import AdminLayout from "../components/admin/AdminLayout";
import StatCard from "../components/admin/StatCard";

export default function LaporanExport() {
  return (
    <AdminLayout title="Laporan & Export" showBack>
      {/* Section 1: Date Range Selector */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-card p-4 space-y-4">
        <h2 className="font-label-lg text-label-lg text-on-surface-variant">
          Pilih Periode Laporan
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface-variant">
              Dari Tanggal
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">
                calendar_month
              </span>
              <input
                className="w-full h-touch-target-min pl-10 border border-outline-variant rounded-ui-element bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary text-body-md outline-none"
                type="date"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface-variant">
              Sampai Tanggal
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">
                calendar_month
              </span>
              <input
                className="w-full h-touch-target-min pl-10 border border-outline-variant rounded-ui-element bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary text-body-md outline-none"
                type="date"
              />
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <label className="font-label-md text-label-md text-on-surface-variant">
            Batch
          </label>
          <select className="w-full h-touch-target-min border border-outline-variant rounded-ui-element bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none text-body-md px-4">
            <option>Batch #3 (Aktif)</option>
            <option>Batch #2 (Selesai)</option>
            <option>Batch #1 (Selesai)</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <button className="px-4 py-2 rounded-full border border-outline-variant text-label-lg hover:bg-surface-container-low transition-colors">
            7 Hari
          </button>
          <button className="px-4 py-2 rounded-full border border-outline-variant text-label-lg hover:bg-surface-container-low transition-colors">
            30 Hari
          </button>
          <button className="px-4 py-2 rounded-full bg-primary-container text-on-primary-container text-label-lg font-bold">
            Batch Ini
          </button>
        </div>
        <button className="w-full h-touch-target-min bg-primary text-on-primary font-label-lg rounded-ui-element active:scale-[0.98] transition-transform shadow-md mt-2 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[20px]">
            visibility
          </span>
          Tampilkan Preview
        </button>
      </section>

      {/* Section 2: Summary Stats Preview — pakai StatCard */}
      <section className="grid grid-cols-2 gap-3">
        <StatCard
          icon="grass"
          label="Total Pakan"
          value="2,450 kg"
          color="primary"
        />
        <StatCard
          icon="favorite_border"
          label="Total Kematian"
          value="127 ekor"
          color="error"
        />
        <StatCard
          icon="trending_up"
          label="Rata-rata FCR"
          value="1.82"
          color="primary"
        />
        <StatCard
          icon="pets"
          label="Ayam Hidup"
          value="14,873 ekor"
          color="primary"
        />
        <StatCard
          icon="percent"
          label="Efisiensi Pakan"
          value="94.2%"
          color="primary"
          badge={{ text: "BAIK", color: "surface-container" }}
        />
        <StatCard
          icon="show_chart"
          label="Deplesi"
          value="0.85%"
          color="on-surface"
        />
      </section>

      {/* Section 3: Chart Preview Card */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-card p-4">
        <div className="flex justify-between items-center mb-1">
          <h2 className="font-headline-sm text-headline-sm">
            Grafik Kematian Harian
          </h2>
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">
            tune
          </button>
        </div>
        <p className="font-label-md text-label-md text-outline mb-6">
          7 hari terakhir
        </p>
        <div className="h-40 flex items-end justify-between gap-2 px-2 pb-6 border-b border-outline-variant relative">
          {/* Bar Chart (7 bars) */}
          <div className="w-full bg-primary/20 rounded-t h-[30%] custom-chart-bar transition-all duration-500" />
          <div className="w-full bg-primary/20 rounded-t h-[45%] custom-chart-bar transition-all duration-500" />
          <div className="w-full bg-primary/20 rounded-t h-[35%] custom-chart-bar transition-all duration-500" />
          {/* Peak bar with error color */}
          <div className="w-full bg-error/80 rounded-t h-[95%] custom-chart-bar transition-all duration-500" />
          <div className="w-full bg-primary/20 rounded-t h-[25%] custom-chart-bar transition-all duration-500" />
          <div className="w-full bg-primary/20 rounded-t h-[40%] custom-chart-bar transition-all duration-500" />
          <div className="w-full bg-primary/20 rounded-t h-[30%] custom-chart-bar transition-all duration-500" />
          {/* Simple Y-axis markings */}
          <div className="absolute left-[-1.5rem] top-0 bottom-6 flex flex-col justify-between text-[10px] text-outline">
            <span>10</span>
            <span>5</span>
            <span>0</span>
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-outline pt-2 px-1">
          <span>04 Jan</span>
          <span>07 Jan</span>
          <span>10 Jan</span>
        </div>
      </section>

      {/* Section 4: Floor Comparison Table */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-card overflow-hidden">
        <div className="p-4 border-b border-outline-variant">
          <h2 className="font-label-lg text-label-lg">Perbandingan Lantai</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container text-label-md text-on-surface-variant">
            <tr>
              <th className="py-2 px-4 font-semibold">Lantai</th>
              <th className="py-2 px-4 font-semibold">Populasi</th>
              <th className="py-2 px-4 font-semibold">Kematian</th>
              <th className="py-2 px-4 font-semibold">FCR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant text-body-md">
            <tr className="hover:bg-surface-container-low transition-colors">
              <td className="py-3 px-4 border-l-4 border-primary">Lantai 1</td>
              <td className="py-3 px-4">5,000</td>
              <td className="py-3 px-4 text-error font-medium">42</td>
              <td className="py-3 px-4">1.78</td>
            </tr>
            <tr className="hover:bg-surface-container-low transition-colors">
              <td className="py-3 px-4 border-l-4 border-secondary-container">
                Lantai 2
              </td>
              <td className="py-3 px-4">4,950</td>
              <td className="py-3 px-4 text-error font-medium">38</td>
              <td className="py-3 px-4">1.84</td>
            </tr>
            <tr className="hover:bg-surface-container-low transition-colors">
              <td className="py-3 px-4 border-l-4 border-tertiary">Lantai 3</td>
              <td className="py-3 px-4">4,923</td>
              <td className="py-3 px-4 text-error font-medium">47</td>
              <td className="py-3 px-4">1.85</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 5: Export Options (List style) */}
      <section className="space-y-2">
        <h2 className="font-label-lg text-label-lg text-outline tracking-widest pt-2">
          EXPORT DATA
        </h2>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-card overflow-hidden">
          <div className="flex items-center h-16 px-4 gap-4 border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-green-700 text-[20px]">
                description
              </span>
            </div>
            <div className="flex-1">
              <p className="font-label-lg text-label-lg text-on-surface">
                Excel Spreadsheet
              </p>
              <p className="text-[11px] text-on-surface-variant">
                Laporan mendalam .xlsx
              </p>
            </div>
            <button className="px-3 py-1.5 border border-green-700 text-green-700 text-[12px] font-bold rounded-ui-element active:scale-95 transition-transform">
              Download
            </button>
          </div>
          <div className="flex items-center h-16 px-4 gap-4 border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-red-700 text-[20px]">
                picture_as_pdf
              </span>
            </div>
            <div className="flex-1">
              <p className="font-label-lg text-label-lg text-on-surface">
                Dokumen PDF
              </p>
              <p className="text-[11px] text-on-surface-variant">
                Siap cetak & arsip .pdf
              </p>
            </div>
            <button className="px-3 py-1.5 border border-red-700 text-red-700 text-[12px] font-bold rounded-ui-element active:scale-95 transition-transform">
              Download
            </button>
          </div>
          <div className="flex items-center h-16 px-4 gap-4 hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-amber-700 text-[20px]">
                csv
              </span>
            </div>
            <div className="flex-1">
              <p className="font-label-lg text-label-lg text-on-surface">
                Raw CSV Data
              </p>
              <p className="text-[11px] text-on-surface-variant">
                Integrasi sistem .csv
              </p>
            </div>
            <button className="px-3 py-1.5 border border-amber-700 text-amber-700 text-[12px] font-bold rounded-ui-element active:scale-95 transition-transform">
              Download
            </button>
          </div>
        </div>
      </section>

      {/* Section 6: Scheduled Reports */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-card overflow-hidden mb-8">
        <div className="p-4 flex justify-between items-center border-b border-outline-variant">
          <h2 className="font-headline-sm text-headline-sm">
            Laporan Otomatis
          </h2>
          <label className="relative inline-flex items-center cursor-pointer">
            <input defaultChecked className="sr-only peer" type="checkbox" />
            <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>
        <div className="divide-y divide-outline-variant">
          <div className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="flex gap-4 items-center">
              <span className="material-symbols-outlined text-outline">
                event_repeat
              </span>
              <div>
                <p className="font-label-lg text-label-lg">Laporan Mingguan</p>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  Setiap Senin, 06:00 WIB • Email Aktif
                </p>
              </div>
            </div>
            <button className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-variant transition-colors">
              edit
            </button>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="flex gap-4 items-center">
              <span className="material-symbols-outlined text-outline">
                calendar_month
              </span>
              <div>
                <p className="font-label-lg text-label-lg">Laporan Bulanan</p>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  Setiap Tgl 1, 07:00 WIB • Email Aktif
                </p>
              </div>
            </div>
            <button className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-variant transition-colors">
              edit
            </button>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
