import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import "@/admin.css";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/properties", label: "Properties" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/property-types", label: "Property Types" },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-brand">Brickstone Admin</div>
          <nav>
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <p className="admin-user-pill">
            {admin?.username}
            <br />
            <button
              type="button"
              className="admin-btn admin-btn-outline"
              style={{ marginTop: "0.75rem", width: "100%" }}
              onClick={() => {
                logout();
                navigate("/admin/login", { replace: true });
              }}
            >
              Sign out
            </button>
          </p>
        </aside>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
