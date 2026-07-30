"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <section className="admin-card">
      <h1>Dashboard</h1>
      <p className="admin-card__lede">
        Create and edit projects and blog posts — including photo galleries.
      </p>
      <div className="admin-actions">
        <Link href="/admin/projects" className="btn btn--primary">
          Manage projects
        </Link>
        <Link href="/admin/posts" className="btn btn--ghost">
          Manage posts
        </Link>
      </div>
      <ul className="admin-help">
        <li>
          Open a project or post → <strong>Edit</strong> → add/remove photos in
          the gallery section
        </li>
        <li>
          Public site: <Link href="/work">/work</Link> and{" "}
          <Link href="/blog">/blog</Link>
        </li>
        <li>
          Admin URL: <code>/admin</code>
        </li>
      </ul>
    </section>
  );
}
