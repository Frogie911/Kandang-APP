import { useState } from "react";

function KematianForm({ form, setForm, onSubmit, loading, onBack }) {
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoError, setFotoError] = useState("");

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFotoError("Ukuran file maksimal 5MB");
      return;
    }

    // Validasi tipe
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setFotoError("Format harus JPG atau PNG");
      return;
    }

    setFotoError("");
    setForm({ ...form, foto: file });

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setFotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmitWithValidation = (e) => {
    e.preventDefault();
    if (!form.foto && !fotoPreview) {
      setFotoError("Foto bukti wajib diupload");
      return;
    }
    onSubmit(e);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* TopAppBar */}
      <header className="sticky top-0 w-full flex justify-between items-center px-gutter h-touch-target-min bg-surface z-50 border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              arrow_back
            </span>
          </button>
          <h1 className="font-headline-sm-mobile text-headline-sm-mobile font-bold text-primary">
            Laporkan Ayam Mati / Afkir
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant">
            notifications
          </span>
          <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden">
            <img
              alt="Profil"
              src="https://i.pravatar.cc/150?img=12"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      <main className="px-margin-mobile pt-stack-md flex flex-col gap-stack-md">
        {/* Location Badge */}
        <div className="flex ml-4 mb-3">
          <div className="bg-[#CCFBF1] text-[#0D9488] rounded-full px-3 py-1.5 text-[12px] font-medium inline-flex items-center">
            <span>📍 Lantai 1 — Area Tugas Anda 🔒</span>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-secondary-container text-on-secondary-container p-4 rounded-xl flex items-start gap-3 border border-secondary">
          <span
            className="material-symbols-outlined shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
          <p className="font-label-lg text-label-lg">
            Data ini akan mengurangi jumlah ayam hidup secara otomatis.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmitWithValidation}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl p-gutter shadow-sm"
        >
          {/* Segmented Control Mati/Afkir */}
          <div className="mb-stack-lg">
            <label className="font-label-lg text-label-lg mb-stack-sm block text-on-surface-variant">
              Jenis Laporan
            </label>
            <div className="flex bg-surface-container-high p-1 rounded-lg">
              {["mati", "afkir"].map((opt) => (
                <label key={opt} className="flex-1 relative cursor-pointer">
                  <input
                    type="radio"
                    name="report_type"
                    value={opt}
                    checked={form.jenis === opt}
                    onChange={(e) =>
                      setForm({ ...form, jenis: e.target.value })
                    }
                    className="peer sr-only"
                  />
                  <div
                    className={`flex items-center justify-center py-2.5 rounded-md font-bold text-on-surface-variant transition-all peer-checked:bg-primary peer-checked:text-on-primary`}
                  >
                    {opt === "mati" ? "Mati" : "Afkir"}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Number Input */}
          <div className="mb-stack-lg">
            <label className="font-label-lg text-label-lg mb-stack-sm block text-on-surface-variant">
              Jumlah Ayam (Ekor)
            </label>
            <div className="relative">
              <input
                type="number"
                value={form.jumlah}
                onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                className="w-full h-16 bg-surface border border-outline-variant rounded-lg px-gutter font-headline-md text-headline-md text-center focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="0"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="text-on-surface-variant font-label-lg">
                  Ekor
                </span>
              </div>
            </div>
          </div>

          {/* Foto Bukti — WAJIB */}
          <div className="mb-stack-lg">
            <label className="font-label-lg text-label-lg mb-stack-sm block text-on-surface-variant">
              Foto Bukti <span className="text-error">*</span>
            </label>

            {fotoPreview ? (
              <div className="relative w-full h-[200px] rounded-xl overflow-hidden border border-outline-variant">
                <img
                  src={fotoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFotoPreview(null);
                    setForm({ ...form, foto: null });
                    setFotoError("");
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-error text-on-error rounded-full flex items-center justify-center shadow-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    close
                  </span>
                </button>
              </div>
            ) : (
              <label className="w-full h-[200px] border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-2 bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFotoChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-primary-fixed-dim flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    photo_camera
                  </span>
                </div>
                <p className="font-label-lg text-label-lg text-on-surface-variant">
                  Ambil Foto atau Upload
                </p>
                <p className="font-label-md text-label-md text-outline">
                  Maks. 5MB (JPG, PNG)
                </p>
              </label>
            )}

            {fotoError && (
              <p className="mt-2 text-error font-label-md text-label-md flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  error
                </span>
                {fotoError}
              </p>
            )}
          </div>

          {/* Keterangan */}
          <div className="mb-stack-lg">
            <label className="font-label-lg text-label-lg mb-stack-sm block text-on-surface-variant">
              Keterangan (Opsional)
            </label>
            <textarea
              value={form.keterangan}
              onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
              className="w-full bg-surface border border-outline-variant rounded-lg p-gutter focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="Contoh: Ayam ditemukan di sudut kandang, kondisi lemas..."
              rows={3}
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-touch-target-min bg-error text-on-error font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-on-error border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined">send</span>
                Kirim Laporan
              </>
            )}
          </button>
        </form>

        {/* History Preview */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Laporan Hari Ini
            </h3>
            <span className="text-primary font-label-lg cursor-pointer">
              Lihat Semua
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded text-[10px] font-bold">
                  MATI
                </span>
                <span className="text-outline text-[10px]">08:45</span>
              </div>
              <p className="font-headline-md text-headline-md text-error">
                12 <span className="text-label-md">Ekor</span>
              </p>
              <p className="text-label-md text-on-surface-variant">
                Lantai 1 • Blok B
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[10px] font-bold">
                  AFKIR
                </span>
                <span className="text-outline text-[10px]">07:20</span>
              </div>
              <p className="font-headline-md text-headline-md text-secondary">
                05 <span className="text-label-md">Ekor</span>
              </p>
              <p className="text-label-md text-on-surface-variant">
                Lantai 2 • Blok A
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default KematianForm;
