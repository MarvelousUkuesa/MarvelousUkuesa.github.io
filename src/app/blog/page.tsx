import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import { getPosts } from "@/lib/content/posts";
import {
  GRID_GAP,
  Section,
  SectionHeader,
} from "@/components/layout/SiteContainer";

export const metadata: Metadata = {
  title: "Writing",
  description: "Writing about builds, process, and lessons learned.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <Section className="pb-24">
      <FadeIn>
        <SectionHeader
          as="h1"
          title="Writing"
          description="Talking through the work — short posts next to the repos."
        />
      </FadeIn>

      {posts.length === 0 ? (
        <p className="text-[var(--ink-muted)]">No posts yet.</p>
      ) : (
        <ul className={`grid grid-cols-1 md:grid-cols-2 ${GRID_GAP}`}>
          {posts.map((post, i) => {
            const date = new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            return (
              <li key={post.slug}>
                <FadeIn delay={i * 0.04}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-5 no-underline transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_35%,var(--line))] hover:shadow-[0_16px_40px_-24px_rgba(18,26,22,0.3)] sm:p-6"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--ink-muted)]">
                      <time dateTime={post.date}>{date}</time>
                      <span aria-hidden>·</span>
                      <span>{post.readingTime}</span>
                      {post.tags[0] ? (
                        <>
                          <span aria-hidden>·</span>
                          <span className="rounded-full border border-[var(--line)] px-2 py-0.5">
                            {post.tags[0]}
                          </span>
                        </>
                      ) : null}
                    </div>
                    <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-[var(--ink)] group-hover:text-[var(--accent)] sm:text-2xl">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--ink-muted)]">
                      {post.summary}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-[var(--accent)]">
                      Read →
                    </span>
                  </Link>
                </FadeIn>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
