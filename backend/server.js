import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import "dotenv/config"; // agar .env terbaca
import jwt from "jsonwebtoken"; // Import JWT untuk middleware
import authRouter from "./auth.js";

// ==============================
// IMPORT MULTER & CLOUDINARY (TAMBAH DI ATAS)
// ==============================
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const app = express();
const prisma = new PrismaClient();

// Setup Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Multer (simpan di memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("File harus berupa gambar"));
    }
  },
});

// ==============================
// MIDDLEWARE UTAMA
// ==============================
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter); // Mengelompokkan rute auth

// ==============================
// MIDDLEWARE AUTENTIKASI (UPDATE DEBUG)
// ==============================
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token tidak ditemukan" });

  console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET); // Cek keberadaan secret
  console.log("Token received:", token.substring(0, 20)); // Cek 20 karakter pertama token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT Error:", err.message); // Cek detail error token
      return res
        .status(403)
        .json({ error: "Token tidak valid", detail: err.message });
    }
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

// ENDPOINT KEMATIAN DENGAN FOTO (TAMBAH SETELAH GET /api/records)
app.post(
  "/api/records/kematian",
  authenticateToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { jumlah, penyebab, keterangan } = req.body;
      let photoUrl = null;

      // Upload foto ke Cloudinary jika ada
      if (req.file) {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "sipoultry/kematian", // Organize di folder
                resource_type: "auto",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              },
            )
            .end(req.file.buffer);
        });

        photoUrl = uploadResult.secure_url;
        console.log("Foto terupload ke Cloudinary:", photoUrl);
      }

      const recordedBy = req.user.username || req.user.id.toString();

      const record = await prisma.record.create({
        data: {
          type: "kematian",
          jumlah: Number(jumlah) || 0,
          penyebab,
          keterangan,
          photoUrl, // ← Simpan URL foto
          recordedBy,
          userId: req.user.id,
        },
      });

      res.status(201).json({
        message: "Laporan kematian tersimpan dengan foto",
        record,
      });
    } catch (err) {
      console.error("POST /api/records/kematian error:", err);
      res.status(500).json({ error: err.message });
    }
  },
);

// POST record baru (VERSI TERBARU)
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
    } = req.body;

    const recordedBy = req.user.username || req.user.id.toString();

    console.log("Creating record:", {
      type,
      jumlah,
      recordedBy,
      userId: req.user.id,
    });

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
        recordedBy, // ← dari token, bukan body
        userId: req.user.id,
      },
    });

    res.status(201).json({ message: "Data tersimpan", record });
  } catch (err) {
    console.error("POST /api/records error:", err); // ← log detail untuk debugging
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
