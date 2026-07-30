import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleProgress } from "@/components/blog/ArticleProgress";
import { ArticleShell } from "@/components/blog/ArticleShell";
import { Markdown } from "@/components/blog/Markdown";
import { MediaGallery } from "@/components/media/MediaGallery";
import { getPosts, getPostWithRelated } from "@/lib/content/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPostWithRelated(slug);
  if (!result) return { title: "Post" };
  return {
    title: result.post.title,
    description: result.post.summary,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const result = await getPostWithRelated(slug);
  if (!result) notFound();

  const { post, relatedProject } = result;
  const all = await getPosts();
  const index = all.findIndex((p) => p.slug === slug);
  const prev = index >= 0 && index < all.length - 1 ? all[index + 1] : null;
  const next = index > 0 ? all[index - 1] : null;

  return (
    <ArticleProgress>
      <ArticleShell
        post={post}
        prev={prev}
        next={next}
        related={
          relatedProject
            ? {
                title: relatedProject.title,
                href: `/work/${relatedProject.id}`,
                repoUrl: relatedProject.repoUrl,
              }
            : null
        }
      >
        <MediaGallery images={post.gallery ?? []} label="Post gallery" />
        <Markdown content={post.content} />
      </ArticleShell>
    </ArticleProgress>
  );
}
