import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Navigate, Outlet } from "react-router";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  const login = useCallback((newToken, newRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      role,
      isAuthenticated: !!token,
      isAdmin: role === "admin",
      login,
      logout,
    }),
    [token, role, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Co-locate the hook with its provider; the provider is rarely edited, so Fast
// Refresh is unaffected in practice.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RequireAdmin() {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
