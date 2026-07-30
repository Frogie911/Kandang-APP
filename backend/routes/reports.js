import express from "express";
import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

const router = express.Router();
const prisma = new PrismaClient();

// ==============================
// HELPER: build where clause
// ==============================
const buildWhere = (batchId, from, to) => {
  const where = {};
  if (batchId) where.batchId = parseInt(batchId);
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = toDate;
    }
  }
  return where;
};

// ==============================
// GET /api/admin/reports/summary
// ==============================
router.get("/summary", async (req, res) => {
  try {
    const { batchId, from, to } = req.query;
    const where = buildWhere(batchId, from, to);

    let batch = null;
    if (batchId) {
      batch = await prisma.batch.findUnique({
        where: { id: parseInt(batchId) },
        include: { harvests: true },
      });
    }

    const [totalPakan, totalKematian] = await Promise.all([
      prisma.record.aggregate({
        where: { ...where, type: "berikan_pakan" },
        _sum: { jumlah: true },
      }),
      prisma.record.aggregate({
        where: { ...where, type: "kematian" },
        _sum: { jumlah: true },
      }),
    ]);

    const totalPakanKg = totalPakan._sum.jumlah || 0;
    const totalMati = totalKematian._sum.jumlah || 0;
    const totalPanen =
      batch?.harvests.reduce((sum, h) => sum + h.totalBerat, 0) || 0;
    const totalAyamPanen =
      batch?.harvests.reduce((sum, h) => sum + h.jumlahAyam, 0) || 0;

    const fcr =
      totalPakanKg > 0 && totalPanen > 0
        ? (totalPakanKg / totalPanen).toFixed(2)
        : null;
    const ayamHidup = batch
      ? batch.jumlahDoc - totalMati - totalAyamPanen
      : null;
    const deplesi =
      batch && batch.jumlahDoc > 0
        ? ((totalMati / batch.jumlahDoc) * 100).toFixed(2)
        : null;

    res.json({
      batch: batch
        ? { id: batch.id, nomorBatch: batch.nomorBatch, status: batch.status }
        : null,
      totalPakan: totalPakanKg,
      totalKematian: totalMati,
      totalPanen,
      fcr,
      ayamHidup,
      deplesi,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// GET /api/admin/reports/daily
// ==============================
router.get("/daily", async (req, res) => {
  try {
    const { batchId, from, to } = req.query;
    const where = buildWhere(batchId, from, to);

    const records = await prisma.record.findMany({
      where: { ...where, type: { in: ["berikan_pakan", "kematian"] } },
      orderBy: { createdAt: "asc" },
    });

    const grouped = {};
    for (const r of records) {
      const dateKey = new Date(r.createdAt).toISOString().split("T")[0];
      if (!grouped[dateKey])
        grouped[dateKey] = { tanggal: dateKey, pakan: 0, mati: 0 };
      if (r.type === "berikan_pakan") grouped[dateKey].pakan += r.jumlah || 0;
      if (r.type === "kematian") grouped[dateKey].mati += r.jumlah || 0;
    }

    const result = Object.values(grouped).sort((a, b) =>
      a.tanggal.localeCompare(b.tanggal),
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// GET /api/admin/reports/floor-comparison
// ==============================
router.get("/floor-comparison", async (req, res) => {
  try {
    const { batchId } = req.query;
    const where = batchId ? { batchId: parseInt(batchId) } : {};

    const floors = await prisma.floor.findMany({ orderBy: { id: "asc" } });

    const result = await Promise.all(
      floors.map(async (floor) => {
        const [mati, pakan] = await Promise.all([
          prisma.record.aggregate({
            where: { ...where, floorId: floor.id, type: "kematian" },
            _sum: { jumlah: true },
          }),
          prisma.record.aggregate({
            where: { ...where, floorId: floor.id, type: "berikan_pakan" },
            _sum: { jumlah: true },
          }),
        ]);
        return {
          id: floor.id,
          nama: floor.nama,
          totalMati: mati._sum.jumlah || 0,
          totalPakan: pakan._sum.jumlah || 0,
        };
      }),
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// GET /api/admin/reports/export/excel
// ==============================
router.get("/export/excel", async (req, res) => {
  try {
    const { batchId, from, to } = req.query;
    const where = buildWhere(batchId, from, to);

    let batch = null;
    if (batchId) {
      batch = await prisma.batch.findUnique({
        where: { id: parseInt(batchId) },
        include: { harvests: true },
      });
    }

    const [totalPakan, totalKematian, records] = await Promise.all([
      prisma.record.aggregate({
        where: { ...where, type: "berikan_pakan" },
        _sum: { jumlah: true },
      }),
      prisma.record.aggregate({
        where: { ...where, type: "kematian" },
        _sum: { jumlah: true },
      }),
      prisma.record.findMany({
        where: { ...where, type: { in: ["berikan_pakan", "kematian"] } },
        orderBy: { createdAt: "asc" },
        include: {
          floor: true,
          user: { select: { name: true, username: true } },
        },
      }),
    ]);

    const totalPakanKg = totalPakan._sum.jumlah || 0;
    const totalMati = totalKematian._sum.jumlah || 0;
    const totalPanen =
      batch?.harvests.reduce((sum, h) => sum + h.totalBerat, 0) || 0;
    const fcr =
      totalPakanKg > 0 && totalPanen > 0
        ? (totalPakanKg / totalPanen).toFixed(2)
        : "-";

    // Group by date
    const grouped = {};
    for (const r of records) {
      const dateKey = new Date(r.createdAt).toISOString().split("T")[0];
      if (!grouped[dateKey])
        grouped[dateKey] = { tanggal: dateKey, pakan: 0, mati: 0 };
      if (r.type === "berikan_pakan") grouped[dateKey].pakan += r.jumlah || 0;
      if (r.type === "kematian") grouped[dateKey].mati += r.jumlah || 0;
    }
    const dailyRows = Object.values(grouped).sort((a, b) =>
      a.tanggal.localeCompare(b.tanggal),
    );

    // ── Style constants ─────────────────────────────────────
    const COLOR_PRIMARY = "FF2E7D5E"; // hijau tua SiPoultry
    const COLOR_HEADER_BG = "FF2E7D5E";
    const COLOR_HEADER_TEXT = "FFFFFFFF";
    const COLOR_BAND = "FFF2F7F4";
    const COLOR_BORDER = "FFD0D7D3";

    const thinBorder = {
      top: { style: "thin", color: { argb: COLOR_BORDER } },
      left: { style: "thin", color: { argb: COLOR_BORDER } },
      bottom: { style: "thin", color: { argb: COLOR_BORDER } },
      right: { style: "thin", color: { argb: COLOR_BORDER } },
    };

    const styleHeaderRow = (row) => {
      row.eachCell((cell) => {
        cell.font = {
          bold: true,
          color: { argb: COLOR_HEADER_TEXT },
          size: 11,
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: COLOR_HEADER_BG },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = thinBorder;
      });
      row.height = 22;
    };

    const styleDataRow = (row, isEven) => {
      row.eachCell((cell) => {
        cell.border = thinBorder;
        cell.alignment = { vertical: "middle" };
        if (isEven) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: COLOR_BAND },
          };
        }
      });
    };

    const addTitleBlock = (sheet, title, colSpan) => {
      sheet.mergeCells(1, 1, 1, colSpan);
      const titleCell = sheet.getCell(1, 1);
      titleCell.value = "SiPoultry — " + title;
      titleCell.font = { bold: true, size: 14, color: { argb: COLOR_PRIMARY } };
      titleCell.alignment = { vertical: "middle", horizontal: "left" };
      sheet.getRow(1).height = 26;

      sheet.mergeCells(2, 1, 2, colSpan);
      const subCell = sheet.getCell(2, 1);
      const periodeLabel = `Batch: ${batch ? `#${batch.nomorBatch} (${batch.status})` : "Semua Batch"}  |  Periode: ${from || "Awal"} – ${to || "Sekarang"}  |  Dicetak: ${new Date().toLocaleString("id-ID")}`;
      subCell.value = periodeLabel;
      subCell.font = { italic: true, size: 9, color: { argb: "FF666666" } };
      sheet.getRow(2).height = 18;

      sheet.addRow([]); // baris kosong pemisah
    };

    // ── Build workbook ─────────────────────────────────────
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "SiPoultry";
    workbook.created = new Date();

    // ===== Sheet 1: Ringkasan =====
    const summarySheet = workbook.addWorksheet("Ringkasan", {
      views: [{ state: "frozen", ySplit: 4 }],
    });
    summarySheet.columns = [
      { key: "metrik", width: 28 },
      { key: "nilai", width: 24 },
    ];
    addTitleBlock(summarySheet, "Ringkasan Laporan", 2);

    const headerRow1 = summarySheet.addRow(["Metrik", "Nilai"]);
    styleHeaderRow(headerRow1);

    const summaryData = [
      [
        "Batch",
        batch ? `Batch #${batch.nomorBatch} (${batch.status})` : "Semua Batch",
      ],
      ["Jumlah DOC", batch?.jumlahDoc ?? "-"],
      ["Total Pakan (kg)", totalPakanKg],
      ["Total Kematian (ekor)", totalMati],
      ["Total Panen (kg)", totalPanen],
      ["FCR", fcr],
    ];
    summaryData.forEach((rowData, idx) => {
      const row = summarySheet.addRow(rowData);
      styleDataRow(row, idx % 2 === 1);
      if (typeof rowData[1] === "number") {
        row.getCell(2).numFmt = "#,##0";
        row.getCell(2).alignment = { horizontal: "right", vertical: "middle" };
      }
      row.getCell(1).font = { bold: true };
    });

    // ===== Sheet 2: Data Harian =====
    const dailySheet = workbook.addWorksheet("Data Harian", {
      views: [{ state: "frozen", ySplit: 4 }],
    });
    dailySheet.columns = [
      { key: "tanggal", width: 16 },
      { key: "pakan", width: 16 },
      { key: "mati", width: 18 },
    ];
    addTitleBlock(dailySheet, "Data Harian (Pakan & Kematian)", 3);

    const headerRow2 = dailySheet.addRow([
      "Tanggal",
      "Pakan (kg)",
      "Kematian (ekor)",
    ]);
    styleHeaderRow(headerRow2);

    if (dailyRows.length === 0) {
      const emptyRow = dailySheet.addRow([
        "Tidak ada data untuk periode ini.",
        "",
        "",
      ]);
      dailySheet.mergeCells(emptyRow.number, 1, emptyRow.number, 3);
      emptyRow.getCell(1).alignment = { horizontal: "center" };
      emptyRow.getCell(1).font = { italic: true, color: { argb: "FF999999" } };
    } else {
      dailyRows.forEach((d, idx) => {
        const row = dailySheet.addRow([
          new Date(d.tanggal).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          d.pakan,
          d.mati,
        ]);
        styleDataRow(row, idx % 2 === 1);
        row.getCell(2).numFmt = "#,##0";
        row.getCell(2).alignment = { horizontal: "right", vertical: "middle" };
        row.getCell(3).numFmt = "#,##0";
        row.getCell(3).alignment = { horizontal: "right", vertical: "middle" };
        if (d.mati > 0) {
          row.getCell(3).font = { color: { argb: "FFC0392B" }, bold: true };
        }
      });

      // Total row
      const totalRow = dailySheet.addRow([
        "TOTAL",
        dailyRows.reduce((s, d) => s + d.pakan, 0),
        dailyRows.reduce((s, d) => s + d.mati, 0),
      ]);
      totalRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.border = thinBorder;
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE2EEE8" },
        };
      });
      totalRow.getCell(2).numFmt = "#,##0";
      totalRow.getCell(2).alignment = {
        horizontal: "right",
        vertical: "middle",
      };
      totalRow.getCell(3).numFmt = "#,##0";
      totalRow.getCell(3).alignment = {
        horizontal: "right",
        vertical: "middle",
      };
    }

    // ===== Sheet 3: Data Mentah =====
    const rawSheet = workbook.addWorksheet("Data Mentah", {
      views: [{ state: "frozen", ySplit: 4 }],
    });
    rawSheet.columns = [
      { key: "tanggal", width: 20 },
      { key: "type", width: 14 },
      { key: "jumlah", width: 10 },
      { key: "lantai", width: 12 },
      { key: "user", width: 18 },
      { key: "ket", width: 28 },
      { key: "foto", width: 30 },
    ];
    addTitleBlock(rawSheet, "Data Mentah (Log Aktivitas)", 7);

    const headerRow3 = rawSheet.addRow([
      "Tanggal",
      "Tipe",
      "Jumlah",
      "Lantai",
      "Dicatat Oleh",
      "Keterangan",
      "Foto Bukti",
    ]);
    styleHeaderRow(headerRow3);

    if (records.length === 0) {
      const emptyRow = rawSheet.addRow([
        "Tidak ada data untuk periode ini.",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      rawSheet.mergeCells(emptyRow.number, 1, emptyRow.number, 7);
      emptyRow.getCell(1).alignment = { horizontal: "center" };
      emptyRow.getCell(1).font = { italic: true, color: { argb: "FF999999" } };
    } else {
      records.forEach((r, idx) => {
        const row = rawSheet.addRow([
          new Date(r.createdAt).toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          r.type === "berikan_pakan" ? "Pakan" : "Kematian",
          r.jumlah,
          r.floor?.nama || "-",
          r.user?.name || r.user?.username || r.recordedBy,
          r.keterangan || "-",
          "", // diisi di bawah kalau ada foto
        ]);
        styleDataRow(row, idx % 2 === 1);
        row.getCell(3).numFmt = "#,##0";
        row.getCell(3).alignment = { horizontal: "right", vertical: "middle" };

        // Badge warna untuk tipe
        if (r.type === "kematian") {
          row.getCell(2).font = { color: { argb: "FFC0392B" }, bold: true };
        } else {
          row.getCell(2).font = { color: { argb: "FF2E7D5E" }, bold: true };
        }

        // Kolom foto: hyperlink kalau ada photoUrl
        const fotoCell = row.getCell(7);
        if (r.photoUrl) {
          fotoCell.value = {
            text: "📷 Lihat Foto",
            hyperlink: r.photoUrl,
            tooltip: r.photoUrl,
          };
          fotoCell.font = { color: { argb: "FF1A73E8" }, underline: true };
        } else {
          fotoCell.value = "-";
          fotoCell.alignment = { horizontal: "center" };
          fotoCell.font = { color: { argb: "FF999999" }, italic: true };
        }
      });
    }

    // ── Send file ─────────────────────────────────────────
    const filename = `Laporan_${batch ? `Batch${batch.nomorBatch}` : "Semua"}_${new Date().toISOString().split("T")[0]}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Export Excel error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// GET /api/admin/reports/export/pdf
// ==============================
router.get("/export/pdf", async (req, res) => {
  try {
    const { batchId, from, to } = req.query;
    const where = buildWhere(batchId, from, to);

    let batch = null;
    if (batchId) {
      batch = await prisma.batch.findUnique({
        where: { id: parseInt(batchId) },
        include: { harvests: true },
      });
    }

    const [totalPakan, totalKematian, records] = await Promise.all([
      prisma.record.aggregate({
        where: { ...where, type: "berikan_pakan" },
        _sum: { jumlah: true },
      }),
      prisma.record.aggregate({
        where: { ...where, type: "kematian" },
        _sum: { jumlah: true },
      }),
      prisma.record.findMany({
        where: { ...where, type: { in: ["berikan_pakan", "kematian"] } },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const totalPakanKg = totalPakan._sum.jumlah || 0;
    const totalMati = totalKematian._sum.jumlah || 0;
    const totalPanen =
      batch?.harvests.reduce((sum, h) => sum + h.totalBerat, 0) || 0;
    const fcr =
      totalPakanKg > 0 && totalPanen > 0
        ? (totalPakanKg / totalPanen).toFixed(2)
        : "-";

    const grouped = {};
    for (const r of records) {
      const dateKey = new Date(r.createdAt).toISOString().split("T")[0];
      if (!grouped[dateKey])
        grouped[dateKey] = { tanggal: dateKey, pakan: 0, mati: 0 };
      if (r.type === "berikan_pakan") grouped[dateKey].pakan += r.jumlah || 0;
      if (r.type === "kematian") grouped[dateKey].mati += r.jumlah || 0;
    }
    const dailyRows = Object.values(grouped).sort((a, b) =>
      a.tanggal.localeCompare(b.tanggal),
    );

    const filename = `Laporan_${batch ? `Batch${batch.nomorBatch}` : "Semua"}_${new Date().toISOString().split("T")[0]}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .fillColor("#2E7D5E")
      .text("SiPoultry", { align: "center" });
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#000000")
      .text("Laporan Farm", { align: "center" });
    doc.moveDown(0.3);
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#666666")
      .text(`Dibuat: ${new Date().toLocaleString("id-ID")}`, {
        align: "center",
      });
    doc.moveDown(1.5);
    doc.fillColor("#000000");

    doc.fontSize(12).font("Helvetica-Bold").text("Informasi Batch");
    doc.fontSize(10).font("Helvetica");
    doc.text(
      `Batch: ${batch ? `#${batch.nomorBatch} (${batch.status})` : "Semua Batch"}`,
    );
    doc.text(`Periode: ${from || "Awal"} - ${to || "Sekarang"}`);
    if (batch)
      doc.text(`Jumlah DOC: ${batch.jumlahDoc.toLocaleString("id-ID")} ekor`);
    doc.moveDown(1);

    doc.fontSize(12).font("Helvetica-Bold").text("Ringkasan");
    doc.fontSize(10).font("Helvetica");
    doc.text(`Total Pakan: ${totalPakanKg.toLocaleString("id-ID")} kg`);
    doc.text(`Total Kematian: ${totalMati.toLocaleString("id-ID")} ekor`);
    doc.text(`Total Panen: ${totalPanen.toLocaleString("id-ID")} kg`);
    doc.text(`FCR: ${fcr}`);
    doc.moveDown(1.5);

    doc.fontSize(12).font("Helvetica-Bold").text("Data Harian");
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const col1 = 50,
      col2 = 220,
      col3 = 380;

    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("Tanggal", col1, tableTop);
    doc.text("Pakan (kg)", col2, tableTop);
    doc.text("Kematian (ekor)", col3, tableTop);
    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    let y = tableTop + 22;
    doc.font("Helvetica");
    for (const row of dailyRows) {
      if (y > 720) {
        doc.addPage();
        y = 50;
      }
      const tgl = new Date(row.tanggal).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      doc.text(tgl, col1, y);
      doc.text(String(row.pakan), col2, y);
      doc.text(String(row.mati), col3, y);
      y += 18;
    }

    if (dailyRows.length === 0) {
      doc
        .fontSize(10)
        .fillColor("#999999")
        .text("Tidak ada data untuk periode ini.", col1, y);
    }

    doc.end();
  } catch (err) {
    console.error("Export PDF error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
