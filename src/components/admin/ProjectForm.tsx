"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import { adminFetch } from "@/lib/admin/auth";
import { getApiUrl } from "@/config/publicApi";

type ProjectFormProps = {
  mode: "create" | "edit";
  projectId?: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function ProjectForm({ mode, projectId }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === "edit");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [gitRepo, setGitRepo] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [draft, setDraft] = useState(false);
  const [relatedProjectIds, setRelatedProjectIds] = useState("");
  const [relatedPostIds, setRelatedPostIds] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !projectId) return;
    let cancelled = false;
    (async () => {
      try {
        const base = getApiUrl();
        const res = await fetch(
          `${base}/projects/${encodeURIComponent(projectId)}?all=1`,
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load project");
        if (cancelled) return;
        const p = data.project as {
          title?: string;
          slug?: string;
          id?: string;
          description?: string;
          tech?: string[];
          gitRepo?: string;
          repoUrl?: string;
          demoUrl?: string;
          draft?: boolean;
          featured?: boolean;
          relatedProjectIds?: string[];
          relatedPostIds?: string[];
          gallery?: string[];
          image?: string;
        };
        setTitle(p.title ?? "");
        setSlug(p.slug ?? p.id ?? "");
        setDescription(p.description ?? "");
        setTech((p.tech ?? []).join(", "));
        setGitRepo(p.gitRepo || p.repoUrl || "");
        setDemoUrl(p.demoUrl ?? "");
        setDraft(
          p.draft !== undefined ? Boolean(p.draft) : p.featured === false,
        );
        setRelatedProjectIds((p.relatedProjectIds ?? []).join(", "));
        setRelatedPostIds((p.relatedPostIds ?? []).join(", "));
        setGallery(p.gallery ?? (p.image ? [p.image] : []));
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
  }, [mode, projectId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const resolvedSlug =
      mode === "edit"
        ? projectId!
        : (slug.trim() || slugify(title)).toLowerCase();

    const body = {
      title,
      slug: resolvedSlug,
      description,
      tech: tech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      gitRepo: gitRepo || "",
      demoUrl: demoUrl || undefined,
      draft,
      featured: !draft,
      relatedProjectIds: relatedProjectIds
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      relatedPostIds: relatedPostIds
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      gallery,
      image: gallery[0],
    };

    try {
      const res =
        mode === "create"
          ? await adminFetch("/projects", {
              method: "POST",
              body: JSON.stringify(body),
            })
          : await adminFetch(`/projects/${encodeURIComponent(projectId!)}`, {
              method: "PUT",
              body: JSON.stringify(body),
            });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setPending(false);
    }
  }

  async function onDelete() {
    if (!projectId || !confirm("Delete this project?")) return;
    setPending(true);
    try {
      const res = await adminFetch(
        `/projects/${encodeURIComponent(projectId)}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed");
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setPending(false);
    }
  }

  if (loading) return <p className="admin-status">Loading project…</p>;

  return (
    <section className="admin-card">
      <h1>{mode === "create" ? "New project" : "Edit project"}</h1>
      <p className="admin-card__lede">
        Slug is the DynamoDB id (PROJECT#slug). Gallery uploads go to S3 via
        presigned URL.
      </p>
      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (mode === "create" && !slug) {
                /* keep slug manual unless empty — auto-fill on blur via placeholder */
              }
            }}
            required
          />
        </label>
        <label>
          Slug {mode === "edit" ? "(locked)" : "(optional — from title)"}
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onBlur={() => {
              if (mode === "create" && !slug.trim() && title.trim()) {
                setSlug(slugify(title));
              }
            }}
            placeholder="auto-from-title"
            disabled={mode === "edit"}
          />
        </label>
        <label>
          Description
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Tech (comma-separated)
          <input
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            placeholder="Next.js, AWS, TypeScript"
          />
        </label>
        <label>
          Git repo URL
          <input
            type="url"
            value={gitRepo}
            onChange={(e) => setGitRepo(e.target.value)}
            placeholder="https://github.com/you/repo"
          />
        </label>
        <label>
          Demo URL
          <input
            type="url"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
          />
        </label>
        <label>
          Related project slugs (comma-separated)
          <input
            value={relatedProjectIds}
            onChange={(e) => setRelatedProjectIds(e.target.value)}
            placeholder="other-project-slug"
          />
        </label>
        <label>
          Related post slugs (comma-separated)
          <input
            value={relatedPostIds}
            onChange={(e) => setRelatedPostIds(e.target.value)}
            placeholder="my-blog-post"
          />
        </label>
        <label className="admin-check">
          <input
            type="checkbox"
            checked={draft}
            onChange={(e) => setDraft(e.target.checked)}
          />
          Draft (hidden on public site)
        </label>

        <GalleryEditor value={gallery} onChange={setGallery} />

        {error ? <p className="admin-error">{error}</p> : null}
        <div className="admin-actions">
          <button type="submit" className="btn btn--primary" disabled={pending}>
            {pending
              ? "Saving…"
              : mode === "create"
                ? "Create project"
                : "Save changes"}
          </button>
          <Link href="/admin/projects" className="btn btn--ghost">
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
