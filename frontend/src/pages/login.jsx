import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Wajib import useNavigate

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // 2. Inisialisasi fungsi navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // --- LOGIKA ALGORITMA LOGIN ---

    try {
      let data = null;

      if (username === "admin" && password === "admin123") {
        data = {
          token: "mock-jwt-token-admin",
          role: "admin",
          username: "SuperAdmin",
        };
      } else if (username === "worker" && password === "worker123") {
        data = {
          token: "mock-jwt-token-worker",
          role: "worker",
          username: "RianWorker",
        };
      } else {
        setError(
          "Username atau password salah! (Gunakan: admin/admin123 atau worker/worker123)",
        );
        return;
      }

      // 3. Simpan data ke localStorage agar bisa dibaca oleh ProtectedRoute kamu
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);

      // 4. ✅ KODE KAMU BERHASIL DIGABUNGKAN DI SINI
      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/worker/dashboard");
      }
    } catch (err) {
      setError("Gagal terhubung ke server.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
          Masuk Akun
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full border rounded p-2 focus:outline-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border rounded p-2 focus:outline-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
