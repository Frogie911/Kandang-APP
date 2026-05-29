import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Profil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ today: 0, week: 0, total: 0 });
  const [darkMode, setDarkMode] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);

  useEffect(() => {
    // Ambil data user dari localStorage
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    setUser({ username, role, name: username });

    // Hitung statistik dari records
    const records = JSON.parse(
      localStorage.getItem("sipoultry_records") || "[]",
    );
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const todayCount = records.filter((r) =>
      r.timestamp?.startsWith(today),
    ).length;
    const weekCount = records.filter(
      (r) => new Date(r.timestamp) >= weekAgo,
    ).length;

    setStats({ today: todayCount, week: weekCount, total: records.length });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const menuItems = [
    { icon: "edit", label: "Edit Profil", action: () => {} },
    { icon: "lock", label: "Ubah Password", action: () => {} },
    { icon: "help", label: "Bantuan & FAQ", action: () => {} },
    { icon: "info", label: "Tentang Aplikasi", action: () => {} },
  ];

  if (!user) return null;

  return (
    <Layout hideFab={true}>
      {/* Header Profil */}
      <section className="flex flex-col items-center pt-4 pb-6">
        <div className="w-24 h-24 rounded-full bg-primary-container border-4 border-primary-fixed overflow-hidden mb-4">
          <img
            src={`https://ui-avatars.com/api/?name=${user.name}&background=00685f&color=fff&size=128`}
            alt="Profil"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="font-headline-md text-headline-md text-on-surface font-bold">
          {user.name}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          @{user.username}
        </p>
        <div className="mt-2 px-4 py-1 bg-primary-container text-on-primary-container rounded-full font-label-md text-label-md font-bold">
          {user.role === "admin" ? "Administrator" : "Pekerja Kandang"}
        </div>
      </section>

      {/* Info Kandang */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 space-y-3">
        <h2 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest">
          Area Tugas
        </h2>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">
              location_on
            </span>
          </div>
          <div>
            <p className="font-body-md text-body-md text-on-surface font-bold">
              Lantai 1 • Kandang A
            </p>
            <p className="font-label-md text-label-md text-on-surface-variant">
              Blok B & C
            </p>
          </div>
        </div>
      </section>

      {/* Statistik */}
      <section className="grid grid-cols-3 gap-3">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-center">
          <p className="font-headline-md text-headline-md text-primary font-bold">
            {stats.today}
          </p>
          <p className="font-label-md text-label-md text-on-surface-variant mt-1">
            Hari Ini
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-center">
          <p className="font-headline-md text-headline-md text-secondary font-bold">
            {stats.week}
          </p>
          <p className="font-label-md text-label-md text-on-surface-variant mt-1">
            Minggu Ini
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-center">
          <p className="font-headline-md text-headline-md text-tertiary font-bold">
            {stats.total}
          </p>
          <p className="font-label-md text-label-md text-on-surface-variant mt-1">
            Total
          </p>
        </div>
      </section>

      {/* Pengaturan */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <h2 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest px-4 pt-4 pb-2">
          Pengaturan
        </h2>

        {/* Dark Mode */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">
              dark_mode
            </span>
            <span className="font-body-md text-body-md text-on-surface">
              Mode Gelap
            </span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full transition-all relative ${darkMode ? "bg-primary" : "bg-outline-variant"}`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-on-primary absolute top-0.5 transition-all ${darkMode ? "left-6" : "left-0.5"}`}
            />
          </button>
        </div>

        {/* Notifikasi */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">
              notifications
            </span>
            <span className="font-body-md text-body-md text-on-surface">
              Notifikasi
            </span>
          </div>
          <button
            onClick={() => setNotifEnabled(!notifEnabled)}
            className={`w-12 h-6 rounded-full transition-all relative ${notifEnabled ? "bg-primary" : "bg-outline-variant"}`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-on-primary absolute top-0.5 transition-all ${notifEnabled ? "left-6" : "left-0.5"}`}
            />
          </button>
        </div>
      </section>

      {/* Menu Lainnya */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <h2 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest px-4 pt-4 pb-2">
          Lainnya
        </h2>
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="w-full flex items-center justify-between px-4 py-3 border-t border-outline-variant hover:bg-surface-container-low transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant">
                {item.icon}
              </span>
              <span className="font-body-md text-body-md text-on-surface">
                {item.label}
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">
              chevron_right
            </span>
          </button>
        ))}
      </section>

      {/* Logout */}
      <section className="pb-8">
        <button
          onClick={handleLogout}
          className="w-full h-touch-target-min bg-error-container text-error border border-error rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">logout</span>
          Keluar Akun
        </button>
      </section>
    </Layout>
  );
}

export default Profil;
