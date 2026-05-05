import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import "dotenv/config"; // agar .env terbaca

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// GET semua ayam
app.get("/ayam", async (req, res) => {
  try {
    const data = await prisma.ayam.findMany();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal ambil data" });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});
