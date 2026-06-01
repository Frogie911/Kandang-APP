const API_URL = "https://kandang-app-production.up.railway.app";
const getToken = () => localStorage.getItem("token");

const api = {
  getRecords: async () => {
    const res = await fetch(`${API_URL}/api/records`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal ambil data");
    return res.json();
  },

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

  createDeathReport: async (data, fotoFile) => {
    const formData = new FormData();
    formData.append("jumlah", data.jumlah);
    formData.append("penyebab", data.penyebab);
    formData.append("keterangan", data.keterangan);
    if (fotoFile) {
      formData.append("photo", fotoFile);
    }

    const res = await fetch(`${API_URL}/api/records/kematian`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        // JANGAN set Content-Type manual!
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Gagal simpan laporan kematian");
    }
    return res.json();
  },

  getDashboard: async () => {
    const res = await fetch(`${API_URL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal ambil dashboard");
    return res.json();
  },
};

export default api;
