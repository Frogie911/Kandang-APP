import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";

export default function ManajemenPengguna() {
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Modal states
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [moveFloorOpen, setMoveFloorOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // Form states - Tambah User
  const [newUser, setNewUser] = useState({
    namaLengkap: "",
    username: "",
    password: "",
    role: "Worker",
    lantai: "Lantai 1",
    izin: {
      inputPakan: true,
      laporanKematian: true,
      stokMasuk: true,
      lihatRiwayat: true,
    },
  });

  // Form states - Reset Password
  const [passwordData, setPasswordData] = useState({
    passwordBaru: "",
    konfirmasiPassword: "",
    showPassword: false,
    showKonfirmasi: false,
  });

  // Form states - Pindah Lantai
  const [selectedFloor, setSelectedFloor] = useState("");

  // Form states - Edit Profile
  const [editData, setEditData] = useState({
    namaLengkap: "",
    username: "",
  });

  const toggleBottomSheet = (user = null) => {
    setSelectedUser(user);
    setSheetOpen(!sheetOpen);
  };

  const openModal = (modalType) => {
    setSheetOpen(false);
    switch (modalType) {
      case "add":
        setAddUserOpen(true);
        break;
      case "reset":
        setResetPasswordOpen(true);
        break;
      case "move":
        setSelectedFloor("");
        setMoveFloorOpen(true);
        break;
      case "edit":
        setEditData({
          namaLengkap: selectedUser?.name || "",
          username: selectedUser?.username || "",
        });
        setEditProfileOpen(true);
        break;
      default:
        break;
    }
  };

  const closeAllModals = () => {
    setAddUserOpen(false);
    setResetPasswordOpen(false);
    setMoveFloorOpen(false);
    setEditProfileOpen(false);
    setSheetOpen(false);
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(passwordData.passwordBaru);
  const strengthLabels = ["Lemah", "Lemah", "Sedang", "Kuat", "Sangat Kuat"];
  const strengthColors = [
    "bg-error",
    "bg-error",
    "bg-secondary",
    "bg-primary",
    "bg-primary",
  ];

  const rightAction = (
    <button
      onClick={() => openModal("add")}
      className="material-symbols-outlined cursor-pointer active:opacity-80 p-2 rounded-full hover:bg-white/10"
    >
      person_add
    </button>
  );

  const users = [
    {
      id: 1,
      initials: "AU",
      name: "Admin User",
      username: "@admin",
      role: "Admin",
      roleColor: "bg-primary-container text-on-primary-container",
      floor: null,
      bg: "bg-primary-container",
      text: "text-on-primary-container",
    },
    {
      id: 2,
      initials: "PS",
      name: "Pak Surya",
      username: "@surya",
      role: "Worker",
      roleColor: "bg-surface-container-high text-on-surface-variant",
      floor: "Lantai 1",
      floorColor: "bg-surface-container text-primary",
      bg: "bg-secondary-container",
      text: "text-on-secondary-container",
      currentFloor: "Lantai 1",
    },
    {
      id: 3,
      initials: "BK",
      name: "Budi",
      username: "@budi_k",
      role: "Worker",
      roleColor: "bg-surface-container-high text-on-surface-variant",
      floor: "Lantai 2",
      floorColor: "bg-surface-container text-primary",
      bg: "bg-tertiary-container",
      text: "text-on-tertiary",
      currentFloor: "Lantai 2",
    },
    {
      id: 4,
      initials: "SF",
      name: "Siti",
      username: "@siti_farm",
      role: "Worker",
      roleColor: "bg-surface-container-high text-on-surface-variant",
      floor: "Lantai 3",
      floorColor: "bg-surface-container text-primary",
      bg: "bg-primary-container",
      text: "text-on-primary-container",
      currentFloor: "Lantai 3",
    },
  ];

  const floors = [
    {
      id: "L1",
      name: "Lantai 1",
      kandang: "Kandang A",
      ekor: 4940,
      current: false,
    },
    {
      id: "L2",
      name: "Lantai 2",
      kandang: "Kandang B",
      ekor: 4960,
      current: false,
    },
    {
      id: "L3",
      name: "Lantai 3",
      kandang: "Kandang C",
      ekor: 4923,
      current: false,
    },
  ];

  return (
    <AdminLayout title="Manajemen Pengguna" showBack rightAction={rightAction}>
      {/* ← FIX: Wrapper tanpa overflow, biar body scroll normal */}
      <div className="space-y-6 pb-6">
        {/* ============================== */}
        {/* SUMMARY STATS BENTO            */}
        {/* ============================== */}
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

        {/* ============================== */}
        {/* SEARCH BAR                     */}
        {/* ============================== */}
        <section className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="w-full h-12 pl-12 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-body-md"
            placeholder="Cari nama atau username..."
            type="text"
          />
        </section>

        {/* ============================== */}
        {/* USER LIST                      */}
        {/* ============================== */}
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
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between group cursor-pointer hover:bg-surface-container-low transition-colors"
                onClick={() => toggleBottomSheet(user)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full ${user.bg} ${user.text} flex items-center justify-center font-bold`}
                  >
                    {user.initials}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-label-lg text-label-lg">
                        {user.name}
                      </span>
                      <span
                        className={`${user.roleColor} px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md text-on-surface-variant">
                        {user.username}
                      </span>
                      {user.floor && (
                        <span className="bg-surface-container px-2 py-0.5 rounded-lg text-[10px] text-primary">
                          {user.floor}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-container transition-colors">
                  more_vert
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ============================== */}
      {/* BOTTOM SHEET: OPSI PENGGUNA    */}
      {/* ============================== */}
      <div className={`fixed inset-0 z-[60] ${sheetOpen ? "flex" : "hidden"}`}>
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setSheetOpen(false)}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-3xl z-[70] transition-transform duration-300 ease-out p-6 pb-margin-mobile max-h-[85vh] overflow-y-auto ${sheetOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <div
            className="w-12 h-1 bg-outline-variant rounded-full mx-auto mb-6"
            onClick={() => setSheetOpen(false)}
          />

          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-xl font-bold">
              {selectedUser?.initials}
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm">
                {selectedUser?.name}
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant">
                {selectedUser?.username}
              </span>
              <div className="flex gap-2 mt-1">
                <span
                  className={`${selectedUser?.roleColor} px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase`}
                >
                  {selectedUser?.role}
                </span>
                {selectedUser?.floor && (
                  <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-lg text-[10px] font-bold">
                    {selectedUser?.floor}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => openModal("edit")}
              className="w-full h-12 flex items-center gap-4 px-4 hover:bg-surface-container rounded-xl transition-colors text-on-surface"
            >
              <span className="material-symbols-outlined text-on-surface-variant">
                edit
              </span>
              <span className="font-label-lg text-label-lg">Edit Profil</span>
            </button>
            <button
              onClick={() => openModal("reset")}
              className="w-full h-12 flex items-center gap-4 px-4 hover:bg-surface-container rounded-xl transition-colors text-on-surface"
            >
              <span className="material-symbols-outlined text-on-surface-variant">
                key
              </span>
              <span className="font-label-lg text-label-lg">
                Reset Password
              </span>
            </button>
            <button
              onClick={() => openModal("move")}
              className="w-full h-12 flex items-center gap-4 px-4 hover:bg-surface-container rounded-xl transition-colors text-on-surface"
            >
              <span className="material-symbols-outlined text-on-surface-variant">
                swap_horiz
              </span>
              <span className="font-label-lg text-label-lg">Pindah Lantai</span>
            </button>
            <button
              onClick={() => {
                setSheetOpen(false);
                navigate(`/admin/pengguna/${selectedUser?.id}/riwayat`);
              }}
              className="w-full h-12 flex items-center gap-4 px-4 hover:bg-surface-container rounded-xl transition-colors text-on-surface"
            >
              <span className="material-symbols-outlined text-on-surface-variant">
                history
              </span>
              <span className="font-label-lg text-label-lg">
                Riwayat Aktivitas
              </span>
            </button>
            <button className="w-full h-12 flex items-center gap-4 px-4 hover:bg-error-container/20 rounded-xl transition-colors text-error">
              <span className="material-symbols-outlined">block</span>
              <span className="font-label-lg text-label-lg">
                Nonaktifkan Akun
              </span>
            </button>
          </div>
          <button
            className="mt-6 w-full h-12 bg-surface-container-high rounded-full font-label-lg text-label-lg hover:bg-surface-container transition-colors"
            onClick={() => setSheetOpen(false)}
          >
            Batal
          </button>
        </div>
      </div>

      {/* ============================== */}
      {/* MODAL: TAMBAH PENGGUNA BARU    */}
      {/* ============================== */}
      <div
        className={`fixed inset-0 z-[80] ${addUserOpen ? "flex" : "hidden"}`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={closeAllModals}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-3xl p-6 flex flex-col gap-6 max-h-[95vh] overflow-y-auto">
          <div
            className="w-12 h-1 bg-outline-variant rounded-full mx-auto"
            onClick={closeAllModals}
          />

          <div className="flex justify-between items-center">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Tambah Pengguna Baru
            </h2>
            <button
              onClick={closeAllModals}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-outline">
                close
              </span>
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center shadow-sm">
              <span className="text-headline-sm text-on-primary-container font-headline-sm">
                {newUser.namaLengkap
                  ? newUser.namaLengkap
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "AU"}
              </span>
            </div>
            <p className="font-label-md text-outline mt-2">
              Foto Profil Otomatis dari Inisial
            </p>
          </div>

          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="space-y-1.5">
              <label className="font-label-md text-on-surface-variant px-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  person
                </span>
                <input
                  type="text"
                  placeholder="Contoh: Pak Budi Santoso"
                  value={newUser.namaLengkap}
                  onChange={(e) =>
                    setNewUser({ ...newUser, namaLengkap: e.target.value })
                  }
                  className="w-full h-12 pl-12 pr-4 bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-0 text-on-surface placeholder:text-outline/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-end px-1">
                <label className="font-label-md text-on-surface-variant">
                  Username
                </label>
                <span className="text-[10px] font-label-md text-outline">
                  Hanya huruf kecil, angka, underscore
                </span>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  alternate_email
                </span>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  className="w-full h-12 pl-12 pr-12 bg-white border border-primary rounded-xl focus:ring-0 text-on-surface"
                />
                <span
                  className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <p className="font-label-md text-primary px-1">
                ✓ Username tersedia
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-end px-1">
                <label className="font-label-md text-on-surface-variant">
                  Password Awal
                </label>
                <span className="text-[10px] font-label-md text-outline">
                  Min. 8 karakter
                </span>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  lock
                </span>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full h-12 pl-12 pr-12 bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-0 text-on-surface"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline cursor-pointer">
                  visibility
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label-md text-on-surface-variant px-1">
                Role Pengguna
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewUser({ ...newUser, role: "Worker" })}
                  className={`flex items-center justify-center gap-2 h-11 border-2 rounded-lg font-label-lg transition-all ${
                    newUser.role === "Worker"
                      ? "border-primary bg-primary-container text-on-primary-container"
                      : "border-outline-variant bg-surface-container-low text-on-surface-variant"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    engineering
                  </span>
                  Worker
                </button>
                <button
                  type="button"
                  onClick={() => setNewUser({ ...newUser, role: "Admin" })}
                  className={`flex items-center justify-center gap-2 h-11 border-2 rounded-lg font-label-lg transition-all ${
                    newUser.role === "Admin"
                      ? "border-primary bg-primary-container text-on-primary-container"
                      : "border-outline-variant bg-surface-container-low text-on-surface-variant"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    admin_panel_settings
                  </span>
                  Admin
                </button>
              </div>
            </div>

            {newUser.role === "Worker" && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-end px-1">
                  <label className="font-label-md text-on-surface-variant">
                    Lantai Penugasan
                  </label>
                  <span className="text-[10px] font-label-md text-outline">
                    Pilih satu lantai
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["Lantai 1", "Lantai 2", "Lantai 3"].map((floor) => (
                    <button
                      key={floor}
                      type="button"
                      onClick={() => setNewUser({ ...newUser, lantai: floor })}
                      className={`h-10 rounded-lg font-label-md transition-all ${
                        newUser.lantai === floor
                          ? "border-2 border-primary bg-primary-container text-on-primary-container"
                          : "border border-outline-variant bg-surface-container-low text-on-surface-variant"
                      }`}
                    >
                      {floor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="font-label-md text-on-surface-variant px-1">
                Izin Akses
              </label>
              <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-4 border border-outline-variant/30">
                {[
                  { key: "inputPakan", label: "Input Pakan" },
                  { key: "laporanKematian", label: "Laporan Kematian" },
                  { key: "stokMasuk", label: "Stok Masuk" },
                  { key: "lihatRiwayat", label: "Lihat Riwayat" },
                ].map((izin) => (
                  <div
                    key={izin.key}
                    className="flex justify-between items-center"
                  >
                    <span className="font-label-md text-on-surface">
                      {izin.label}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setNewUser({
                          ...newUser,
                          izin: {
                            ...newUser.izin,
                            [izin.key]: !newUser.izin[izin.key],
                          },
                        })
                      }
                      className={`w-10 h-5 rounded-full relative shadow-inner transition-all ${
                        newUser.izin[izin.key]
                          ? "bg-primary"
                          : "bg-outline-variant"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                          newUser.izin[izin.key] ? "right-0.5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-14 mt-4 bg-primary text-on-primary rounded-xl font-label-lg shadow-md flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">person_add</span>
              Tambah Pengguna
            </button>
          </form>
        </div>
      </div>

      {/* ============================== */}
      {/* MODAL: RESET PASSWORD          */}
      {/* ============================== */}
      <div
        className={`fixed inset-0 z-[80] ${resetPasswordOpen ? "flex" : "hidden"}`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={closeAllModals}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-3xl p-6 flex flex-col gap-6">
          <div
            className="w-12 h-1 bg-outline-variant rounded-full mx-auto"
            onClick={closeAllModals}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-on-primary-container"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  key
                </span>
              </div>
              <h2 className="font-headline-sm text-headline-sm">
                Reset Password
              </h2>
            </div>
            <button
              onClick={closeAllModals}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant">
                close
              </span>
            </button>
          </div>

          <p className="font-label-md text-label-md text-on-surface-variant">
            Mereset password untuk:{" "}
            <span className="text-on-surface font-bold">
              {selectedUser?.name} ({selectedUser?.username})
            </span>
          </p>

          <div className="bg-error-container text-on-error-container rounded-xl p-4 flex gap-3 items-start">
            <span
              className="material-symbols-outlined shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
            <p className="font-label-md text-label-md leading-relaxed">
              Password lama akan langsung tidak berlaku. Worker harus login
              ulang dengan password baru.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-label-lg text-label-lg text-on-surface-variant ml-1">
                Password Baru
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-outline">
                  lock
                </span>
                <input
                  type={passwordData.showPassword ? "text" : "password"}
                  value={passwordData.passwordBaru}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      passwordBaru: e.target.value,
                    })
                  }
                  className="w-full h-12 pl-12 pr-12 border border-outline-variant rounded-xl bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
                <span
                  className="material-symbols-outlined absolute right-4 text-outline cursor-pointer"
                  onClick={() =>
                    setPasswordData({
                      ...passwordData,
                      showPassword: !passwordData.showPassword,
                    })
                  }
                >
                  {passwordData.showPassword ? "visibility_off" : "visibility"}
                </span>
              </div>
            </div>

            <div className="space-y-2 px-1">
              <div className="flex gap-1.5 h-1.5 w-full">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all ${
                      i < passwordStrength
                        ? strengthColors[passwordStrength - 1]
                        : "bg-outline-variant"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`font-label-md text-label-md ${passwordStrength > 0 ? "text-primary" : "text-outline"}`}
              >
                Kekuatan:{" "}
                {passwordStrength > 0
                  ? strengthLabels[passwordStrength - 1]
                  : "-"}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-label-lg text-label-lg text-on-surface-variant ml-1">
                Konfirmasi Password Baru
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-outline">
                  lock
                </span>
                <input
                  type={passwordData.showKonfirmasi ? "text" : "password"}
                  value={passwordData.konfirmasiPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      konfirmasiPassword: e.target.value,
                    })
                  }
                  className="w-full h-12 pl-12 pr-12 border border-outline-variant rounded-xl bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
                <span
                  className="material-symbols-outlined absolute right-4 text-outline cursor-pointer"
                  onClick={() =>
                    setPasswordData({
                      ...passwordData,
                      showKonfirmasi: !passwordData.showKonfirmasi,
                    })
                  }
                >
                  {passwordData.showKonfirmasi
                    ? "visibility_off"
                    : "visibility"}
                </span>
              </div>
              {passwordData.konfirmasiPassword &&
                passwordData.passwordBaru ===
                  passwordData.konfirmasiPassword && (
                  <span
                    className="material-symbols-outlined text-on-tertiary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
            </div>
          </div>

          <div className="space-y-3 pb-4">
            <button className="w-full h-14 bg-primary text-on-primary rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform duration-150">
              <span className="material-symbols-outlined">lock_reset</span>Reset
              Password
            </button>
            <button
              onClick={closeAllModals}
              className="w-full h-12 bg-surface-container-low border border-outline-variant text-on-surface rounded-xl font-label-lg text-label-lg active:scale-95 transition-transform duration-150"
            >
              Batal
            </button>
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* MODAL: PINDAH LANTAI           */}
      {/* ============================== */}
      <div
        className={`fixed inset-0 z-[80] ${moveFloorOpen ? "flex" : "hidden"}`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={closeAllModals}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-3xl p-6 flex flex-col gap-6">
          <div
            className="w-12 h-1 bg-outline-variant rounded-full mx-auto"
            onClick={closeAllModals}
          />

          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Pindah Lantai
            </h3>
            <button
              onClick={closeAllModals}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-outline">
                close
              </span>
            </button>
          </div>

          <div className="bg-surface-container-low rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-lg shadow-sm">
              {selectedUser?.initials}
            </div>
            <div>
              <p className="font-label-lg text-on-surface">
                {selectedUser?.name} ({selectedUser?.username})
              </p>
              <p className="font-label-md text-on-surface-variant">
                Saat ini: {selectedUser?.currentFloor || "-"}
              </p>
            </div>
          </div>

          <div className="mb-1">
            <h4 className="font-label-lg text-on-surface-variant uppercase tracking-wider">
              PILIH LANTAI BARU
            </h4>
          </div>

          <div className="space-y-3">
            {floors.map((floor) => {
              const isCurrent = floor.name === selectedUser?.currentFloor;
              const isSelected = selectedFloor === floor.name;
              return (
                <div
                  key={floor.id}
                  onClick={() => !isCurrent && setSelectedFloor(floor.name)}
                  className={`rounded-xl p-4 flex items-center justify-between transition-all ${
                    isCurrent
                      ? "bg-surface-container-low border border-outline-variant opacity-80 cursor-not-allowed"
                      : isSelected
                        ? "bg-surface-container-lowest border-2 border-primary cursor-pointer active:scale-[0.98]"
                        : "bg-surface-container-lowest border border-outline-variant cursor-pointer hover:bg-surface-container-low active:scale-[0.98]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 font-headline-sm rounded-xl flex items-center justify-center ${
                        isCurrent
                          ? "bg-surface-container-high text-on-surface-variant"
                          : isSelected
                            ? "bg-primary-container text-on-primary-container"
                            : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {floor.id}
                    </div>
                    <div>
                      <p
                        className={`font-label-lg ${isCurrent ? "text-on-surface-variant" : "text-on-surface"}`}
                      >
                        {floor.name} — {floor.kandang}
                      </p>
                      <p className="font-label-md text-on-surface-variant">
                        {floor.ekor.toLocaleString("id-ID")} ekor aktif
                      </p>
                    </div>
                  </div>
                  {isCurrent ? (
                    <div className="bg-surface-container-high text-outline rounded-full px-3 py-1 font-label-md">
                      SAAT INI
                    </div>
                  ) : isSelected ? (
                    <span
                      className="material-symbols-outlined text-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      radio_button_checked
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-outline">
                      radio_button_unchecked
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-surface-container-low rounded-xl p-4 flex gap-3">
            <span className="material-symbols-outlined text-primary text-[20px]">
              info
            </span>
            <p className="font-label-md text-on-surface-variant leading-relaxed">
              Worker akan otomatis dipindah. Semua input berikutnya akan
              tercatat di {selectedFloor || "lantai yang dipilih"}.
            </p>
          </div>

          <div className="space-y-3 pb-4">
            <button
              disabled={!selectedFloor}
              className={`w-full h-14 rounded-xl font-label-lg shadow-md flex items-center justify-center gap-2 transition-all ${
                selectedFloor
                  ? "bg-primary text-on-primary active:opacity-90"
                  : "bg-surface-container-high text-outline cursor-not-allowed"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                swap_horiz
              </span>
              Pindah ke {selectedFloor || "Lantai"}
            </button>
            <button
              onClick={closeAllModals}
              className="w-full h-12 bg-surface-container-low text-on-surface-variant rounded-xl font-label-lg hover:bg-surface-container-high active:scale-95 transition-all"
            >
              Batal
            </button>
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* MODAL: EDIT PROFIL             */}
      {/* ============================== */}
      <div
        className={`fixed inset-0 z-[80] ${editProfileOpen ? "flex" : "hidden"}`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={closeAllModals}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-3xl p-6 flex flex-col gap-6">
          <div
            className="w-12 h-1 bg-outline-variant rounded-full mx-auto"
            onClick={closeAllModals}
          />

          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Edit Profil
            </h2>
            <button
              onClick={closeAllModals}
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
            <div className="space-y-1.5">
              <label className="font-label-md text-on-surface-variant px-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  person
                </span>
                <input
                  type="text"
                  value={editData.namaLengkap}
                  onChange={(e) =>
                    setEditData({ ...editData, namaLengkap: e.target.value })
                  }
                  className="w-full h-12 pl-12 pr-4 bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-0 text-on-surface transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="font-label-md text-on-surface-variant px-1">
                Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  alternate_email
                </span>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) =>
                    setEditData({ ...editData, username: e.target.value })
                  }
                  className="w-full h-12 pl-12 pr-4 bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-0 text-on-surface transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full h-14 bg-primary text-on-primary rounded-xl font-label-lg shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">save</span>Simpan
              Perubahan
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
