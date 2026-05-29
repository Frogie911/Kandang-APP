import { useState, useEffect } from "react";

function PakanMasukForm({ form, setForm, onSubmit, loading, onBack }) {
  const quickAdd = [10, 25, 50];

  // Set tanggal hari ini saat komponen mount
  useEffect(() => {
    if (!form.tanggal) {
      const today = new Date().toISOString().split("T")[0]; // format: yyyy-mm-dd
      setForm((prev) => ({ ...prev, tanggal: today }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-[140px]">
      {/* TopAppBar */}
      <header className="sticky top-0 w-full flex justify-between items-center px-gutter h-touch-target-min bg-surface z-50 border-b border-outline-variant">
        <div className="flex items-center gap-stack-sm">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              arrow_back
            </span>
          </button>
          <h1 className="text-headline-sm font-bold text-primary">
            Catat Pakan Masuk
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-label-md">
            PP
          </div>
          <span className="material-symbols-outlined text-primary">
            notifications
          </span>
        </div>
      </header>

      <main className="flex-grow p-gutter max-w-2xl mx-auto w-full space-y-stack-lg">
        {/* Location Badge */}
        <div className="flex justify-start">
          <div className="bg-[#CCFBF1] text-[#0D9488] px-4 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5">
            <span>📍 Lantai 1 — Area Tugas Anda 🔒</span>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={onSubmit}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl p-gutter shadow-sm space-y-stack-md"
        >
          {/* Jenis Pakan */}
          <div className="space-y-2">
            <label className="font-label-lg text-label-lg text-on-surface-variant">
              Jenis Pakan
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-outline">
                <span className="material-symbols-outlined">search</span>
              </span>
              <input
                type="text"
                value={form.jenis}
                onChange={(e) => setForm({ ...form, jenis: e.target.value })}
                className="w-full h-touch-target-min pl-10 pr-4 bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all"
                placeholder="Cari merk atau tipe pakan..."
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {["Starter S1", "Grower G2", "Finisher F3"].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setForm({ ...form, jenis: chip })}
                  className={`px-3 py-1 rounded-full border text-label-md transition-all ${
                    form.jenis === chip
                      ? "bg-primary text-on-primary border-primary"
                      : "bg-surface-container border-outline-variant text-on-surface-variant"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Jumlah (kg) — FIX LAYOUT */}
          <div className="space-y-2">
            <label className="font-label-lg text-label-lg text-on-surface-variant">
              Jumlah (kg)
            </label>
            <div className="flex gap-3 items-center w-full">
              <input
                type="number"
                value={form.jumlah}
                onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                className="flex-1 min-w-0 h-[56px] px-4 bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim outline-none text-headline-md font-bold text-primary"
                placeholder="0"
              />
              <span className="text-on-surface-variant font-bold text-label-lg shrink-0">
                KG
              </span>
            </div>
            <div className="flex gap-2 pt-1">
              {quickAdd.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      jumlah: (Number(form.jumlah) || 0) + val,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant text-label-md font-semibold text-on-surface-variant hover:bg-primary-fixed-dim transition-all"
                >
                  +{val}kg
                </button>
              ))}
            </div>
          </div>

          {/* Supplier / No. DO */}
          <div className="space-y-2">
            <label className="font-label-lg text-label-lg text-on-surface-variant">
              Supplier / No. DO
            </label>
            <input
              type="text"
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              className="w-full h-touch-target-min px-4 bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all"
              placeholder="Contoh: PT. Maju Jaya / DO-8829"
            />
          </div>

          {/* Tanggal Datang — OTOMATIS */}
          <div className="space-y-2">
            <label className="font-label-lg text-label-lg text-on-surface-variant">
              Tanggal Datang
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-3 flex items-center text-outline pointer-events-none">
                <span className="material-symbols-outlined">
                  calendar_today
                </span>
              </span>
              <input
                type="date"
                value={form.tanggal}
                onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                className="w-full h-touch-target-min px-4 bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all"
              />
            </div>
          </div>
        </form>

        {/* Warning Note */}
        <div className="bg-secondary-fixed text-on-secondary-container p-4 rounded-lg flex gap-3 items-start border border-secondary-container">
          <span className="material-symbols-outlined shrink-0">info</span>
          <p className="text-label-md">
            Pastikan jumlah pakan yang diinput sesuai dengan surat jalan. Stok
            akan langsung ditambahkan ke gudang Lantai 1.
          </p>
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-[64px] left-0 w-full p-gutter bg-surface-bright border-t border-outline-variant z-40">
        <button
          type="submit"
          onClick={onSubmit}
          disabled={loading}
          className="w-full h-[56px] bg-primary text-on-primary rounded-xl font-bold text-body-lg shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span className="material-symbols-outlined">inventory_2</span>
              Tambah ke Stok
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default PakanMasukForm;
