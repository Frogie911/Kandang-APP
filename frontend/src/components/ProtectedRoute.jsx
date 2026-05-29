import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const username = localStorage.getItem("username");

      console.log("Token:", token);
      console.log("Role:", role);

      if (!token || !role) {
        console.log("No token/role found, redirecting to login");
        setLoading(false);
        return;
      }

      // ✅ Ambil data user dari localStorage (tidak perlu panggil /auth/me yang 404)
      const userData = {
        username: username,
        role: role,
        name: username, // atau localStorage.getItem("user_name") kalau ada
      };

      setUser(userData);
      setLoading(false);
    };

    verifyAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant font-body-md">Memuat...</p>
        </div>
      </div>
    );
  }

  // Belum login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Cek role permission
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Simpan ke localStorage agar komponen lain bisa akses
  localStorage.setItem("user_name", user.name || user.username);
  localStorage.setItem("user_role", user.role);

  return children;
}

export default ProtectedRoute;
