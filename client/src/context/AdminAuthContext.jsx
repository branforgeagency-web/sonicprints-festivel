import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { adminLogin, adminMe } from "../api/client.js";

const AdminAuthContext = createContext(null);
const TOKEN_KEY = "sonic_admin_token";

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setChecking(false);
      return;
    }
    adminMe()
      .then((r) => setAdmin(r.admin))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setChecking(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, admin } = await adminLogin(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setAdmin(admin);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setAdmin(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, checking, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
