"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Project } from "@/lib/schemas/project";
import { formatUpdated, projectStatus } from "@/lib/work/categories";

type Props = {
  project: Project;
  index?: number;
};

export function WorkProjectCard({ project, index = 0 }: Props) {
  const status = projectStatus(project);
  const updated = formatUpdated(project.updatedAt);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative flex h-full flex-col gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--line))] hover:shadow-[0_12px_40px_-18px_color-mix(in_srgb,var(--accent)_35%,transparent)] sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[var(--ink)] sm:text-xl">
          <Link
            href={`/work/${project.id}`}
            className="text-inherit no-underline hover:text-[var(--accent)]"
          >
            {project.title}
          </Link>
        </h3>
        <span
          className={
            status === "Active"
              ? "shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-800"
              : status === "Experimental"
                ? "shrink-0 rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-900"
                : "shrink-0 rounded-full bg-neutral-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-600"
          }
        >
          {status}
        </span>
      </div>
      <p className="flex-1 text-sm leading-relaxed text-[var(--ink-muted)]">
        {project.description}
      </p>
      {project.tech.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 5).map((t) => (
            <li
              key={t}
              className="rounded-md border border-[var(--line)] bg-[var(--bg)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink-muted)]"
            >
              {t}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--line)] pt-3 text-xs text-[var(--ink-muted)]">
        {typeof project.stars === "number" ? (
          <span className="tabular-nums">{project.stars} ★</span>
        ) : null}
        {updated ? <span>Updated {updated}</span> : null}
        <Link
          href={`/work/${project.id}`}
          className="ml-auto font-semibold text-[var(--accent)] no-underline group-hover:text-[var(--ink)]"
        >
          View →
        </Link>
      </div>
    </motion.article>
  );
}
