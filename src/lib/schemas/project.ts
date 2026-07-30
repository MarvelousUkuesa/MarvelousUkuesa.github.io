import { z } from "zod";

/**
 * Stable project shape for the UI.
 * Adapters (local JSON, GitHub, portfolio-api) all normalize to this.
 */
export const projectSchema = z.object({
  id: z.string().min(1),
  /** Same as id when sourced from the API (slug-based keys). */
  slug: z.string().min(1).optional(),
  title: z.string().min(1),
  description: z.string(),
  tech: z.array(z.string()).default([]),
  /** Normalized from API `gitRepo` or local `repoUrl`. */
  repoUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  demoUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  image: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  relatedProjectIds: z.array(z.string()).default([]),
  relatedPostIds: z.array(z.string()).default([]),
  stars: z.number().int().nonnegative().optional(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
  /** Work index filter bucket */
  category: z.enum(["ai", "cloud", "tools"]).optional(),
  status: z.enum(["Active", "Archived", "Experimental"]).optional(),
  commits: z.number().int().nonnegative().optional(),
  prs: z.number().int().nonnegative().optional(),
  highlights: z.array(z.string()).default([]),
  source: z.enum(["curated", "github", "api"]).default("curated"),
});

export type Project = z.infer<typeof projectSchema>;

export const curatedProjectsFileSchema = z.object({
  projects: z.array(
    projectSchema.omit({ source: true }).extend({
      /** GitHub repo name for enrichment, e.g. "portfolio" */
      githubRepo: z.string().optional(),
    }),
  ),
});

export type CuratedProjectsFile = z.infer<typeof curatedProjectsFileSchema>;
