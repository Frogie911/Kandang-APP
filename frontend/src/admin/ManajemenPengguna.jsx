import { useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";

export default function ManajemenPengguna() {
  const [sheetOpen, setSheetOpen] = useState(false);

  const toggleBottomSheet = () => setSheetOpen(!sheetOpen);

  const rightAction = (
    <button className="material-symbols-outlined cursor-pointer active:opacity-80 p-2 rounded-full hover:bg-white/10">
      person_add
    </button>
  );

  return (
    <AdminLayout title="Manajemen Pengguna" showBack rightAction={rightAction}>
      {/* Summary Stats Bento */}
      <section className="grid grid-cols-2 gap-base">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col gap-1 transition-all active:scale-[0.98]">
          <span className="material-symbols-outlined text-primary text-[28px]">
            manage_accounts
          </span>
          <span className="font-label-md text-label-md text-on-surface-variant mt-1">
            Total Pengguna
          </span>
          <div className="font-headline-md text-headline-md text-primary">
            4
          </div>
          <span className="font-label-md text-label-md text-primary">
            Aktif semua
          </span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col gap-1 transition-all active:scale-[0.98]">
          <span className="material-symbols-outlined text-secondary text-[28px]">
            grid_view
          </span>
          <span className="font-label-md text-label-md text-on-surface-variant mt-1">
            Lantai Terdaftar
          </span>
          <div className="font-headline-md text-headline-md text-on-surface">
            3
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant">
            Lantai 1, 2, 3
          </span>
        </div>
      </section>

      {/* Search Bar */}
      <section className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
          search
        </span>
        <input
          className="w-full h-touch-target-min pl-12 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-body-md"
          placeholder="Cari nama atau username..."
          type="text"
        />
      </section>

      {/* User List */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <h2 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">
            DAFTAR PENGGUNA
          </h2>
          <span className="bg-surface-container-highest px-2 py-0.5 rounded-full font-label-md text-label-md">
            4
          </span>
        </div>
        <div className="space-y-3">
          {/* User 1 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                AU
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-label-lg text-label-lg">
                    Admin User
                  </span>
                  <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase">
                    Admin
                  </span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  @admin
                </span>
              </div>
            </div>
            <button className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-container transition-colors">
              more_vert
            </button>
          </div>
          {/* User 2 (Trigger for Bottom Sheet) */}
          <div
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors"
            onClick={toggleBottomSheet}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                PS
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-label-lg text-label-lg">Pak Surya</span>
                  <span className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase">
                    Worker
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-label-md text-on-surface-variant">
                    @surya
                  </span>
                  <span className="bg-surface-container px-2 py-0.5 rounded-lg text-[10px] text-primary">
                    Lantai 1
                  </span>
                </div>
              </div>
            </div>
            <button className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-container transition-colors">
              more_vert
            </button>
          </div>
          {/* User 3 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center font-bold">
                BK
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-label-lg text-label-lg">Budi</span>
                  <span className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase">
                    Worker
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-label-md text-on-surface-variant">
                    @budi_k
                  </span>
                  <span className="bg-surface-container px-2 py-0.5 rounded-lg text-[10px] text-primary">
                    Lantai 2
                  </span>
                </div>
              </div>
            </div>
            <button className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-container transition-colors">
              more_vert
            </button>
          </div>
          {/* User 4 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                SF
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-label-lg text-label-lg">Siti</span>
                  <span className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase">
                    Worker
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-label-md text-on-surface-variant">
                    @siti_farm
                  </span>
                  <span className="bg-surface-container px-2 py-0.5 rounded-lg text-[10px] text-primary">
                    Lantai 3
                  </span>
                </div>
              </div>
            </div>
            <button className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-container transition-colors">
              more_vert
            </button>
          </div>
        </div>
      </section>

      {/* User Action Bottom Sheet (Overlay & Drawer) */}
      <div
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${sheetOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggleBottomSheet}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-3xl z-[70] transition-transform duration-300 ease-out p-6 pb-margin-mobile ${sheetOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <div
          className="w-12 h-1 bg-outline-variant rounded-full mx-auto mb-6"
          onClick={toggleBottomSheet}
        />
        {/* BS Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-xl font-bold">
            PS
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm">Pak Surya</span>
            <span className="font-body-md text-body-md text-on-surface-variant">
              @surya
            </span>
          </div>
        </div>
        {/* BS Actions */}
        <div className="space-y-1">
          <button className="w-full h-touch-target-min flex items-center gap-4 px-4 hover:bg-surface-container rounded-xl transition-colors text-on-surface">
            <span className="material-symbols-outlined text-on-surface-variant">
              edit
            </span>
            <span className="font-label-lg text-label-lg">Edit Profil</span>
          </button>
          <button className="w-full h-touch-target-min flex items-center gap-4 px-4 hover:bg-surface-container rounded-xl transition-colors text-on-surface">
            <span className="material-symbols-outlined text-on-surface-variant">
              key
            </span>
            <span className="font-label-lg text-label-lg">Reset Password</span>
          </button>
          <button className="w-full h-touch-target-min flex items-center gap-4 px-4 hover:bg-surface-container rounded-xl transition-colors text-on-surface">
            <span className="material-symbols-outlined text-on-surface-variant">
              swap_horiz
            </span>
            <span className="font-label-lg text-label-lg">Pindah Lantai</span>
          </button>
          <button className="w-full h-touch-target-min flex items-center gap-4 px-4 hover:bg-error-container/20 rounded-xl transition-colors text-error">
            <span className="material-symbols-outlined">block</span>
            <span className="font-label-lg text-label-lg">
              Nonaktifkan Akun
            </span>
          </button>
        </div>
        <button
          className="mt-6 w-full h-touch-target-min bg-surface-container-high rounded-full font-label-lg text-label-lg hover:bg-surface-container transition-colors"
          onClick={toggleBottomSheet}
        >
          Cancel
        </button>
      </div>
    </AdminLayout>
  );
}
