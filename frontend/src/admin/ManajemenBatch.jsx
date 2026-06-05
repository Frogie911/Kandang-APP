import { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";

export default function ManajemenBatch() {
  const [modalOpen, setModalOpen] = useState(false);
  const [harvestModalOpen, setHarvestModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  // State untuk form Buka Batch Baru
  const [newBatch, setNewBatch] = useState({
    tanggal: "",
    jumlahDoc: "",
    lantai: ["Lantai 1"],
    supplier: "Indojaya Perkasa",
    hargaDoc: "",
    targetFcr: "",
    catatan: "",
  });

  // State untuk form Catat Hasil Panen (MULTI-PANEN)
  const [harvestData, setHarvestData] = useState({
    tanggal: "",
    beratPerEkor: "", // ← GANTI: dari totalBerat
    panenKe: "1", // ← BARU: pilihan panen ke-berapa
    jumlahAyamPanen: "", // ← BARU: berapa ekor yang dipanen
    catatan: "",
  });

  const toggleModal = () => setModalOpen(!modalOpen);
  const toggleHarvestModal = (batch = null) => {
    setSelectedBatch(batch);
    setHarvestModalOpen(!harvestModalOpen);
  };

  const handleFloorToggle = (floor) => {
    setNewBatch((prev) => ({
      ...prev,
      lantai: prev.lantai.includes(floor)
        ? prev.lantai.filter((l) => l !== floor)
        : [...prev.lantai, floor],
    }));
  };

  const batches = [
    {
      id: 3,
      name: "Batch #3",
      status: "AKTIF",
      statusColor: "bg-primary-container text-on-primary-container",
      ekor: 15000,
      tanggal: "12 Mei 2026",
      fcr: 1.82,
      mati: 127,
      umur: "Hari 21",
      isActive: true,
      sisaAyam: 14873,
      totalPanen: 0,
      panenCount: 0,
    },
    {
      id: 2,
      name: "Batch #2",
      status: "SELESAI",
      statusColor: "bg-surface-variant text-on-surface-variant",
      ekor: 14500,
      tanggalMulai: "Mar 2026",
      tanggalSelesai: "Apr 2026",
      mati: 210,
      fcr: 1.78,
      durasi: "35 Hr",
      totalPakan: "24,200 kg",
    },
    {
      id: 1,
      name: "Batch #1",
      status: "SELESAI",
      statusColor: "bg-surface-variant text-on-surface-variant",
      ekor: 14000,
      tanggalMulai: "Jan 2026",
      tanggalSelesai: "Feb 2026",
      mati: 305,
      fcr: 1.85,
      durasi: "38 Hr",
      totalPakan: "26,000 kg",
    },
  ];

  // Ringkasan dinamis berdasarkan input panen
  const getHarvestSummary = () => {
    const beratPerEkor = parseFloat(harvestData.beratPerEkor) || 0;
    const jumlahPanen = parseInt(harvestData.jumlahAyamPanen) || 0;
    const panenKe = parseInt(harvestData.panenKe) || 1;
    const batch = selectedBatch || batches[0];

    const totalBerat = beratPerEkor * jumlahPanen;
    const sisaAyam = batch.sisaAyam - jumlahPanen;
    const estimasiRevenue = totalBerat * 22000; // Rp 22.000/kg (mock)
    const bisaPanenLagi = sisaAyam > 500; // threshold 500 ekor

    return {
      durasi: batch.umur || "35 hari",
      populasiAwal: batch.ekor?.toLocaleString("id-ID") + " ekor",
      totalKematian:
        batch.mati +
        " ekor (" +
        ((batch.mati / batch.ekor) * 100).toFixed(2) +
        "%)",
      fcrFinal: batch.fcr,
      panenKe: panenKe,
      beratPerEkor: beratPerEkor > 0 ? beratPerEkor + " kg" : "-",
      jumlahPanen:
        jumlahPanen > 0 ? jumlahPanen.toLocaleString("id-ID") + " ekor" : "-",
      totalBerat:
        totalBerat > 0 ? totalBerat.toLocaleString("id-ID") + " kg" : "-",
      sisaAyam:
        sisaAyam > 0 ? sisaAyam.toLocaleString("id-ID") + " ekor" : "0 ekor",
      estimasiRevenue:
        estimasiRevenue > 0
          ? "Rp " + estimasiRevenue.toLocaleString("id-ID")
          : "-",
      bisaPanenLagi,
      statusPanen:
        panenKe === 1
          ? "Panen Pertama"
          : panenKe === 2
            ? "Panen Kedua"
            : "Panen Ketiga",
    };
  };

  const harvestSummary = getHarvestSummary();

  return (
    <AdminLayout title="Manajemen Batch" showBack>
      <div className="space-y-6">
        {/* ============================== */}
        {/* SECTION 1: ACTIVE BATCH BANNER */}
        {/* ============================== */}
        <section className="w-full">
          <div className="bg-primary-container rounded-xl p-4 flex flex-col gap-4 border border-outline-variant shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-[10px] mb-2">
                  BATCH AKTIF
                </span>
                <h2 className="font-headline-md text-headline-md text-on-primary-container block">
                  Batch #3
                </h2>
                <p className="font-label-md text-label-md text-on-primary-container/80">
                  Dimulai: 12 Mei 2026
                </p>
              </div>
              <div className="text-right">
                <p className="font-headline-sm text-headline-sm text-on-primary-container">
                  15,000
                </p>
                <p className="font-label-md text-label-md text-on-primary-container/80">
                  ekor
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-primary/20 backdrop-blur-sm p-2 rounded-lg flex flex-col items-center justify-center border border-on-primary-container/10">
                <p className="font-label-md text-[10px] text-on-primary-container/70 uppercase">
                  Umur
                </p>
                <p className="font-label-lg text-label-lg text-on-primary-container">
                  Hari 21
                </p>
              </div>
              <div className="bg-primary/20 backdrop-blur-sm p-2 rounded-lg flex flex-col items-center justify-center border border-on-primary-container/10">
                <p className="font-label-md text-[10px] text-on-primary-container/70 uppercase">
                  FCR
                </p>
                <p className="font-label-lg text-label-lg text-on-primary-container">
                  1.82
                </p>
              </div>
              <div className="bg-primary/20 backdrop-blur-sm p-2 rounded-lg flex flex-col items-center justify-center border border-on-primary-container/10">
                <p className="font-label-md text-[10px] text-on-primary-container/70 uppercase">
                  Mati
                </p>
                <p className="font-label-lg text-label-lg text-on-tertiary-container">
                  127
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================== */}
        {/* SECTION 2: QUICK ACTIONS       */}
        {/* ============================== */}
        <section className="grid grid-cols-2 gap-3">
          <Link to="/admin/perbandingan" className="block">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center gap-3 hover:bg-surface-container-low transition-colors active:scale-[0.98]">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container">
                  compare_arrows
                </span>
              </div>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface">
                  Perbandingan
                </p>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  Bandingkan batch
                </p>
              </div>
            </div>
          </Link>
          <button
            onClick={() => toggleHarvestModal(batches[0])}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center gap-3 hover:bg-surface-container-low transition-colors active:scale-[0.98] text-left w-full"
          >
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-secondary-container">
                agriculture
              </span>
            </div>
            <div>
              <p className="font-label-lg text-label-lg text-on-surface">
                Catat Panen
              </p>
              <p className="font-label-md text-label-md text-on-surface-variant">
                Input hasil panen
              </p>
            </div>
          </button>
        </section>

        {/* ============================== */}
        {/* SECTION 3: SEARCH & FILTER     */}
        {/* ============================== */}
        <section className="flex flex-col gap-4">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-outline">
              search
            </span>
            <input
              className="w-full h-12 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="Cari ID Batch..."
              type="text"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <button className="px-4 h-9 rounded-full bg-primary text-on-primary font-label-md whitespace-nowrap transition-colors">
              Semua
            </button>
            <button className="px-4 h-9 rounded-full bg-surface-container-high text-on-surface-variant border border-outline-variant font-label-md whitespace-nowrap hover:bg-surface-container transition-colors">
              Aktif
            </button>
            <button className="px-4 h-9 rounded-full bg-surface-container-high text-on-surface-variant border border-outline-variant font-label-md whitespace-nowrap hover:bg-surface-container transition-colors">
              Selesai
            </button>
            <button className="px-4 h-9 rounded-full bg-surface-container-high text-on-surface-variant border border-outline-variant font-label-md whitespace-nowrap hover:bg-surface-container transition-colors">
              Dibatalkan
            </button>
          </div>
        </section>

        {/* ============================== */}
        {/* SECTION 4: BATCH LIST          */}
        {/* ============================== */}
        <section className="flex flex-col gap-4">
          <h3 className="font-label-lg text-label-lg text-outline uppercase tracking-wider">
            Riwayat Batch
          </h3>
          <div className="flex flex-col gap-3">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className={`bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex flex-col gap-3 cursor-pointer active:bg-surface-container-low transition-colors ${!batch.isActive ? "opacity-90" : ""}`}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-headline-sm text-headline-sm text-on-surface">
                    {batch.name}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded ${batch.statusColor} font-label-md text-[10px]`}
                  >
                    {batch.status}
                  </span>
                </div>

                {batch.isActive ? (
                  <div className="flex justify-between items-end border-t border-outline-variant/30 pt-3">
                    <div className="flex flex-col">
                      <p className="font-label-md text-on-surface-variant">
                        {batch.ekor.toLocaleString("id-ID")} ekor
                      </p>
                      <p className="font-label-md text-outline">
                        {batch.tanggal}
                      </p>
                    </div>
                    <Link to={`/admin/lantai/${batch.id}`}>
                      <span className="material-symbols-outlined text-outline">
                        chevron_right
                      </span>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2 py-2">
                      <div>
                        <p className="text-[10px] text-outline uppercase font-label-md">
                          Mati
                        </p>
                        <p className="text-label-lg text-on-surface font-label-lg">
                          {batch.mati}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-outline uppercase font-label-md">
                          FCR
                        </p>
                        <p className="text-label-lg text-on-surface font-label-lg">
                          {batch.fcr}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-outline uppercase font-label-md">
                          Durasi
                        </p>
                        <p className="text-label-lg text-on-surface font-label-lg">
                          {batch.durasi}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-outline-variant/30 pt-2">
                      <p className="font-label-md text-outline">
                        {batch.tanggalMulai} - {batch.tanggalSelesai}
                      </p>
                      <span className="material-symbols-outlined text-outline">
                        chevron_right
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ============================== */}
      {/* FLOATING ACTION BUTTON         */}
      {/* ============================== */}
      <button
        className="fixed bottom-24 right-margin-mobile w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-all z-40"
        onClick={toggleModal}
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>

      {/* ============================== */}
      {/* MODAL: BUKA BATCH BARU         */}
      {/* ============================== */}
      <div className={`fixed inset-0 z-[60] ${modalOpen ? "flex" : "hidden"}`}>
        <div className="absolute inset-0 bg-black/40" onClick={toggleModal} />
        <div className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-3xl p-6 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
          <div
            className="w-12 h-1.5 bg-outline-variant rounded-full mx-auto cursor-pointer"
            onClick={toggleModal}
          />

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Buka Batch Baru
              </h3>
              <p className="font-label-md text-label-md text-on-surface-variant mt-1">
                Batch #4 akan dibuat setelah form ini disubmit
              </p>
            </div>
            <button
              onClick={toggleModal}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-outline">
                close
              </span>
            </button>
          </div>

          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-2">
              <label className="font-label-lg text-label-lg text-on-surface">
                Tanggal Masuk DOC
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  calendar_month
                </span>
                <input
                  type="date"
                  value={newBatch.tanggal}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, tanggal: e.target.value })
                  }
                  className="w-full h-12 pl-12 pr-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-lg text-label-lg text-on-surface">
                Jumlah DOC (ekor)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  pets
                </span>
                <input
                  type="number"
                  placeholder="Contoh: 5000"
                  value={newBatch.jumlahDoc}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, jumlahDoc: e.target.value })
                  }
                  className="w-full h-12 pl-12 pr-16 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label-md text-on-surface-variant">
                  ekor
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <label className="font-label-lg text-label-lg text-on-surface">
                  Lantai Kandang yang Diisi
                </label>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  Pilih satu atau lebih lantai
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {["Lantai 1", "Lantai 2", "Lantai 3"].map((floor) => (
                  <button
                    key={floor}
                    type="button"
                    onClick={() => handleFloorToggle(floor)}
                    className={`h-11 flex items-center justify-center font-label-lg rounded-lg border transition-all ${
                      newBatch.lantai.includes(floor)
                        ? "bg-primary-container text-on-primary-container border-primary-container shadow-sm"
                        : "bg-surface-container-low text-on-surface border-outline-variant"
                    }`}
                  >
                    {floor}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-lg text-label-lg text-on-surface">
                Supplier DOC
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  store
                </span>
                <select
                  value={newBatch.supplier}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, supplier: e.target.value })
                  }
                  className="w-full h-12 pl-12 pr-10 bg-white border border-outline-variant rounded-lg appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                >
                  <option>Indojaya Perkasa</option>
                  <option>Mitra Ternak Jaya</option>
                  <option>PT Charoen Pokphand</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-lg text-label-lg text-on-surface">
                Harga DOC per Ekor (Opsional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-label-lg text-on-surface-variant">
                  Rp
                </span>
                <input
                  type="number"
                  placeholder="8.500"
                  value={newBatch.hargaDoc}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, hargaDoc: e.target.value })
                  }
                  className="w-full h-12 pl-12 pr-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <label className="font-label-lg text-label-lg text-on-surface">
                  Target FCR Batch Ini
                </label>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  Rata-rata industri broiler: 1.75 – 2.00
                </p>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  trending_up
                </span>
                <input
                  type="text"
                  placeholder="1.80"
                  value={newBatch.targetFcr}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, targetFcr: e.target.value })
                  }
                  className="w-full h-12 pl-12 pr-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-lg text-label-lg text-on-surface">
                Catatan Batch
              </label>
              <textarea
                placeholder="Tambahkan instruksi khusus atau detail supplier..."
                value={newBatch.catatan}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, catatan: e.target.value })
                }
                className="w-full h-24 p-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-primary text-on-primary rounded-xl flex items-center justify-center gap-3 shadow-md hover:opacity-90 active:scale-95 transition-all mt-2"
            >
              <span className="material-symbols-outlined">add_circle</span>
              <span className="font-label-lg">Buka Batch Sekarang</span>
            </button>
          </form>
        </div>
      </div>

      {/* ============================== */}
      {/* MODAL: CATAT HASIL PANEN       */}
      {/* ============================== */}
      <div
        className={`fixed inset-0 z-[60] ${harvestModalOpen ? "flex" : "hidden"}`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => toggleHarvestModal()}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-3xl p-6 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
          <div
            className="w-12 h-1.5 bg-outline-variant rounded-full mx-auto cursor-pointer"
            onClick={() => toggleHarvestModal()}
          />

          <div className="flex justify-between items-center">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Catat Hasil Panen
            </h3>
            <button
              onClick={() => toggleHarvestModal()}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-outline">
                close
              </span>
            </button>
          </div>

          {/* Warning Banner */}
          <div className="bg-error-container rounded-xl p-4 flex gap-3 items-start">
            <span className="material-symbols-outlined text-on-error-container mt-0.5">
              warning
            </span>
            <p className="font-label-md text-on-error-container">
              Pastikan data panen sudah benar. Batch masih bisa dipanen lagi
              jika sisa ayam masih cukup.
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {/* Tanggal Panen */}
            <div className="flex flex-col gap-2">
              <label className="font-label-lg text-label-lg text-on-surface-variant">
                Tanggal Panen
              </label>
              <input
                type="date"
                value={harvestData.tanggal}
                onChange={(e) =>
                  setHarvestData({ ...harvestData, tanggal: e.target.value })
                }
                className="h-12 px-4 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Panen Ke-berapa */}
            <div className="flex flex-col gap-2">
              <label className="font-label-lg text-label-lg text-on-surface-variant">
                Panen Ke-
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  format_list_numbered
                </span>
                <select
                  value={harvestData.panenKe}
                  onChange={(e) =>
                    setHarvestData({ ...harvestData, panenKe: e.target.value })
                  }
                  className="w-full h-12 pl-12 pr-10 bg-white border border-outline-variant rounded-lg appearance-none focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                >
                  <option value="1">Panen Pertama</option>
                  <option value="2">Panen Kedua</option>
                  <option value="3">Panen Ketiga</option>
                  <option value="4">Panen Keempat</option>
                  <option value="5">Panen Kelima</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Jumlah Ayam Dipanen */}
            <div className="flex flex-col gap-2">
              <label className="font-label-lg text-label-lg text-on-surface-variant">
                Jumlah Ayam Dipanen
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  pets
                </span>
                <input
                  type="number"
                  placeholder="Contoh: 5000"
                  value={harvestData.jumlahAyamPanen}
                  onChange={(e) =>
                    setHarvestData({
                      ...harvestData,
                      jumlahAyamPanen: e.target.value,
                    })
                  }
                  className="w-full h-12 pl-12 pr-16 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label-md text-on-surface-variant">
                  ekor
                </span>
              </div>
            </div>

            {/* Berat per Ekor */}
            <div className="flex flex-col gap-2">
              <label className="font-label-lg text-label-lg text-on-surface-variant">
                Berat per Ekor
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  scale
                </span>
                <input
                  type="number"
                  placeholder="Contoh: 2.1"
                  value={harvestData.beratPerEkor}
                  onChange={(e) =>
                    setHarvestData({
                      ...harvestData,
                      beratPerEkor: e.target.value,
                    })
                  }
                  className="w-full h-12 pl-12 pr-16 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label-md text-on-surface-variant">
                  kg
                </span>
              </div>
            </div>

            {/* Catatan */}
            <div className="flex flex-col gap-2">
              <label className="font-label-lg text-label-lg text-on-surface-variant">
                Catatan (Opsional)
              </label>
              <textarea
                placeholder="Masukkan detail tambahan jika ada..."
                value={harvestData.catatan}
                onChange={(e) =>
                  setHarvestData({ ...harvestData, catatan: e.target.value })
                }
                className="h-20 p-4 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Summary Preview */}
          <div className="bg-surface-container-low rounded-xl p-4 space-y-3">
            <h4 className="font-label-lg tracking-wider text-on-surface-variant uppercase">
              Ringkasan Panen
            </h4>

            <div className="flex justify-between items-center">
              <span className="font-label-md text-on-surface-variant">
                Status
              </span>
              <span className="font-label-lg text-primary font-bold">
                {harvestSummary.statusPanen}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label-md text-on-surface-variant">
                Durasi Batch
              </span>
              <span className="font-label-lg text-on-surface">
                {harvestSummary.durasi}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label-md text-on-surface-variant">
                Populasi Awal
              </span>
              <span className="font-label-lg text-on-surface">
                {harvestSummary.populasiAwal}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label-md text-on-surface-variant">
                Total Kematian
              </span>
              <span className="font-label-lg text-error">
                {harvestSummary.totalKematian}
              </span>
            </div>
            <hr className="border-outline-variant/30" />
            <div className="flex justify-between items-center">
              <span className="font-label-md text-on-surface-variant">
                Berat per Ekor
              </span>
              <span className="font-label-lg text-on-surface">
                {harvestSummary.beratPerEkor}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label-md text-on-surface-variant">
                Jumlah Dipanen
              </span>
              <span className="font-label-lg text-on-surface">
                {harvestSummary.jumlahPanen}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label-md text-on-surface-variant">
                Total Berat
              </span>
              <span className="font-label-lg text-on-surface font-bold">
                {harvestSummary.totalBerat}
              </span>
            </div>
            <hr className="border-outline-variant/30" />
            <div className="flex justify-between items-center">
              <span className="font-label-md text-on-surface-variant">
                Sisa Ayam
              </span>
              <span
                className={`font-label-lg ${harvestSummary.bisaPanenLagi ? "text-primary" : "text-error"}`}
              >
                {harvestSummary.sisaAyam}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="font-label-lg text-on-surface">
                Estimasi Revenue
              </span>
              <span className="font-headline-sm text-primary">
                {harvestSummary.estimasiRevenue}
              </span>
            </div>
          </div>

          {/* Actions — DIPISAH: Simpan vs Tutup */}
          <div className="flex flex-col gap-3">
            <button className="w-full h-14 bg-primary text-on-primary rounded-xl font-label-lg shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
              <span className="material-symbols-outlined">save</span>
              Simpan Panen
            </button>

            {harvestSummary.bisaPanenLagi && (
              <p className="text-center font-label-md text-on-surface-variant">
                Sisa ayam masih {harvestSummary.sisaAyam}. Bisa panen lagi
                nanti.
              </p>
            )}

            <button
              className={`w-full h-14 rounded-xl font-label-lg shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-transform ${
                harvestSummary.bisaPanenLagi
                  ? "bg-surface-container-high text-outline border border-outline-variant"
                  : "bg-error text-on-error"
              }`}
            >
              <span className="material-symbols-outlined">
                {harvestSummary.bisaPanenLagi ? "lock" : "check_circle"}
              </span>
              {harvestSummary.bisaPanenLagi
                ? "Tutup Batch (Final)"
                : "Konfirmasi & Tutup Batch"}
            </button>

            <button
              onClick={() => toggleHarvestModal()}
              className="text-center underline text-outline font-label-lg"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
