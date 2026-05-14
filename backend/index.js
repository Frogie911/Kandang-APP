import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 database sementara
let dataAyam = [];

// ✅ TEST
app.get("/", (req, res) => {
  res.send("API Kandang Ayam Jalan 🐔");
});

// ✅ GET semua data ayam
app.get("/ayam", (req, res) => {
  res.json(dataAyam);
});

// ✅ POST tambah data ayam mati
app.post("/ayam", (req, res) => {
  const { jumlah } = req.body;

  const dataBaru = {
    id: Date.now(),
    jumlah,
    tanggal: new Date(),
  };

  dataAyam.push(dataBaru);

  res.json({
    message: "Data berhasil ditambahkan",
    data: dataBaru,
  });
});

// jalankan server
app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});
