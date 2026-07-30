"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/content/site";
import type { Post } from "@/lib/schemas/post";
import { ArticleToc } from "@/components/blog/ArticleToc";
import { SiteContainer } from "@/components/layout/SiteContainer";

type Props = {
  post: Post;
  prev?: Post | null;
  next?: Post | null;
  related?: { title: string; href: string; repoUrl?: string } | null;
  children: React.ReactNode;
};

export function ArticleShell({
  post,
  prev,
  next,
  related,
  children,
}: Props) {
  const [copied, setCopied] = useState(false);
  const category = post.tags[0] ?? "Engineering";
  const dateLabel = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const initial = site.author.name.slice(0, 1).toUpperCase();

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="pb-28 pt-10 sm:pt-12 lg:pt-16">
      <SiteContainer>
        <div className="mx-auto grid max-w-6xl gap-10 xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-14">
          <article className="mx-auto w-full max-w-3xl">
            <header className="border-b border-[var(--line)] pb-10">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-semibold tracking-[0.12em] text-[var(--ink-muted)]">
                <span className="rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-2.5 py-1 uppercase text-[var(--accent)]">
                  {category}
                </span>
                <time dateTime={post.date}>{dateLabel}</time>
                <span aria-hidden>·</span>
                <span>{post.readingTime}</span>
              </div>

              <h1 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl md:text-[clamp(2.5rem,4.5vw,3.35rem)] md:leading-[1.1]">
                {post.title}
              </h1>

              <p className="mt-4 max-w-[65ch] text-lg leading-relaxed text-[var(--ink-muted)]">
                {post.summary}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ink)] font-[family-name:var(--font-display)] text-sm font-bold text-[var(--bg-elevated)]"
                    aria-hidden
                  >
                    {initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      {site.author.name}
                    </p>
                    <p className="text-sm text-[var(--ink-muted)]">
                      {site.author.title}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex min-h-10 items-center rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-4 text-sm font-semibold text-[var(--ink-muted)] transition hover:text-[var(--ink)]"
                >
                  {copied ? "Link copied" : "Copy link"}
                </button>
              </div>
            </header>

            <div
              id="article-body"
              className="prose-article mt-10 max-w-[70ch]"
            >
              {children}
            </div>

            {related ? (
              <p className="mt-12 border-t border-[var(--line)] pt-6 text-sm text-[var(--ink-muted)]">
                Related project:{" "}
                <Link
                  href={related.href}
                  className="font-semibold text-[var(--ink)] no-underline hover:text-[var(--accent)]"
                >
                  {related.title}
                </Link>
                {related.repoUrl ? (
                  <>
                    {" "}
                    ·{" "}
                    <a
                      href={related.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--accent)] no-underline"
                    >
                      Repository
                    </a>
                  </>
                ) : null}
              </p>
            ) : null}

            <aside className="mt-12 rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] font-[family-name:var(--font-display)] text-base font-bold text-[var(--bg-elevated)]"
                  aria-hidden
                >
                  {initial}
                </div>
                <div>
                  <p className="font-[family-name:var(--font-display)] text-base font-bold text-[var(--ink)]">
                    {site.author.name}
                  </p>
                  <p className="mt-0.5 text-sm text-[var(--ink-muted)]">
                    {site.author.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
                    {site.author.bio}
                  </p>
                </div>
              </div>
            </aside>

            {(prev || next) && (
              <nav
                className="mt-10 grid grid-cols-1 gap-4 border-t border-[var(--line)] pt-8 sm:grid-cols-2"
                aria-label="Related articles"
              >
                {prev ? (
                  <Link
                    href={`/blog/${prev.slug}`}
                    className="group rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-5 no-underline transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_40%,var(--line))]"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                      ← Previous
                    </span>
                    <span className="mt-2 block font-[family-name:var(--font-display)] text-base font-semibold text-[var(--ink)] group-hover:text-[var(--accent)]">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {next ? (
                  <Link
                    href={`/blog/${next.slug}`}
                    className="group rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-5 text-right no-underline transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_40%,var(--line))]"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                      Next →
                    </span>
                    <span className="mt-2 block font-[family-name:var(--font-display)] text-base font-semibold text-[var(--ink)] group-hover:text-[var(--accent)]">
                      {next.title}
                    </span>
                  </Link>
                ) : null}
              </nav>
            )}

            <p className="mt-10 text-center">
              <Link
                href="/blog"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent)] no-underline"
              >
                ← Back to Writing
              </Link>
            </p>
          </article>

          <div className="pt-2">
            <ArticleToc rootId="article-body" />
          </div>
        </div>
      </SiteContainer>
    </div>
  );
}
