"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { Project } from "@/lib/schemas/project";
import { useBreakpoint } from "@/hooks/useBreakpoint";

type Props = {
  project: Project;
};

function relativeUpdate(updatedAt?: string) {
  if (!updatedAt) return "—";
  const then = new Date(updatedAt).getTime();
  if (Number.isNaN(then)) return "—";
  const days = Math.max(0, Math.round((Date.now() - then) / 86_400_000));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 14) return `${days} days ago`;
  return new Date(updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const PILL_TONES = [
  "bg-[#dce4ea] text-[#1f2a32]",
  "bg-[#c8ddd8] text-[#16352f]",
  "bg-[#d5e0d4] text-[#1e3220]",
];

export function ProjectDetailPanel({ project }: Props) {
  const bp = useBreakpoint();
  const highlights =
    project.highlights.length > 0 ? project.highlights : project.tech.slice(0, 4);
  const mobile = bp === "mobile";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={project.id}
        initial={
          mobile ? { opacity: 0, scale: 0.95 } : { opacity: 0, y: 10 }
        }
        animate={
          mobile ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 }
        }
        exit={mobile ? { opacity: 0, scale: 0.98 } : { opacity: 0, y: -6 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mt-5 grid gap-6"
      >
        <div>
          <Link
            href={`/work/${project.id}`}
            className="inline-flex min-h-11 items-center font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--ink)] no-underline transition hover:text-[var(--accent)] sm:text-3xl"
          >
            {project.title}
          </Link>

          {project.tech.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((t, i) => (
                <li
                  key={t}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${PILL_TONES[i % PILL_TONES.length]}`}
                >
                  {t}
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--ink-muted)]">
            {project.description}
          </p>

          {highlights.length > 0 ? (
            <ul className="mt-4 space-y-1.5 text-sm text-[var(--ink)]">
              {highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--ink)]" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white sm:min-w-[16rem]">
            <p className="border-b border-[var(--line)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
              Project Stats
            </p>
            <div className="grid grid-cols-3 divide-x divide-[var(--line)] text-center">
              <div className="px-2 py-3">
                <p className="text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                  commits
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold tabular-nums">
                  {project.commits ?? "—"}
                </p>
              </div>
              <div className="px-2 py-3">
                <p className="text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                  PRs
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold tabular-nums">
                  {project.prs ?? "—"}
                </p>
              </div>
              <div className="px-2 py-3">
                <p className="text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                  last update
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {relativeUpdate(project.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/work/${project.id}`}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white no-underline transition hover:bg-[var(--accent)] md:hover:scale-105"
            >
              View project →
            </Link>
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] no-underline transition hover:border-[var(--ink)] md:hover:scale-105"
              >
                GitHub
              </a>
            ) : null}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
