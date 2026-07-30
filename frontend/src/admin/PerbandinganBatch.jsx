import { useState, useEffect } from "react";
import AdminLayout from "../components/admin/AdminLayout";

export default function PerbandinganBatch() {
  const [selectedFilter, setSelectedFilter] = useState("Semua Batch");
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  const fetchComparison = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/admin/batches/stats/compare`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal memuat data");
      setBatches(Array.isArray(json) ? json : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, []);

  const formatTanggal = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    });
  };

  const filters = [
    "Semua Batch",
    ...batches.map((b) => `Batch #${b.nomorBatch}`),
  ];

  const filteredBatches =
    selectedFilter === "Semua Batch"
      ? batches
      : batches.filter((b) => `Batch #${b.nomorBatch}` === selectedFilter);

  const batchesWithFcr = batches.filter((b) => b.fcr !== null);
  const bestBatch =
    batchesWithFcr.length > 0
      ? batchesWithFcr.reduce((best, b) =>
          parseFloat(b.fcr) < parseFloat(best.fcr) ? b : best,
        )
      : null;

  const fcrValues = batches
    .filter((b) => b.fcr !== null)
    .map((b) => parseFloat(b.fcr));
  const maxFcr = fcrValues.length > 0 ? Math.max(...fcrValues) : 2.0;
  const minFcr = 1.5;
  const getFcrBarHeight = (fcr) => {
    if (!fcr) return 30;
    const val = parseFloat(fcr);
    return Math.round(((val - minFcr) / (maxFcr - minFcr + 0.1)) * 60 + 30);
  };

  const deplesiValues = batches
    .filter((b) => b.deplesi !== null)
    .map((b) => parseFloat(b.deplesi));
  const maxDeplesi =
    deplesiValues.length > 0 ? Math.max(...deplesiValues) : 100;

  const generateInsights = () => {
    const insights = [];
    if (batchesWithFcr.length >= 2) {
      const sorted = [...batchesWithFcr].sort(
        (a, b) => a.nomorBatch - b.nomorBatch,
      );
      const last = sorted[sorted.length - 1];
      const prev = sorted[sorted.length - 2];
      const diff = (
        ((parseFloat(prev.fcr) - parseFloat(last.fcr)) / parseFloat(prev.fcr)) *
        100
      ).toFixed(1);
      if (parseFloat(diff) > 0) {
        insights.push({
          icon: "trending_up",
          iconColor: "text-primary",
          text: "FCR membaik",
          highlight: `${diff}%`,
          suffix: `dari Batch #${prev.nomorBatch} ke Batch #${last.nomorBatch}`,
        });
      } else if (parseFloat(diff) < 0) {
        insights.push({
          icon: "trending_down",
          iconColor: "text-error",
          text: "FCR memburuk",
          highlight: `${Math.abs(diff)}%`,
          suffix: `dari Batch #${prev.nomorBatch} ke Batch #${last.nomorBatch}`,
        });
      }
    }
    const deplesiWithData = batches.filter((b) => b.deplesi !== null);
    if (deplesiWithData.length >= 2) {
      const sorted = [...deplesiWithData].sort(
        (a, b) => a.nomorBatch - b.nomorBatch,
      );
      const last = sorted[sorted.length - 1];
      const prev = sorted[sorted.length - 2];
      const diff = (
        parseFloat(prev.deplesi) - parseFloat(last.deplesi)
      ).toFixed(2);
      if (parseFloat(diff) > 0) {
        insights.push({
          icon: "verified",
          iconColor: "text-primary",
          text: "Mortalitas turun",
          highlight: `${diff}%`,
          suffix: `dibanding Batch #${prev.nomorBatch} — performa kandang membaik`,
        });
      }
    }
    if (insights.length === 0) {
      insights.push({
        icon: "info",
        iconColor: "text-on-surface-variant",
        text: "Belum cukup data untuk menghasilkan insight otomatis. Lengkapi data panen untuk melihat perbandingan FCR.",
        noHighlight: true,
      });
    }
    return insights;
  };

  if (loading) {
    return (
      <AdminLayout title="Perbandingan Batch" showBack>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <span className="material-symbols-outlined text-primary text-[40px] animate-spin">
            progress_activity
          </span>
          <p className="font-label-md text-on-surface-variant">
            Memuat data perbandingan...
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Perbandingan Batch" showBack>
        <div className="bg-error-container text-on-error-container rounded-xl p-4 flex gap-3 items-center">
          <span className="material-symbols-outlined">error</span>
          <p className="font-label-md flex-1">{error}</p>
          <button onClick={fetchComparison} className="font-label-md underline">
            Coba lagi
          </button>
        </div>
      </AdminLayout>
    );
  }

  const insights = generateInsights();

  return (
    <AdminLayout title="Perbandingan Batch" showBack>
      <main className="pt-2 pb-6 space-y-3">
        {/* FILTER CHIPS */}
        <section className="overflow-x-auto whitespace-nowrap flex gap-2 no-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`rounded-full px-4 py-2 font-label-md transition-all active:scale-95 ${
                selectedFilter === filter
                  ? "bg-primary-container text-on-primary-container"
                  : "border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              {filter}
            </button>
          ))}
        </section>

        {/* BEST PERFORMER */}
        {bestBatch ? (
          <section className="bg-primary-container rounded-xl p-4 shadow-md overflow-hidden relative">
            <div className="absolute -right-4 -top-4 opacity-10">
              <span
                className="material-symbols-outlined text-[80px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                emoji_events
              </span>
            </div>
            <div className="relative z-10">
              <p className="font-label-md uppercase text-on-primary-container/70 tracking-wider">
                🏆 PERFORMA TERBAIK
              </p>
              <h2 className="font-headline-md text-on-primary-container mt-1">
                Batch #{bestBatch.nomorBatch}
              </h2>
              <p className="font-label-md text-on-primary-container/80 mt-1">
                FCR {bestBatch.fcr}
                {bestBatch.deplesi && ` · Mortalitas ${bestBatch.deplesi}%`}
              </p>
              <p className="font-label-md text-on-primary-container/60 mt-4 italic">
                {bestBatch.status === "aktif"
                  ? "Batch aktif dengan performa paling efisien"
                  : `Batch selesai — durasi ${bestBatch.durasi} hari`}
              </p>
            </div>
          </section>
        ) : (
          <section className="bg-surface-container-low rounded-xl p-4 text-center">
            <p className="font-label-md text-on-surface-variant">
              Belum ada data FCR. Lengkapi data panen untuk melihat performa
              terbaik.
            </p>
          </section>
        )}

        {/* COMPARISON TABLE */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
          <div className="grid grid-cols-4 bg-surface-container-high px-3 py-3 border-b border-outline-variant">
            <div className="font-label-lg text-on-surface-variant">Metrik</div>
            {filteredBatches.slice(0, 3).map((b) => (
              <div
                key={b.id}
                className={`font-label-lg text-center ${b.status === "aktif" ? "text-primary font-bold" : "text-on-surface-variant"}`}
              >
                #{b.nomorBatch}
                {b.status === "aktif" && (
                  <span className="text-[9px] block">aktif</span>
                )}
              </div>
            ))}
            {filteredBatches.length < 3 &&
              Array.from({ length: 3 - filteredBatches.length }).map((_, i) => (
                <div key={`eh-${i}`} />
              ))}
          </div>

          {[
            { label: "Durasi", key: "durasi", suffix: " Hr" },
            {
              label: "Populasi",
              key: "jumlahDoc",
              format: (v) => parseInt(v).toLocaleString("id-ID"),
            },
            { label: "Deplesi", key: "deplesi", suffix: "%" },
            { label: "FCR", key: "fcr" },
            {
              label: "Total Pakan",
              key: "totalPakan",
              suffix: " kg",
              format: (v) => parseInt(v).toLocaleString("id-ID"),
            },
          ].map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-4 items-center px-3 py-3 ${idx < 4 ? "border-b border-outline-variant/30" : ""}`}
            >
              <div className="font-label-md text-on-surface-variant">
                {row.label}
              </div>
              {filteredBatches.slice(0, 3).map((batch) => {
                const rawVal = batch[row.key];
                const displayVal =
                  rawVal === null || rawVal === undefined
                    ? "-"
                    : row.format
                      ? row.format(rawVal) + (row.suffix || "")
                      : rawVal + (row.suffix || "");
                const isBestFcr =
                  row.key === "fcr" &&
                  bestBatch?.id === batch.id &&
                  rawVal !== null;
                return (
                  <div
                    key={batch.id}
                    className={`font-label-md text-center ${isBestFcr ? "text-primary font-bold" : batch.status === "aktif" ? "font-bold text-on-surface" : "text-on-surface"}`}
                  >
                    {displayVal}
                    {batch.status === "aktif" && rawVal !== null && (
                      <span className="text-[9px] text-outline block">
                        *estimasi
                      </span>
                    )}
                  </div>
                );
              })}
              {filteredBatches.length < 3 &&
                Array.from({ length: 3 - filteredBatches.length }).map(
                  (_, i) => <div key={`er-${i}`} />,
                )}
            </div>
          ))}
          <div className="bg-surface-container-low px-3 py-2">
            <p className="italic text-[10px] text-on-surface-variant">
              *Data batch aktif belum final
            </p>
          </div>
        </section>

        {/* FCR TREND CHART */}
        <section className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant">
          <h3 className="font-label-lg mb-6 text-on-surface">
            Tren FCR Per Batch
          </h3>
          {batchesWithFcr.length > 0 ? (
            <div className="relative h-40 flex items-end justify-around pb-6 border-b border-outline-variant/20">
              <div className="absolute w-full border-t border-dashed border-outline top-0 z-0">
                <span className="absolute -top-5 right-0 text-[10px] text-outline">
                  Target 2.00
                </span>
              </div>
              {filteredBatches.map((batch) => (
                <div
                  key={batch.id}
                  className={`flex flex-col items-center gap-2 z-10 w-12 ${batch.status === "aktif" ? "text-primary font-bold" : ""}`}
                >
                  <span className="font-label-md">{batch.fcr || "-"}</span>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-700 ${batch.status === "aktif" ? "bg-tertiary-fixed-dim" : "bg-surface-container-highest"}`}
                    style={{ height: `${getFcrBarHeight(batch.fcr)}%` }}
                  />
                  <span
                    className={`font-label-md ${batch.status === "aktif" ? "text-primary font-bold" : "text-on-surface-variant"}`}
                  >
                    #{batch.nomorBatch}
                    {batch.status === "aktif" ? "*" : ""}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center">
              <p className="font-label-md text-on-surface-variant text-center">
                Belum ada data FCR. Catat panen untuk melihat tren.
              </p>
            </div>
          )}
        </section>

        {/* MORTALITY BARS */}
        <section className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant">
          <h3 className="font-label-lg mb-4 text-on-surface">
            Perbandingan Mortalitas
          </h3>
          {deplesiValues.length > 0 ? (
            <div className="space-y-4">
              {filteredBatches.map((batch) => {
                const deplesiVal = batch.deplesi
                  ? parseFloat(batch.deplesi)
                  : null;
                const barWidth =
                  deplesiVal !== null
                    ? Math.round((deplesiVal / maxDeplesi) * 100)
                    : 0;
                return (
                  <div key={batch.id} className="space-y-1">
                    <div
                      className={`flex justify-between font-label-md ${batch.status === "aktif" ? "text-primary font-bold" : "text-on-surface-variant"}`}
                    >
                      <span>
                        Batch #{batch.nomorBatch}
                        {batch.status === "aktif" ? " (Aktif)" : ""}
                      </span>
                      <span>
                        {deplesiVal !== null ? `${deplesiVal}%` : "-"}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2">
                      <div
                        className={`rounded-full h-2 transition-all duration-1000 ${batch.status === "aktif" ? "bg-tertiary" : "bg-error/60"}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="font-label-md text-on-surface-variant">
                Belum ada data mortalitas dari hasil panen.
              </p>
            </div>
          )}
        </section>

        {/* INSIGHTS */}
        <section className="p-4 bg-surface-container-low rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="material-symbols-outlined text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lightbulb
            </span>
            <h3 className="font-label-lg text-on-surface">Insight Otomatis</h3>
          </div>
          <ul className="space-y-3">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex gap-3">
                <span
                  className={`material-symbols-outlined text-[18px] mt-0.5 ${insight.iconColor}`}
                >
                  {insight.icon}
                </span>
                <p className="font-label-md text-on-surface-variant">
                  {insight.noHighlight ? (
                    insight.text
                  ) : (
                    <>
                      {insight.text}{" "}
                      <span className="font-bold text-primary">
                        {insight.highlight}
                      </span>{" "}
                      {insight.suffix}
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </AdminLayout>
  );
}
