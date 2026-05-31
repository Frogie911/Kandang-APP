import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import "dotenv/config"; // agar .env terbaca
import jwt from "jsonwebtoken"; // Import JWT untuk middleware
import authRouter from "./auth.js";

const app = express();
const prisma = new PrismaClient();

// ==============================
// MIDDLEWARE UTAMA
// ==============================
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter); // Mengelompokkan rute auth

// Fungsi Middleware Autentikasi
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: Bearer TOKEN

  if (!token) return res.status(401).json({ error: "Token tidak ditemukan" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token tidak valid" });
    req.user = user;
    next();
  });
}

// ==============================
// API AYAM (LAMA)
// ==============================
// GET semua ayam
app.get("/ayam", async (req, res) => {
  try {
    const data = await prisma.ayam.findMany();
    res.json(data);
  } catch (err) {
    console.error("PRISMA ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET by ID
app.get("/ayam/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await prisma.ayam.findUnique({
      where: { id: Number(id) },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal ambil data by id" });
  }
});

// POST (tambah data)
app.post("/ayam", async (req, res) => {
  try {
    const { jumlah, mati, pakan } = req.body;
    const data = await prisma.ayam.create({
      data: { jumlah, mati, pakan },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal tambah data" });
  }
});

// PUT (update)
app.put("/ayam/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { jumlah, mati, pakan } = req.body;
    const data = await prisma.ayam.update({
      where: { id: Number(id) },
      data: { jumlah, mati, pakan },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal update data" });
  }
});

// ==============================
// API RECORDS (BARU)
// ==============================

// GET semua records
app.get("/api/records", authenticateToken, async (req, res) => {
  try {
    const records = await prisma.record.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST record baru
app.post("/api/records", authenticateToken, async (req, res) => {
  try {
    const {
      type,
      jumlah,
      jenis,
      waktu,
      penyebab,
      keterangan,
      supplier,
      tanggal,
      recordedBy,
    } = req.body;

    const record = await prisma.record.create({
      data: {
        type,
        jumlah: Number(jumlah) || 0,
        jenis,
        waktu,
        penyebab,
        keterangan,
        supplier,
        tanggal: tanggal ? new Date(tanggal) : null,
        recordedBy,
        userId: req.user.id, // ambil dari token yang di-decode middleware
      },
    });

    res.status(201).json({ message: "Data tersimpan", record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET dashboard stats
app.get("/api/dashboard", authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayRecords, weekRecords, totalAyam, totalPakan] =
      await Promise.all([
        prisma.record.count({ where: { createdAt: { gte: today } } }),
        prisma.record.count({
          where: {
            createdAt: {
              gte: new Date(today - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        prisma.record.aggregate({
          where: { type: "populasi" },
          _sum: { jumlah: true },
        }),
        prisma.record.aggregate({
          where: { type: "berikan_pakan" },
          _sum: { jumlah: true },
        }),
      ]);

    res.json({
      ayamHidup: totalAyam._sum.jumlah || 1482,
      stokPakan: 120, // nanti dari tabel stok
      kematianHariIni: 0, // nanti dihitung
      todayRecords,
      weekRecords,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// RUN SERVER
// ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});
