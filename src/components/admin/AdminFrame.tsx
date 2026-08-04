"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "@/components/admin/AdminAuthProvider";

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function AdminShell({ children }: { children: ReactNode }) {
  const { ready, isAuthenticated, email, logout } = useAdminAuth();
  const pathname = normalizePath(usePathname() ?? "");
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated && !isLogin) {
      router.replace("/admin/login/");
    }
    if (isAuthenticated && isLogin) {
      router.replace("/admin/");
    }
  }, [ready, isAuthenticated, isLogin, router]);

  if (!ready) {
    return <p className="admin-status">Loading admin…</p>;
  }

  if (!isAuthenticated && !isLogin) {
    return <p className="admin-status">Redirecting to login…</p>;
  }

  return (
    <div className="admin">
      <header className="admin__header">
        <div className="admin__brand">
          <Link href="/admin">Admin</Link>
          <span className="admin__hint">private · Cognito</span>
        </div>
        {isAuthenticated ? (
          <div className="admin__user">
            <span>{email}</span>
            <nav className="admin__nav">
              <Link href="/admin">Dashboard</Link>
              <Link href="/admin/projects">Projects</Link>
              <Link href="/admin/posts">Posts</Link>
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
