import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Riwayat() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [filterType, setFilterType] = useState("semua");
  const [filterDate, setFilterDate] = useState("hari_ini");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("sipoultry_records") || "[]");
    setRecords(data.reverse()); // Terbaru di atas
  }, []);

  const filterRecords = () => {
    let filtered = [...records];

    // Filter tipe
    if (filterType !== "semua") {
      filtered = filtered.filter((r) => r.type === filterType);
    }

    // Filter tanggal
    const now = new Date();
    if (filterDate === "hari_ini") {
      const today = now.toISOString().split("T")[0];
      filtered = filtered.filter((r) => r.timestamp?.startsWith(today));
    } else if (filterDate === "minggu_ini") {
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((r) => new Date(r.timestamp) >= weekAgo);
    } else if (filterDate === "bulan_ini") {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter((r) => new Date(r.timestamp) >= monthStart);
    }

    return filtered;
  };

  const filtered = filterRecords();

  const typeConfig = {
    berikan_pakan: {
      label: "Pemberian Pakan",
      icon: "restaurant",
      color: "bg-primary-container text-on-primary-container",
      border: "border-primary",
    },
    kematian: {
      label: "Kematian",
      icon: "warning",
      color: "bg-error-container text-error",
      border: "border-error",
    },
    pakan_masuk: {
      label: "Pakan Masuk",
      icon: "inventory_2",
      color: "bg-secondary-container text-on-secondary-container",
      border: "border-secondary",
    },
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      {/* Header */}
      <section>
        <h1 className="font-headline-sm text-headline-sm text-on-surface">
          Riwayat
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Lihat semua aktivitas kandang
        </p>
      </section>

      {/* Filter Tipe */}
      <section className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "semua", label: "Semua" },
          { id: "berikan_pakan", label: "Pakan" },
          { id: "kematian", label: "Kematian" },
          { id: "pakan_masuk", label: "Stok Masuk" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all ${
              filterType === f.id
                ? "bg-primary text-on-primary"
                : "bg-surface-container border border-outline-variant text-on-surface-variant"
            }`}
          >
            {f.label}
          </button>
        ))}
      </section>

      {/* Filter Tanggal */}
      <section className="flex gap-2">
        {[
          { id: "hari_ini", label: "Hari Ini" },
          { id: "minggu_ini", label: "Minggu Ini" },
          { id: "bulan_ini", label: "Bulan Ini" },
          { id: "semua", label: "Semua" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterDate(f.id)}
            className={`flex-1 py-2 rounded-lg font-label-md text-label-md text-center transition-all ${
              filterDate === f.id
                ? "bg-primary-container text-on-primary-container font-bold"
                : "bg-surface-container-low border border-outline-variant text-on-surface-variant"
            }`}
          >
            {f.label}
          </button>
        ))}
      </section>

      {/* List Records */}
      <section className="space-y-3 pb-20">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-[64px] mb-4 opacity-50">
              history
            </span>
            <p className="font-body-md text-body-md">Belum ada data</p>
            <p className="font-label-md text-label-md mt-1">
              Data akan muncul setelah kamu input
            </p>
          </div>
        ) : (
          filtered.map((record, idx) => {
            const config = typeConfig[record.type] || typeConfig.berikan_pakan;
            return (
              <div
                key={idx}
                className={`bg-surface-container-lowest border ${config.border} rounded-xl p-4 flex items-start gap-3 active:scale-95 transition-transform`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center shrink-0`}
                >
                  <span className="material-symbols-outlined">
                    {config.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="font-label-lg text-label-lg font-bold text-on-surface">
                      {config.label}
                    </span>
                    <span className="font-label-md text-label-md text-outline">
                      {formatDate(record.timestamp)}
                    </span>
                  </div>

                  {/* Detail per tipe */}
                  {record.type === "berikan_pakan" && (
                    <div className="mt-1 space-y-1">
                      <p className="font-body-md text-body-md text-on-surface">
                        <span className="font-bold text-primary">
                          {record.jumlah} kg
                        </span>{" "}
                        {record.jenis}
                      </p>
                      <p className="font-label-md text-label-md text-on-surface-variant capitalize">
                        Waktu: {record.waktu}
                      </p>
                    </div>
                  )}

                  {record.type === "kematian" && (
                    <div className="mt-1 space-y-1">
                      <p className="font-body-md text-body-md text-on-surface">
                        <span className="font-bold text-error">
                          {record.jumlah} ekor
                        </span>{" "}
                        ayam {record.jenis}
                      </p>
                      {record.keterangan && (
                        <p className="font-label-md text-label-md text-on-surface-variant truncate">
                          {record.keterangan}
                        </p>
                      )}
                    </div>
                  )}

                  {record.type === "pakan_masuk" && (
                    <div className="mt-1 space-y-1">
                      <p className="font-body-md text-body-md text-on-surface">
                        <span className="font-bold text-secondary">
                          {record.jumlah} kg
                        </span>{" "}
                        {record.jenis}
                      </p>
                      {record.supplier && (
                        <p className="font-label-md text-label-md text-on-surface-variant truncate">
                          {record.supplier}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>
    </Layout>
  );
}

export default Riwayat;
