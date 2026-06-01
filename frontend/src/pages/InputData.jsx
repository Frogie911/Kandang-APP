import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import BerikanPakanForm from "../components/input/BerikanPakanForm";
import KematianForm from "../components/input/KematianForm";
import PakanMasukForm from "../components/input/PakanMasukForm";
import api from "../api";

function InputData() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const [activeForm, setActiveForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Form states
  const [pakanForm, setPakanForm] = useState({
    jenis: "starter",
    jumlah: 45.0,
    waktu: new Date().toLocaleString("id-ID"),
  });
  const [kematianForm, setKematianForm] = useState({
    jenis: "mati",
    jumlah: "",
    keterangan: "",
    foto: null,
  });
  const [pakanMasukForm, setPakanMasukForm] = useState({
    jenis: "",
    jumlah: 0,
    supplier: "",
    tanggal: new Date().toISOString().split("T")[0],
    foto: null,
  });

  const showToast = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const openForm = (type) => {
    setActiveForm(type);
    setShowModal(false);
  };

  const backToMenu = () => {
    setActiveForm(null);
    setShowModal(true);
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);

    const username = localStorage.getItem("username");
    let payload = {
      type,
      recordedBy: username,
      timestamp: new Date().toISOString(),
    };

    // 1. JIKA FORM YANG DIKIRIM ADALAH KEMATIAN
    if (type === "kematian") {
      if (!kematianForm.jumlah) {
        showToast("Jumlah ayam wajib diisi!", "error");
        setLoading(false);
        return;
      }

      try {
        // Kita satukan datanya ke dalam satu objek bersih sesuai kebutuhan backend
        const dataLaporan = {
          jumlah: Number(kematianForm.jumlah),
          penyebab: kematianForm.jenis, // Mengubah 'jenis' menjadi 'penyebab'
          keterangan: kematianForm.keterangan,
          recordedBy: username,
        };

        // Kirim dataLaporan dan file fisik gambarnya (kematianForm.foto)
        await api.createDeathReport(dataLaporan, kematianForm.foto);
        showToast("Data kematian berhasil disimpan dengan foto!", "success");

        // Reset form kematian setelah berhasil
        setKematianForm({
          jenis: "mati",
          jumlah: "",
          keterangan: "",
          foto: null,
        });
      } catch (err) {
        console.error("Submit error kematian:", err);
        showToast("Gagal simpan laporan kematian: " + err.message, "error");
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. JIKA FORM ADALAH PAKAN ATAU STOK MASUK (MENGGUNAKAN JSON BIASA)
    if (type === "berikan_pakan") {
      payload = { ...payload, ...pakanForm, jumlah: Number(pakanForm.jumlah) };
      if (!pakanForm.jumlah) {
        showToast("Jumlah pakan wajib diisi!", "error");
        setLoading(false);
        return;
      }
    } else if (type === "pakan_masuk") {
      payload = {
        ...payload,
        ...pakanMasukForm,
        jumlah: Number(pakanMasukForm.jumlah),
      };
      if (!pakanMasukForm.jumlah) {
        showToast("Jumlah stok masuk wajib diisi!", "error");
        setLoading(false);
        return;
      }
    }

    try {
      await api.createRecord(payload);
      showToast("Data berhasil disimpan!", "success");

      // Reset form pakan harian atau pakan masuk
      if (type === "berikan_pakan")
        setPakanForm({
          jenis: "starter",
          jumlah: 45.0,
          waktu: new Date().toLocaleString("id-ID"),
        });
      if (type === "pakan_masuk")
        setPakanMasukForm({
          jenis: "",
          jumlah: 0,
          supplier: "",
          tanggal: new Date().toISOString().split("T")[0],
          foto: null,
        });
    } catch (err) {
      console.error("Submit error:", err);
      showToast("Gagal simpan: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      id: "berikan_pakan",
      label: "Berikan Pakan",
      icon: "restaurant",
      color: "bg-primary-container text-on-primary-container",
    },
    {
      id: "kematian",
      label: "Laporkan Kematian",
      icon: "emergency_home",
      color: "bg-error-container text-error",
    },
    {
      id: "pakan_masuk",
      label: "Pakan Masuk (Stok)",
      icon: "inventory_2",
      color: "bg-secondary-container text-on-secondary-container",
    },
    {
      id: "riwayat",
      label: "Lihat Riwayat",
      icon: "history",
      color: "bg-tertiary-container text-on-tertiary-container",
    },
  ];

  return (
    <Layout>
      {/* Toast */}
      {message && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-[70] px-4 py-3 rounded-xl border shadow-lg ${
            message.type === "success"
              ? "bg-primary-fixed border-primary text-on-primary-fixed"
              : "bg-error-container border-error text-on-error-container"
          }`}
        >
          <p className="font-body-md text-body-md flex items-center gap-2">
            <span className="material-symbols-outlined">
              {message.type === "success" ? "check_circle" : "error"}
            </span>
            {message.text}
          </p>
        </div>
      )}

      {/* Background Content (Dashboard preview) */}
      {!activeForm && (
        <main className="px-margin-mobile pt-stack-lg pb-32 space-y-stack-lg">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 bg-surface-container-lowest border border-outline-variant p-4 rounded-xl flex flex-col gap-2">
              <span className="font-label-lg text-label-lg text-outline">
                Populasi Saat Ini
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
                  12,450
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Ekor
                </span>
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl">
              <span className="font-label-md text-label-md text-outline">
                Pakan Terpakai
              </span>
              <p className="font-headline-sm text-headline-sm text-on-surface">
                450 kg
              </p>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl">
              <span className="font-label-md text-label-md text-outline">
                Kematian Harian
              </span>
              <p className="font-headline-sm text-headline-sm text-error">2</p>
            </div>
          </div>
          <section className="space-y-stack-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Kondisi Kandang
            </h2>
            <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
              <div className="h-48 bg-surface-variant relative">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1548550023-2bdb3c5b3b0c?w=600"
                  alt="Kandang"
                />
                <div className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-full text-on-primary font-label-md text-label-md">
                  LIVE VIEW
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    thermometer
                  </span>
                  <span className="font-body-md text-body-md">28.5°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    humidity_mid
                  </span>
                  <span className="font-body-md text-body-md">65%</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Form Pages */}
      {activeForm === "berikan_pakan" && (
        <BerikanPakanForm
          form={pakanForm}
          setForm={setPakanForm}
          onSubmit={(e) => handleSubmit(e, "berikan_pakan")}
          loading={loading}
          onBack={backToMenu}
        />
      )}
      {activeForm === "kematian" && (
        <KematianForm
          form={kematianForm}
          setForm={setKematianForm}
          onSubmit={(e) => handleSubmit(e, "kematian")}
          loading={loading}
          onBack={backToMenu}
        />
      )}
      {activeForm === "pakan_masuk" && (
        <PakanMasukForm
          form={pakanMasukForm}
          setForm={setPakanMasukForm}
          onSubmit={(e) => handleSubmit(e, "pakan_masuk")}
          loading={loading}
          onBack={backToMenu}
        />
      )}

      {/* Bottom Sheet Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => {}}
        >
          <div className="w-full max-w-md bg-surface-container-lowest rounded-t-[28px] shadow-2xl p-margin-mobile flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Drag Handle */}
            <div className="w-8 h-1 bg-outline-variant rounded-full mx-auto mb-6"></div>

            {/* Header */}
            <div className="mb-stack-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Pilih Aktivitas
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Lakukan pembaruan data harian kandang
              </p>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-4 mb-stack-lg">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    item.id === "riwayat"
                      ? navigate("/riwayat")
                      : openForm(item.id)
                  }
                  className="bg-surface-container border border-outline-variant rounded-xl p-5 flex flex-col items-center gap-3 active:scale-95 transition-all hover:bg-surface-container-high group text-center h-full"
                >
                  <div
                    className={`w-14 h-14 rounded-full ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <span className="material-symbols-outlined !text-[32px]">
                      {item.icon}
                    </span>
                  </div>
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full h-touch-target-min rounded-full border-2 border-primary text-primary font-label-lg text-label-lg font-bold hover:bg-primary-fixed-dim transition-colors mb-safe"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default InputData;
