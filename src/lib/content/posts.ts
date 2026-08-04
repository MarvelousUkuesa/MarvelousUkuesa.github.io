import { readdir, readFile } from "fs/promises";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { postFrontmatterSchema, type Post } from "@/lib/schemas/post";
import type { Project } from "@/lib/schemas/project";
import {
  fetchPostBySlugFromApi,
  fetchPostsFromApi,
  isApiConfigured,
} from "@/lib/api/posts";

const blogDir = path.join(process.cwd(), "content", "blog");

async function getLocalPosts(): Promise<Post[]> {
  const files = await readdir(blogDir);
  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
      .map(async (file) => {
        const slug = file.replace(/\.mdx?$/, "");
        const raw = await readFile(path.join(blogDir, file), "utf8");
        const { data, content } = matter(raw);
        const frontmatter = postFrontmatterSchema.parse(data);
        const stats = readingTime(content);

        return {
          ...frontmatter,
          slug,
          content,
          readingTime: stats.text,
        } satisfies Post;
      }),
  );

  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

/**
 * Prefer portfolio-api when NEXT_PUBLIC_API_URL is set.
 * Once the API responds, never mix in local demo markdown — even if the list is empty.
 */
export async function getPosts(): Promise<Post[]> {
  if (isApiConfigured()) {
    const remote = await fetchPostsFromApi();
    if (remote) return remote;
  }
  return getLocalPosts();
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  if (isApiConfigured()) {
    const remote = await fetchPostBySlugFromApi(slug);
    if (remote) return remote.post;
    // API is configured: missing slug is a real miss, not a cue to serve demo posts.
    const list = await fetchPostsFromApi();
    if (list) return undefined;
  }
  const posts = await getLocalPosts();
  return posts.find((p) => p.slug === slug);
}

/** Post + server-resolved related project (from API when available). */
export async function getPostWithRelated(slug: string): Promise<{
  post: Post;
  relatedProject: Project | null;
} | null> {
  if (isApiConfigured()) {
    const remote = await fetchPostBySlugFromApi(slug);
    if (remote) {
      return {
        post: remote.post,
        relatedProject: remote.relatedProject,
      };
    }
    const list = await fetchPostsFromApi();
    if (list) return null;
  }

  const post = await getPostBySlug(slug);
  if (!post) return null;

  let relatedProject: Project | null = null;
  if (post.relatedProjectId) {
    const { getProjectById } = await import("@/lib/content/projects");
    relatedProject = (await getProjectById(post.relatedProjectId)) ?? null;
  }

  return { post, relatedProject };
}

export async function getLatestPosts(limit = 3) {
  const posts = await getPosts();
  return posts.slice(0, limit);
}
