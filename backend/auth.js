import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "rahasia123";

// =======================================================
// MIDDLEWARE (FUNGSI AMAN) UNTUK IMPORT KE FILE LAIN
// =======================================================

// 1. Fungsi memeriksa Token (Dipakai global di server.js)
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Mengambil token setelah teks 'Bearer'

  if (!token) {
    return res
      .status(401)
      .json({ error: "Token tidak ditemukan, silakan login terlebih dahulu" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ error: "Token tidak valid atau sudah kedaluwarsa" });
    }
    req.user = user; // Menyimpan data user (id, username, role) ke dalam request
    next();
  });
};

// 2. Fungsi memeriksa Hak Akses Admin (Dipakai di routes/batch.js)
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ error: "Akses ditolak. Fitur ini hanya untuk Akun Admin!" });
  }
};

// =======================================================
// RUTE BACKEND (REGISTER & LOGIN)
// =======================================================

// POST /auth/register (buat admin pertama)
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashed, role },
    });
    res.json({
      message: "User berhasil dibuat",
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: "User tidak ditemukan" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Password salah" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "365d" },
    );
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
