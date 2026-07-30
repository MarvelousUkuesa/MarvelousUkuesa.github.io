import { type Post, postSchema } from "@/lib/schemas/post";
import { type Project } from "@/lib/schemas/project";
import { normalizeApiProject } from "@/lib/api/projects";

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
}

export function isApiConfigured() {
  return Boolean(apiBaseUrl());
}

type ApiPost = {
  slug?: string;
  title?: string;
  date?: string;
  summary?: string;
  tags?: string[];
  content?: string;
  relatedProjectId?: string;
  gallery?: string[];
  draft?: boolean;
  readingTime?: string;
  createdAt?: string;
  updatedAt?: string;
};

/** Map portfolio-api post JSON → UI Post schema. */
export function normalizeApiPost(raw: ApiPost): Post {
  const content = raw.content ?? "";
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));

  return postSchema.parse({
    slug: raw.slug ?? "",
    title: raw.title ?? "",
    date: raw.date ?? new Date().toISOString().slice(0, 10),
    summary: raw.summary ?? "",
    tags: raw.tags ?? [],
    content,
    relatedProjectId: raw.relatedProjectId || undefined,
    gallery: raw.gallery ?? [],
    draft: Boolean(raw.draft),
    readingTime: raw.readingTime ?? `${minutes} min read`,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  });
}

export async function fetchPostsFromApi(): Promise<Post[] | null> {
  const base = apiBaseUrl();
  if (!base) return null;

  try {
    const res = await fetch(`${base}/posts`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { posts?: ApiPost[] };
    return (data.posts ?? []).map(normalizeApiPost);
  } catch {
    return null;
  }
}

export async function fetchPostBySlugFromApi(slug: string): Promise<{
  post: Post;
  relatedProject: Project | null;
} | null> {
  const base = apiBaseUrl();
  if (!base) return null;

  try {
    const res = await fetch(`${base}/posts/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      post?: ApiPost;
      relatedProject?: Parameters<typeof normalizeApiProject>[0] | null;
    };
    if (!data.post) return null;
    return {
      post: normalizeApiPost(data.post),
      relatedProject: data.relatedProject
        ? normalizeApiProject(data.relatedProject)
        : null,
    };
  } catch {
    return null;
  }
}
