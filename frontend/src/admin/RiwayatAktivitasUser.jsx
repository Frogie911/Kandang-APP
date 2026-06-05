import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";

export default function RiwayatAktivitasUser() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Mock data user
  const users = {
    1: {
      name: "Admin User",
      username: "@admin",
      role: "Admin",
      initials: "AU",
      bg: "bg-primary-container",
      text: "text-on-primary-container",
    },
    2: {
      name: "Pak Surya",
      username: "@surya",
      role: "Worker",
      initials: "PS",
      bg: "bg-secondary-container",
      text: "text-on-secondary-container",
    },
    3: {
      name: "Budi",
      username: "@budi_k",
      role: "Worker",
      initials: "BK",
      bg: "bg-tertiary-container",
      text: "text-on-tertiary",
    },
    4: {
      name: "Siti",
      username: "@siti_farm",
      role: "Worker",
      initials: "SF",
      bg: "bg-primary-container",
      text: "text-on-primary-container",
    },
  };

  const user = users[userId] || users[2];

  // Mock riwayat aktivitas
  const [filter, setFilter] = useState("semua");

  const allActivities = [
    {
      id: 1,
      icon: "grass",
      iconBg: "bg-primary-container",
      iconColor: "text-primary",
      title: "Input Pakan",
      detail: "Lantai 1 — 450 kg",
      time: "08:30 WIB",
      date: "Hari ini",
      type: "pakan",
    },
    {
      id: 2,
      icon: "error",
      iconBg: "bg-error-container",
      iconColor: "text-error",
      title: "Laporan Kematian",
      detail: "Lantai 1 — 2 ekor",
      time: "09:15 WIB",
      date: "Hari ini",
      type: "kematian",
    },
    {
      id: 3,
      icon: "inventory_2",
      iconBg: "bg-secondary-container",
      iconColor: "text-on-secondary-container",
      title: "Stok Masuk",
      detail: "Pakan grower — 50 kg",
      time: "10:00 WIB",
      date: "Hari ini",
      type: "stok",
    },
    {
      id: 4,
      icon: "medical_services",
      iconBg: "bg-tertiary-container",
      iconColor: "text-on-tertiary",
      title: "Pemberian Vitamin",
      detail: "Vitamin B complex — Lantai 1",
      time: "07:00 WIB",
      date: "Kemarin",
      type: "vitamin",
    },
    {
      id: 5,
      icon: "grass",
      iconBg: "bg-primary-container",
      iconColor: "text-primary",
      title: "Input Pakan",
      detail: "Lantai 1 — 440 kg",
      time: "08:15 WIB",
      date: "Kemarin",
      type: "pakan",
    },
    {
      id: 6,
      icon: "person_check",
      iconBg: "bg-secondary-container",
      iconColor: "text-on-secondary-container",
      title: "Cek Kebersihan",
      detail: "Lantai 1 — Status Bersih",
      time: "06:30 WIB",
      date: "Kemarin",
      type: "cek",
    },
    {
      id: 7,
      icon: "grass",
      iconBg: "bg-primary-container",
      iconColor: "text-primary",
      title: "Input Pakan",
      detail: "Lantai 1 — 460 kg",
      time: "08:45 WIB",
      date: "2 hari lalu",
      type: "pakan",
    },
    {
      id: 8,
      icon: "error",
      iconBg: "bg-error-container",
      iconColor: "text-error",
      title: "Laporan Kematian",
      detail: "Lantai 1 — 3 ekor",
      time: "09:30 WIB",
      date: "2 hari lalu",
      type: "kematian",
    },
    {
      id: 9,
      icon: "grass",
      iconBg: "bg-primary-container",
      iconColor: "text-primary",
      title: "Input Pakan",
      detail: "Lantai 1 — 455 kg",
      time: "08:20 WIB",
      date: "3 hari lalu",
      type: "pakan",
    },
    {
      id: 10,
      icon: "inventory_2",
      iconBg: "bg-secondary-container",
      iconColor: "text-on-secondary-container",
      title: "Stok Masuk",
      detail: "Pakan starter — 100 kg",
      time: "11:00 WIB",
      date: "3 hari lalu",
      type: "stok",
    },
  ];

  const filteredActivities =
    filter === "semua"
      ? allActivities
      : allActivities.filter((a) => a.type === filter);

  const filters = [
    { key: "semua", label: "Semua" },
    { key: "pakan", label: "Pakan" },
    { key: "kematian", label: "Kematian" },
    { key: "stok", label: "Stok" },
    { key: "vitamin", label: "Vitamin" },
    { key: "cek", label: "Cek" },
  ];

  // Group by date
  const grouped = filteredActivities.reduce((acc, act) => {
    if (!acc[act.date]) acc[act.date] = [];
    acc[act.date].push(act);
    return acc;
  }, {});

  return (
    <AdminLayout title="Riwayat Aktivitas" showBack>
      <div className="space-y-6 pb-6">
        {/* User Card */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-full ${user.bg} ${user.text} flex items-center justify-center text-xl font-bold`}
          >
            {user.initials}
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm">
              {user.name}
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant">
              {user.username}
            </span>
            <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase mt-1 w-fit">
              {user.role}
            </span>
          </div>
        </section>

        {/* Filter Chips */}
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

        {/* Activity List */}
        <section className="space-y-6">
          {Object.entries(grouped).map(([date, activities]) => (
            <div key={date} className="space-y-3">
              <h3 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider sticky top-0 bg-surface py-2">
                {date}
              </h3>
              <div className="space-y-3">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-start gap-3"
                  >
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
                      <p className="font-body-md text-body-md text-on-surface leading-tight font-bold">
                        {act.title}
                      </p>
                      <p className="font-label-md text-label-md text-on-surface-variant mt-0.5">
                        {act.detail}
                      </p>
                      <p className="font-label-md text-label-md text-outline mt-1">
                        {act.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Total Count */}
        <section className="text-center py-4">
          <p className="font-label-md text-on-surface-variant">
            Menampilkan{" "}
            <span className="text-primary font-bold">
              {filteredActivities.length}
            </span>{" "}
            dari {allActivities.length} aktivitas
          </p>
        </section>
      </div>
    </AdminLayout>
  );
}
