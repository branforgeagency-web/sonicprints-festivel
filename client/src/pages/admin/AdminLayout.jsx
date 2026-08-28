import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

const LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/enquiries", label: "Bulk enquiries" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/settings", label: "Site settings" }
];

export default function AdminLayout() {
  const { admin, checking, logout } = useAdminAuth();

  if (checking) return null;
  if (!admin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <h1>Sonic Prints</h1>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "active" : "")}>
              {l.label}
            </NavLink>
          ))}
          <div className="spacer" />
          <div style={{ fontSize: 12.5, color: "#8FA7A3", padding: "0 8px 8px" }}>{admin.email}</div>
          <button className="linklike" onClick={logout}>Sign out</button>
        </aside>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
