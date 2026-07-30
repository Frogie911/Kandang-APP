import express from "express";
import { PrismaClient } from "@prisma/client";
// Kita hanya meng-import requireAdmin karena verifikasi token sudah ditangani global di server.js
import { requireAdmin } from "../auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/admin/batches — semua batch
router.get("/", requireAdmin, async (req, res) => {
  try {
    const batches = await prisma.batch.findMany({
      orderBy: { nomorBatch: "desc" },
      include: {
        harvests: true,
        _count: { select: { records: true } },
      },
    });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/batches/active — batch yang sedang aktif
router.get("/active", requireAdmin, async (req, res) => {
  try {
    const batch = await prisma.batch.findFirst({
      where: { status: "aktif" },
      include: { harvests: true },
    });
    res.json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/batches/:id — detail satu batch
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const batch = await prisma.batch.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { harvests: true, records: true },
    });
    if (!batch) return res.status(404).json({ error: "Batch tidak ditemukan" });
    res.json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/batches — buka batch baru
router.post("/", requireAdmin, async (req, res) => {
  try {
    const {
      tanggalMulai,
      jumlahDoc,
      supplier,
      hargaDoc,
      targetFcr,
      catatan,
      lantai,
    } = req.body;

    // Cek apakah masih ada batch aktif
    const activeBatch = await prisma.batch.findFirst({
      where: { status: "aktif" },
    });
    if (activeBatch) {
      return res
        .status(400)
        .json({ error: "Masih ada batch aktif. Tutup batch sebelumnya dulu." });
    }

    // Nomor batch otomatis
    const lastBatch = await prisma.batch.findFirst({
      orderBy: { nomorBatch: "desc" },
    });
    const nomorBatch = lastBatch ? lastBatch.nomorBatch + 1 : 1;

    const batch = await prisma.batch.create({
      data: {
        nomorBatch,
        tanggalMulai: new Date(tanggalMulai),
        jumlahDoc: parseInt(jumlahDoc),
        supplier: supplier || null,
        hargaDoc: hargaDoc ? parseFloat(hargaDoc) : null,
        targetFcr: targetFcr ? parseFloat(targetFcr) : null,
        catatan: catatan || null,
        status: "aktif",
      },
    });

    res.status(201).json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/batches/:id/close — tutup batch
router.patch("/:id/close", requireAdmin, async (req, res) => {
  try {
    const batch = await prisma.batch.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status: "selesai",
        tanggalSelesai: new Date(),
      },
    });
    res.json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/batches/:id/harvest — catat panen
router.post("/:id/harvest", requireAdmin, async (req, res) => {
  try {
    const { tanggalPanen, panenKe, jumlahAyam, beratPerEkor, catatan } =
      req.body;
    const batchId = parseInt(req.params.id);
    const totalBerat = parseFloat(beratPerEkor) * parseInt(jumlahAyam);

    const harvest = await prisma.harvest.create({
      data: {
        batchId,
        tanggalPanen: new Date(tanggalPanen),
        panenKe: parseInt(panenKe),
        jumlahAyam: parseInt(jumlahAyam),
        beratPerEkor: parseFloat(beratPerEkor),
        totalBerat,
        catatan: catatan || null,
      },
    });

    res.status(201).json(harvest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// BAGIAN INI YANG DIPERBAIKI (STATS COMPARE)
// ==========================================
// GET /api/admin/batches/compare — perbandingan semua batch
router.get("/stats/compare", requireAdmin, async (req, res) => {
  try {
    const batches = await prisma.batch.findMany({
      orderBy: { nomorBatch: "asc" },
      include: {
        harvests: true,
        records: {
          where: { type: "berikan_pakan" },
        },
      },
    });

    const result = batches.map((batch) => {
      const totalPakan = batch.records.reduce(
        (sum, r) => sum + (r.jumlah || 0),
        0,
      );
      const totalPanen = batch.harvests.reduce(
        (sum, h) => sum + h.totalBerat,
        0,
      );
      const totalAyamPanen = batch.harvests.reduce(
        (sum, h) => sum + h.jumlahAyam,
        0,
      );

      // FCR hanya dihitung kalau ada pakan DAN ada panen
      const fcr =
        totalPakan > 0 && totalPanen > 0
          ? (totalPakan / totalPanen).toFixed(2)
          : null;

      const durasi = batch.tanggalSelesai
        ? Math.ceil(
            (new Date(batch.tanggalSelesai) - new Date(batch.tanggalMulai)) /
              (1000 * 60 * 60 * 24),
          )
        : Math.ceil(
            (new Date() - new Date(batch.tanggalMulai)) / (1000 * 60 * 60 * 24),
          );

      // Deplesi hanya dihitung kalau sudah ada panen
      const deplesi =
        totalAyamPanen > 0
          ? (
              ((batch.jumlahDoc - totalAyamPanen) / batch.jumlahDoc) *
              100
            ).toFixed(2)
          : null;

      return {
        id: batch.id,
        nomorBatch: batch.nomorBatch,
        status: batch.status,
        tanggalMulai: batch.tanggalMulai,
        tanggalSelesai: batch.tanggalSelesai,
        jumlahDoc: batch.jumlahDoc,
        totalPakan: totalPakan.toFixed(0),
        totalPanen: totalPanen.toFixed(0),
        fcr,
        durasi,
        deplesi,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
