import { useState, useEffect } from "react";
import { NavLink, Navigate, Outlet, Link } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import Icon from "../../components/Icon.jsx";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: "sparkle", end: true },
  { to: "/admin/orders", label: "Orders", icon: "cart" },
  { to: "/admin/enquiries", label: "Bulk Enquiries", icon: "mail" },
  { to: "/admin/products", label: "Products Catalog", icon: "eye" },
  { to: "/admin/settings", label: "Site Settings", icon: "check" }
];

export default function AdminLayout() {
  const { admin, checking, logout } = useAdminAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("admin-theme") || "light");

  useEffect(() => {
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  if (checking) return null;
  if (!admin) return <Navigate to="/admin/login" replace />;

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <div className={`admin luxury-admin theme-${theme}`}>
      <div className="admin-shell">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <span className="admin-brand-icon">✦</span>
            <div>
              <h1 className="admin-brand-title">Sonic Prints</h1>
              <span className="admin-brand-badge">Executive Suite</span>
            </div>
          </div>

          <nav className="admin-nav">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
              >
                <span className="admin-nav-icon"><Icon name={l.icon} size={16} /></span>
                <span>{l.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="spacer" />

          <div className="admin-sidebar-footer">
            <button className="admin-theme-toggle-btn" onClick={toggleTheme} title="Switch Theme">
              <span>{theme === "light" ? "☀️ Light Gold Theme" : "🌙 Dark Obsidian Theme"}</span>
              <span className="theme-badge">{theme === "light" ? "Light" : "Dark"}</span>
            </button>

            <div className="admin-user-info">
              <div className="admin-avatar">
                {(admin.name || admin.email || "A")[0].toUpperCase()}
              </div>
              <div className="admin-user-details">
                <span className="admin-user-name">{admin.name || "Administrator"}</span>
                <span className="admin-user-email">{admin.email}</span>
              </div>
            </div>

            <div className="admin-sidebar-actions">
              <Link to="/" target="_blank" rel="noreferrer" className="admin-btn-store">
                <Icon name="eye" size={14} /> Storefront ↗
              </Link>
              <button className="admin-btn-logout" onClick={logout} title="Sign Out">
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="admin-content-wrap">
          {/* Top Bar Header */}
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              <span className="admin-topbar-date">🗓️ {todayStr}</span>
              <span className="admin-topbar-pill">Live Executive Suite</span>
            </div>
            <div className="admin-topbar-right">
              <button className="admin-theme-pill-btn" onClick={toggleTheme}>
                {theme === "light" ? "🌙 Switch to Dark Mode" : "☀️ Switch to Light Gold Mode"}
              </button>
              <Link to="/" target="_blank" rel="noreferrer" className="admin-topbar-link">
                View Live Storefront ↗
              </Link>
            </div>
          </header>

          <main className="admin-main">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
