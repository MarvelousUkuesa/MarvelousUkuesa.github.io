"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ProjectRow = {
  id: string;
  title: string;
  featured?: boolean;
  draft?: boolean;
  gallery?: string[];
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
    fetch(`${base}/projects?all=1`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load");
        setProjects(data.projects ?? []);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="admin-card">
      <div className="admin-card__row">
        <div>
          <h1>Projects</h1>
          <p className="admin-card__lede">Edit existing work or add a new project.</p>
        </div>
        <Link href="/admin/projects/new" className="btn btn--primary">
          New project
        </Link>
      </div>

      {loading ? <p className="admin-status">Loading…</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}

      {!loading && projects.length === 0 ? (
        <p className="admin-status">No projects yet.</p>
      ) : (
        <ul className="admin-list">
          {projects.map((p) => (
            <li key={p.id}>
              <div>
                <strong>{p.title}</strong>
                <span className="admin-list__meta">
                  {p.draft ? "Draft · " : p.featured ? "Featured · " : ""}
                  {p.id} · {p.gallery?.length ?? 0} photos
                </span>
              </div>
              <Link href={`/admin/projects/edit/?id=${encodeURIComponent(p.id)}`}>
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
