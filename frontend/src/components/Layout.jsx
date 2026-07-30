import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Layout({ children, title, hideFab = false, hideNav = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [notifCount] = useState(2);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const role = localStorage.getItem("role");
        const username = localStorage.getItem("username");

        if (token) {
          const userData = {
            username: username,
            role: role,
            name: username,
          };
          setUser(userData);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Beranda", icon: "home", iconFilled: "home" },
    {
      path: "/input",
      label: "Input",
      icon: "add_circle",
      iconFilled: "add_circle",
    },
    {
      path: "/riwayat",
      label: "Riwayat",
      icon: "history",
      iconFilled: "history",
    },
    { path: "/profil", label: "Profil", icon: "person", iconFilled: "person" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen pb-24">
      {/* TopAppBar */}
      {!hideNav && (
        <header className="sticky top-0 w-full flex justify-between items-center px-gutter h-touch-target-min bg-surface border-b border-outline-variant z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden border border-outline-variant">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt="Profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-on-primary-fixed">
                  person
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm-mobile text-headline-sm-mobile font-bold text-primary">
                {title || "Lantai 1 • Kandang A"}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="relative w-touch-target-min h-touch-target-min flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant">
              notifications
            </span>
            {notifCount > 0 && (
              <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface"></div>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="px-margin-mobile pt-stack-lg space-y-stack-lg">
        {children}
      </main>

      {/* FAB */}
      {!hideFab && (
        <div className="fixed bottom-24 right-margin-mobile z-50">
          <button
            onClick={() => navigate("/input")}
            className="w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-lg flex items-center justify-center active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[32px]">add</span>
          </button>
        </div>
      )}

      {/* BottomNavBar */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-[64px] bg-surface px-margin-mobile pb-safe border-t border-outline-variant z-50">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center transition-transform duration-150 ${
                  active
                    ? "text-primary font-bold scale-90"
                    : "text-on-surface-variant"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {active ? item.iconFilled : item.icon}
                </span>
                <span className="font-label-md text-label-md">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export default Layout;
