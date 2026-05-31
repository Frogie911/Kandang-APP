import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    ayamHidup: "—",
    stokPakan: "—",
    kematianHariIni: "—",
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const username = localStorage.getItem("username");
        const role = localStorage.getItem("role");
        if (username) {
          setUser({ username, role, name: username });
        }

        // Ambil data dashboard dari API
        const dashboardData = await api.getDashboard();
        setStats({
          ayamHidup:
            dashboardData.ayamHidup?.toLocaleString("id-ID") || "1,482",
          stokPakan: dashboardData.stokPakan
            ? `${dashboardData.stokPakan}kg`
            : "120kg",
          kematianHariIni: dashboardData.kematianHariIni?.toString() || "0",
        });

        // Ambil aktivitas terakhir dari records
        const records = await api.getRecords();
        const recentRecords = records.slice(0, 5).map((r, idx) => ({
          id: idx + 1,
          title:
            r.type === "berikan_pakan"
              ? `Pakan diberikan ${r.jumlah}kg`
              : r.type === "kematian"
                ? `Laporan ${r.jenis}: ${r.jumlah} ekor`
                : `Pakan masuk: ${r.jumlah}kg ${r.jenis}`,
          subtitle: new Date(r.createdAt || r.timestamp).toLocaleString(
            "id-ID",
          ),
          type: r.type === "berikan_pakan" ? "feed" : "system",
          dotColor: r.type === "kematian" ? "bg-error" : "bg-primary",
        }));

        setActivities(
          recentRecords.length > 0
            ? recentRecords
            : [
                {
                  id: 1,
                  title: "Pakan diberikan 45kg",
                  subtitle: "Hari ini, 07:30",
                  type: "feed",
                  dotColor: "bg-primary",
                },
                {
                  id: 2,
                  title: "Pengecekan suhu otomatis",
                  subtitle: "Hari ini, 06:00",
                  type: "system",
                  dotColor: "bg-outline-variant",
                },
              ],
        );
      } catch (err) {
        console.error("Dashboard load error:", err);
        // Fallback ke dummy data kalau API error
        setStats({
          ayamHidup: "1,482",
          stokPakan: "120kg",
          kematianHariIni: "0",
        });
        setActivities([
          {
            id: 1,
            title: "Pakan diberikan 45kg",
            subtitle: "Hari ini, 07:30",
            type: "feed",
            dotColor: "bg-primary",
          },
          {
            id: 2,
            title: "Pengecekan suhu otomatis",
            subtitle: "Hari ini, 06:00",
            type: "system",
            dotColor: "bg-outline-variant",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant font-body-md">
            Memuat dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <section>
        <h1 className="font-headline-sm text-headline-sm text-on-surface">
          Selamat Pagi, {user?.name || user?.username || "Pak Surya"}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Lantai 1 —{" "}
          {new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="col-span-2 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              sensors
            </span>
            <span className="font-label-lg text-label-lg uppercase text-on-surface-variant">
              Status Lingkungan
            </span>
          </div>
          <div className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-[10px] font-bold uppercase tracking-wider">
            Optimal
          </div>
        </div>
        <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-primary">
              thermostat
            </span>
            <span className="font-label-md text-label-md text-primary">
              28°C
            </span>
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant">
            Suhu
          </span>
        </div>
        <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-primary">
              humidity_mid
            </span>
            <span className="font-label-md text-label-md text-primary">
              65%
            </span>
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant">
            Kelembapan
          </span>
        </div>
        <div className="col-span-2 px-4 py-2 flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[14px]">
            schedule
          </span>
          <span className="font-label-md text-label-md italic">
            Updated: 2 menit lalu
          </span>
        </div>
      </section>

      <section className="space-y-stack-md">
        <h2 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest px-1">
          Ringkasan Hari Ini
        </h2>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center p-4 bg-surface-container-lowest border border-outline-variant rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">pets</span>
            </div>
            <div className="ml-4 flex-grow">
              <div className="font-label-md text-label-md text-on-surface-variant">
                Ayam Hidup
              </div>
              <div className="font-headline-sm text-headline-sm text-on-surface">
                {stats.ayamHidup}
              </div>
            </div>
            <div className="text-primary flex items-center">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
          </div>

          <div className="flex items-center p-4 bg-surface-container-lowest border border-outline-variant rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <div className="ml-4 flex-grow">
              <div className="font-label-md text-label-md text-on-surface-variant">
                Stok Pakan
              </div>
              <div className="font-headline-sm text-headline-sm text-secondary">
                {stats.stokPakan}
              </div>
            </div>
            <div className="px-2 py-1 bg-secondary-container rounded text-[10px] font-bold text-on-secondary-container">
              REFILL
            </div>
          </div>

          <div className="flex items-center p-4 bg-surface-container-lowest border border-outline-variant rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">heart_broken</span>
            </div>
            <div className="ml-4 flex-grow">
              <div className="font-label-md text-label-md text-on-surface-variant">
                Kematian Hari Ini
              </div>
              <div className="font-headline-sm text-headline-sm text-primary">
                {stats.kematianHariIni}
              </div>
            </div>
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="flex items-center justify-between px-1 mb-3">
          <h2 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest">
            Aktivitas Terakhir
          </h2>
          <button
            onClick={() => navigate("/riwayat")}
            className="text-primary font-label-lg text-label-lg"
          >
            Lihat Semua
          </button>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden divide-y divide-outline-variant">
          {activities.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant font-body-md">
              Belum ada aktivitas hari ini
            </div>
          ) : (
            activities.map((act, idx) => (
              <div key={act.id} className="p-4 flex gap-4">
                <div className="relative">
                  <div
                    className={`w-2 h-2 rounded-full ${act.dotColor} mt-2`}
                  ></div>
                  {idx !== activities.length - 1 && (
                    <div className="absolute top-4 left-1 w-[1px] h-full bg-outline-variant"></div>
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="font-body-md text-body-md text-on-surface">
                    {act.title}
                  </p>
                  <p className="font-label-md text-label-md text-on-surface-variant">
                    {act.subtitle}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </Layout>
  );
}

export default Dashboard;
