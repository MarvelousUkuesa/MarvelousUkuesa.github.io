"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import { adminFetch } from "@/lib/admin/auth";

type PostFormProps = {
  mode: "create" | "edit";
  slug?: string;
};

export function PostForm({ mode, slug }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === "edit");
  const [title, setTitle] = useState("");
  const [slugInput, setSlugInput] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [relatedProjectId, setRelatedProjectId] = useState("");
  const [draft, setDraft] = useState(false);
  const [gallery, setGallery] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !slug) return;
    let cancelled = false;
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
        const res = await fetch(
          `${base}/posts/${encodeURIComponent(slug)}?all=1`,
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load post");
        if (cancelled) return;
        const p = data.post as {
          slug?: string;
          title?: string;
          summary?: string;
          tags?: string[];
          content?: string;
          draft?: boolean;
          gallery?: string[];
          relatedProjectId?: string;
        };
        setTitle(p.title ?? "");
        setSlugInput(p.slug ?? "");
        setSummary(p.summary ?? "");
        setTags((p.tags ?? []).join(", "));
        setContent(p.content ?? "");
        setRelatedProjectId(p.relatedProjectId ?? "");
        setDraft(Boolean(p.draft));
        setGallery(p.gallery ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, slug]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const body = {
      title,
      slug: slugInput || undefined,
      summary,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      content,
      relatedProjectId: relatedProjectId.trim(),
      draft,
      gallery,
      date: new Date().toISOString().slice(0, 10),
    };

    try {
      const res =
        mode === "create"
          ? await adminFetch("/posts", {
              method: "POST",
              body: JSON.stringify(body),
            })
          : await adminFetch(`/posts/${encodeURIComponent(slug!)}`, {
              method: "PUT",
              body: JSON.stringify(body),
            });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setPending(false);
    }
  }

  async function onDelete() {
    if (!slug || !confirm("Delete this post?")) return;
    setPending(true);
    try {
      const res = await adminFetch(`/posts/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed");
      }
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setPending(false);
    }
  }

  if (loading) return <p className="admin-status">Loading post…</p>;

  return (
    <section className="admin-card">
      <h1>{mode === "create" ? "New blog post" : "Edit blog post"}</h1>
      <p className="admin-card__lede">
        Body accepts <strong>HTML</strong> and Markdown. Title and summary are
        rendered by the page chrome — start the body at the first{" "}
        <code>&lt;p&gt;</code> or <code>&lt;h2&gt;</code>, not another{" "}
        <code>&lt;h1&gt;</code> / <code>&lt;article&gt;</code>.
      </p>
      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Slug {mode === "edit" ? "(locked)" : "(optional)"}
          <input
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            placeholder="auto-from-title"
            disabled={mode === "edit"}
          />
        </label>
        <label>
          Summary
          <textarea
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </label>
        <label>
          Tags (comma-separated)
          <input value={tags} onChange={(e) => setTags(e.target.value)} />
        </label>
        <label>
          Related project slug
          <input
            value={relatedProjectId}
            onChange={(e) => setRelatedProjectId(e.target.value)}
            placeholder="multi-agent-orchestration"
          />
        </label>
        <label>
          Content (HTML or Markdown)
          <textarea
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            spellCheck={false}
            className="font-mono text-sm"
            placeholder={`<h2>Key Features</h2>
<p>A short intro paragraph…</p>
<ul>
  <li><strong>Stripe Checkout</strong> — secure payments</li>
  <li>Digital e-tickets with QR codes</li>
</ul>
<table>
  <thead><tr><th>Step</th><th>Feature</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Donation modal</td></tr>
  </tbody>
</table>`}
          />
        </label>
        <p className="admin-hint">
          Use: <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>,{" "}
          <code>&lt;ul&gt;</code>, <code>&lt;table&gt;</code>,{" "}
          <code>&lt;pre&gt;&lt;code class=&quot;language-python&quot;&gt;</code>.
          Skip <code>&lt;article&gt;</code>, <code>&lt;header&gt;</code>, and a
          second title — those already come from the site layout. Scripts are
          stripped on the public page.
        </p>
        <label className="admin-check">
          <input
            type="checkbox"
            checked={draft}
            onChange={(e) => setDraft(e.target.checked)}
          />
          Save as draft (hidden on public site)
        </label>

        <GalleryEditor value={gallery} onChange={setGallery} />

        {error ? <p className="admin-error">{error}</p> : null}
        <div className="admin-actions">
          <button type="submit" className="btn btn--primary" disabled={pending}>
            {pending
              ? "Saving…"
              : mode === "create"
                ? "Publish post"
                : "Save changes"}
          </button>
          <Link href="/admin/posts" className="btn btn--ghost">
            Cancel
          </Link>
          {mode === "edit" ? (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => void onDelete()}
              disabled={pending}
            >
              Delete
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
