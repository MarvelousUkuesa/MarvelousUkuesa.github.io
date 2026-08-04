"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "@/components/admin/AdminAuthProvider";

function browserPath() {
  return typeof window !== "undefined" ? window.location.pathname : "";
}

function normalizePath(pathname: string) {
  const raw = pathname || "/";
  if (raw.length > 1 && raw.endsWith("/")) return raw.slice(0, -1);
  return raw;
}

function isLoginPath(pathname: string) {
  return normalizePath(pathname) === "/admin/login";
}

function AdminShell({ children }: { children: ReactNode }) {
  const { ready, isAuthenticated, email, logout } = useAdminAuth();
  const routerPath = usePathname() ?? "";
  const [here, setHere] = useState(routerPath);

  useEffect(() => {
    setHere(browserPath() || routerPath);
  }, [routerPath]);

  // Any signal that we are on the login route — never blank the form.
  const onLogin =
    isLoginPath(here) || isLoginPath(routerPath) || isLoginPath(browserPath());

  useEffect(() => {
    if (!ready) return;

    const url = browserPath();
    const login = isLoginPath(url) || isLoginPath(routerPath);

    if (!isAuthenticated && !login) {
      // Soft router.replace hangs on static GitHub Pages exports.
      window.location.replace("/admin/login/");
      return;
    }

    if (isAuthenticated && login) {
      window.location.replace("/admin/");
    }
  }, [ready, isAuthenticated, routerPath]);

  if (!ready) {
    return <p className="admin-status">Loading admin…</p>;
  }

  if (!isAuthenticated && !onLogin) {
    return <p className="admin-status">Redirecting to login…</p>;
  }

  return (
    <div className="admin">
      <header className="admin__header">
        <div className="admin__brand">
          <Link href="/admin/">Admin</Link>
          <span className="admin__hint">private · Cognito</span>
        </div>
        {isAuthenticated ? (
          <div className="admin__user">
            <span>{email}</span>
            <nav className="admin__nav">
              <Link href="/admin/">Dashboard</Link>
              <Link href="/admin/projects/">Projects</Link>
              <Link href="/admin/posts/">Posts</Link>
              <Link href="/">View site</Link>
              <button type="button" className="admin__logout" onClick={logout}>
                Sign out
              </button>
            </nav>
          </div>
        ) : null}
      </header>
      <div className="admin__body">{children}</div>
    </div>
  );
}

export function AdminFrame({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
