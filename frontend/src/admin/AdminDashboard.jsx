import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import StatCard from "../components/admin/StatCard";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [pressedCard, setPressedCard] = useState(null);

  // ── API state ──────────────────────────────────────────────
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  // ── Fetch dashboard data ───────────────────────────────────
  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal memuat dashboard");
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ── Helper ─────────────────────────────────────────────────
  const formatTanggal = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatWaktu = (iso) => {
    if (!iso) return "-";
    const diff = Math.floor((new Date() - new Date(iso)) / 60000);
    if (diff < 1) return "Baru saja";
    if (diff < 60) return `${diff} menit yang lalu`;
    if (diff < 1440) return `${Math.floor(diff / 60)} jam yang lalu`;
    return `${Math.floor(diff / 1440)} hari yang lalu`;
  };

  const getActivityMeta = (type) => {
    const map = {
      berikan_pakan: {
        icon: "edit",
        bg: "bg-primary-fixed",
        color: "text-on-primary-fixed",
        label: "Input pakan",
      },
      kematian: {
        icon: "warning",
        bg: "bg-error-container",
        color: "text-on-error-container",
        label: "Pencatatan mortalitas",
      },
      pakan_masuk: {
        icon: "inventory_2",
        bg: "bg-primary-fixed",
        color: "text-on-primary-fixed",
        label: "Stok pakan masuk",
      },
      populasi: {
        icon: "pets",
        bg: "bg-secondary-fixed",
        color: "text-on-secondary-fixed",
        label: "Update populasi",
      },
    };
    return (
      map[type] || {
        icon: "notes",
        bg: "bg-surface-container",
        color: "text-on-surface-variant",
        label: type,
      }
    );
  };

  const handleCardPress = (index, floorId) => {
    setPressedCard(index);
    setTimeout(() => {
      setPressedCard(null);
      navigate(`/admin/lantai/${floorId}`);
    }, 100);
  };

  // ── Stok pakan label ───────────────────────────────────────
  const getStokBadge = (stok) => {
    if (stok === 0) return { text: "HABIS", color: "error-container" };
    if (stok < 500) return { text: "LOW", color: "error-container" };
    if (stok < 1000) return { text: "CUKUP", color: "surface-container" };
    return { text: "AMAN", color: "primary-fixed" };
  };

  // ── Loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <AdminLayout title="Admin Dashboard">
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <span className="material-symbols-outlined text-primary text-[40px] animate-spin">
            progress_activity
          </span>
          <p className="font-label-md text-on-surface-variant">
            Memuat dashboard...
          </p>
        </div>
      </AdminLayout>
    );
  }

  // ── Error ──────────────────────────────────────────────────
  if (error) {
    return (
      <AdminLayout title="Admin Dashboard">
        <div className="bg-error-container text-on-error-container rounded-xl p-4 flex gap-3 items-center">
          <span className="material-symbols-outlined">error</span>
          <p className="font-label-md flex-1">{error}</p>
          <button onClick={fetchDashboard} className="font-label-md underline">
            Coba lagi
          </button>
        </div>
      </AdminLayout>
    );
  }

  const stokBadge = getStokBadge(data?.stokPakan || 0);

  return (
    <AdminLayout title="Admin Dashboard">
      {/* ============================== */}
      {/* FARM OVERVIEW                  */}
      {/* ============================== */}
      <section className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-headline-sm text-headline-sm">
              Selamat Datang, Admin
            </h2>
            <p className="font-body-md text-on-surface-variant text-[14px]">
              {formatTanggal(new Date().toISOString())}
            </p>
          </div>
          {data?.activeBatch ? (
            <div className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-md font-label-md">
              Batch #{data.activeBatch.nomorBatch} • Aktif
            </div>
          ) : (
            <div className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-label-md font-label-md">
              Tidak ada batch aktif
            </div>
          )}
        </div>
      </section>

      {/* ============================== */}
      {/* KPI GRID (2x2)                 */}
      {/* ============================== */}
      <section className="grid grid-cols-2 gap-4">
        <StatCard
          icon="pets"
          label="Total Ayam"
          value={data?.totalAyam?.toLocaleString("id-ID") || "0"}
          color="primary"
          fillIcon
        />
        <StatCard
          icon="favorite_border"
          label="Kematian Hari Ini"
          value={data?.kematianHariIni?.toLocaleString("id-ID") || "0"}
          color="error"
        />
        <StatCard
          icon="warehouse"
          label="Stok Pakan"
          value={`${data?.stokPakan?.toLocaleString("id-ID") || "0"} kg`}
          color="secondary"
          fillIcon
          badge={stokBadge}
        />
        <StatCard
          icon="trending_up"
          label="FCR"
          value={data?.fcr || "-"}
          color="primary"
          badge={
            data?.fcr
              ? {
                  text:
                    parseFloat(data.fcr) <= 1.8
                      ? "BAIK"
                      : parseFloat(data.fcr) <= 2.0
                        ? "CUKUP"
                        : "BURUK",
                  color: "primary-fixed",
                }
              : { text: "BELUM", color: "surface-container" }
          }
        />
      </section>

      {/* ============================== */}
      {/* FLOOR STATUS                   */}
      {/* ============================== */}
      <section className="space-y-3">
        <h3 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">
          Status Lantai
        </h3>
        <div className="space-y-3">
          {data?.floors?.length > 0 ? (
            data.floors.map((floor, index) => (
              <div
                key={floor.id}
                onClick={() => handleCardPress(index, floor.id)}
                className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between active:bg-surface-container-low transition-all cursor-pointer ${
                  pressedCard === index ? "scale-[0.98]" : "scale-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
                    L{floor.id}
                  </div>
                  <div>
                    <p className="font-label-lg text-on-surface">
                      {floor.nama}
                    </p>
                    <p className="text-label-md text-on-surface-variant">
                      Pakan: {floor.pakanHariIni} kg | Mati: {floor.totalMati}
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline">
                  chevron_right
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-on-surface-variant font-label-md">
              Tidak ada data lantai.
            </div>
          )}
        </div>
      </section>

      {/* ============================== */}
      {/* RECENT ACTIVITY                */}
      {/* ============================== */}
      <section className="space-y-3">
        <h3 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">
          Aktivitas Terkini
        </h3>
        {data?.activities?.length > 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
            <div className="divide-y divide-outline-variant">
              {data.activities.slice(0, 5).map((act) => {
                const meta = getActivityMeta(act.type);
                const workerName =
                  act.user?.name || act.user?.username || act.recordedBy;
                const floorLabel = act.floor?.nama
                  ? ` • ${act.floor.nama}`
                  : "";
                return (
                  <div key={act.id} className="p-4 flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full ${meta.bg} flex items-center justify-center ${meta.color} shrink-0`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {meta.icon}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-label-md text-on-surface">
                        {meta.label}
                        {floorLabel} oleh <strong>{workerName}</strong>
                      </p>
                      <p className="text-[10px] text-outline mt-1">
                        {formatWaktu(act.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 text-center text-on-surface-variant font-label-md">
            Belum ada aktivitas hari ini.
          </div>
        )}
      </section>

      {/* ============================== */}
      {/* QUICK ACTION                   */}
      {/* ============================== */}
      <section className="pb-4">
        <button
          onClick={() => navigate("/admin/laporan")}
          className="w-full h-12 border border-outline text-primary font-label-lg rounded-lg flex items-center justify-center gap-2 active:bg-primary/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            file_download
          </span>
          Export Laporan
        </button>
      </section>
    </AdminLayout>
  );
}
