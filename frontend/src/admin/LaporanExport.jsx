import { useState, useEffect } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import StatCard from "../components/admin/StatCard";

export default function LaporanExport() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("batch");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [loadingBatches, setLoadingBatches] = useState(true);

  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState([]);
  const [floorComparison, setFloorComparison] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [exporting, setExporting] = useState(null); // "excel" | "pdf" | null
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  // ── Fetch daftar batch untuk dropdown ──────────────────────
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetch(`${API}/api/admin/batches`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setBatches(list);
        const active = list.find((b) => b.status === "aktif");
        setSelectedBatchId(active ? active.id : list[0]?.id || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBatches(false);
      }
    };
    fetchBatches();
  }, []);

  // ── Hitung range tanggal berdasarkan periode ──────────────
  const getDateRange = () => {
    const today = new Date();
    if (selectedPeriod === "7hari") {
      const from = new Date(today);
      from.setDate(today.getDate() - 6);
      return {
        from: from.toISOString().split("T")[0],
        to: today.toISOString().split("T")[0],
      };
    }
    if (selectedPeriod === "30hari") {
      const from = new Date(today);
      from.setDate(today.getDate() - 29);
      return {
        from: from.toISOString().split("T")[0],
        to: today.toISOString().split("T")[0],
      };
    }
    // batch: pakai dateFrom/dateTo custom kalau diisi
    return { from: dateFrom || undefined, to: dateTo || undefined };
  };

  // ── Fetch laporan ──────────────────────────────────────────
  const fetchReport = async () => {
    setLoadingReport(true);
    setError(null);
    try {
      const { from, to } = getDateRange();
      const params = new URLSearchParams();
      if (selectedBatchId) params.set("batchId", selectedBatchId);
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      const [summaryRes, dailyRes, floorRes] = await Promise.all([
        fetch(`${API}/api/admin/reports/summary?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/api/admin/reports/daily?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/api/admin/reports/floor-comparison?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const summaryData = await summaryRes.json();
      const dailyData = await dailyRes.json();
      const floorData = await floorRes.json();

      if (!summaryRes.ok)
        throw new Error(summaryData.error || "Gagal memuat laporan");

      setSummary(summaryData);
      setDaily(Array.isArray(dailyData) ? dailyData : []);
      setFloorComparison(Array.isArray(floorData) ? floorData : []);
      setPreviewOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingReport(false);
    }
  };

  // ── Download Excel / PDF ────────────────────────────────────
  const handleExport = async (type) => {
    setExporting(type);
    setError(null);
    try {
      const { from, to } = getDateRange();
      const params = new URLSearchParams();
      if (selectedBatchId) params.set("batchId", selectedBatchId);
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      const res = await fetch(
        `${API}/api/admin/reports/export/${type}?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Gagal export ${type}`);
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="(.+)"/);
      const filename = match
        ? match[1]
        : `laporan.${type === "excel" ? "xlsx" : "pdf"}`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(null);
    }
  };

  const formatTanggal = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getPeriodeLabel = () => {
    const { from, to } = getDateRange();
    if (selectedPeriod === "batch") {
      const batch = batches.find((b) => b.id === parseInt(selectedBatchId));
      if (!batch) return "-";
      return `${formatTanggal(batch.tanggalMulai)} – ${batch.tanggalSelesai ? formatTanggal(batch.tanggalSelesai) : "Sekarang"}`;
    }
    return from && to ? `${formatTanggal(from)} – ${formatTanggal(to)}` : "-";
  };

  const selectedBatch = batches.find((b) => b.id === parseInt(selectedBatchId));

  // ── Max value untuk chart kematian harian ──────────────────
  const maxMati = Math.max(...daily.map((d) => d.mati), 1);

  // ── Loading awal ────────────────────────────────────────────
  if (loadingBatches) {
    return (
      <AdminLayout title="Laporan & Export" showBack>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <span className="material-symbols-outlined text-primary text-[40px] animate-spin">
            progress_activity
          </span>
          <p className="font-label-md text-on-surface-variant">
            Memuat daftar batch...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Laporan & Export" showBack>
      <div className="space-y-6 pb-6">
        {error && (
          <div className="bg-error-container text-on-error-container rounded-xl p-4 flex gap-3 items-center">
            <span className="material-symbols-outlined">error</span>
            <p className="font-label-md flex-1">{error}</p>
          </div>
        )}

        {/* ============================== */}
        {/* SECTION 1: FILTER PERIODE      */}
        {/* ============================== */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 space-y-4">
          <h2 className="font-label-lg text-label-lg text-on-surface-variant">
            Pilih Periode Laporan
          </h2>

          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface-variant">
              Batch
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full h-12 border border-outline-variant rounded-lg bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none text-body-md px-4"
            >
              {batches.length === 0 && (
                <option value="">Belum ada batch</option>
              )}
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  Batch #{b.nomorBatch}{" "}
                  {b.status === "aktif" ? "(Aktif)" : "(Selesai)"}
                </option>
              ))}
            </select>
          </div>

          {selectedPeriod === "batch" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant whitespace-nowrap text-[11px]">
                  Dari Tanggal (opsional)
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full h-12 px-3 border border-outline-variant rounded-lg bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary text-body-sm outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant whitespace-nowrap text-[11px]">
                  Sampai Tanggal (opsional)
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full h-12 px-3 border border-outline-variant rounded-lg bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary text-body-sm outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { key: "7hari", label: "7 Hari" },
              { key: "30hari", label: "30 Hari" },
              { key: "batch", label: "Seluruh Batch" },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setSelectedPeriod(p.key)}
                className={`px-4 py-2 rounded-full text-label-lg transition-all active:scale-95 ${
                  selectedPeriod === p.key
                    ? "bg-primary-container text-on-primary-container font-bold"
                    : "border border-outline-variant hover:bg-surface-container-low"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchReport}
            disabled={loadingReport || !selectedBatchId}
            className="w-full h-12 bg-primary text-on-primary font-label-lg rounded-lg active:scale-[0.98] transition-transform shadow-md mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[20px]">
              {loadingReport ? "progress_activity" : "visibility"}
            </span>
            {loadingReport ? "Memuat..." : "Tampilkan Preview"}
          </button>
        </section>

        {/* ============================== */}
        {/* SECTION 2: SUMMARY STATS       */}
        {/* ============================== */}
        {summary && (
          <section className="grid grid-cols-2 gap-3">
            <StatCard
              icon="grass"
              label="Total Pakan"
              value={`${summary.totalPakan?.toLocaleString("id-ID") || 0} kg`}
              color="primary"
            />
            <StatCard
              icon="favorite_border"
              label="Total Kematian"
              value={`${summary.totalKematian?.toLocaleString("id-ID") || 0} ekor`}
              color="error"
            />
            <StatCard
              icon="trending_up"
              label="FCR"
              value={summary.fcr || "-"}
              color="primary"
            />
            <StatCard
              icon="pets"
              label="Ayam Hidup"
              value={
                summary.ayamHidup !== null
                  ? `${summary.ayamHidup.toLocaleString("id-ID")} ekor`
                  : "-"
              }
              color="primary"
            />
            <StatCard
              icon="percent"
              label="Deplesi"
              value={summary.deplesi !== null ? `${summary.deplesi}%` : "-"}
              color="on-surface"
            />
            <StatCard
              icon="show_chart"
              label="Total Panen"
              value={`${summary.totalPanen?.toLocaleString("id-ID") || 0} kg`}
              color="on-surface"
            />
          </section>
        )}

        {/* ============================== */}
        {/* SECTION 3: CHART KEMATIAN      */}
        {/* ============================== */}
        {daily.length > 0 && (
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
            <div className="flex justify-between items-center mb-1">
              <h2 className="font-headline-sm text-headline-sm">
                Grafik Kematian Harian
              </h2>
            </div>
            <p className="font-label-md text-label-md text-outline mb-6">
              {daily.length} hari data
            </p>
            <div className="h-40 flex items-end justify-between gap-2 px-2 pb-6 border-b border-outline-variant relative">
              {daily.map((d, idx) => (
                <div
                  key={idx}
                  className={`w-full rounded-t transition-all duration-500 ${d.mati > 0 ? "bg-error/80" : "bg-primary/20"}`}
                  style={{
                    height: `${Math.max((d.mati / maxMati) * 100, 4)}%`,
                  }}
                  title={`${formatTanggal(d.tanggal)}: ${d.mati} ekor`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-outline pt-2 px-1">
              <span>{formatTanggal(daily[0]?.tanggal)}</span>
              {daily.length > 2 && (
                <span>
                  {formatTanggal(daily[Math.floor(daily.length / 2)]?.tanggal)}
                </span>
              )}
              <span>{formatTanggal(daily[daily.length - 1]?.tanggal)}</span>
            </div>
          </section>
        )}

        {/* ============================== */}
        {/* SECTION 4: PERBANDINGAN LANTAI */}
        {/* ============================== */}
        {floorComparison.length > 0 && (
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
            <div className="p-4 border-b border-outline-variant">
              <h2 className="font-label-lg text-label-lg">
                Perbandingan Lantai
              </h2>
            </div>
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container text-label-md text-on-surface-variant">
                <tr>
                  <th className="py-2 px-4 font-semibold">Lantai</th>
                  <th className="py-2 px-4 font-semibold text-right">
                    Pakan (kg)
                  </th>
                  <th className="py-2 px-4 font-semibold text-right">
                    Kematian
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-body-md">
                {floorComparison.map((f) => (
                  <tr
                    key={f.id}
                    className="hover:bg-surface-container-low transition-colors"
                  >
                    <td className="py-3 px-4">{f.nama}</td>
                    <td className="py-3 px-4 text-right">
                      {f.totalPakan.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-right text-error font-medium">
                      {f.totalMati}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* ============================== */}
        {/* SECTION 5: EXPORT DATA         */}
        {/* ============================== */}
        <section className="space-y-2">
          <h2 className="font-label-lg text-label-lg text-outline tracking-widest pt-2">
            EXPORT DATA
          </h2>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
            {[
              {
                type: "excel",
                icon: "description",
                iconColor: "text-green-700",
                bg: "bg-green-100",
                label: "Excel Spreadsheet",
                desc: "Laporan mendalam .xlsx",
                borderColor: "border-green-700",
                textColor: "text-green-700",
              },
              {
                type: "pdf",
                icon: "picture_as_pdf",
                iconColor: "text-red-700",
                bg: "bg-red-100",
                label: "Dokumen PDF",
                desc: "Siap cetak & arsip .pdf",
                borderColor: "border-red-700",
                textColor: "text-red-700",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center h-16 px-4 gap-4 ${idx < 1 ? "border-b border-outline-variant" : ""}`}
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
                  onClick={() => handleExport(item.type)}
                  disabled={exporting !== null || !selectedBatchId}
                  className={`px-3 py-1.5 border ${item.borderColor} ${item.textColor} text-[12px] font-bold rounded-lg active:scale-95 transition-transform disabled:opacity-50`}
                >
                  {exporting === item.type ? "..." : "Download"}
                </button>
              </div>
            ))}
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
                  {getPeriodeLabel()}
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
                {selectedBatch
                  ? `Batch #${selectedBatch.nomorBatch} ${selectedBatch.status === "aktif" ? "(Aktif)" : "(Selesai)"}`
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label-md text-on-surface-variant">
                Periode
              </span>
              <span className="font-label-lg text-on-surface">
                {getPeriodeLabel()}
              </span>
            </div>
          </div>

          {summary && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 flex flex-col items-center">
                <span className="material-symbols-outlined text-primary text-[24px]">
                  grass
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface mt-1">
                  {summary.totalPakan?.toLocaleString("id-ID") || 0} kg
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
                  {summary.totalKematian?.toLocaleString("id-ID") || 0} ekor
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
                  {summary.fcr || "-"}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  FCR
                </span>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 flex flex-col items-center">
                <span className="material-symbols-outlined text-primary text-[24px]">
                  pets
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface mt-1">
                  {summary.ayamHidup !== null
                    ? summary.ayamHidup.toLocaleString("id-ID")
                    : "-"}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Ayam Hidup
                </span>
              </div>
            </div>
          )}

          {daily.length > 0 && (
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
                  {daily.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-surface-container-low transition-colors"
                    >
                      <td className="py-3 px-4">
                        {formatTanggal(row.tanggal)}
                      </td>
                      <td className="py-3 px-4 text-right">{row.pakan}</td>
                      <td className="py-3 px-4 text-right text-error">
                        {row.mati}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {daily.length === 0 && (
            <div className="text-center py-6">
              <p className="font-label-md text-on-surface-variant">
                Tidak ada data harian untuk periode ini.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 pb-4">
            <button
              onClick={() => handleExport("excel")}
              disabled={exporting !== null}
              className="w-full h-14 bg-primary text-on-primary rounded-xl font-label-lg shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
            >
              <span className="material-symbols-outlined">download</span>
              {exporting === "excel" ? "Mengunduh..." : "Export Excel"}
            </button>
            <button
              onClick={() => handleExport("pdf")}
              disabled={exporting !== null}
              className="w-full h-12 border border-outline text-primary font-label-lg rounded-lg flex items-center justify-center gap-2 active:bg-primary/5 transition-colors disabled:opacity-60"
            >
              <span className="material-symbols-outlined">picture_as_pdf</span>
              {exporting === "pdf" ? "Mengunduh..." : "Export PDF"}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
