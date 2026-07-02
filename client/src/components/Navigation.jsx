import { Link, NavLink, useNavigate } from "react-router";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition hover:text-purple-700 ${
    isActive ? "text-purple-700" : "text-gray-700"
  }`;

export default function Navigation() {
  const { count } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
      <Link
        to="/"
        className="font-display text-2xl font-bold tracking-tight text-purple-700"
      >
        🫧 Kombucha Party
      </Link>

      <div className="flex items-center gap-5 sm:gap-6">
        <NavLink to="/about" className={linkClass}>
          About
        </NavLink>
        <NavLink to="/blogs" className={linkClass}>
          Blogs
        </NavLink>
        <NavLink to="/faq" className={linkClass}>
          FAQ
        </NavLink>
        <NavLink to="/contact" className={linkClass}>
          Contact
        </NavLink>

        <NavLink
          to="/products"
          className="rounded-full bg-purple-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-800"
        >
          Shop all
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `flex items-center gap-1 text-sm font-medium transition hover:text-purple-700 ${
              isActive ? "text-purple-700" : "text-gray-700"
            }`
          }
        >
          Cart
          {count > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 px-1.5 text-xs font-semibold text-white">
              {count}
            </span>
          )}
        </NavLink>

        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-gray-700 transition hover:text-purple-700"
          >
            Logout
          </button>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
            <NavLink to="/register" className={linkClass}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
