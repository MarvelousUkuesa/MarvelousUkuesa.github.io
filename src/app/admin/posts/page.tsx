"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PostRow = {
  slug: string;
  title: string;
  draft?: boolean;
  gallery?: string[];
  date?: string;
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
    fetch(`${base}/posts?all=1`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load");
        setPosts(data.posts ?? []);
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
          <h1>Blog posts</h1>
          <p className="admin-card__lede">Edit posts and their photo galleries.</p>
        </div>
        <Link href="/admin/posts/new" className="btn btn--primary">
          New post
        </Link>
      </div>

      {loading ? <p className="admin-status">Loading…</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}

      {!loading && posts.length === 0 ? (
        <p className="admin-status">No posts yet.</p>
      ) : (
        <ul className="admin-list">
          {posts.map((p) => (
            <li key={p.slug}>
              <div>
                <strong>{p.title}</strong>
                <span className="admin-list__meta">
                  {p.draft ? "Draft · " : ""}
                  {p.date ?? ""} · {p.gallery?.length ?? 0} photos
                </span>
              </div>
              <Link href={`/admin/posts/edit/?slug=${encodeURIComponent(p.slug)}`}>
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
