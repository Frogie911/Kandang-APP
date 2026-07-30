import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";

export default function ManajemenBatch() {
  const [modalOpen, setModalOpen] = useState(false);
  const [harvestModalOpen, setHarvestModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  // ── API state ──────────────────────────────────────────────
  const [batches, setBatches] = useState([]);
  const [activeBatch, setActiveBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Filter chip state
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // ── State form Buka Batch Baru ─────────────────────────────
  const [newBatch, setNewBatch] = useState({
    tanggal: "",
    jumlahDoc: "",
    lantai: ["Lantai 1"],
    supplier: "Indojaya Perkasa",
    hargaDoc: "",
    targetFcr: "",
    catatan: "",
  });

  // ── State form Catat Hasil Panen ───────────────────────────
  const [harvestData, setHarvestData] = useState({
    tanggal: "",
    beratPerEkor: "",
    panenKe: "1",
    jumlahAyamPanen: "",
    catatan: "",
  });

  // ── Fetch data dari backend ────────────────────────────────
  const fetchBatches = async () => {
    setLoading(true);
    setError(null);
    try {
      // Alamat `${API}` diganti langsung ke alamat backend port 3000
      const [allRes, activeRes] = await Promise.all([
        fetch("http://localhost:3000/api/admin/batches/active", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3000/api/admin/batches/active", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const allData = await allRes.json();
      const activeData = await activeRes.json();

      setBatches(Array.isArray(allData) ? allData : []);
      setActiveBatch(activeData?.id ? activeData : null);
    } catch (err) {
      setError("Gagal memuat data batch. Periksa koneksi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // ── Helper: hitung umur batch (hari) ──────────────────────
  const hitungUmur = (tanggalMulai) => {
    const mulai = new Date(tanggalMulai);
    const hari = Math.ceil((new Date() - mulai) / (1000 * 60 * 60 * 24));
    return `Hari ${hari}`;
  };

  // ── Helper: hitung total kematian dari records ─────────────
  const hitungMati = (batch) => {
    if (!batch.records) return 0;
    return batch.records
      .filter((r) => r.type === "kematian")
      .reduce((sum, r) => sum + (r.jumlah || 0), 0);
  };

  // ── Helper: hitung sisa ayam ──────────────────────────────
  const hitungSisaAyam = (batch) => {
    const mati = hitungMati(batch);
    const totalPanen = (batch.harvests || []).reduce(
      (sum, h) => sum + h.jumlahAyam,
      0,
    );
    return batch.jumlahDoc - mati - totalPanen;
  };

  // ── Helper: hitung durasi batch selesai ───────────────────
  const hitungDurasi = (tanggalMulai, tanggalSelesai) => {
    const mulai = new Date(tanggalMulai);
    const selesai = new Date(tanggalSelesai);
    const hari = Math.ceil((selesai - mulai) / (1000 * 60 * 60 * 24));
    return `${hari} Hr`;
  };

  // ── Helper: format tanggal ke ID ──────────────────────────
  const formatTanggal = (iso) =>
    new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // ── Filter & search batches ────────────────────────────────
  const filteredBatches = batches.filter((b) => {
    const matchFilter =
      activeFilter === "Semua" ||
      (activeFilter === "Aktif" && b.status === "aktif") ||
      (activeFilter === "Selesai" && b.status === "selesai") ||
      (activeFilter === "Dibatalkan" && b.status === "dibatalkan");

    const matchSearch =
      searchQuery === "" ||
      `Batch #${b.nomorBatch}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchFilter && matchSearch;
  });

  // ── Submit: Buka Batch Baru ────────────────────────────────
  const handleBukaBatch = async (e) => {
    e.preventDefault();
    if (!newBatch.tanggal || !newBatch.jumlahDoc) {
      alert("Tanggal dan jumlah DOC wajib diisi.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/admin/batches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tanggalMulai: newBatch.tanggal,
          jumlahDoc: newBatch.jumlahDoc,
          supplier: newBatch.supplier,
          hargaDoc: newBatch.hargaDoc || null,
          targetFcr: newBatch.targetFcr || null,
          catatan: newBatch.catatan || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal membuka batch.");
        return;
      }

      // Reset form & tutup modal
      setNewBatch({
        tanggal: "",
        jumlahDoc: "",
        lantai: ["Lantai 1"],
        supplier: "Indojaya Perkasa",
        hargaDoc: "",
        targetFcr: "",
        catatan: "",
      });
      setModalOpen(false);
      fetchBatches();
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submit: Catat Panen ────────────────────────────────────
  const handleSimpanPanen = async () => {
    if (
      !harvestData.tanggal ||
      !harvestData.jumlahAyamPanen ||
      !harvestData.beratPerEkor
    ) {
      alert("Tanggal, jumlah ayam, dan berat per ekor wajib diisi.");
      return;
    }
    if (!selectedBatch?.id) return;

    setSubmitting(true);
    try {
      const res = await fetch(
        `${API}/api/admin/batches/${selectedBatch.id}/harvest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tanggalPanen: harvestData.tanggal,
            panenKe: harvestData.panenKe,
            jumlahAyam: harvestData.jumlahAyamPanen,
            beratPerEkor: harvestData.beratPerEkor,
            catatan: harvestData.catatan || null,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal menyimpan panen.");
        return;
      }

      setHarvestModalOpen(false);
      setHarvestData({
        tanggal: "",
        beratPerEkor: "",
        panenKe: "1",
        jumlahAyamPanen: "",
        catatan: "",
      });
      fetchBatches();
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submit: Tutup Batch ────────────────────────────────────
  const handleTutupBatch = async () => {
    if (!selectedBatch?.id) return;
    if (
      !confirm(
        `Yakin menutup Batch #${selectedBatch.nomorBatch}? Tindakan ini tidak bisa dibatalkan.`,
      )
    )
      return;

    setSubmitting(true);
    try {
      const res = await fetch(
        `${API}/api/admin/batches/${selectedBatch.id}/close`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        setHarvestModalOpen(false);
        fetchBatches();
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle helpers ─────────────────────────────────────────
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

  // ── Ringkasan panen (kalkulasi lokal, real-time) ───────────
  const getHarvestSummary = () => {
    const beratPerEkor = parseFloat(harvestData.beratPerEkor) || 0;
    const jumlahPanen = parseInt(harvestData.jumlahAyamPanen) || 0;
    const panenKe = parseInt(harvestData.panenKe) || 1;
    const batch = selectedBatch || activeBatch;

    if (!batch) return null;

    const sisaSekarang = hitungSisaAyam(batch);
    const mati = hitungMati(batch);
    const totalBerat = beratPerEkor * jumlahPanen;
    const sisaSetelahPanen = sisaSekarang - jumlahPanen;
    const estimasiRevenue = totalBerat * 22000;
    const bisaPanenLagi = sisaSetelahPanen > 500;

    return {
      durasi: hitungUmur(batch.tanggalMulai),
      populasiAwal: batch.jumlahDoc?.toLocaleString("id-ID") + " ekor",
      totalKematian:
        mati + " ekor (" + ((mati / batch.jumlahDoc) * 100).toFixed(2) + "%)",
      panenKe,
      beratPerEkor: beratPerEkor > 0 ? beratPerEkor + " kg" : "-",
      jumlahPanen:
        jumlahPanen > 0 ? jumlahPanen.toLocaleString("id-ID") + " ekor" : "-",
      totalBerat:
        totalBerat > 0 ? totalBerat.toLocaleString("id-ID") + " kg" : "-",
      sisaAyam:
        sisaSetelahPanen > 0
          ? sisaSetelahPanen.toLocaleString("id-ID") + " ekor"
          : "0 ekor",
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
            : `Panen ke-${panenKe}`,
    };
  };

  const harvestSummary = getHarvestSummary();

  // ── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <AdminLayout title="Manajemen Batch" showBack>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <span className="material-symbols-outlined text-primary text-[40px] animate-spin">
            progress_activity
          </span>
          <p className="font-label-md text-on-surface-variant">
            Memuat data batch...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manajemen Batch" showBack>
      <div className="space-y-6">
        {/* Error banner */}
        {error && (
          <div className="bg-error-container text-on-error-container rounded-xl p-4 flex gap-3 items-center">
            <span className="material-symbols-outlined">error</span>
            <p className="font-label-md">{error}</p>
            <button
              onClick={fetchBatches}
              className="ml-auto font-label-md underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* ============================== */}
        {/* SECTION 1: ACTIVE BATCH BANNER */}
        {/* ============================== */}
        <section className="w-full">
          <div className="bg-primary-container rounded-xl p-4 flex flex-col gap-4 border border-outline-variant shadow-sm">
            {activeBatch ? (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-[10px] mb-2">
                      BATCH AKTIF
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-primary-container block">
                      Batch #{activeBatch.nomorBatch}
                    </h2>
                    <p className="font-label-md text-label-md text-on-primary-container/80">
                      Dimulai: {formatTanggal(activeBatch.tanggalMulai)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-headline-sm text-headline-sm text-on-primary-container">
                      {activeBatch.jumlahDoc?.toLocaleString("id-ID")}
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
                      {hitungUmur(activeBatch.tanggalMulai)}
                    </p>
                  </div>
                  <div className="bg-primary/20 backdrop-blur-sm p-2 rounded-lg flex flex-col items-center justify-center border border-on-primary-container/10">
                    <p className="font-label-md text-[10px] text-on-primary-container/70 uppercase">
                      Target FCR
                    </p>
                    <p className="font-label-lg text-label-lg text-on-primary-container">
                      {activeBatch.targetFcr ?? "-"}
                    </p>
                  </div>
                  <div className="bg-primary/20 backdrop-blur-sm p-2 rounded-lg flex flex-col items-center justify-center border border-on-primary-container/10">
                    <p className="font-label-md text-[10px] text-on-primary-container/70 uppercase">
                      Panen
                    </p>
                    <p className="font-label-lg text-label-lg text-on-primary-container">
                      {activeBatch.harvests?.length ?? 0}x
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-4 gap-2">
                <span className="material-symbols-outlined text-on-primary-container/50 text-[40px]">
                  inventory_2
                </span>
                <p className="font-label-lg text-on-primary-container/70">
                  Tidak ada batch aktif
                </p>
                <p className="font-label-md text-on-primary-container/50">
                  Tekan tombol + untuk membuka batch baru
                </p>
              </div>
            )}
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
            onClick={() => activeBatch && toggleHarvestModal(activeBatch)}
            disabled={!activeBatch}
            className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center gap-3 transition-colors active:scale-[0.98] text-left w-full ${activeBatch ? "hover:bg-surface-container-low" : "opacity-50 cursor-not-allowed"}`}
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
                {activeBatch ? "Input hasil panen" : "Tidak ada batch aktif"}
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
              placeholder="Cari Batch..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {["Semua", "Aktif", "Selesai", "Dibatalkan"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 h-9 rounded-full font-label-md whitespace-nowrap transition-colors ${
                  activeFilter === f
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high text-on-surface-variant border border-outline-variant hover:bg-surface-container"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        {/* ============================== */}
        {/* SECTION 4: BATCH LIST          */}
        {/* ============================== */}
        <section className="flex flex-col gap-4">
          <h3 className="font-label-lg text-label-lg text-outline uppercase tracking-wider">
            Riwayat Batch ({filteredBatches.length})
          </h3>
          <div className="flex flex-col gap-3">
            {filteredBatches.length === 0 ? (
              <div className="text-center py-10 text-on-surface-variant font-label-md">
                Tidak ada batch ditemukan.
              </div>
            ) : (
              filteredBatches.map((batch) => {
                const isActive = batch.status === "aktif";
                const durasi = batch.tanggalSelesai
                  ? hitungDurasi(batch.tanggalMulai, batch.tanggalSelesai)
                  : hitungUmur(batch.tanggalMulai);

                return (
                  <div
                    key={batch.id}
                    className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex flex-col gap-3 active:bg-surface-container-low transition-colors cursor-pointer"
                    onClick={() => navigate("/admin/perbandingan")}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-headline-sm text-headline-sm text-on-surface">
                        Batch #{batch.nomorBatch}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded font-label-md text-[10px] ${
                          isActive
                            ? "bg-primary-container text-on-primary-container"
                            : "bg-surface-variant text-on-surface-variant"
                        }`}
                      >
                        {batch.status.toUpperCase()}
                      </span>
                    </div>

                    {isActive ? (
                      <div className="flex justify-between items-end border-t border-outline-variant/30 pt-3">
                        <div className="flex flex-col">
                          <p className="font-label-md text-on-surface-variant">
                            {batch.jumlahDoc?.toLocaleString("id-ID")} ekor
                          </p>
                          <p className="font-label-md text-outline">
                            {formatTanggal(batch.tanggalMulai)}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-outline">
                          chevron_right
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-2 py-2">
                          <div>
                            <p className="text-[10px] text-outline uppercase font-label-md">
                              Ekor
                            </p>
                            <p className="text-label-lg text-on-surface font-label-lg">
                              {batch.jumlahDoc?.toLocaleString("id-ID")}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-outline uppercase font-label-md">
                              Durasi
                            </p>
                            <p className="text-label-lg text-on-surface font-label-lg">
                              {durasi}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-outline uppercase font-label-md">
                              Panen
                            </p>
                            <p className="text-label-lg text-on-surface font-label-lg">
                              {batch.harvests?.length ?? 0}x
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-outline-variant/30 pt-2">
                          <p className="font-label-md text-outline">
                            {formatTanggal(batch.tanggalMulai)}
                            {batch.tanggalSelesai &&
                              ` – ${formatTanggal(batch.tanggalSelesai)}`}
                          </p>
                          <span className="material-symbols-outlined text-outline">
                            chevron_right
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* ============================== */}
      {/* FLOATING ACTION BUTTON         */}
      {/* ============================== */}
      <button
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-all z-40"
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
                Nomor batch akan dibuat otomatis
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

          <form className="flex flex-col gap-5" onSubmit={handleBukaBatch}>
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
                  required
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
                  required
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
                  placeholder="8500"
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
              disabled={submitting}
              className="w-full h-14 bg-primary text-on-primary rounded-xl flex items-center justify-center gap-3 shadow-md hover:opacity-90 active:scale-95 transition-all mt-2 disabled:opacity-60"
            >
              <span className="material-symbols-outlined">add_circle</span>
              <span className="font-label-lg">
                {submitting ? "Menyimpan..." : "Buka Batch Sekarang"}
              </span>
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

          <div className="bg-error-container rounded-xl p-4 flex gap-3 items-start">
            <span className="material-symbols-outlined text-on-error-container mt-0.5">
              warning
            </span>
            <p className="font-label-md text-on-error-container">
              Pastikan data panen sudah benar. Batch masih bisa dipanen lagi
              jika sisa ayam masih cukup.
            </p>
          </div>

          <div className="flex flex-col gap-4">
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
          {harvestSummary && (
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
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={handleSimpanPanen}
              disabled={submitting}
              className="w-full h-14 bg-primary text-on-primary rounded-xl font-label-lg shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
            >
              <span className="material-symbols-outlined">save</span>
              {submitting ? "Menyimpan..." : "Simpan Panen"}
            </button>

            {harvestSummary?.bisaPanenLagi && (
              <p className="text-center font-label-md text-on-surface-variant">
                Sisa ayam masih {harvestSummary.sisaAyam}. Bisa panen lagi
                nanti.
              </p>
            )}

            <button
              onClick={handleTutupBatch}
              disabled={submitting}
              className={`w-full h-14 rounded-xl font-label-lg shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60 ${
                harvestSummary?.bisaPanenLagi
                  ? "bg-surface-container-high text-outline border border-outline-variant"
                  : "bg-error text-on-error"
              }`}
            >
              <span className="material-symbols-outlined">
                {harvestSummary?.bisaPanenLagi ? "lock" : "check_circle"}
              </span>
              {harvestSummary?.bisaPanenLagi
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
