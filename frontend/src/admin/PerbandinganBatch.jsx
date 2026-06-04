import { useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";

export default function PerbandinganBatch() {
  const [selectedFilter, setSelectedFilter] = useState("Semua Batch");

  const batchData = {
    bestPerformer: {
      batch: "Batch #3",
      fcr: 1.82,
      mortalitas: 0.85,
      note: "Batch aktif dengan performa paling efisien",
    },
    comparison: [
      {
        id: 1,
        name: "#1",
        durasi: "38 Hr",
        populasi: "14,000",
        deplesi: "2.18%",
        fcr: 1.85,
        totalPakan: "26,000 kg",
      },
      {
        id: 2,
        name: "#2",
        durasi: "35 Hr",
        populasi: "14,500",
        deplesi: "1.45%",
        fcr: 1.78,
        totalPakan: "24,200 kg",
      },
      {
        id: 3,
        name: "#3*",
        durasi: "21 Hr*",
        populasi: "15,000",
        deplesi: "0.85%",
        fcr: 1.82,
        totalPakan: "24,570*",
        active: true,
      },
    ],
    fcrTrend: [
      { name: "#1", value: 1.85, height: 70 },
      { name: "#2", value: 1.78, height: 55 },
      { name: "#3*", value: 1.82, height: 60, active: true },
    ],
    mortality: [
      { name: "Batch #1", value: 2.18, width: 73, color: "bg-error" },
      { name: "Batch #2", value: 1.45, width: 48, color: "bg-error/60" },
      {
        name: "Batch #3 (Aktif)",
        value: 0.85,
        width: 28,
        color: "bg-tertiary",
        active: true,
      },
    ],
    insights: [
      {
        icon: "trending_up",
        iconColor: "text-primary",
        text: "FCR membaik",
        highlight: "1.6%",
        suffix: "dari Batch #2 ke Batch #3 (aktif)",
      },
      {
        icon: "verified",
        iconColor: "text-primary",
        text: "Mortalitas turun",
        highlight: "41%",
        suffix: "dibanding Batch #2 — performa kandang membaik",
      },
      {
        icon: "info",
        iconColor: "text-on-surface-variant",
        text: "Konsumsi pakan per ekor lebih efisien di Batch #2 (47g/ekor/hari)",
        noHighlight: true,
      },
    ],
  };

  const filters = ["Semua Batch", "Batch #1", "Batch #2", "Batch #3"];

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

        {/* HIGHLIGHT CARD */}
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
              {batchData.bestPerformer.batch}
            </h2>
            <p className="font-label-md text-on-primary-container/80 mt-1">
              FCR {batchData.bestPerformer.fcr} · Mortalitas{" "}
              {batchData.bestPerformer.mortalitas}%
            </p>
            <p className="font-label-md text-on-primary-container/60 mt-4 italic">
              {batchData.bestPerformer.note}
            </p>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
          <div className="grid grid-cols-4 bg-surface-container-high px-3 py-3 border-b border-outline-variant">
            <div className="font-label-lg text-on-surface-variant">Metrik</div>
            <div className="font-label-lg text-on-surface-variant text-center">
              #1
            </div>
            <div className="font-label-lg text-on-surface-variant text-center">
              #2
            </div>
            <div className="font-label-lg text-on-surface text-center">#3*</div>
          </div>

          {[
            { label: "Durasi", keys: ["durasi", "durasi", "durasi"] },
            { label: "Populasi", keys: ["populasi", "populasi", "populasi"] },
            { label: "Deplesi", keys: ["deplesi", "deplesi", "deplesi"] },
            { label: "FCR", keys: ["fcr", "fcr", "fcr"] },
            {
              label: "Total Pakan",
              keys: ["totalPakan", "totalPakan", "totalPakan"],
            },
          ].map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-4 items-center px-3 py-3 ${idx < 4 ? "border-b border-outline-variant/30" : ""}`}
            >
              <div className="font-label-md text-on-surface-variant">
                {row.label}
              </div>
              {batchData.comparison.map((batch, bIdx) => (
                <div
                  key={batch.id}
                  className={`font-label-md text-center ${batch.active && row.label === "FCR" ? "text-primary font-bold" : batch.active && row.label === "Deplesi" ? "text-primary flex items-center justify-center gap-0.5" : batch.active ? "font-bold" : ""}`}
                >
                  {row.label === "Deplesi" && batch.active ? (
                    <>
                      {batch.deplesi}{" "}
                      <span
                        className="material-symbols-outlined text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </>
                  ) : row.label === "FCR" && batch.active ? (
                    batch.fcr
                  ) : row.label === "Durasi" && batch.active ? (
                    <span className="font-bold">{batch.durasi}*</span>
                  ) : row.label === "Total Pakan" && batch.active ? (
                    <span className="font-bold">{batch.totalPakan}*</span>
                  ) : (
                    batch[row.keys[bIdx]]
                  )}
                </div>
              ))}
            </div>
          ))}
          <div className="bg-surface-container-low px-3 py-2">
            <p className="italic text-[10px] text-on-surface-variant">
              *Batch aktif, data belum final
            </p>
          </div>
        </section>

        {/* TREND CHART CARD */}
        <section className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant">
          <h3 className="font-label-lg mb-6 text-on-surface">
            Tren FCR Per Batch
          </h3>
          <div className="relative h-40 flex items-end justify-around pb-6 border-b border-outline-variant/20">
            <div className="absolute w-full border-t border-dashed border-outline top-0 z-0">
              <span className="absolute -top-5 right-0 text-[10px] text-outline">
                Target 2.00
              </span>
            </div>
            {batchData.fcrTrend.map((bar) => (
              <div
                key={bar.name}
                className={`flex flex-col items-center gap-2 z-10 w-12 ${bar.active ? "text-primary font-bold" : ""}`}
              >
                <span className="font-label-md">{bar.value}</span>
                <div
                  className={`w-full rounded-t-lg transition-all duration-700 ${bar.active ? "bg-tertiary-fixed-dim" : "bg-surface-container-highest"}`}
                  style={{ height: `${bar.height}%` }}
                />
                <span
                  className={`font-label-md ${bar.active ? "text-primary font-bold" : "text-on-surface-variant"}`}
                >
                  {bar.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* MORTALITY BARS */}
        <section className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant">
          <h3 className="font-label-lg mb-4 text-on-surface">
            Perbandingan Mortalitas
          </h3>
          <div className="space-y-4">
            {batchData.mortality.map((item) => (
              <div key={item.name} className="space-y-1">
                <div
                  className={`flex justify-between font-label-md ${item.active ? "text-primary font-bold" : "text-on-surface-variant"}`}
                >
                  <span>{item.name}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div
                    className={`${item.color} rounded-full h-2 transition-all duration-1000`}
                    style={{ width: `${item.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
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
            {batchData.insights.map((insight, idx) => (
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
