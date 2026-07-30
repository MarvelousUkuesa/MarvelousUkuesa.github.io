import type { Project } from "@/lib/schemas/project";

export const WORK_FILTERS = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI & Agents" },
  { id: "cloud", label: "Cloud & IaC" },
  { id: "tools", label: "Developer Tools" },
] as const;

export type WorkFilterId = (typeof WORK_FILTERS)[number]["id"];

/** Resolve filter bucket from explicit category or tech heuristics. */
export function projectCategory(project: Project): Exclude<WorkFilterId, "all"> {
  if (project.category) return project.category;
  const hay = `${project.title} ${project.description} ${project.tech.join(" ")}`.toLowerCase();
  if (/ai|agent|bedrock|llm|openai|swarm|orchestr/.test(hay)) return "ai";
  if (/aws|cdk|terraform|cloud|lambda|dynamodb|iac|s3|api gateway/.test(hay))
    return "cloud";
  return "tools";
}

export function projectStatus(project: Project) {
  return project.status ?? "Active";
}

export function formatUpdated(updatedAt?: string) {
  if (!updatedAt) return null;
  const d = new Date(updatedAt);
  if (Number.isNaN(+d)) return null;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
