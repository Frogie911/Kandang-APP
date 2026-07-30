import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/admin/dashboard — KPI utama
router.get("/", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ambil batch aktif
    const activeBatch = await prisma.batch.findFirst({
      where: { status: "aktif" },
      include: { harvests: true },
    });

    if (!activeBatch) {
      return res.json({
        activeBatch: null,
        totalAyam: 0,
        kematianHariIni: 0,
        totalKematian: 0,
        stokPakan: 0,
        fcr: null,
        activities: [],
        floors: [],
      });
    }

    // Semua agregasi sekaligus
    const [
      kematianHariIni,
      totalKematian,
      totalPakan,
      stokMasuk,
      activities,
      floors,
    ] = await Promise.all([
      // Kematian hari ini (batch aktif)
      prisma.record.aggregate({
        where: {
          type: "kematian",
          batchId: activeBatch.id,
          createdAt: { gte: today },
        },
        _sum: { jumlah: true },
      }),

      // Total kematian batch aktif
      prisma.record.aggregate({
        where: { type: "kematian", batchId: activeBatch.id },
        _sum: { jumlah: true },
      }),

      // Total pakan batch aktif
      prisma.record.aggregate({
        where: { type: "berikan_pakan", batchId: activeBatch.id },
        _sum: { jumlah: true },
      }),

      // Total stok pakan masuk - stok yang dipakai
      prisma.record.aggregate({
        where: { type: "pakan_masuk", batchId: activeBatch.id },
        _sum: { jumlah: true },
      }),

      // Aktivitas terkini (20 terakhir)
      prisma.record.findMany({
        where: { batchId: activeBatch.id },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          user: { select: { name: true, username: true } },
          floor: { select: { nama: true } },
        },
      }),

      // Status per lantai
      prisma.floor.findMany({
        orderBy: { id: "asc" },
        include: {
          users: {
            where: { role: "worker" },
            select: { id: true, name: true, username: true },
          },
        },
      }),
    ]);

    // Kalkulasi nilai
    const totalMati = totalKematian._sum.jumlah || 0;
    const totalPakanKg = totalPakan._sum.jumlah || 0;
    const totalStokMasuk = stokMasuk._sum.jumlah || 0;
    const totalPanen = activeBatch.harvests.reduce(
      (sum, h) => sum + h.totalBerat,
      0,
    );
    const ayamHidup = activeBatch.jumlahDoc - totalMati;

    // FCR = total pakan / total berat panen (hanya bisa dihitung jika sudah ada panen)
    const fcr = totalPanen > 0 ? (totalPakanKg / totalPanen).toFixed(2) : null;

    // Stok pakan estimasi = stok masuk - stok yang sudah dipakai
    const stokPakan = Math.max(0, totalStokMasuk - totalPakanKg);

    // Pakan per lantai hari ini
    const pakanPerLantaiHariIni = await prisma.record.groupBy({
      by: ["floorId"],
      where: {
        type: "berikan_pakan",
        batchId: activeBatch.id,
        createdAt: { gte: today },
      },
      _sum: { jumlah: true },
    });

    // Kematian per lantai batch aktif
    const kematianPerLantai = await prisma.record.groupBy({
      by: ["floorId"],
      where: {
        type: "kematian",
        batchId: activeBatch.id,
      },
      _sum: { jumlah: true },
    });

    // Gabungkan data lantai
    const floorsData = floors.map((floor) => {
      const pakanLantai = pakanPerLantaiHariIni.find(
        (p) => p.floorId === floor.id,
      );
      const kematianLantai = kematianPerLantai.find(
        (k) => k.floorId === floor.id,
      );
      return {
        id: floor.id,
        nama: floor.nama,
        kandang: floor.kandang,
        workers: floor.users,
        pakanHariIni: pakanLantai?._sum.jumlah || 0,
        totalMati: kematianLantai?._sum.jumlah || 0,
      };
    });

    res.json({
      activeBatch: {
        id: activeBatch.id,
        nomorBatch: activeBatch.nomorBatch,
        tanggalMulai: activeBatch.tanggalMulai,
        jumlahDoc: activeBatch.jumlahDoc,
        targetFcr: activeBatch.targetFcr,
      },
      totalAyam: ayamHidup,
      kematianHariIni: kematianHariIni._sum.jumlah || 0,
      totalKematian: totalMati,
      stokPakan,
      fcr,
      activities,
      floors: floorsData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/floors/:id — detail satu lantai
router.get("/floors/:id", async (req, res) => {
  try {
    const floorId = parseInt(req.params.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today - 6 * 24 * 60 * 60 * 1000);

    // Batch aktif
    const activeBatch = await prisma.batch.findFirst({
      where: { status: "aktif" },
    });

    const floor = await prisma.floor.findUnique({
      where: { id: floorId },
      include: {
        users: {
          where: { role: "worker" },
          select: { id: true, name: true, username: true },
        },
      },
    });

    if (!floor)
      return res.status(404).json({ error: "Lantai tidak ditemukan" });

    const batchFilter = activeBatch ? { batchId: activeBatch.id } : {};

    const [totalMati, pakanHariIni, aktivitasHariIni, pakan7Hari] =
      await Promise.all([
        // Total kematian lantai ini di batch aktif
        prisma.record.aggregate({
          where: { type: "kematian", floorId, ...batchFilter },
          _sum: { jumlah: true },
        }),

        // Pakan hari ini lantai ini
        prisma.record.aggregate({
          where: {
            type: "berikan_pakan",
            floorId,
            createdAt: { gte: today },
            ...batchFilter,
          },
          _sum: { jumlah: true },
        }),

        // Aktivitas hari ini lantai ini
        prisma.record.findMany({
          where: {
            floorId,
            createdAt: { gte: today },
            ...batchFilter,
          },
          orderBy: { createdAt: "asc" },
          take: 20,
          include: {
            user: { select: { name: true, username: true } },
          },
        }),

        // Pakan 7 hari terakhir lantai ini
        prisma.record.groupBy({
          by: ["createdAt"],
          where: {
            type: "berikan_pakan",
            floorId,
            createdAt: { gte: sevenDaysAgo },
            ...batchFilter,
          },
          _sum: { jumlah: true },
          orderBy: { createdAt: "asc" },
        }),
      ]);

    // Hitung ekor hidup lantai ini (estimasi: jumlahDoc / 3 - kematian lantai)
    const ekorHidup = activeBatch
      ? Math.max(
          0,
          Math.round(activeBatch.jumlahDoc / 3) - (totalMati._sum.jumlah || 0),
        )
      : 0;

    // Proses data pakan 7 hari untuk chart
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const pakan7HariData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      const dateStr = date.toDateString();
      const found = pakan7Hari.find(
        (p) => new Date(p.createdAt).toDateString() === dateStr,
      );
      return {
        day: days[date.getDay()],
        value: found?._sum.jumlah || 0,
        today: date.toDateString() === new Date().toDateString(),
      };
    });

    res.json({
      floor: {
        id: floor.id,
        nama: floor.nama,
        kandang: floor.kandang,
        workers: floor.users,
      },
      ekorHidup,
      totalMati: totalMati._sum.jumlah || 0,
      pakanHariIni: pakanHariIni._sum.jumlah || 0,
      pakan7Hari: pakan7HariData,
      aktivitasHariIni,
      activeBatch: activeBatch
        ? { id: activeBatch.id, nomorBatch: activeBatch.nomorBatch }
        : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
