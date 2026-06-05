import { useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import StatCard from "../components/admin/StatCard";

export default function LaporanExport() {
  const [scheduledReportOpen, setScheduledReportOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // ← BARU: State untuk periode yang dipilih
  const [selectedPeriod, setSelectedPeriod] = useState("batch"); // "7hari" | "30hari" | "batch"

  const [selectedDays, setSelectedDays] = useState(["Sen"]);
  const [selectedFormats, setSelectedFormats] = useState(["Excel", "PDF"]);
  const [reportSettings, setReportSettings] = useState({
    masterToggle: true,
    weeklyEnabled: true,
    monthlyEnabled: true,
    weeklyTime: "06:00",
    monthlyDate: "1",
    monthlyTime: "07:00",
    weeklyItems: {
      ringkasanKPI: true,
      dataPakan: true,
      laporanKematian: true,
      perbandinganLantai: true,
      dataMentahCSV: false,
    },
    monthlyItems: {
      perbandinganBatch: true,
      analisaEfisiensi: true,
    },
    emails: ["admin@kandangayam.com"],
  });

  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const formats = [
    { name: "Excel", icon: "table_view" },
    { name: "PDF", icon: "picture_as_pdf" },
    { name: "CSV", icon: "description" },
  ];

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const toggleFormat = (format) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format],
    );
  };

  const toggleWeeklyItem = (key) => {
    setReportSettings((prev) => ({
      ...prev,
      weeklyItems: { ...prev.weeklyItems, [key]: !prev.weeklyItems[key] },
    }));
  };

  const toggleMonthlyItem = (key) => {
    setReportSettings((prev) => ({
      ...prev,
      monthlyItems: { ...prev.monthlyItems, [key]: !prev.monthlyItems[key] },
    }));
  };

  const removeEmail = (emailToRemove) => {
    setReportSettings((prev) => ({
      ...prev,
      emails: prev.emails.filter((e) => e !== emailToRemove),
    }));
  };

  // Mock data untuk preview laporan (dinamis berdasarkan periode)
  const getPreviewData = () => {
    const baseData = {
      periode:
        selectedPeriod === "7hari"
          ? "12 Mei 2026 – 18 Mei 2026"
          : selectedPeriod === "30hari"
            ? "19 April 2026 – 18 Mei 2026"
            : "12 Mei 2026 – Sekarang",
      batch: "Batch #3 (Aktif)",
      totalPakan:
        selectedPeriod === "7hari"
          ? "2,450 kg"
          : selectedPeriod === "30hari"
            ? "10,500 kg"
            : "24,570 kg",
      totalKematian:
        selectedPeriod === "7hari"
          ? "127 ekor"
          : selectedPeriod === "30hari"
            ? "340 ekor"
            : "127 ekor",
      rataFCR:
        selectedPeriod === "7hari"
          ? "1.82"
          : selectedPeriod === "30hari"
            ? "1.79"
            : "1.82",
      ayamHidup: "14,873 ekor",
      efisiensi: "94.2%",
      deplesi:
        selectedPeriod === "7hari"
          ? "0.85%"
          : selectedPeriod === "30hari"
            ? "2.27%"
            : "0.85%",
    };

    const harian7 = [
      { tanggal: "12 Mei", pakan: 350, mati: 3 },
      { tanggal: "13 Mei", pakan: 360, mati: 5 },
      { tanggal: "14 Mei", pakan: 340, mati: 2 },
      { tanggal: "15 Mei", pakan: 380, mati: 8 },
      { tanggal: "16 Mei", pakan: 370, mati: 4 },
      { tanggal: "17 Mei", pakan: 355, mati: 3 },
      { tanggal: "18 Mei", pakan: 365, mati: 2 },
    ];

    const harian30 = [
      { tanggal: "19 Apr", pakan: 320, mati: 4 },
      { tanggal: "26 Apr", pakan: 340, mati: 6 },
      { tanggal: "03 Mei", pakan: 355, mati: 5 },
      { tanggal: "10 Mei", pakan: 360, mati: 3 },
      { tanggal: "18 Mei", pakan: 365, mati: 2 },
    ];

    return {
      ...baseData,
      harian: selectedPeriod === "30hari" ? harian30 : harian7,
    };
  };

  const previewData = getPreviewData();

  return (
    <AdminLayout title="Laporan & Export" showBack>
      {/* ← FIX: Wrapper utama tanpa overflow-y-auto, biar body yang scroll */}
      <div className="space-y-6 pb-6">
        {/* ============================== */}
        {/* SECTION 1: DATE RANGE SELECTOR */}
        {/* ============================== */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 space-y-4">
          <h2 className="font-label-lg text-label-lg text-on-surface-variant">
            Pilih Periode Laporan
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">
                Dari Tanggal
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">
                  calendar_month
                </span>
                <input
                  type="date"
                  className="w-full h-12 pl-10 border border-outline-variant rounded-lg bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary text-body-md outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant">
                Sampai Tanggal
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">
                  calendar_month
                </span>
                <input
                  type="date"
                  className="w-full h-12 pl-10 border border-outline-variant rounded-lg bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary text-body-md outline-none"
                />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface-variant">
              Batch
            </label>
            <select className="w-full h-12 border border-outline-variant rounded-lg bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none text-body-md px-4">
              <option>Batch #3 (Aktif)</option>
              <option>Batch #2 (Selesai)</option>
              <option>Batch #1 (Selesai)</option>
            </select>
          </div>

          {/* ← FIX: Filter chips dengan state & handler */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => setSelectedPeriod("7hari")}
              className={`px-4 py-2 rounded-full text-label-lg transition-all active:scale-95 ${
                selectedPeriod === "7hari"
                  ? "bg-primary-container text-on-primary-container font-bold"
                  : "border border-outline-variant hover:bg-surface-container-low"
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setSelectedPeriod("30hari")}
              className={`px-4 py-2 rounded-full text-label-lg transition-all active:scale-95 ${
                selectedPeriod === "30hari"
                  ? "bg-primary-container text-on-primary-container font-bold"
                  : "border border-outline-variant hover:bg-surface-container-low"
              }`}
            >
              30 Hari
            </button>
            <button
              onClick={() => setSelectedPeriod("batch")}
              className={`px-4 py-2 rounded-full text-label-lg transition-all active:scale-95 ${
                selectedPeriod === "batch"
                  ? "bg-primary-container text-on-primary-container font-bold"
                  : "border border-outline-variant hover:bg-surface-container-low"
              }`}
            >
              Batch Ini
            </button>
          </div>

          <button
            onClick={() => setPreviewOpen(true)}
            className="w-full h-12 bg-primary text-on-primary font-label-lg rounded-lg active:scale-[0.98] transition-transform shadow-md mt-2 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">
              visibility
            </span>
            Tampilkan Preview
          </button>
        </section>

        {/* ============================== */}
        {/* SECTION 2: SUMMARY STATS       */}
        {/* ============================== */}
        <section className="grid grid-cols-2 gap-3">
          <StatCard
            icon="grass"
            label="Total Pakan"
            value="2,450 kg"
            color="primary"
          />
          <StatCard
            icon="favorite_border"
            label="Total Kematian"
            value="127 ekor"
            color="error"
          />
          <StatCard
            icon="trending_up"
            label="Rata-rata FCR"
            value="1.82"
            color="primary"
          />
          <StatCard
            icon="pets"
            label="Ayam Hidup"
            value="14,873 ekor"
            color="primary"
          />
          <StatCard
            icon="percent"
            label="Efisiensi Pakan"
            value="94.2%"
            color="primary"
            badge={{ text: "BAIK", color: "surface-container" }}
          />
          <StatCard
            icon="show_chart"
            label="Deplesi"
            value="0.85%"
            color="on-surface"
          />
        </section>

        {/* ============================== */}
        {/* SECTION 3: CHART PREVIEW       */}
        {/* ============================== */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-headline-sm text-headline-sm">
              Grafik Kematian Harian
            </h2>
            <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">
              tune
            </button>
          </div>
          <p className="font-label-md text-label-md text-outline mb-6">
            7 hari terakhir
          </p>
          <div className="h-40 flex items-end justify-between gap-2 px-2 pb-6 border-b border-outline-variant relative">
            <div className="w-full bg-primary/20 rounded-t h-[30%] transition-all duration-500" />
            <div className="w-full bg-primary/20 rounded-t h-[45%] transition-all duration-500" />
            <div className="w-full bg-primary/20 rounded-t h-[35%] transition-all duration-500" />
            <div className="w-full bg-error/80 rounded-t h-[95%] transition-all duration-500" />
            <div className="w-full bg-primary/20 rounded-t h-[25%] transition-all duration-500" />
            <div className="w-full bg-primary/20 rounded-t h-[40%] transition-all duration-500" />
            <div className="w-full bg-primary/20 rounded-t h-[30%] transition-all duration-500" />
            <div className="absolute left-[-1.5rem] top-0 bottom-6 flex flex-col justify-between text-[10px] text-outline">
              <span>10</span>
              <span>5</span>
              <span>0</span>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-outline pt-2 px-1">
            <span>04 Jan</span>
            <span>07 Jan</span>
            <span>10 Jan</span>
          </div>
        </section>

        {/* ============================== */}
        {/* SECTION 4: FLOOR COMPARISON    */}
        {/* ============================== */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
          <div className="p-4 border-b border-outline-variant">
            <h2 className="font-label-lg text-label-lg">Perbandingan Lantai</h2>
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container text-label-md text-on-surface-variant">
              <tr>
                <th className="py-2 px-4 font-semibold">Lantai</th>
                <th className="py-2 px-4 font-semibold">Populasi</th>
                <th className="py-2 px-4 font-semibold">Kematian</th>
                <th className="py-2 px-4 font-semibold">FCR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-body-md">
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-3 px-4 border-l-4 border-primary">
                  Lantai 1
                </td>
                <td className="py-3 px-4">5,000</td>
                <td className="py-3 px-4 text-error font-medium">42</td>
                <td className="py-3 px-4">1.78</td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-3 px-4 border-l-4 border-secondary-container">
                  Lantai 2
                </td>
                <td className="py-3 px-4">4,950</td>
                <td className="py-3 px-4 text-error font-medium">38</td>
                <td className="py-3 px-4">1.84</td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-3 px-4 border-l-4 border-tertiary">
                  Lantai 3
                </td>
                <td className="py-3 px-4">4,923</td>
                <td className="py-3 px-4 text-error font-medium">47</td>
                <td className="py-3 px-4">1.85</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ============================== */}
        {/* SECTION 5: EXPORT OPTIONS      */}
        {/* ============================== */}
        <section className="space-y-2">
          <h2 className="font-label-lg text-label-lg text-outline tracking-widest pt-2">
            EXPORT DATA
          </h2>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
            {[
              {
                icon: "description",
                iconColor: "text-green-700",
                bg: "bg-green-100",
                label: "Excel Spreadsheet",
                desc: "Laporan mendalam .xlsx",
                borderColor: "border-green-700",
                textColor: "text-green-700",
              },
              {
                icon: "picture_as_pdf",
                iconColor: "text-red-700",
                bg: "bg-red-100",
                label: "Dokumen PDF",
                desc: "Siap cetak & arsip .pdf",
                borderColor: "border-red-700",
                textColor: "text-red-700",
              },
              {
                icon: "csv",
                iconColor: "text-amber-700",
                bg: "bg-amber-100",
                label: "Raw CSV Data",
                desc: "Integrasi sistem .csv",
                borderColor: "border-amber-700",
                textColor: "text-amber-700",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center h-16 px-4 gap-4 ${idx < 2 ? "border-b border-outline-variant" : ""} hover:bg-surface-container-low transition-colors cursor-pointer`}
              >
                <div
                  className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center shrink-0`}
                >
                  <span
                    className={`material-symbols-outlined ${item.iconColor} text-[20px]`}
                  >
                    {item.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-label-lg text-label-lg text-on-surface">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    {item.desc}
                  </p>
                </div>
                <button
                  className={`px-3 py-1.5 border ${item.borderColor} ${item.textColor} text-[12px] font-bold rounded-lg active:scale-95 transition-transform`}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ============================== */}
        {/* SECTION 6: SCHEDULED REPORTS   */}
        {/* ============================== */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b border-outline-variant">
            <h2 className="font-headline-sm text-headline-sm">
              Laporan Otomatis
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={reportSettings.masterToggle}
                onChange={(e) =>
                  setReportSettings({
                    ...reportSettings,
                    masterToggle: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
          <div className="divide-y divide-outline-variant">
            <div
              className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={() => setScheduledReportOpen(true)}
            >
              <div className="flex gap-4 items-center">
                <span className="material-symbols-outlined text-outline">
                  event_repeat
                </span>
                <div>
                  <p className="font-label-lg text-label-lg">
                    Laporan Mingguan
                  </p>
                  <p className="font-label-md text-label-md text-on-surface-variant">
                    Setiap Senin, 06:00 WIB • Email Aktif
                  </p>
                </div>
              </div>
              <button className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-variant transition-colors">
                edit
              </button>
            </div>
            <div
              className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={() => setScheduledReportOpen(true)}
            >
              <div className="flex gap-4 items-center">
                <span className="material-symbols-outlined text-outline">
                  calendar_month
                </span>
                <div>
                  <p className="font-label-lg text-label-lg">Laporan Bulanan</p>
                  <p className="font-label-md text-label-md text-on-surface-variant">
                    Setiap Tgl 1, 07:00 WIB • Email Aktif
                  </p>
                </div>
              </div>
              <button className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-variant transition-colors">
                edit
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ============================== */}
      {/* MODAL: PREVIEW LAPORAN         */}
      {/* ============================== */}
      <div
        className={`fixed inset-0 z-[60] ${previewOpen ? "flex" : "hidden"}`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setPreviewOpen(false)}
        />
        {/* ← FIX: Modal pakai absolute bottom-0, body yang scroll */}
        <div className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-3xl p-6 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
          <div
            className="w-12 h-1 bg-outline-variant rounded-full mx-auto cursor-pointer"
            onClick={() => setPreviewOpen(false)}
          />

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined">visibility</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm">
                  Preview Laporan
                </h2>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  {previewData.periode}
                </p>
              </div>
            </div>
            <button
              onClick={() => setPreviewOpen(false)}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-outline">
                close
              </span>
            </button>
          </div>

          <div className="bg-surface-container-low rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-label-md text-on-surface-variant">
                Batch
              </span>
              <span className="font-label-lg text-on-surface font-bold">
                {previewData.batch}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label-md text-on-surface-variant">
                Periode
              </span>
              <span className="font-label-lg text-on-surface">
                {previewData.periode}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 flex flex-col items-center">
              <span className="material-symbols-outlined text-primary text-[24px]">
                grass
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface mt-1">
                {previewData.totalPakan}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Total Pakan
              </span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 flex flex-col items-center">
              <span className="material-symbols-outlined text-error text-[24px]">
                favorite_border
              </span>
              <span className="font-headline-sm text-headline-sm text-error mt-1">
                {previewData.totalKematian}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Kematian
              </span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 flex flex-col items-center">
              <span className="material-symbols-outlined text-primary text-[24px]">
                trending_up
              </span>
              <span className="font-headline-sm text-headline-sm text-primary mt-1">
                {previewData.rataFCR}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Rata-rata FCR
              </span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 flex flex-col items-center">
              <span className="material-symbols-outlined text-primary text-[24px]">
                pets
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface mt-1">
                {previewData.ayamHidup}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Ayam Hidup
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
            <div className="p-4 border-b border-outline-variant">
              <h3 className="font-label-lg text-label-lg">Data Harian</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container text-label-md text-on-surface-variant">
                <tr>
                  <th className="py-2 px-4 font-semibold">Tanggal</th>
                  <th className="py-2 px-4 font-semibold text-right">
                    Pakan (kg)
                  </th>
                  <th className="py-2 px-4 font-semibold text-right">Mati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-body-md">
                {previewData.harian.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-surface-container-low transition-colors"
                  >
                    <td className="py-3 px-4">{row.tanggal}</td>
                    <td className="py-3 px-4 text-right">{row.pakan}</td>
                    <td className="py-3 px-4 text-right text-error">
                      {row.mati}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 pb-4">
            <button className="w-full h-14 bg-primary text-on-primary rounded-xl font-label-lg shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform">
              <span className="material-symbols-outlined">download</span>
              Export Excel
            </button>
            <button className="w-full h-12 border border-outline text-primary font-label-lg rounded-lg flex items-center justify-center gap-2 active:bg-primary/5 transition-colors">
              <span className="material-symbols-outlined">picture_as_pdf</span>
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* MODAL: LAPORAN OTOMATIS DETAIL */}
      {/* ============================== */}
      <div
        className={`fixed inset-0 z-[60] ${scheduledReportOpen ? "flex" : "hidden"}`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setScheduledReportOpen(false)}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-3xl p-6 flex flex-col gap-6 max-h-[95vh] overflow-y-auto">
          <div
            className="w-12 h-1 bg-outline-variant rounded-full mx-auto cursor-pointer"
            onClick={() => setScheduledReportOpen(false)}
          />

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm">
                Laporan Otomatis
              </h2>
            </div>
            <button
              onClick={() => setScheduledReportOpen(false)}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-outline">
                close
              </span>
            </button>
          </div>

          <div className="bg-surface-container-low rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-label-lg text-on-surface">
                Aktifkan Laporan Otomatis
              </p>
              <p className="font-label-md text-on-surface-variant">
                Generate & kirim laporan secara terjadwal
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={reportSettings.masterToggle}
                onChange={(e) =>
                  setReportSettings({
                    ...reportSettings,
                    masterToggle: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          <h3 className="font-label-lg text-on-surface-variant uppercase tracking-wider">
            JADWAL LAPORAN
          </h3>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="font-label-lg text-on-surface">
                Laporan Mingguan
              </span>
              <input
                type="checkbox"
                checked={reportSettings.weeklyEnabled}
                onChange={(e) =>
                  setReportSettings({
                    ...reportSettings,
                    weeklyEnabled: e.target.checked,
                  })
                }
                className="w-5 h-5 accent-primary rounded"
              />
            </div>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`text-center py-2 rounded-lg font-label-md cursor-pointer transition-all ${selectedDays.includes(day) ? "bg-primary-container text-white" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-variant"}`}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="flex items-center bg-surface-container-low px-3 py-2 rounded-lg mb-4 w-fit">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-2">
                access_time
              </span>
              <span className="font-label-lg text-on-surface">
                {reportSettings.weeklyTime}
              </span>
            </div>
            <div className="space-y-3">
              {[
                { key: "ringkasanKPI", label: "Ringkasan KPI" },
                { key: "dataPakan", label: "Data Pakan Harian" },
                { key: "laporanKematian", label: "Laporan Kematian" },
                { key: "perbandinganLantai", label: "Perbandingan Lantai" },
                { key: "dataMentahCSV", label: "Data Mentah CSV" },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={reportSettings.weeklyItems[item.key]}
                    onChange={() => toggleWeeklyItem(item.key)}
                    className="w-4 h-4 rounded border-outline accent-primary"
                  />
                  <span
                    className={`font-label-md ${reportSettings.weeklyItems[item.key] ? "text-on-surface" : "text-on-surface-variant"}`}
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="font-label-lg text-on-surface">
                Laporan Bulanan
              </span>
              <input
                type="checkbox"
                checked={reportSettings.monthlyEnabled}
                onChange={(e) =>
                  setReportSettings({
                    ...reportSettings,
                    monthlyEnabled: e.target.checked,
                  })
                }
                className="w-5 h-5 accent-primary rounded"
              />
            </div>
            <div className="flex space-x-3 mb-4">
              <div className="flex items-center bg-surface-container-low px-3 py-2 rounded-lg w-fit">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-2">
                  calendar_today
                </span>
                <span className="font-label-lg text-on-surface">
                  Tanggal {reportSettings.monthlyDate}
                </span>
              </div>
              <div className="flex items-center bg-surface-container-low px-3 py-2 rounded-lg w-fit">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-2">
                  access_time
                </span>
                <span className="font-label-lg text-on-surface">
                  {reportSettings.monthlyTime}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { key: "perbandinganBatch", label: "Perbandingan Antar Batch" },
                { key: "analisaEfisiensi", label: "Analisa Efisiensi Biaya" },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={reportSettings.monthlyItems[item.key]}
                    onChange={() => toggleMonthlyItem(item.key)}
                    className="w-4 h-4 rounded border-outline accent-primary"
                  />
                  <span
                    className={`font-label-md ${reportSettings.monthlyItems[item.key] ? "text-on-surface" : "text-on-surface-variant"}`}
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
            <p className="font-label-lg text-on-surface mb-3">
              Tujuan Pengiriman Email
            </p>
            <div className="space-y-2 mb-4">
              {reportSettings.emails.map((email) => (
                <div
                  key={email}
                  className="flex items-center justify-between bg-surface-container-low p-3 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-on-surface-variant mr-3">
                      mail
                    </span>
                    <span className="font-label-md text-on-surface">
                      {email}
                    </span>
                  </div>
                  <button
                    onClick={() => removeEmail(email)}
                    className="text-outline hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      close
                    </span>
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full flex items-center justify-center py-3 border-2 border-dashed border-outline-variant rounded-xl text-primary font-label-lg hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined mr-2">add_circle</span>
              Tambah Email
            </button>
          </div>

          <div className="mb-4">
            <p className="font-label-lg text-on-surface mb-3">
              Format Lampiran
            </p>
            <div className="grid grid-cols-3 gap-3">
              {formats.map((format) => (
                <button
                  key={format.name}
                  onClick={() => toggleFormat(format.name)}
                  className={`border-2 p-3 rounded-xl text-center font-label-lg cursor-pointer flex flex-col items-center transition-all ${selectedFormats.includes(format.name) ? "border-primary bg-primary-container text-white" : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-variant"}`}
                >
                  <span className="material-symbols-outlined mb-1">
                    {format.icon}
                  </span>
                  {format.name}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full h-14 bg-primary text-on-primary rounded-xl font-label-lg shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <span className="material-symbols-outlined">save</span>
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
