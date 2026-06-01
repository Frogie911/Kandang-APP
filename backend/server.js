import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import jwt from "jsonwebtoken";
import authRouter from "./auth.js";
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

// Setup Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("File harus berupa gambar"));
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token tidak ditemukan" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token tidak valid" });
    req.user = user;
    next();
  });
}

// ==============================
// API RECORDS
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

// POST record umum (pakan, stok)
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
        userId: req.user.id,
      },
    });
    res.status(201).json({ message: "Data tersimpan", record });
  } catch (err) {
    console.error("POST /api/records error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST kematian dengan foto (ROBUST: kalau Cloudinary gagal, tetap simpan data)
app.post(
  "/api/records/kematian",
  authenticateToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { jumlah, penyebab, keterangan } = req.body;
      let photoUrl = null;

      // Upload ke Cloudinary dengan try-catch
      if (req.file) {
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                { folder: "sipoultry/kematian", resource_type: "auto" },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                },
              )
              .end(req.file.buffer);
          });
          photoUrl = uploadResult.secure_url;
          console.log("✅ Foto terupload:", photoUrl);
        } catch (cloudErr) {
          // Kalau Cloudinary gagal (secret salah), jangan crash. Simpan data tanpa foto.
          console.error(
            "⚠️ Cloudinary gagal (cek API_SECRET di Railway):",
            cloudErr.message,
          );
          photoUrl = null;
        }
      }

      const recordedBy = req.user.username || req.user.id.toString();

      const record = await prisma.record.create({
        data: {
          type: "kematian",
          jumlah: Number(jumlah) || 0,
          penyebab,
          keterangan,
          photoUrl,
          recordedBy,
          userId: req.user.id,
        },
      });

      res.status(201).json({
        message: photoUrl
          ? "Laporan kematian tersimpan dengan foto"
          : "Laporan kematian tersimpan (foto gagal upload, cek Cloudinary)",
        record,
      });
    } catch (err) {
      console.error("POST /api/records/kematian error:", err);
      res.status(500).json({ error: err.message });
    }
  },
);

// GET dashboard
app.get("/api/dashboard", authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayRecords, weekRecords, totalAyam, totalPakan] =
      await Promise.all([
        prisma.record.count({ where: { createdAt: { gte: today } } }),
        prisma.record.count({
          where: {
            createdAt: { gte: new Date(today - 7 * 24 * 60 * 60 * 1000) },
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
      stokPakan: 120,
      kematianHariIni: 0,
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
