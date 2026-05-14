import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "rahasia123";

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
      { expiresIn: "7d" },
    );
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
