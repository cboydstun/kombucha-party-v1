import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/admin/dashboard", label: "Overview", icon: "📊" },
  { to: "/admin/orders", label: "Orders", icon: "📦" },
  { to: "/admin/blogs", label: "Blogs", icon: "📝" },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-purple-100 text-purple-700"
      : "text-gray-700 hover:bg-gray-100 hover:text-purple-700"
  }`;

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <aside className="w-full shrink-0 sm:w-56">
      <nav className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
        <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Admin
        </p>

        <div className="flex flex-col gap-1">
          {links.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <span aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </div>

        <hr className="my-3 border-gray-200" />

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-purple-700"
        >
          <span aria-hidden="true">🚪</span>
          Logout
        </button>
      </nav>
    </aside>
  );
}
