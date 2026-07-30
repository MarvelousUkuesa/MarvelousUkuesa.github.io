"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Post } from "@/lib/schemas/post";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { CHIP_GAP, GRID_GAP } from "@/components/layout/SiteContainer";

type Props = {
  posts: Post[];
};

function readMin(readingTime: string) {
  const n = parseInt(readingTime, 10);
  return Number.isFinite(n) ? `${n} min` : readingTime;
}

export function WorkPageBlogColumn({ posts }: Props) {
  const bp = useBreakpoint();
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;
  const grid = rest.slice(0, bp === "mobile" ? 4 : 6);

  return (
    <div className="w-full">
      <header className="mb-8 text-left lg:mb-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl lg:text-[clamp(2.2rem,4vw,3rem)]">
          Blog
        </h2>
      </header>

      <div className={`flex flex-col ${GRID_GAP}`}>
        <Link
          href={`/blog/${featured.slug}`}
          className="group grid overflow-hidden rounded-2xl border border-[var(--line)] bg-white no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="relative min-h-[7.5rem] bg-gradient-to-br from-[#1a2420] via-[#243530] to-[#0f1a16] sm:min-h-[8.5rem]">
            <div
              aria-hidden
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 40%, rgba(52,211,153,0.35), transparent 50%), radial-gradient(circle at 70% 60%, rgba(56,189,248,0.25), transparent 45%)",
              }}
            />
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--ink)]">
              Featured Post
            </span>
            <div className="absolute inset-x-5 bottom-5 top-11 rounded-xl border border-white/10 bg-white/5" />
          </div>
          <div className="p-4">
            <h3 className="font-[family-name:var(--font-display)] text-base font-bold leading-snug tracking-tight text-[var(--ink)] group-hover:text-[var(--accent)] sm:text-lg">
              {featured.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-[var(--ink-muted)]">
              {featured.summary}
            </p>
            <div
              className={`mt-3 flex flex-wrap items-center ${CHIP_GAP} text-xs text-[var(--ink-muted)]`}
            >
              <span>{readMin(featured.readingTime)}</span>
              {featured.tags[0] ? (
                <span className="rounded-full border border-[var(--line)] bg-[var(--bg)] px-2 py-0.5">
                  {featured.tags[0]}
                </span>
              ) : null}
            </div>
          </div>
        </Link>

        {grid.length > 0 ? (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 ${GRID_GAP}`}
          >
            {grid.map((post, i) => (
              <motion.div
                key={post.slug}
                className="h-full"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full min-h-[7.5rem] flex-col rounded-2xl border border-[var(--line)] bg-white p-3.5 no-underline shadow-sm transition hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_35%,var(--line))] hover:shadow-md"
                >
                  <span className="w-fit rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                    {i === 0 ? "Featured" : `Day ${i}`}
                  </span>
                  <h3 className="mt-2.5 font-[family-name:var(--font-display)] text-[0.9rem] font-bold leading-snug text-[var(--ink)] group-hover:text-[var(--accent)]">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-3 flex-1 text-[11px] leading-relaxed text-[var(--ink-muted)]">
                    {post.summary}
                  </p>
                  {post.tags[0] ? (
                    <span className="mt-2.5 w-fit rounded-full border border-[var(--line)] px-2 py-0.5 text-[10px] text-[var(--ink-muted)]">
                      {post.tags[0]}
                    </span>
                  ) : null}
                </Link>
              </motion.div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
