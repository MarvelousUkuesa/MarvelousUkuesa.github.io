"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearAdminSession,
  getAdminEmail,
  getAdminToken,
  loginAdmin,
} from "@/lib/admin/auth";

type AdminAuthValue = {
  ready: boolean;
  email: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getAdminToken());
    setEmail(getAdminEmail());
    setReady(true);
  }, []);

  const login = useCallback(async (userEmail: string, password: string) => {
    const idToken = await loginAdmin(userEmail, password);
    setToken(idToken);
    setEmail(userEmail);
  }, []);

  const logout = useCallback(() => {
    clearAdminSession();
    setToken(null);
    setEmail(null);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      email,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [ready, email, token, login, logout],
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
