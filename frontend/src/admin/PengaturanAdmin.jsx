import AdminLayout from "../components/admin/AdminLayout";

export default function PengaturanAdmin() {
  return (
    <AdminLayout title="Pengaturan">
      <section className="space-y-6">
        {/* Account Info */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xl font-bold">
            AD
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm">
              Admin User
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant">
              @admin
            </span>
            <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase mt-1 w-fit">
              Administrator
            </span>
          </div>
        </div>

        {/* Settings List */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden divide-y divide-outline-variant">
          <div className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-on-surface-variant">
                notifications
              </span>
              <span className="font-label-lg text-label-lg">Notifikasi</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input defaultChecked className="sr-only peer" type="checkbox" />
              <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-on-surface-variant">
                lock
              </span>
              <span className="font-label-lg text-label-lg">
                Ganti Password
              </span>
            </div>
            <span className="material-symbols-outlined text-outline">
              chevron_right
            </span>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-on-surface-variant">
                language
              </span>
              <span className="font-label-lg text-label-lg">Bahasa</span>
            </div>
            <span className="font-label-md text-label-md text-primary">
              Indonesia
            </span>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-on-surface-variant">
                dark_mode
              </span>
              <span className="font-label-lg text-label-lg">Mode Gelap</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input className="sr-only peer" type="checkbox" />
              <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </div>

        {/* Logout */}
        <button
          className="w-full h-touch-target-min bg-error-container text-on-error-container rounded-xl font-label-lg text-label-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("username");
            window.location.href = "/login";
          }}
        >
          <span className="material-symbols-outlined">logout</span>
          Keluar Akun
        </button>
      </section>
    </AdminLayout>
  );
}
