import { useState } from "react";

function BerikanPakanForm({ form, setForm, onSubmit, loading, onBack }) {
  const [stok] = useState(120); // dummy stok tersedia

  const stepper = (delta) => {
    const current = Number(form.jumlah) || 0;
    const next = Math.max(0, current + delta);
    setForm({ ...form, jumlah: next });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Top Navigation */}
      <header className="sticky top-0 w-full flex justify-between items-center px-gutter h-touch-target-min bg-surface z-50 border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              arrow_back
            </span>
          </button>
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary">
            Catat Pemberian Pakan
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
          <img
            alt="Profil"
            className="w-full h-full object-cover"
            src="https://i.pravatar.cc/150?img=12"
          />
        </div>
      </header>

      <main className="px-margin-mobile pt-4 space-y-stack-lg max-w-md mx-auto">
        {/* Location Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-[#CCFBF1] text-[#0D9488] rounded-full text-[12px] font-bold shadow-sm">
            <span>📍 Lantai 1 — Area Tugas Anda 🔒</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-label-lg text-label-lg text-on-surface-variant">
              Langkah 1 dari 1
            </span>
            <span className="font-label-lg text-label-lg text-primary font-bold">
              100%
            </span>
          </div>
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="w-full h-full bg-primary"></div>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={onSubmit}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl p-gutter shadow-sm space-y-6"
        >
          {/* Quantity Stepper */}
          <div className="space-y-4">
            <label className="font-label-lg text-label-lg text-on-surface-variant block text-center">
              Jumlah Pakan (kg)
            </label>
            <div className="flex items-center justify-between bg-surface-container-low rounded-lg p-2 border border-outline-variant">
              <button
                type="button"
                onClick={() => stepper(-5)}
                className="w-12 h-12 flex items-center justify-center rounded-lg bg-surface border border-outline-variant text-primary active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined font-bold">
                  remove
                </span>
              </button>
              <div className="flex items-baseline gap-1">
                <span className="font-headline-md text-[24px] text-on-surface font-bold">
                  {form.jumlah}
                </span>
                <span className="font-label-lg text-label-lg text-on-surface-variant">
                  kg
                </span>
              </div>
              <button
                type="button"
                onClick={() => stepper(5)}
                className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary text-on-primary active:scale-90 transition-transform shadow-sm"
              >
                <span className="material-symbols-outlined font-bold">add</span>
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 text-primary font-medium">
              <span className="material-symbols-outlined text-[18px]">
                inventory_2
              </span>
              <p className="font-label-md text-label-md">
                Stok tersedia: {stok}kg
              </p>
            </div>
          </div>

          {/* Feed Type */}
          <div className="space-y-2">
            <label className="font-label-lg text-label-lg text-on-surface-variant block">
              Jenis Pakan
            </label>
            <div className="relative">
              <select
                value={form.jenis}
                onChange={(e) => setForm({ ...form, jenis: e.target.value })}
                className="w-full h-touch-target-min px-4 bg-surface border border-outline-variant rounded-lg appearance-none font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary-container/20 transition-all"
              >
                <option value="starter">Starter (Tahap Awal)</option>
                <option value="grower">Grower (Tahap Pertumbuhan)</option>
                <option value="finisher">Finisher (Tahap Akhir)</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-on-surface-variant">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>

          {/* Read-only Timestamp */}
          <div className="space-y-2">
            <label className="font-label-lg text-label-lg text-on-surface-variant block">
              Waktu Pencatatan
            </label>
            <div className="flex items-center gap-3 px-4 h-touch-target-min bg-surface-container-low border border-outline-variant rounded-lg text-on-surface-variant opacity-75">
              <span className="material-symbols-outlined text-[20px]">
                schedule
              </span>
              <span className="font-body-md text-body-md">{form.waktu}</span>
            </div>
          </div>
        </form>

        {/* Submit */}
        <div className="pt-4 space-y-4">
          <button
            type="submit"
            onClick={onSubmit}
            disabled={loading}
            className="w-full h-[56px] bg-primary text-on-primary rounded-xl font-headline-sm text-headline-sm flex items-center justify-center gap-3 shadow-md active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined">send</span>
                Simpan & Kirim
              </>
            )}
          </button>
          <p className="text-center text-outline font-label-md text-label-md">
            Data akan langsung sinkron dengan sistem pusat.
          </p>
        </div>
      </main>
    </div>
  );
}

export default BerikanPakanForm;
