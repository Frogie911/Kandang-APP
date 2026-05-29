import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import InputData from "./pages/InputData"; // ← TAMBAH INI
import ProtectedRoute from "./components/ProtectedRoute";
import Riwayat from "./pages/Riwayat";
import Profil from "./pages/Profil";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Redirect root */}
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

        {/* ============================== */}
        {/* ROUTE KHUSUS ADMIN             */}
        {/* ============================== */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ============================== */}
        {/* ROUTE INPUT DATA (BARU)        */}
        {/* ============================== */}
        <Route
          path="/input"
          element={
            <ProtectedRoute allowedRoles={["worker", "admin"]}>
              <InputData />
            </ProtectedRoute>
          }
        />

        {/* ============================== */}
        {/* ROUTE HALAMAN LAIN (NANTI)     */}
        {/* ============================== */}

        <Route
          path="/riwayat"
          element={
            <ProtectedRoute>
              <Riwayat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profil"
          element={
            <ProtectedRoute>
              <Profil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/unauthorized"
          element={
            <div className="p-10 text-center">
              <h1 className="text-2xl font-bold text-error">Akses Ditolak</h1>
              <p className="text-on-surface-variant mt-2">
                Kamu tidak punya akses ke halaman ini.
              </p>
            </div>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<div className="p-10">404 - Halaman tidak ditemukan</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
