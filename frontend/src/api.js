const API_URL = "https://kandang-app-production.up.railway.app";

const getToken = () => localStorage.getItem("token");

const api = {
  // GET semua records
  getRecords: async () => {
    const res = await fetch(`${API_URL}/api/records`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal ambil data");
    return res.json();
  },

  // POST record baru
  createRecord: async (data) => {
    const res = await fetch(`${API_URL}/api/records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal simpan data");
    return res.json();
  },

  // Upload kematian dengan foto (TAMBAHAN BARU)
  createDeathReport: async (data, photoFile) => {
    const formData = new FormData();
    formData.append("jumlah", data.jumlah);
    formData.append("penyebab", data.penyebab);
    formData.append("keterangan", data.keterangan);
    if (photoFile) {
      formData.append("photo", photoFile); // ← Multer akan terima sebagai req.file
    }

    const res = await fetch(`${API_URL}/api/records/kematian`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        // ⚠️ JANGAN set Content-Type: application/json
        // FormData akan set multipart/form-data otomatis
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Gagal simpan laporan kematian");
    return res.json();
  },

  // GET dashboard stats
  getDashboard: async () => {
    const res = await fetch(`${API_URL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal ambil dashboard");
    return res.json();
  },
};

export default api;
