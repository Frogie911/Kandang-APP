import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { path: "/admin/batch", label: "Batch", icon: "inventory_2" },
  { path: "/admin/laporan", label: "Laporan", icon: "assessment" },
  { path: "/admin/pengguna", label: "Pengguna", icon: "group" },
  { path: "/admin/pengaturan", label: "Pengaturan", icon: "settings" },
];

export default function AdminLayout({
  children,
  title,
  showBack,
  rightAction,
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-primary-container text-on-primary-container h-nav-item-height px-margin-mobile flex justify-between items-center shadow-none">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="active:scale-95 transition-transform p-2 -ml-2 rounded-full hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-[24px]">
                arrow_back
              </span>
            </button>
          )}
          {!showBack && (
            <button className="active:scale-95 transition-transform p-2 -ml-2 rounded-full hover:bg-white/10 md:hidden">
              <span className="material-symbols-outlined text-[24px]">
                menu
              </span>
            </button>
          )}
          <h1 className="font-label-lg text-label-lg uppercase tracking-wider">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {rightAction}
          <span className="material-symbols-outlined text-[24px] cursor-pointer active:opacity-80">
            notifications
          </span>
          <img
            alt="Admin"
            className="w-8 h-8 rounded-full border border-on-primary-container/20"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMPvKEnNkxvsmPUr4C2xGrV93uWXB9ev2Q-pJdGnr460ZfXpPH54eformku-9LZypAwYPfX-l1CxJ1LDRKfTG97WfhY9tbkq1mvQqvmCgv7M5SqTeF357TQnFzmvjg8LRG7LNHrGjKi38WGc9WUBokXQhMMeR18rrR7hzvsl7RN0XJ7iAOnSBWeX0NNEyuHnCDlJ28AvY3ZFXsA4Psych8csiHT72NQKQehSOk08mSQ3_HWaGp1J8XzGoaa-Hd5IQet0WdABQ3Fw"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20 pb-24 px-margin-mobile space-y-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-50 h-nav-item-height bg-surface border-t border-outline-variant flex justify-around items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center h-full w-full transition-all duration-150 active:scale-90 ${
                isActive
                  ? "text-on-secondary-container"
                  : "text-on-surface-variant hover:text-primary"
              }`
            }
          >
            {({ isActive }) => (
              <div
                className={`flex flex-col items-center justify-center px-4 py-1 rounded-full transition-all ${isActive ? "bg-secondary-container" : ""}`}
              >
                <span
                  className="material-symbols-outlined"
                  style={
                    isActive
                      ? {
                          fontVariationSettings:
                            "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                        }
                      : {
                          fontVariationSettings:
                            "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                        }
                  }
                >
                  {item.icon}
                </span>
                <span className="font-label-md mt-0.5">{item.label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
