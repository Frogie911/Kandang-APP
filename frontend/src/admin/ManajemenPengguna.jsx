import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";

export default function ManajemenPengguna() {
  const navigate = useNavigate();

  // ── API state ──────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Modal states ───────────────────────────────────────────
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [moveFloorOpen, setMoveFloorOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // ── Form states ────────────────────────────────────────────
  const [newUser, setNewUser] = useState({
    namaLengkap: "",
    username: "",
    password: "",
    role: "worker",
    floorId: "",
  });

  const [passwordData, setPasswordData] = useState({
    passwordBaru: "",
    konfirmasiPassword: "",
    showPassword: false,
    showKonfirmasi: false,
  });

  const [selectedFloor, setSelectedFloor] = useState("");
  const [editData, setEditData] = useState({ namaLengkap: "", username: "" });

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  // ── Fetch data ─────────────────────────────────────────────
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, floorsRes] = await Promise.all([
        fetch(`${API}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/api/admin/users/floors/list`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const usersData = await usersRes.json();
      const floorsData = await floorsRes.json();
      setUsers(Array.isArray(usersData) ? usersData : []);
      setFloors(Array.isArray(floorsData) ? floorsData : []);
    } catch (err) {
      setError("Gagal memuat data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ── Helpers ────────────────────────────────────────────────
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

  const getInitials = (name, username) => {
    if (name)
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return username?.slice(0, 2).toUpperCase() || "??";
  };

  const getFloorName = (user) => user?.floor?.nama || null;

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) || u.name?.toLowerCase().includes(q)
    );
  });

  // ── Submit: Tambah User ────────────────────────────────────
  const handleTambahUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) {
      alert("Username dan password wajib diisi.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newUser.username,
          name: newUser.namaLengkap || null,
          password: newUser.password,
          role: newUser.role,
          floorId: newUser.floorId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal menambah user.");
        return;
      }
      setAddUserOpen(false);
      setNewUser({
        namaLengkap: "",
        username: "",
        password: "",
        role: "worker",
        floorId: "",
      });
      fetchUsers();
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submit: Reset Password ─────────────────────────────────
  const handleResetPassword = async () => {
    if (!passwordData.passwordBaru || passwordData.passwordBaru.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }
    if (passwordData.passwordBaru !== passwordData.konfirmasiPassword) {
      alert("Konfirmasi password tidak cocok.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        `${API}/api/admin/users/${selectedUser.id}/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: passwordData.passwordBaru }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal reset password.");
        return;
      }
      alert("Password berhasil direset.");
      setResetPasswordOpen(false);
      setPasswordData({
        passwordBaru: "",
        konfirmasiPassword: "",
        showPassword: false,
        showKonfirmasi: false,
      });
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submit: Pindah Lantai ──────────────────────────────────
  const handlePindahLantai = async () => {
    if (!selectedFloor) return;
    setSubmitting(true);
    try {
      const floor = floors.find((f) => f.nama === selectedFloor);
      const res = await fetch(
        `${API}/api/admin/users/${selectedUser.id}/floor`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ floorId: floor?.id || null }),
        },
      );
      if (!res.ok) {
        alert("Gagal memindah lantai.");
        return;
      }
      setMoveFloorOpen(false);
      setSelectedFloor("");
      fetchUsers();
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submit: Edit Profil ────────────────────────────────────
  const handleEditProfil = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editData.namaLengkap,
          username: editData.username,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal edit profil.");
        return;
      }
      setEditProfileOpen(false);
      fetchUsers();
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submit: Hapus User ─────────────────────────────────────
  const handleHapusUser = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/admin/users/${selectedUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Gagal menghapus user.");
        return;
      }
      setDeleteConfirmOpen(false);
      setSheetOpen(false);
      fetchUsers();
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Modal helpers ──────────────────────────────────────────
  const toggleBottomSheet = (user = null) => {
    setSelectedUser(user);
    setSheetOpen(!sheetOpen);
  };

  const openModal = (modalType) => {
    setSheetOpen(false);
    setTimeout(() => {
      if (modalType === "add") setAddUserOpen(true);
      if (modalType === "reset") setResetPasswordOpen(true);
      if (modalType === "move") {
        setSelectedFloor("");
        setMoveFloorOpen(true);
      }
      if (modalType === "edit") {
        setEditData({
          namaLengkap: selectedUser?.name || "",
          username: selectedUser?.username || "",
        });
        setEditProfileOpen(true);
      }
      if (modalType === "delete") setDeleteConfirmOpen(true);
    }, 200);
  };

  const closeAllModals = () => {
    setAddUserOpen(false);
    setResetPasswordOpen(false);
    setMoveFloorOpen(false);
    setEditProfileOpen(false);
    setDeleteConfirmOpen(false);
    setSheetOpen(false);
  };

  const rightAction = (
    <button
      onClick={() => openModal("add")}
      className="material-symbols-outlined cursor-pointer active:opacity-80 p-2 rounded-full hover:bg-white/10"
    >
      person_add
    </button>
  );

  // ── Loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <AdminLayout title="Manajemen Pengguna" showBack>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <span className="material-symbols-outlined text-primary text-[40px] animate-spin">
            progress_activity
          </span>
          <p className="font-label-md text-on-surface-variant">
            Memuat data pengguna...
          </p>
        </div>
      </AdminLayout>
    );
  }

  const workers = users.filter((u) => u.role === "worker");
  const admins = users.filter((u) => u.role === "admin");

  return (
    <AdminLayout title="Manajemen Pengguna" showBack rightAction={rightAction}>
      <div className="space-y-6 pb-6">
        {/* Error banner */}
        {error && (
          <div className="bg-error-container text-on-error-container rounded-xl p-4 flex gap-3 items-center">
            <span className="material-symbols-outlined">error</span>
            <p className="font-label-md flex-1">{error}</p>
            <button onClick={fetchUsers} className="font-label-md underline">
              Coba lagi
            </button>
          </div>
        )}

        {/* ============================== */}
        {/* SUMMARY STATS                  */}
        {/* ============================== */}
        <section className="grid grid-cols-2 gap-base">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col gap-1">
            <span className="material-symbols-outlined text-primary text-[28px]">
              manage_accounts
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant mt-1">
              Total Pengguna
            </span>
            <div className="font-headline-md text-headline-md text-primary">
              {users.length}
            </div>
            <span className="font-label-md text-label-md text-primary">
              {workers.length} Worker · {admins.length} Admin
            </span>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col gap-1">
            <span className="material-symbols-outlined text-secondary text-[28px]">
              grid_view
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant mt-1">
              Lantai Terdaftar
            </span>
            <div className="font-headline-md text-headline-md text-on-surface">
              {floors.length}
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant">
              {floors.map((f) => f.nama).join(", ")}
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
            type="search"
            autoComplete="new-password"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              {filteredUsers.length}
            </span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-10 text-on-surface-variant font-label-md">
              Tidak ada pengguna ditemukan.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors"
                  onClick={() => toggleBottomSheet(user)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                      {getInitials(user.name, user.username)}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-label-lg text-label-lg">
                          {user.name || user.username}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                            user.role === "admin"
                              ? "bg-primary-container text-on-primary-container"
                              : "bg-surface-container-high text-on-surface-variant"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-label-md text-label-md text-on-surface-variant">
                          @{user.username}
                        </span>
                        {getFloorName(user) && (
                          <span className="bg-surface-container px-2 py-0.5 rounded-lg text-[10px] text-primary">
                            {getFloorName(user)}
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
          )}
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
        <div className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-3xl z-[70] p-6 pb-8 max-h-[85vh] overflow-y-auto">
          <div
            className="w-12 h-1 bg-outline-variant rounded-full mx-auto mb-6"
            onClick={() => setSheetOpen(false)}
          />

          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xl font-bold">
              {getInitials(selectedUser?.name, selectedUser?.username)}
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm">
                {selectedUser?.name || selectedUser?.username}
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant">
                @{selectedUser?.username}
              </span>
              <div className="flex gap-2 mt-1">
                <span
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                    selectedUser?.role === "admin"
                      ? "bg-primary-container text-on-primary-container"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {selectedUser?.role}
                </span>
                {getFloorName(selectedUser) && (
                  <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-lg text-[10px] font-bold">
                    {getFloorName(selectedUser)}
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
            {selectedUser?.role === "worker" && (
              <button
                onClick={() => openModal("move")}
                className="w-full h-12 flex items-center gap-4 px-4 hover:bg-surface-container rounded-xl transition-colors text-on-surface"
              >
                <span className="material-symbols-outlined text-on-surface-variant">
                  swap_horiz
                </span>
                <span className="font-label-lg text-label-lg">
                  Pindah Lantai
                </span>
              </button>
            )}
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
            <button
              onClick={() => openModal("delete")}
              className="w-full h-12 flex items-center gap-4 px-4 hover:bg-error-container/20 rounded-xl transition-colors text-error"
            >
              <span className="material-symbols-outlined">delete</span>
              <span className="font-label-lg text-label-lg">Hapus Akun</span>
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
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleTambahUser}>
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
              <label className="font-label-md text-on-surface-variant px-1">
                Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  alternate_email
                </span>
                <input
                  type="text"
                  required
                  placeholder="contoh: budi_worker"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  className="w-full h-12 pl-12 pr-4 bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-0 text-on-surface transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label-md text-on-surface-variant px-1">
                Password Awal
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  lock
                </span>
                <input
                  type="password"
                  required
                  placeholder="Min. 6 karakter"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full h-12 pl-12 pr-4 bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-0 text-on-surface transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label-md text-on-surface-variant px-1">
                Role Pengguna
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["worker", "admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setNewUser({ ...newUser, role: r })}
                    className={`flex items-center justify-center gap-2 h-11 border-2 rounded-lg font-label-lg transition-all ${
                      newUser.role === r
                        ? "border-primary bg-primary-container text-on-primary-container"
                        : "border-outline-variant bg-surface-container-low text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {r === "worker" ? "engineering" : "admin_panel_settings"}
                    </span>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {newUser.role === "worker" && (
              <div className="space-y-1.5">
                <label className="font-label-md text-on-surface-variant px-1">
                  Lantai Penugasan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {floors.map((floor) => (
                    <button
                      key={floor.id}
                      type="button"
                      onClick={() =>
                        setNewUser({ ...newUser, floorId: floor.id })
                      }
                      className={`h-10 rounded-lg font-label-md transition-all ${
                        newUser.floorId === floor.id
                          ? "border-2 border-primary bg-primary-container text-on-primary-container"
                          : "border border-outline-variant bg-surface-container-low text-on-surface-variant"
                      }`}
                    >
                      {floor.nama}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-14 mt-4 bg-primary text-on-primary rounded-xl font-label-lg shadow-md flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-60"
            >
              <span className="material-symbols-outlined">person_add</span>
              {submitting ? "Menyimpan..." : "Tambah Pengguna"}
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
            <h2 className="font-headline-sm text-headline-sm">
              Reset Password
            </h2>
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
              {selectedUser?.name || selectedUser?.username} (@
              {selectedUser?.username})
            </span>
          </p>

          <div className="bg-error-container text-on-error-container rounded-xl p-4 flex gap-3 items-start">
            <span className="material-symbols-outlined shrink-0">warning</span>
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
                  className="w-full h-12 pl-12 pr-12 border border-outline-variant rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
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
              <div className="flex gap-1.5 h-1.5 w-full px-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all ${i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-outline-variant"}`}
                  />
                ))}
              </div>
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
                  className="w-full h-12 pl-12 pr-12 border border-outline-variant rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
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
            </div>
          </div>

          <div className="space-y-3 pb-4">
            <button
              onClick={handleResetPassword}
              disabled={submitting}
              className="w-full h-14 bg-primary text-on-primary rounded-xl font-label-lg flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform disabled:opacity-60"
            >
              <span className="material-symbols-outlined">lock_reset</span>
              {submitting ? "Menyimpan..." : "Reset Password"}
            </button>
            <button
              onClick={closeAllModals}
              className="w-full h-12 bg-surface-container-low border border-outline-variant text-on-surface rounded-xl font-label-lg"
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
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-lg">
              {getInitials(selectedUser?.name, selectedUser?.username)}
            </div>
            <div>
              <p className="font-label-lg text-on-surface">
                {selectedUser?.name || selectedUser?.username} (@
                {selectedUser?.username})
              </p>
              <p className="font-label-md text-on-surface-variant">
                Saat ini: {getFloorName(selectedUser) || "Belum ditugaskan"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {floors.map((floor) => {
              const isCurrent = floor.nama === getFloorName(selectedUser);
              const isSelected = selectedFloor === floor.nama;
              return (
                <div
                  key={floor.id}
                  onClick={() => !isCurrent && setSelectedFloor(floor.nama)}
                  className={`rounded-xl p-4 flex items-center justify-between transition-all ${
                    isCurrent
                      ? "bg-surface-container-low border border-outline-variant opacity-70 cursor-not-allowed"
                      : isSelected
                        ? "bg-surface-container-lowest border-2 border-primary cursor-pointer"
                        : "bg-surface-container-lowest border border-outline-variant cursor-pointer hover:bg-surface-container-low"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 font-headline-sm rounded-xl flex items-center justify-center ${isSelected ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high text-on-surface-variant"}`}
                    >
                      L{floor.id}
                    </div>
                    <div>
                      <p className="font-label-lg text-on-surface">
                        {floor.nama} — {floor.kandang}
                      </p>
                    </div>
                  </div>
                  {isCurrent ? (
                    <div className="bg-surface-container-high text-outline rounded-full px-3 py-1 font-label-md text-[10px]">
                      SAAT INI
                    </div>
                  ) : (
                    <span className="material-symbols-outlined text-outline">
                      {isSelected
                        ? "radio_button_checked"
                        : "radio_button_unchecked"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-3 pb-4">
            <button
              disabled={!selectedFloor || submitting}
              onClick={handlePindahLantai}
              className={`w-full h-14 rounded-xl font-label-lg shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-60 ${selectedFloor ? "bg-primary text-on-primary" : "bg-surface-container-high text-outline cursor-not-allowed"}`}
            >
              <span className="material-symbols-outlined text-[20px]">
                swap_horiz
              </span>
              {submitting
                ? "Menyimpan..."
                : `Pindah ke ${selectedFloor || "Lantai"}`}
            </button>
            <button
              onClick={closeAllModals}
              className="w-full h-12 bg-surface-container-low text-on-surface-variant rounded-xl font-label-lg"
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

          <form className="flex flex-col gap-5" onSubmit={handleEditProfil}>
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
              disabled={submitting}
              className="w-full h-14 bg-primary text-on-primary rounded-xl font-label-lg shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
            >
              <span className="material-symbols-outlined">save</span>
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>
      </div>

      {/* ============================== */}
      {/* MODAL: KONFIRMASI HAPUS        */}
      {/* ============================== */}
      <div
        className={`fixed inset-0 z-[80] ${deleteConfirmOpen ? "flex" : "hidden"}`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={closeAllModals}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-3xl p-6 flex flex-col gap-6">
          <div className="w-12 h-1 bg-outline-variant rounded-full mx-auto" />

          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center">
              <span className="material-symbols-outlined text-error text-[32px]">
                delete
              </span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Hapus Akun?
            </h2>
            <p className="font-label-md text-on-surface-variant text-center">
              Akun{" "}
              <span className="font-bold text-on-surface">
                @{selectedUser?.username}
              </span>{" "}
              akan dihapus permanen. Semua data aktivitasnya tetap tersimpan.
            </p>
          </div>

          <div className="space-y-3 pb-4">
            <button
              onClick={handleHapusUser}
              disabled={submitting}
              className="w-full h-14 bg-error text-on-error rounded-xl font-label-lg flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform disabled:opacity-60"
            >
              <span className="material-symbols-outlined">delete</span>
              {submitting ? "Menghapus..." : "Ya, Hapus Akun"}
            </button>
            <button
              onClick={closeAllModals}
              className="w-full h-12 bg-surface-container-low border border-outline-variant text-on-surface rounded-xl font-label-lg"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
