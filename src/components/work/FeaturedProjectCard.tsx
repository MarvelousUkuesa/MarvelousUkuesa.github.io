"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Project } from "@/lib/schemas/project";

type Props = {
  project: Project;
};

function ArchitectureVisual({ tech }: { tech: string[] }) {
  const nodes = tech.slice(0, 4);
  return (
    <div className="relative flex h-full min-h-[16rem] flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#0c0f0e] p-4 sm:min-h-[18rem] sm:p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative z-[1] flex flex-wrap gap-2">
        {nodes.map((t) => (
          <span
            key={t}
            className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium tracking-wide text-emerald-200"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="relative z-[1] mt-6 grid flex-1 grid-cols-3 items-center gap-2 sm:gap-3">
        <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-white/45">Planner</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-sm font-semibold text-white">
            Agent
          </p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
          <div className="rounded-md border border-emerald-400/40 bg-emerald-500/15 px-2 py-2 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200">
              Bus
            </p>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
        </div>
        <div className="space-y-2">
          <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-center">
            <p className="text-[10px] text-white/50">Worker</p>
            <p className="text-xs font-semibold text-white">A</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-center">
            <p className="text-[10px] text-white/50">Worker</p>
            <p className="text-xs font-semibold text-white">B</p>
          </div>
        </div>
      </div>
      <p className="relative z-[1] mt-4 font-mono text-[10px] text-white/35">
        architecture · preview
      </p>
    </div>
  );
}

export function FeaturedProjectCard({ project }: Props) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900 text-white shadow-2xl"
    >
      <div className="grid gap-0 lg:grid-cols-2">
        <Link
          href={`/work/${project.id}`}
          className="border-b border-white/10 p-5 no-underline sm:p-6 lg:border-b-0 lg:border-r"
        >
          <ArchitectureVisual tech={project.tech} />
        </Link>
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300/90">
            Featured project
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-white sm:text-3xl">
            <Link
              href={`/work/${project.id}`}
              className="text-inherit no-underline hover:text-emerald-200"
            >
              {project.title}
            </Link>
          </h2>
          <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-white/65">
            {project.description}
          </p>
          {(project.commits != null || project.prs != null) && (
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:max-w-xs">
              {project.commits != null ? (
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                  <dt className="text-[10px] uppercase tracking-wider text-white/45">
                    Commits
                  </dt>
                  <dd className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold tabular-nums text-white">
                    {project.commits}
                  </dd>
                </div>
              ) : null}
              {project.prs != null ? (
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                  <dt className="text-[10px] uppercase tracking-wider text-white/45">
                    PRs
                  </dt>
                  <dd className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold tabular-nums text-white">
                    {project.prs}
                  </dd>
                </div>
              ) : null}
            </dl>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={`/work/${project.id}`}
              className="inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 no-underline transition hover:bg-emerald-100"
            >
              View project →
            </Link>
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-white/20 bg-transparent px-4 py-2.5 text-sm font-semibold text-white no-underline transition hover:border-white/40 hover:bg-white/5"
              >
                GitHub
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
