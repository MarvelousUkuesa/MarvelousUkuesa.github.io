import { readFile } from "fs/promises";
import path from "path";
import {
  curatedProjectsFileSchema,
  type Project,
  projectSchema,
} from "@/lib/schemas/project";
import {
  fetchProjectByIdFromApi,
  fetchProjectsFromApi,
  isApiConfigured,
} from "@/lib/api/projects";
import { fetchGithubRepos, getGithubUsername } from "@/lib/github";

const curatedPath = path.join(process.cwd(), "content", "projects.json");

async function loadCurated() {
  const raw = await readFile(curatedPath, "utf8");
  return curatedProjectsFileSchema.parse(JSON.parse(raw));
}

async function getLocalProjects(): Promise<Project[]> {
  const { projects } = await loadCurated();
  const username = getGithubUsername();
  const repos = await fetchGithubRepos(username);
  const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));

  return projects.map((p) => {
    const repo = p.githubRepo
      ? byName.get(p.githubRepo.toLowerCase())
      : undefined;

    return projectSchema.parse({
      id: p.id,
      slug: p.slug ?? p.id,
      title: p.title,
      description: p.description || repo?.description || "",
      tech:
        p.tech.length > 0
          ? p.tech
          : [repo?.language, ...(repo?.topics ?? [])].filter(
              (t): t is string => Boolean(t),
            ),
      repoUrl: p.repoUrl ?? repo?.html_url,
      demoUrl: p.demoUrl ?? (repo?.homepage ? repo.homepage : undefined),
      image: p.image,
      gallery: p.gallery,
      featured: p.featured,
      draft: p.draft ?? false,
      relatedProjectIds: p.relatedProjectIds ?? [],
      relatedPostIds: p.relatedPostIds ?? [],
      stars: p.stars ?? repo?.stargazers_count,
      updatedAt: p.updatedAt ?? repo?.updated_at,
      category: p.category,
      status: p.status,
      commits: p.commits,
      prs: p.prs,
      highlights: p.highlights,
      source: repo ? "github" : "curated",
    });
  });
}

/**
 * Prefer the remote portfolio-api when NEXT_PUBLIC_API_URL is set.
 * Otherwise use local JSON (+ optional GitHub enrichment).
 */
export async function getProjects(): Promise<Project[]> {
  if (isApiConfigured()) {
    const remote = await fetchProjectsFromApi();
    if (remote) return remote;
  }
  return getLocalProjects();
}

export async function getFeaturedProjects() {
  const projects = await getProjects();
  return projects.filter((p) => p.featured && !p.draft);
}

export async function getProjectById(id: string) {
  if (isApiConfigured()) {
    const remote = await fetchProjectByIdFromApi(id);
    if (remote) return remote.project;
  }
  const projects = await getProjects();
  return projects.find((p) => p.id === id || p.slug === id);
}
