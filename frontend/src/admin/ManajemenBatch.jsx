import { useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";

export default function ManajemenBatch() {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  const rightAction = (
    <button
      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-90 transition-all"
      onClick={toggleModal}
    >
      <span className="material-symbols-outlined text-on-primary-container">
        add
      </span>
    </button>
  );

  return (
    <AdminLayout title="Manajemen Batch" showBack rightAction={rightAction}>
      {/* Section 1: Active Batch Banner */}
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
            <div className="bg-primary/20 backdrop-blur-sm p-2 rounded-lg flex flex-col items-center justify-center border border-on-primary-container/10 text-error-container">
              <p className="font-label-md text-[10px] text-on-tertiary-container/70 uppercase">
                Mati
              </p>
              <p className="font-label-lg text-label-lg text-on-tertiary-container">
                127
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Search & Filter */}
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

      {/* Section 3: Batch List */}
      <section className="flex flex-col gap-4">
        <h3 className="font-label-lg text-label-lg text-outline uppercase tracking-wider">
          Riwayat Batch
        </h3>
        <div className="flex flex-col gap-3">
          {/* Batch #3 Active Card */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex flex-col gap-3 cursor-pointer active:bg-surface-container-low transition-colors">
            <div className="flex justify-between items-center">
              <h4 className="font-headline-sm text-headline-sm text-on-surface">
                Batch #3
              </h4>
              <span className="px-2 py-1 rounded bg-primary-container text-on-primary-container font-label-md text-[10px]">
                AKTIF
              </span>
            </div>
            <div className="flex justify-between items-end border-t border-outline-variant/30 pt-3">
              <div className="flex flex-col">
                <p className="font-label-md text-on-surface-variant">
                  15,000 ekor
                </p>
                <p className="font-label-md text-outline">12 Mei 2026</p>
              </div>
              <span className="material-symbols-outlined text-outline">
                chevron_right
              </span>
            </div>
          </div>
          {/* Batch #2 Finished Card */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex flex-col gap-3 opacity-90 cursor-pointer active:bg-surface-container-low transition-colors">
            <div className="flex justify-between items-center">
              <h4 className="font-headline-sm text-headline-sm text-on-surface">
                Batch #2
              </h4>
              <span className="px-2 py-1 rounded bg-surface-variant text-on-surface-variant font-label-md text-[10px]">
                SELESAI
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2">
              <div>
                <p className="text-[10px] text-outline uppercase font-label-md">
                  Mati
                </p>
                <p className="text-label-lg text-on-surface font-label-lg">
                  210
                </p>
              </div>
              <div>
                <p className="text-[10px] text-outline uppercase font-label-md">
                  FCR
                </p>
                <p className="text-label-lg text-on-surface font-label-lg">
                  1.78
                </p>
              </div>
              <div>
                <p className="text-[10px] text-outline uppercase font-label-md">
                  Durasi
                </p>
                <p className="text-label-lg text-on-surface font-label-lg">
                  35 Hr
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-outline-variant/30 pt-2">
              <p className="font-label-md text-outline">Mar 2026 - Apr 2026</p>
              <span className="material-symbols-outlined text-outline">
                chevron_right
              </span>
            </div>
          </div>
          {/* Batch #1 Finished Card */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex flex-col gap-3 opacity-90 cursor-pointer active:bg-surface-container-low transition-colors">
            <div className="flex justify-between items-center">
              <h4 className="font-headline-sm text-headline-sm text-on-surface">
                Batch #1
              </h4>
              <span className="px-2 py-1 rounded bg-surface-variant text-on-surface-variant font-label-md text-[10px]">
                SELESAI
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2">
              <div>
                <p className="text-[10px] text-outline uppercase font-label-md">
                  Mati
                </p>
                <p className="text-label-lg text-on-surface font-label-lg">
                  305
                </p>
              </div>
              <div>
                <p className="text-[10px] text-outline uppercase font-label-md">
                  FCR
                </p>
                <p className="text-label-lg text-on-surface font-label-lg">
                  1.85
                </p>
              </div>
              <div>
                <p className="text-[10px] text-outline uppercase font-label-md">
                  Durasi
                </p>
                <p className="text-label-lg text-on-surface font-label-lg">
                  38 Hr
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-outline-variant/30 pt-2">
              <p className="font-label-md text-outline">Jan 2026 - Feb 2026</p>
              <span className="material-symbols-outlined text-outline">
                chevron_right
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-24 right-margin-mobile w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-all z-40"
        onClick={toggleModal}
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>

      {/* Bottom Sheet Modal Overlay */}
      <div
        className={`fixed inset-0 z-[60] flex-col justify-end transition-opacity duration-300 ${modalOpen ? "flex opacity-100" : "hidden opacity-0"}`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={toggleModal} />
        <div className="relative bg-surface w-full rounded-t-3xl p-6 flex flex-col gap-6 animate-[slide-up_0.3s_ease-out]">
          <div
            className="w-12 h-1.5 bg-outline-variant rounded-full mx-auto cursor-pointer"
            onClick={toggleModal}
          />
          <div className="flex justify-between items-center">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Buka Batch Baru
            </h3>
            <button onClick={toggleModal}>
              <span className="material-symbols-outlined text-outline">
                close
              </span>
            </button>
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant">
                Tanggal Mulai
              </label>
              <input
                className="h-12 px-4 bg-white border border-outline-variant rounded-lg font-body-md focus:ring-primary focus:border-primary outline-none"
                type="date"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant">
                Populasi (ekor)
              </label>
              <div className="relative">
                <input
                  className="w-full h-12 px-4 pr-12 bg-white border border-outline-variant rounded-lg font-body-md focus:ring-primary focus:border-primary outline-none"
                  placeholder="15000"
                  type="number"
                />
                <span className="absolute right-4 top-3 font-label-md text-outline">
                  ekor
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant">
                Lantai Kandang
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  className="h-11 rounded-lg border-2 border-primary bg-primary-container text-on-primary-container font-label-lg transition-colors"
                  type="button"
                >
                  Lantai 1
                </button>
                <button
                  className="h-11 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface-variant font-label-lg hover:bg-surface-container transition-colors"
                  type="button"
                >
                  Lantai 2
                </button>
                <button
                  className="h-11 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface-variant font-label-lg hover:bg-surface-container transition-colors"
                  type="button"
                >
                  Lantai 3
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant">
                Supplier DOC
              </label>
              <select className="h-12 px-4 bg-white border border-outline-variant rounded-lg font-body-md focus:ring-primary focus:border-primary outline-none appearance-none">
                <option>Pilih Supplier</option>
                <option>Indojaya Perkasa</option>
                <option>Mitra Ternak Jaya</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant">
                Harga DOC (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 font-label-md text-outline">
                  Rp
                </span>
                <input
                  className="w-full h-12 pl-12 pr-4 bg-white border border-outline-variant rounded-lg font-body-md focus:ring-primary focus:border-primary outline-none"
                  placeholder="7500"
                  type="number"
                />
              </div>
            </div>
            <button
              className="w-full h-14 bg-primary text-on-primary rounded-xl font-label-lg text-label-lg shadow-md active:scale-[0.98] transition-transform mt-2"
              type="button"
            >
              Buka Batch
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
