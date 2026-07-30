import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/admin/users — daftar semua user
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        floorId: true,
        floor: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/users — tambah user baru
router.post("/", async (req, res) => {
  try {
    const { username, name, password, role, floorId } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username dan password wajib diisi." });
    }

    // Cek username sudah ada
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: "Username sudah digunakan." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        name: name || null,
        password: hashedPassword,
        role: role || "worker",
        floorId: floorId ? parseInt(floorId) : null,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        floorId: true,
        floor: true,
        createdAt: true,
      },
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/users/:id — edit nama & username
router.put("/:id", async (req, res) => {
  try {
    const { name, username } = req.body;
    const id = parseInt(req.params.id);

    // Cek username tidak bentrok dengan user lain
    if (username) {
      const existing = await prisma.user.findFirst({
        where: { username, NOT: { id } },
      });
      if (existing) {
        return res.status(400).json({ error: "Username sudah digunakan." });
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(username !== undefined && { username }),
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        floorId: true,
        floor: true,
      },
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/users/:id/password — reset password
router.patch("/:id/password", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password minimal 6 karakter." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password berhasil direset." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/users/:id/floor — pindah lantai
router.patch("/:id/floor", async (req, res) => {
  try {
    const { floorId } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { floorId: floorId ? parseInt(floorId) : null },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        floorId: true,
        floor: true,
      },
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/users/:id/activities — riwayat aktivitas user
router.get("/:id/activities", async (req, res) => {
  try {
    const records = await prisma.record.findMany({
      where: { userId: parseInt(req.params.id) },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { floor: true },
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/users/:id — hapus user
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Cegah hapus diri sendiri
    if (id === req.user.id) {
      return res
        .status(400)
        .json({ error: "Tidak bisa menghapus akun sendiri." });
    }

    await prisma.user.delete({ where: { id } });
    res.json({ message: "User berhasil dihapus." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/floors — daftar lantai (untuk dropdown)
router.get("/floors/list", async (req, res) => {
  try {
    const floors = await prisma.floor.findMany({ orderBy: { id: "asc" } });
    res.json(floors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
