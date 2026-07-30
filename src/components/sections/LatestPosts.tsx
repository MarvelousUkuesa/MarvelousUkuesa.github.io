import Link from "next/link";
import type { Post } from "@/lib/schemas/post";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger } from "@/components/motion/Stagger";
import { PostCard } from "@/components/blog/PostCard";
import { Section, SectionHeader } from "@/components/layout/SiteContainer";

type Props = {
  posts: Post[];
};

export function LatestPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <Section id="writing" aria-labelledby="blog-heading">
      <FadeIn>
        <SectionHeader
          id="blog-heading"
          title="Writing"
          description="Notes on the work — what shipped and what I learned."
        />
      </FadeIn>
      <Stagger className="post-list">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </Stagger>
      <FadeIn delay={0.1}>
        <p className="section__more">
          <Link href="/blog">All writing →</Link>
        </p>
      </FadeIn>
    </Section>
  );
}
