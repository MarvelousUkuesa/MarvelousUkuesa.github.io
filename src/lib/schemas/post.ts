import { z } from "zod";

/**
 * Blog post frontmatter + resolved fields.
 * Add a new .md file under content/blog — no UI changes required.
 */
export const postFrontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.union([z.string(), z.date()]).transform((v) =>
    v instanceof Date ? v.toISOString().slice(0, 10) : v,
  ),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  relatedProjectId: z.string().optional().or(z.literal("")).transform((v) => v || undefined),
  gallery: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export const postSchema = postFrontmatterSchema.extend({
  slug: z.string().min(1),
  content: z.string(),
  readingTime: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;
export type Post = z.infer<typeof postSchema>;
