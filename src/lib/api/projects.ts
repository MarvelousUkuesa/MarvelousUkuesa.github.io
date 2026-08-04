import { type Project, projectSchema } from "@/lib/schemas/project";
import { getApiUrl } from "@/config/publicApi";

function apiBaseUrl() {
  return getApiUrl();
}

export function isApiConfigured() {
  return Boolean(apiBaseUrl());
}

type ApiProject = {
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  tech?: string[];
  gitRepo?: string;
  repoUrl?: string;
  demoUrl?: string;
  image?: string;
  gallery?: string[];
  featured?: boolean;
  draft?: boolean;
  relatedProjectIds?: string[];
  relatedPostIds?: string[];
  createdAt?: string;
  updatedAt?: string;
};

/** Map portfolio-api project JSON → UI Project schema. */
export function normalizeApiProject(raw: ApiProject): Project {
  const slug = (raw.slug ?? raw.id ?? "").trim();
  const gallery = raw.gallery ?? (raw.image ? [raw.image] : []);
  const draft = Boolean(raw.draft);
  const featured =
    raw.featured !== undefined ? Boolean(raw.featured) : !draft;

  return projectSchema.parse({
    id: slug,
    slug,
    title: raw.title ?? "",
    description: raw.description ?? "",
    tech: raw.tech ?? [],
    repoUrl: raw.repoUrl || raw.gitRepo || undefined,
    demoUrl: raw.demoUrl,
    image: raw.image ?? gallery[0],
    gallery,
    featured,
    draft,
    relatedProjectIds: raw.relatedProjectIds ?? [],
    relatedPostIds: raw.relatedPostIds ?? [],
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    source: "api",
  });
}

/**
 * Fetch projects from the standalone portfolio-api CDK backend.
 * Returns null if the API is unset or unreachable (caller falls back to local content).
 */
export async function fetchProjectsFromApi(): Promise<Project[] | null> {
  const base = apiBaseUrl();
  if (!base) return null;

  try {
    const res = await fetch(`${base}/projects`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { projects?: ApiProject[] };
    return (data.projects ?? []).map(normalizeApiProject);
  } catch {
    return null;
  }
}

export async function fetchProjectByIdFromApi(
  id: string,
): Promise<{
  project: Project;
  relatedProjects: Project[];
  relatedPosts: unknown[];
} | null> {
  const base = apiBaseUrl();
  if (!base) return null;

  try {
    const res = await fetch(`${base}/projects/${encodeURIComponent(id)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      project?: ApiProject;
      relatedProjects?: ApiProject[];
      relatedPosts?: unknown[];
    };
    if (!data.project) return null;
    return {
      project: normalizeApiProject(data.project),
      relatedProjects: (data.relatedProjects ?? []).map(normalizeApiProject),
      relatedPosts: data.relatedPosts ?? [],
    };
  } catch {
    return null;
  }
}
