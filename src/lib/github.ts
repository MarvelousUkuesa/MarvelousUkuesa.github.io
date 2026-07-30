import { site } from "@/content/site";

export function getGithubUsername() {
  return (
    process.env.NEXT_PUBLIC_GITHUB_USER?.trim() ||
    site.githubUsername
  );
}

type GithubRepo = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
  fork: boolean;
  archived: boolean;
};

/**
 * Optional enrichment from the public GitHub API.
 * Fails soft — curated content still renders if GitHub is down or username is a placeholder.
 */
export async function fetchGithubRepos(
  username: string,
): Promise<GithubRepo[]> {
  if (!username || username.includes("YOUR_")) return [];

  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "portfolio-site",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) return [];
  const data = (await res.json()) as GithubRepo[];
  return data.filter((r) => !r.fork && !r.archived);
}

export type { GithubRepo };
