import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";

export default function RiwayatAktivitasUser() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("semua");

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  // ── Fetch user + aktivitas ─────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [userRes, actRes] = await Promise.all([
        fetch(`${API}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/api/admin/users/${userId}/activities`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const usersData = await userRes.json();
      const actData = await actRes.json();

      // Cari user berdasarkan userId dari URL
      const found = Array.isArray(usersData)
        ? usersData.find((u) => u.id === parseInt(userId))
        : null;

      setUser(found || null);
      setActivities(Array.isArray(actData) ? actData : []);
    } catch (err) {
      setError("Gagal memuat data aktivitas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  // ── Helper: map type ke label & icon ──────────────────────
  const getActivityMeta = (type) => {
    const map = {
      berikan_pakan: {
        icon: "grass",
        iconBg: "bg-primary-container",
        iconColor: "text-primary",
        label: "Input Pakan",
        filterKey: "pakan",
      },
      kematian: {
        icon: "error",
        iconBg: "bg-error-container",
        iconColor: "text-error",
        label: "Laporan Kematian",
        filterKey: "kematian",
      },
      pakan_masuk: {
        icon: "inventory_2",
        iconBg: "bg-secondary-container",
        iconColor: "text-on-secondary-container",
        label: "Stok Masuk",
        filterKey: "stok",
      },
      populasi: {
        icon: "pets",
        iconBg: "bg-primary-container",
        iconColor: "text-primary",
        label: "Update Populasi",
        filterKey: "populasi",
      },
      suhu: {
        icon: "thermostat",
        iconBg: "bg-tertiary-container",
        iconColor: "text-on-tertiary",
        label: "Catat Suhu",
        filterKey: "suhu",
      },
    };
    return (
      map[type] || {
        icon: "notes",
        iconBg: "bg-surface-container",
        iconColor: "text-on-surface-variant",
        label: type,
        filterKey: "lain",
      }
    );
  };

  // ── Helper: format detail aktivitas ───────────────────────
  const getActivityDetail = (record) => {
    const floorLabel =
      record.floor?.nama || record.floorId ? `Lantai ${record.floorId}` : "";
    if (record.type === "berikan_pakan")
      return `${floorLabel} — ${record.jumlah ?? "-"} kg`;
    if (record.type === "kematian")
      return `${floorLabel} — ${record.jumlah ?? "-"} ekor`;
    if (record.type === "pakan_masuk")
      return `${record.jenis || "Pakan"} — ${record.jumlah ?? "-"} kg`;
    if (record.type === "populasi")
      return `${floorLabel} — ${record.jumlah ?? "-"} ekor`;
    return record.keterangan || "-";
  };

  // ── Helper: format waktu ───────────────────────────────────
  const formatWaktu = (iso) => {
    const date = new Date(iso);
    return (
      date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) +
      " WIB"
    );
  };

  const formatTanggal = (iso) => {
    const date = new Date(iso);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Hari ini";
    if (date.toDateString() === yesterday.toDateString()) return "Kemarin";

    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return `${diffDays} hari lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ── Filter aktivitas ───────────────────────────────────────
  const filteredActivities =
    filter === "semua"
      ? activities
      : activities.filter((a) => getActivityMeta(a.type).filterKey === filter);

  // ── Group by tanggal ───────────────────────────────────────
  const grouped = filteredActivities.reduce((acc, act) => {
    const label = formatTanggal(act.createdAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(act);
    return acc;
  }, {});

  const filters = [
    { key: "semua", label: "Semua" },
    { key: "pakan", label: "Pakan" },
    { key: "kematian", label: "Kematian" },
    { key: "stok", label: "Stok" },
    { key: "populasi", label: "Populasi" },
  ];

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
      <AdminLayout title="Riwayat Aktivitas" showBack>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <span className="material-symbols-outlined text-primary text-[40px] animate-spin">
            progress_activity
          </span>
          <p className="font-label-md text-on-surface-variant">
            Memuat riwayat aktivitas...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Riwayat Aktivitas" showBack>
      <div className="space-y-6 pb-6">
        {/* Error banner */}
        {error && (
          <div className="bg-error-container text-on-error-container rounded-xl p-4 flex gap-3 items-center">
            <span className="material-symbols-outlined">error</span>
            <p className="font-label-md flex-1">{error}</p>
            <button onClick={fetchData} className="font-label-md underline">
              Coba lagi
            </button>
          </div>
        )}

        {/* ============================== */}
        {/* USER CARD                      */}
        {/* ============================== */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center gap-4">
          {user ? (
            <>
              <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xl font-bold">
                {getInitials(user.name, user.username)}
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm">
                  {user.name || user.username}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  @{user.username}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                      user.role === "admin"
                        ? "bg-primary-container text-on-primary-container"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {user.role}
                  </span>
                  {user.floor && (
                    <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-lg text-[10px] font-bold">
                      {user.floor.nama}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="font-label-md text-on-surface-variant">
              User tidak ditemukan.
            </p>
          )}
        </section>

        {/* ============================== */}
        {/* FILTER CHIPS                   */}
        {/* ============================== */}
        <section className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 h-9 rounded-full font-label-md whitespace-nowrap transition-all active:scale-95 ${
                filter === f.key
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant border border-outline-variant hover:bg-surface-container"
              }`}
            >
              {f.label}
            </button>
          ))}
        </section>

        {/* ============================== */}
        {/* ACTIVITY LIST                  */}
        {/* ============================== */}
        <section className="space-y-6">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <span className="material-symbols-outlined text-[48px] text-outline">
                inbox
              </span>
              <p className="font-label-md text-on-surface-variant">
                Belum ada aktivitas.
              </p>
            </div>
          ) : (
            Object.entries(grouped).map(([date, acts]) => (
              <div key={date} className="space-y-3">
                <h3 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider sticky top-0 bg-surface py-2">
                  {date}
                </h3>
                <div className="space-y-3">
                  {acts.map((act) => {
                    const meta = getActivityMeta(act.type);
                    return (
                      <div
                        key={act.id}
                        className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-start gap-3"
                      >
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
                          <p className="font-body-md text-body-md text-on-surface leading-tight font-bold">
                            {meta.label}
                          </p>
                          <p className="font-label-md text-label-md text-on-surface-variant mt-0.5">
                            {getActivityDetail(act)}
                          </p>
                          <p className="font-label-md text-label-md text-outline mt-1">
                            {formatWaktu(act.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>

        {/* ============================== */}
        {/* TOTAL COUNT                    */}
        {/* ============================== */}
        {filteredActivities.length > 0 && (
          <section className="text-center py-4">
            <p className="font-label-md text-on-surface-variant">
              Menampilkan{" "}
              <span className="text-primary font-bold">
                {filteredActivities.length}
              </span>{" "}
              dari {activities.length} aktivitas
            </p>
          </section>
        )}
      </div>
    </AdminLayout>
  );
}
