"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { isAdminConfigured } from "@/lib/admin/auth";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const configured = isAdminConfigured();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await login(email.trim(), password);
      router.replace("/admin/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="admin-card">
      <h1>Admin sign in</h1>
      <p className="admin-card__lede">
        Cognito-protected area for creating projects and blog posts.
      </p>

      {!configured ? (
        <p className="admin-error">
          Missing Cognito env vars. Add{" "}
          <code>NEXT_PUBLIC_COGNITO_USER_POOL_ID</code>,{" "}
          <code>NEXT_PUBLIC_COGNITO_CLIENT_ID</code>, and{" "}
          <code>NEXT_PUBLIC_COGNITO_REGION</code> to <code>.env.local</code>.
        </p>
      ) : (
        <form className="admin-form" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error ? <p className="admin-error">{error}</p> : null}
          <button type="submit" className="btn btn--primary" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      )}
    </section>
  );
}
