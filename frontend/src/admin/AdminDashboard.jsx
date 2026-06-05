import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import StatCard from "../components/admin/StatCard";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // State untuk micro-interaction scale pada floor card
  const [pressedCard, setPressedCard] = useState(null);

  // Handler: set card yang sedang di-press, auto-reset setelah 100ms
  const handleCardPress = (index, floorId) => {
    setPressedCard(index);
    setTimeout(() => {
      setPressedCard(null);
      navigate(`/admin/lantai/${floorId}`);
    }, 100);
  };

  return (
    <AdminLayout title="Admin Dashboard">
      {/* Farm Overview Section */}
      <section className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-headline-sm text-headline-sm">
              Selamat Datang, Admin
            </h2>
            <p className="font-body-md text-on-surface-variant text-[14px]">
              Senin, 24 Mei 2024
            </p>
          </div>
          <div className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-md font-label-md">
            Batch #3 • Aktif
          </div>
        </div>
      </section>

      {/* KPI Grid (2x2) — pakai StatCard */}
      <section className="grid grid-cols-2 gap-4">
        <StatCard
          icon="pets"
          label="Total Ayam"
          value="14,820"
          color="primary"
          fillIcon
          onClick={() => console.log("Navigasi ke detail ayam")}
        />
        <StatCard
          icon="favorite_border"
          label="Kematian"
          value="12"
          color="error"
          onClick={() => console.log("Navigasi ke detail kematian")}
        />
        <StatCard
          icon="warehouse"
          label="Stok Pakan"
          value="850 kg"
          color="secondary"
          fillIcon
          badge={{ text: "LOW", color: "error-container" }}
          onClick={() => console.log("Navigasi ke stok pakan")}
        />
        <StatCard
          icon="trending_up"
          label="FCR"
          value="1.82"
          color="primary"
          badge={{ text: "BAIK", color: "primary-fixed" }}
          onClick={() => console.log("Navigasi ke detail FCR")}
        />
      </section>

      {/* Floor Status */}
      <section className="space-y-3">
        <h3 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">
          Status Lantai
        </h3>
        <div className="space-y-3">
          {/* Lantai 1 */}
          <div
            onClick={() => handleCardPress(0, 1)}
            className={`floor-card bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between active:bg-surface-container-low transition-all cursor-pointer ${
              pressedCard === 0 ? "scale-[0.98]" : "scale-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
                L1
              </div>
              <div>
                <p className="font-label-lg text-on-surface">Lantai 1</p>
                <p className="text-label-md text-on-surface-variant">
                  Pakan: 400kg | Mati: 2
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline">
              chevron_right
            </span>
          </div>

          {/* Lantai 2 */}
          <div
            onClick={() => handleCardPress(1, 2)}
            className={`floor-card bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between active:bg-surface-container-low transition-all cursor-pointer ${
              pressedCard === 1 ? "scale-[0.98]" : "scale-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
                L2
              </div>
              <div>
                <p className="font-label-lg text-on-surface">Lantai 2</p>
                <p className="text-label-md text-on-surface-variant">
                  Pakan: 350kg | Mati: 8
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline">
              chevron_right
            </span>
          </div>

          {/* Lantai 3 */}
          <div
            onClick={() => handleCardPress(2, 3)}
            className={`floor-card bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between active:bg-surface-container-low transition-all cursor-pointer ${
              pressedCard === 2 ? "scale-[0.98]" : "scale-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
                L3
              </div>
              <div>
                <p className="font-label-lg text-on-surface">Lantai 3</p>
                <p className="text-label-md text-on-surface-variant">
                  Pakan: 100kg | Mati: 2
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline">
              chevron_right
            </span>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-3">
        <h3 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">
          Aktivitas Terkini
        </h3>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
          <div className="divide-y divide-outline-variant">
            <div className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0">
                <span className="material-symbols-outlined text-sm">edit</span>
              </div>
              <div className="flex-grow">
                <p className="font-label-md text-on-surface">
                  Input pakan Lantai 1 oleh <strong>Budi</strong>
                </p>
                <p className="text-[10px] text-outline mt-1">
                  15 menit yang lalu
                </p>
              </div>
            </div>
            <div className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                <span className="material-symbols-outlined text-sm">
                  medical_services
                </span>
              </div>
              <div className="flex-grow">
                <p className="font-label-md text-on-surface">
                  Pemberian vitamin oleh <strong>Siti</strong>
                </p>
                <p className="text-[10px] text-outline mt-1">1 jam yang lalu</p>
              </div>
            </div>
            <div className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center text-on-error-container shrink-0">
                <span className="material-symbols-outlined text-sm">
                  warning
                </span>
              </div>
              <div className="flex-grow">
                <p className="font-label-md text-on-surface">
                  Pencatatan mortalitas oleh <strong>Agus</strong>
                </p>
                <p className="text-[10px] text-outline mt-1">2 jam yang lalu</p>
              </div>
            </div>
            <div className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0">
                <span className="material-symbols-outlined text-sm">
                  inventory_2
                </span>
              </div>
              <div className="flex-grow">
                <p className="font-label-md text-on-surface">
                  Stok pakan baru masuk oleh <strong>Admin</strong>
                </p>
                <p className="text-[10px] text-outline mt-1">4 jam yang lalu</p>
              </div>
            </div>
            <div className="p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                <span className="material-symbols-outlined text-sm">
                  person_check
                </span>
              </div>
              <div className="flex-grow">
                <p className="font-label-md text-on-surface">
                  Cek kebersihan kandang oleh <strong>Yanto</strong>
                </p>
                <p className="text-[10px] text-outline mt-1">6 jam yang lalu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions — Hanya Export Laporan */}
      <section className="pb-4">
        <button className="w-full h-12 border border-outline text-primary font-label-lg rounded-lg flex items-center justify-center gap-2 active:bg-primary/5 transition-colors">
          <span className="material-symbols-outlined text-[20px]">
            file_download
          </span>
          Export Laporan
        </button>
      </section>
    </AdminLayout>
  );
}
