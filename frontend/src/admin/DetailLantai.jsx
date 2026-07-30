import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";

export default function DetailLantai() {
  const { id } = useParams();
  const floorId = parseInt(id) || 1;

  // ── API state ──────────────────────────────────────────────
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animateBars, setAnimateBars] = useState(false);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  // ── Fetch data lantai ──────────────────────────────────────
  const fetchFloor = async () => {
    setLoading(true);
    setError(null);
    setAnimateBars(false);
    try {
      const res = await fetch(`${API}/api/admin/dashboard/floors/${floorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal memuat data lantai");
      setData(json);
      setTimeout(() => setAnimateBars(true), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFloor();
  }, [floorId]);

  // ── Helper ─────────────────────────────────────────────────
  const getActivityMeta = (type) => {
    const map = {
      berikan_pakan: {
        icon: "grass",
        iconBg: "bg-primary-container",
        iconColor: "text-primary",
        label: "Input Pakan",
      },
      kematian: {
        icon: "error",
        iconBg: "bg-error-container",
        iconColor: "text-error",
        label: "Laporan Kematian",
      },
      pakan_masuk: {
        icon: "inventory_2",
        iconBg: "bg-secondary-container",
        iconColor: "text-on-secondary-container",
        label: "Stok Masuk",
      },
      populasi: {
        icon: "pets",
        iconBg: "bg-primary-container",
        iconColor: "text-primary",
        label: "Update Populasi",
      },
    };
    return (
      map[type] || {
        icon: "notes",
        iconBg: "bg-surface-container",
        iconColor: "text-on-surface-variant",
        label: type,
      }
    );
  };

  const getActivityDetail = (act) => {
    if (act.type === "berikan_pakan") return `${act.jumlah ?? "-"} kg`;
    if (act.type === "kematian") return `${act.jumlah ?? "-"} ekor`;
    if (act.type === "pakan_masuk")
      return `${act.jenis || "Pakan"} — ${act.jumlah ?? "-"} kg`;
    return act.keterangan || "-";
  };

  const formatWaktu = (iso) => {
    if (!iso) return "-";
    return (
      new Date(iso).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    );
  };

  const getInitials = (name, username) => {
    if (name)
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return username?.slice(0, 2).toUpperCase() || "??";
  };

  // ── Loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <AdminLayout title="Detail Lantai" showBack>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <span className="material-symbols-outlined text-primary text-[40px] animate-spin">
            progress_activity
          </span>
          <p className="font-label-md text-on-surface-variant">
            Memuat data lantai...
          </p>
        </div>
      </AdminLayout>
    );
  }

  // ── Error ──────────────────────────────────────────────────
  if (error || !data) {
    return (
      <AdminLayout title="Detail Lantai" showBack>
        <div className="bg-error-container text-on-error-container rounded-xl p-4 flex gap-3 items-center">
          <span className="material-symbols-outlined">error</span>
          <p className="font-label-md flex-1">
            {error || "Data tidak ditemukan"}
          </p>
          <button onClick={fetchFloor} className="font-label-md underline">
            Coba lagi
          </button>
        </div>
      </AdminLayout>
    );
  }

  const {
    floor,
    ekorHidup,
    totalMati,
    pakanHariIni,
    pakan7Hari,
    aktivitasHariIni,
  } = data;

  // Hitung max value untuk skala bar chart
  const maxPakan = Math.max(...pakan7Hari.map((p) => p.value), 1);
  const avgPakan = Math.round(
    pakan7Hari.reduce((sum, p) => sum + p.value, 0) / pakan7Hari.length,
  );

  const titlePage = `${floor.nama} — ${floor.kandang || "Kandang"}`;

  return (
    <AdminLayout title={titlePage} showBack>
      <main className="animate-in fade-in duration-500 space-y-3">
        {/* ============================== */}
        {/* QUICK STATS ROW                */}
        {/* ============================== */}
        <section className="grid grid-cols-3 gap-3">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-3 flex flex-col items-center shadow-sm">
            <span className="material-symbols-outlined text-on-primary-container mb-1">
              pets
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface">
              {ekorHidup.toLocaleString("id-ID")}
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
              {totalMati}
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
              {pakanHariIni} kg
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant text-center whitespace-nowrap">
              Pakan Hari Ini
            </span>
          </div>
        </section>

        {/* ============================== */}
        {/* PAKAN HARIAN CHART             */}
        {/* ============================== */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight">
                Konsumsi Pakan 7 Hari
              </h3>
              <p className="font-label-md text-label-md text-on-surface-variant">
                {floor.nama} saja
              </p>
            </div>
          </div>

          {maxPakan > 0 ? (
            <div className="relative h-32 mt-4 flex flex-col justify-end">
              {avgPakan > 0 && (
                <div className="absolute w-full top-8 border-t border-dashed border-outline text-right">
                  <span className="bg-surface-container-lowest px-1 text-[10px] text-outline font-bold absolute -top-2 right-0">
                    Avg: {avgPakan} kg
                  </span>
                </div>
              )}
              <div className="flex items-end gap-2 h-28">
                {pakan7Hari.map((item, idx) => {
                  const heightPct =
                    maxPakan > 0
                      ? Math.round((item.value / maxPakan) * 100)
                      : 0;
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div
                        className={`w-full rounded-t-md transition-all duration-700 ${
                          item.today ? "bg-primary" : "bg-primary-container"
                        }`}
                        style={{
                          height: animateBars ? `${heightPct}%` : "0%",
                          minHeight: item.value > 0 ? "4px" : "0",
                        }}
                      />
                      <span
                        className={`font-label-md text-label-md ${item.today ? "text-primary font-bold" : "text-on-surface-variant"}`}
                      >
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center">
              <p className="font-label-md text-on-surface-variant">
                Belum ada data pakan 7 hari terakhir.
              </p>
            </div>
          )}
        </section>

        {/* ============================== */}
        {/* AKTIVITAS HARI INI             */}
        {/* ============================== */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Aktivitas Hari Ini
            </h3>
            <div className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full text-label-md font-bold">
              {aktivitasHariIni.length}
            </div>
          </div>

          {aktivitasHariIni.length > 0 ? (
            <div className="space-y-4">
              {aktivitasHariIni.map((act) => {
                const meta = getActivityMeta(act.type);
                const workerName =
                  act.user?.name || act.user?.username || act.recordedBy;
                return (
                  <div key={act.id} className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${meta.iconBg} flex items-center justify-center shrink-0`}
                    >
                      <span
                        className={`material-symbols-outlined ${meta.iconColor}`}
                      >
                        {meta.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body-md text-body-md text-on-surface leading-tight">
                        {meta.label} oleh{" "}
                        <span className="font-bold">{workerName}</span>
                      </p>
                      <p className="font-label-md text-label-md text-on-surface-variant mt-0.5">
                        {getActivityDetail(act)}
                      </p>
                      <p className="font-label-md text-label-md text-outline mt-0.5">
                        {formatWaktu(act.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center text-on-surface-variant font-label-md">
              Belum ada aktivitas hari ini.
            </div>
          )}
        </section>

        {/* ============================== */}
        {/* WORKER ASSIGNMENTS             */}
        {/* ============================== */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm mb-6">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
            Worker Lantai Ini
          </h3>

          {floor.workers?.length > 0 ? (
            <div className="space-y-4">
              {floor.workers.map((worker) => (
                <div key={worker.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-headline-sm">
                    {getInitials(worker.name, worker.username)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-body-md text-body-md font-bold text-on-surface">
                      {worker.name || worker.username}{" "}
                      <span className="font-normal text-on-surface-variant">
                        (@{worker.username})
                      </span>
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-outline-variant" />
                      <span className="font-label-md text-label-md text-on-surface-variant">
                        Worker
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-on-surface-variant font-label-md">
              Belum ada worker ditugaskan di lantai ini.
            </div>
          )}
        </section>
      </main>
    </AdminLayout>
  );
}
