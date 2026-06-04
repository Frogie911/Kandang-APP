import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import InputData from "./pages/InputData";
import ProtectedRoute from "./components/ProtectedRoute";
import Riwayat from "./pages/Riwayat";
import Profil from "./pages/Profil";

// Admin pages
import AdminDashboard from "./admin/AdminDashboard";
import ManajemenBatch from "./admin/ManajemenBatch";
import ManajemenPengguna from "./admin/ManajemenPengguna";
import LaporanExport from "./admin/LaporanExport";
import PengaturanAdmin from "./admin/PengaturanAdmin";
import DetailLantai from "./admin/DetailLantai";
import PerbandinganBatch from "./admin/PerbandinganBatch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ============================== */}
        {/* PUBLIC ROUTE                   */}
        {/* ============================== */}
        <Route path="/login" element={<Login />} />

        {/* ============================== */}
        {/* REDIRECT ROOT                  */}
        {/* ============================== */}
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ============================== */}
        {/* ROUTE UNTUK SEMUA USER LOGIN   */}
        {/* ============================== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ============================== */}
        {/* ROUTE KHUSUS WORKER            */}
        {/* ============================== */}
        <Route
          path="/worker/dashboard"
          element={
            <ProtectedRoute allowedRoles={["worker", "admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/input"
          element={
            <ProtectedRoute allowedRoles={["worker", "admin"]}>
              <InputData />
            </ProtectedRoute>
          }
        />

        <Route
          path="/riwayat"
          element={
            <ProtectedRoute allowedRoles={["worker", "admin"]}>
              <Riwayat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profil"
          element={
            <ProtectedRoute allowedRoles={["worker", "admin"]}>
              <Profil />
            </ProtectedRoute>
          }
        />

        {/* ============================== */}
        {/* ROUTE KHUSUS ADMIN             */}
        {/* ============================== */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/batch"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManajemenBatch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pengguna"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManajemenPengguna />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/laporan"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <LaporanExport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pengaturan"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PengaturanAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/lantai/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DetailLantai />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/perbandingan"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PerbandinganBatch />
            </ProtectedRoute>
          }
        />

        {/* ============================== */}
        {/* UNAUTHORIZED & 404             */}
        {/* ============================== */}
        <Route
          path="/unauthorized"
          element={
            <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-10 text-center">
              <span className="material-symbols-outlined text-6xl text-error mb-4">
                gpp_bad
              </span>
              <h1 className="font-headline-md text-headline-md text-error">
                Akses Ditolak
              </h1>
              <p className="font-body-md text-on-surface-variant mt-2">
                Kamu tidak punya akses ke halaman ini.
              </p>
              <button
                onClick={() => window.history.back()}
                className="mt-6 px-6 py-3 bg-primary text-on-primary rounded-xl font-label-lg active:scale-95 transition-transform"
              >
                Kembali
              </button>
            </div>
          }
        />

        <Route
          path="*"
          element={
            <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-10 text-center">
              <span className="material-symbols-outlined text-6xl text-outline mb-4">
                search_off
              </span>
              <h1 className="font-headline-md text-headline-md text-on-surface">
                404
              </h1>
              <p className="font-body-md text-on-surface-variant mt-2">
                Halaman tidak ditemukan
              </p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
