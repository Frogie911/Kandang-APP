import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://kandang-app-production.up.railway.app";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }

      // Simpan token & role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // Redirect berdasarkan role
      if (data.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/worker/dashboard");
      }
    } catch (err) {
      setError("Tidak bisa konek ke server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-margin-mobile">
      {/* Logo & Tagline */}
      <div className="flex flex-col items-center mb-stack-lg text-center">
        <div className="w-24 h-24 mb-stack-sm flex items-center justify-center bg-primary-container rounded-full overflow-hidden shadow-sm">
          <span className="material-symbols-outlined text-on-primary-container text-[48px]">
            agriculture
          </span>
        </div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          SiPoultry
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Monitoring Kandang Digital
        </p>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-surface-container-lowest rounded-xl border border-outline-variant p-stack-lg shadow-sm space-y-stack-md"
      >
        {/* Error Message */}
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-lg text-body-md border border-error">
            {error}
          </div>
        )}

        {/* Username Field */}
        <div className="space-y-stack-sm">
          <label className="block font-label-lg text-label-lg text-on-surface-variant px-1">
            Username
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-outline">
              alternate_email
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full h-touch-target-min pl-12 pr-4 bg-surface border border-outline-variant rounded-lg font-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-stack-sm">
          <label className="block font-label-lg text-label-lg text-on-surface-variant px-1">
            Password
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-outline">
              lock
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full h-touch-target-min pl-12 pr-12 bg-surface border border-outline-variant rounded-lg font-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-touch-target-min bg-primary text-on-primary font-label-lg rounded-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? "Memproses..." : "Masuk"}
          {!loading && (
            <span className="material-symbols-outlined text-[20px]">login</span>
          )}
        </button>
      </form>

      {/* Footer */}
      <footer className="mt-auto py-stack-md">
        <p className="font-label-md text-label-md text-outline-variant">
          © 2024 SiPoultry v2.4.0
        </p>
      </footer>
    </div>
  );
}

export default Login;
