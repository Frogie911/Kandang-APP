import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";

export default function DetailLantai() {
  const { id } = useParams(); // ← ambil id dari URL: /admin/lantai/:id
  const floorId = parseInt(id) || 1;

  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateBars(true), 100);
    return () => clearTimeout(timer);
  }, [floorId]); // ← re-trigger animasi saat ganti lantai

  // Data mock untuk 3 lantai — nanti ganti dengan API call
  const floorsData = {
    1: {
      name: "Lantai 1 — Kandang A",
      ekorHidup: 4940,
      totalMati: 42,
      pakanHariIni: 450,
      fcr: 1.79,
      fcrStatus: "TERBAIK",
      fcrRank: "Di antara 3 lantai",
      fcrComparison: [
        { name: "Lantai 1", value: 1.79, active: true },
        { name: "Lantai 2", value: 1.84, active: false },
        { name: "Lantai 3", value: 1.86, active: false },
      ],
      pakan7Hari: [
        { day: "S", value: 60, label: "Sen" },
        { day: "S", value: 65, label: "Sel" },
        { day: "R", value: 55, label: "Rab" },
        { day: "K", value: 70, label: "Kam" },
        { day: "J", value: 62, label: "Jum" },
        { day: "S", value: 80, label: "Sab" },
        { day: "M", value: 95, label: "Min", today: true },
      ],
      avgPakan: 64,
      activities: [
        {
          id: 1,
          icon: "grass",
          iconBg: "bg-primary-container",
          iconColor: "text-primary",
          title: "Input Pakan oleh",
          boldName: "Pak Surya",
          time: "08:30 WIB",
        },
        {
          id: 2,
          icon: "error",
          iconBg: "bg-error-container",
          iconColor: "text-error",
          title: "Laporan Kematian oleh",
          boldName: "Pak Surya",
          time: "09:15 WIB",
        },
        {
          id: 3,
          icon: "inventory_2",
          iconBg: "bg-secondary-container",
          iconColor: "text-on-secondary-container",
          title: "Stok Masuk oleh",
          boldName: "Budi",
          time: "10:00 WIB",
        },
      ],
      workers: [
        {
          initials: "PS",
          name: "Pak Surya",
          username: "@surya",
          online: true,
          bg: "bg-secondary-container",
          text: "text-on-secondary-container",
        },
        {
          initials: "BM",
          name: "Budi Mandiri",
          username: "@budi_m",
          online: false,
          bg: "bg-surface-container-highest",
          text: "text-on-surface",
        },
      ],
    },
    2: {
      name: "Lantai 2 — Kandang B",
      ekorHidup: 4960,
      totalMati: 38,
      pakanHariIni: 350,
      fcr: 1.84,
      fcrStatus: "BAIK",
      fcrRank: "Di antara 3 lantai",
      fcrComparison: [
        { name: "Lantai 1", value: 1.79, active: false },
        { name: "Lantai 2", value: 1.84, active: true },
        { name: "Lantai 3", value: 1.86, active: false },
      ],
      pakan7Hari: [
        { day: "S", value: 55, label: "Sen" },
        { day: "S", value: 58, label: "Sel" },
        { day: "R", value: 60, label: "Rab" },
        { day: "K", value: 52, label: "Kam" },
        { day: "J", value: 65, label: "Jum" },
        { day: "S", value: 70, label: "Sab" },
        { day: "M", value: 75, label: "Min", today: true },
      ],
      avgPakan: 62,
      activities: [
        {
          id: 1,
          icon: "grass",
          iconBg: "bg-primary-container",
          iconColor: "text-primary",
          title: "Input Pakan oleh",
          boldName: "Budi",
          time: "07:15 WIB",
        },
        {
          id: 2,
          icon: "medical_services",
          iconBg: "bg-secondary-container",
          iconColor: "text-on-secondary-container",
          title: "Pemberian Vitamin oleh",
          boldName: "Siti",
          time: "08:00 WIB",
        },
        {
          id: 3,
          icon: "warning",
          iconBg: "bg-error-container",
          iconColor: "text-error",
          title: "Laporan Kematian oleh",
          boldName: "Budi",
          time: "10:30 WIB",
        },
      ],
      workers: [
        {
          initials: "BK",
          name: "Budi Kusuma",
          username: "@budi_k",
          online: true,
          bg: "bg-tertiary-container",
          text: "text-on-tertiary",
        },
        {
          initials: "SF",
          name: "Siti Farida",
          username: "@siti_f",
          online: true,
          bg: "bg-primary-container",
          text: "text-on-primary-container",
        },
      ],
    },
    3: {
      name: "Lantai 3 — Kandang C",
      ekorHidup: 4923,
      totalMati: 47,
      pakanHariIni: 100,
      fcr: 1.86,
      fcrStatus: "CUKUP",
      fcrRank: "Di antara 3 lantai",
      fcrComparison: [
        { name: "Lantai 1", value: 1.79, active: false },
        { name: "Lantai 2", value: 1.84, active: false },
        { name: "Lantai 3", value: 1.86, active: true },
      ],
      pakan7Hari: [
        { day: "S", value: 45, label: "Sen" },
        { day: "S", value: 50, label: "Sel" },
        { day: "R", value: 48, label: "Rab" },
        { day: "K", value: 55, label: "Kam" },
        { day: "J", value: 42, label: "Jum" },
        { day: "S", value: 60, label: "Sab" },
        { day: "M", value: 65, label: "Min", today: true },
      ],
      avgPakan: 52,
      activities: [
        {
          id: 1,
          icon: "person_check",
          iconBg: "bg-secondary-container",
          iconColor: "text-on-secondary-container",
          title: "Cek Kebersihan oleh",
          boldName: "Yanto",
          time: "06:00 WIB",
        },
        {
          id: 2,
          icon: "grass",
          iconBg: "bg-primary-container",
          iconColor: "text-primary",
          title: "Input Pakan oleh",
          boldName: "Yanto",
          time: "07:00 WIB",
        },
        {
          id: 3,
          icon: "inventory_2",
          iconBg: "bg-secondary-container",
          iconColor: "text-on-secondary-container",
          title: "Stok Pakan Masuk oleh",
          boldName: "Admin",
          time: "09:00 WIB",
        },
      ],
      workers: [
        {
          initials: "YA",
          name: "Yanto Agus",
          username: "@yanto_a",
          online: false,
          bg: "bg-surface-container-highest",
          text: "text-on-surface",
        },
        {
          initials: "AD",
          name: "Admin",
          username: "@admin",
          online: true,
          bg: "bg-primary-container",
          text: "text-on-primary-container",
        },
      ],
    },
  };

  // Ambil data sesuai floorId, fallback ke lantai 1 kalau tidak ada
  const floorData = floorsData[floorId] || floorsData[1];

  const fcrGaugePercent = ((floorData.fcr - 1.5) / (2.5 - 1.5)) * 100;

  return (
    <AdminLayout title={floorData.name} showBack>
      <main className="animate-in fade-in duration-500 space-y-3">
        {/* QUICK STATS ROW */}
        <section className="grid grid-cols-3 gap-3">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-3 flex flex-col items-center shadow-sm">
            <span className="material-symbols-outlined text-on-primary-container mb-1">
              pets
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface">
              {floorData.ekorHidup.toLocaleString("id-ID")}
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant text-center">
              Ekor Hidup
            </span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-3 flex flex-col items-center shadow-sm">
            <span className="material-symbols-outlined text-error mb-1">
              favorite_border
            </span>
            <span className="font-headline-sm text-headline-sm text-error">
              {floorData.totalMati}
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant text-center">
              Total Mati
            </span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-3 flex flex-col items-center shadow-sm">
            <span className="material-symbols-outlined text-primary mb-1">
              grass
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface">
              {floorData.pakanHariIni} kg
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant text-center whitespace-nowrap">
              Pakan Hari Ini
            </span>
          </div>
        </section>

        {/* FCR GAUGE CARD */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface-variant">
              FCR LANTAI INI
            </h2>
            <div className="bg-primary-container text-on-primary-container rounded-full px-3 py-0.5 text-label-md flex items-center">
              <span className="font-semibold uppercase text-[10px]">
                {floorData.fcrStatus}
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between mb-4">
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-primary leading-none">
                {floorData.fcr}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant mt-1">
                Laju Konversi Pakan
              </span>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant">
              {floorData.fcrRank}
            </span>
          </div>
          <div className="relative pt-1">
            <div className="flex items-center justify-between text-label-md text-on-surface-variant mb-1">
              <span>Excellent 1.5</span>
              <span>Buruk 2.5</span>
            </div>
            <div className="w-full h-3 bg-surface-container-high rounded-full relative">
              <div
                className="h-full bg-primary-container rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(fcrGaugePercent, 100)}%` }}
              />
              <div
                className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow absolute top-1/2 -translate-y-1/2 transition-all duration-1000"
                style={{ left: `${Math.min(fcrGaugePercent, 100)}%` }}
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant grid grid-cols-3 gap-1">
            {floorData.fcrComparison.map((item) => (
              <div key={item.name} className="flex flex-col items-center">
                <span
                  className={`font-label-md text-label-md ${item.active ? "text-primary font-bold" : "text-on-surface-variant opacity-60"}`}
                >
                  {item.name}
                </span>
                <span
                  className={`font-label-md text-label-md ${item.active ? "text-primary font-bold" : "text-on-surface-variant"}`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* PAKAN HARIAN CHART */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight">
                Konsumsi Pakan 7 Hari
              </h3>
              <p className="font-label-md text-label-md text-on-surface-variant">
                {floorData.name.split(" — ")[0]} saja
              </p>
            </div>
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">
                filter_list
              </span>
            </button>
          </div>
          <div className="relative h-32 mt-4 flex flex-col justify-end">
            <div className="absolute w-full top-8 border-t border-dashed border-outline text-right">
              <span className="bg-surface-container-lowest px-1 text-[10px] text-outline font-bold absolute -top-2 right-0">
                Avg: {floorData.avgPakan} kg
              </span>
            </div>
            <div className="flex items-end gap-2 h-28">
              {floorData.pakan7Hari.map((item, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-full rounded-t-md transition-all duration-700 ${item.today ? "bg-primary" : "bg-primary-container"}`}
                    style={{ height: animateBars ? `${item.value}%` : "0%" }}
                  />
                  <span
                    className={`font-label-md text-label-md ${item.today ? "text-primary font-bold" : "text-on-surface-variant"}`}
                  >
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RIWAYAT HARI INI */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Aktivitas Hari Ini
            </h3>
            <div className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full text-label-md font-bold">
              {floorData.activities.length}
            </div>
          </div>
          <div className="space-y-4">
            {floorData.activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${act.iconBg} flex items-center justify-center shrink-0`}
                >
                  <span
                    className={`material-symbols-outlined ${act.iconColor}`}
                  >
                    {act.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body-md text-body-md text-on-surface leading-tight">
                    {act.title}{" "}
                    <span className="font-bold">{act.boldName}</span>
                  </p>
                  <p className="font-label-md text-label-md text-on-surface-variant mt-0.5">
                    {act.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-primary font-label-lg text-label-lg flex items-center justify-center gap-1 active:opacity-60 transition-opacity">
            Lihat Semua Riwayat
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
        </section>

        {/* WORKER ASSIGNMENTS */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm mb-6">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
            Worker Lantai Ini
          </h3>
          <div className="space-y-4">
            {floorData.workers.map((worker) => (
              <div key={worker.initials} className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full ${worker.bg} flex items-center justify-center ${worker.text} font-bold text-headline-sm`}
                >
                  {worker.initials}
                </div>
                <div className="flex-1">
                  <h4 className="font-body-md text-body-md font-bold text-on-surface">
                    {worker.name} ({worker.username})
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div
                      className={`w-2 h-2 rounded-full ${worker.online ? "bg-green-500" : "bg-outline-variant"}`}
                    />
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      {worker.online ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </AdminLayout>
  );
}
