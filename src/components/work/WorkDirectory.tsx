"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/lib/schemas/project";
import {
  WORK_FILTERS,
  projectCategory,
  projectStatus,
  type WorkFilterId,
} from "@/lib/work/categories";
import {
  CHIP_GAP,
  GRID_GAP,
  SiteContainer,
} from "@/components/layout/SiteContainer";

type Props = {
  projects: Project[];
};

const PREVIEW_TONES = [
  { bg: "#1a2420", accent: "#9ec9c0", glow: "rgba(168,207,198,0.35)" },
  { bg: "#141c18", accent: "#a8cfc6", glow: "rgba(200,224,219,0.3)" },
  { bg: "#1c2824", accent: "#c8e0db", glow: "rgba(126,184,174,0.32)" },
  { bg: "#161e1a", accent: "#7eb8ae", glow: "rgba(10,92,84,0.28)" },
  { bg: "#1c2018", accent: "#c4b896", glow: "rgba(196,184,150,0.28)" },
] as const;

function toneFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) % PREVIEW_TONES.length;
  return PREVIEW_TONES[h] ?? PREVIEW_TONES[0];
}

function coverFor(project: Project) {
  return project.gallery?.[0] ?? project.image;
}

/**
 * Sticky list + live preview for /work.
 * Large screens: viewport-locked split (same SiteContainer bounds as home)
 * so the right preview (fixed image + text box) always fits on screen.
 */
export function WorkDirectory({ projects }: Props) {
  const [filter, setFilter] = useState<WorkFilterId>("all");
  const filtered = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => projectCategory(p) === filter),
    [projects, filter],
  );
  const [activeId, setActiveId] = useState<string | null>(
    () => filtered[0]?.id ?? null,
  );

  useEffect(() => {
    if (!filtered.some((p) => p.id === activeId)) {
      setActiveId(filtered[0]?.id ?? null);
    }
  }, [filtered, activeId]);

  const active =
    filtered.find((p) => p.id === activeId) ?? filtered[0] ?? null;
  const tone = active ? toneFor(active.id) : PREVIEW_TONES[0];
  const cover = active ? coverFor(active) : undefined;

  return (
    <div className="pb-24 pt-10 sm:pt-12 lg:flex lg:h-[100dvh] lg:min-h-0 lg:flex-col lg:overflow-hidden lg:pb-24 lg:pt-10">
      <SiteContainer className="flex min-h-0 flex-1 flex-col overflow-x-clip">
        <header className="shrink-0 text-left">
          <h1
            id="work-heading"
            className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl lg:text-[clamp(2rem,3.5vw,2.75rem)]"
          >
            Work
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--ink-muted)] sm:text-base">
            Selected agentic systems, infrastructure builds, and open-source
            projects.
          </p>
        </header>

        <div
          className={`mt-6 mb-6 flex shrink-0 flex-wrap ${CHIP_GAP} lg:mb-8 lg:mt-8`}
          role="tablist"
          aria-label="Project filters"
        >
          {WORK_FILTERS.map((tab) => {
            const on = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setFilter(tab.id);
                  setActiveId(null);
                }}
                className={
                  on
                    ? "min-h-11 rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-[var(--bg-elevated)]"
                    : "min-h-11 rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--ink-muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="text-[var(--ink-muted)]">No projects in this filter.</p>
        ) : (
          <>
            {/* Mobile / tablet portrait: stacked cards */}
            <ul className={`grid grid-cols-1 ${GRID_GAP} lg:hidden`}>
              {filtered.map((project) => {
                const src = coverFor(project);
                const t = toneFor(project.id);
                return (
                  <li key={project.id} className="max-w-full">
                    <Link
                      href={`/work/${project.id}`}
                      className="group flex h-full max-w-full flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div
                        className="relative aspect-[16/10] max-w-full overflow-hidden"
                        style={{ background: t.bg }}
                      >
                        {src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={src}
                            alt=""
                            className="h-full w-full max-w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full items-end p-5">
                            <p className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
                              {project.title}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col p-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                          {projectStatus(project)}
                        </span>
                        <h2 className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold text-[var(--ink)] group-hover:text-[var(--accent)]">
                          {project.title}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-sm text-[var(--ink-muted)]">
                          {project.description}
                        </p>
                        {project.tech[0] ? (
                          <ul className={`mt-3 flex flex-wrap ${CHIP_GAP}`}>
                            {project.tech.slice(0, 4).map((tech) => (
                              <li
                                key={tech}
                                className="rounded-full border border-[var(--line)] px-2.5 py-0.5 text-[11px] text-[var(--ink-muted)]"
                              >
                                {tech}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/*
              Large screens: same max-w-7xl container as home.
              Viewport-locked row — left list scrolls, right preview is a
              fixed-height box (photo + text) that always fits the screen.
            */}
            <div className="hidden min-h-0 min-w-0 max-w-full flex-1 grid-cols-12 gap-8 overflow-hidden lg:grid lg:gap-10 xl:gap-12">
              <ul
                className="col-span-5 min-h-0 min-w-0 max-w-full divide-y divide-[var(--line)] overflow-y-auto overscroll-contain border-y border-[var(--line)]"
                data-lenis-prevent
              >
                {filtered.map((project) => {
                  const on = active?.id === project.id;
                  return (
                    <li key={project.id} className="min-w-0 max-w-full">
                      <div
                        className={`group relative min-w-0 overflow-hidden py-5 transition ${on ? "bg-[color-mix(in_srgb,var(--accent-soft)_35%,transparent)]" : "hover:bg-[color-mix(in_srgb,var(--accent-soft)_18%,transparent)]"}`}
                        onMouseEnter={() => setActiveId(project.id)}
                        onFocus={() => setActiveId(project.id)}
                      >
                        <button
                          type="button"
                          className="absolute inset-0 z-0 cursor-pointer appearance-none border-0 bg-transparent"
                          aria-label={`Preview ${project.title}`}
                          aria-pressed={on}
                          onClick={() => setActiveId(project.id)}
                        />
                        <div className="relative z-[1] flex min-w-0 items-start justify-between gap-4 px-1 pointer-events-none">
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                              {projectStatus(project)}
                              <span className="mx-2 text-[var(--line)]">·</span>
                              {projectCategory(project)}
                            </p>
                            <h2
                              className={`mt-1 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight xl:text-[1.75rem] ${on ? "text-[var(--accent)]" : "text-[var(--ink)]"}`}
                            >
                              {project.title}
                            </h2>
                            <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-[var(--ink-muted)]">
                              {project.description}
                            </p>
                            {project.tech.length > 0 ? (
                              <ul
                                className={`mt-3 flex flex-wrap ${CHIP_GAP} pointer-events-auto`}
                              >
                                {project.tech.slice(0, 5).map((tech) => (
                                  <li
                                    key={tech}
                                    className="rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--ink-muted)]"
                                  >
                                    {tech}
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                          <Link
                            href={`/work/${project.id}`}
                            className="pointer-events-auto shrink-0 self-center text-sm font-semibold text-[var(--accent)] no-underline opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
                          >
                            Open →
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="col-span-7 flex min-h-0 min-w-0 max-w-full flex-col self-stretch">
                <div className="flex h-full min-h-0 w-full min-w-0 max-w-full flex-col">
                  <AnimatePresence mode="wait">
                    {active ? (
                      <motion.div
                        key={active.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="grid h-full min-h-0 w-full min-w-0 max-w-full grid-rows-[minmax(0,1fr)_10.5rem] overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--bg-elevated)] shadow-[0_24px_60px_-28px_rgba(18,26,22,0.4)] xl:grid-rows-[minmax(0,1fr)_11.25rem]"
                      >
                        {/* Fixed photo pane — fills leftover height only */}
                        <div
                          className="relative min-h-0 min-w-0 max-w-full overflow-hidden"
                          style={{ background: tone.bg }}
                        >
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0"
                            style={{
                              backgroundImage: `radial-gradient(circle at 30% 20%, ${tone.glow}, transparent 55%)`,
                            }}
                          />
                          {cover ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={cover}
                              alt=""
                              className="relative z-[1] h-full w-full max-w-full object-cover object-center"
                            />
                          ) : (
                            <div className="relative z-[1] flex h-full flex-col justify-between p-6 text-white sm:p-8">
                              <span className="w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide">
                                Preview
                              </span>
                              <p className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight xl:text-3xl">
                                {active.title}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Fixed text box — always fully on screen */}
                        <div className="flex min-h-0 min-w-0 max-w-full flex-col overflow-hidden border-t border-[var(--line)] px-5 py-4 sm:px-6">
                          <h3 className="truncate font-[family-name:var(--font-display)] text-lg font-bold text-[var(--ink)] xl:text-xl">
                            {active.title}
                          </h3>
                          <p className="mt-1.5 line-clamp-2 max-w-full text-sm leading-relaxed text-[var(--ink-muted)]">
                            {active.description}
                          </p>
                          <div className="mt-auto flex flex-wrap gap-3 pt-3">
                            <Link
                              href={`/work/${active.id}`}
                              className="inline-flex min-h-10 items-center rounded-xl bg-[var(--ink)] px-5 text-sm font-semibold text-white no-underline transition hover:bg-[var(--accent)]"
                            >
                              View project →
                            </Link>
                            {active.repoUrl ? (
                              <a
                                href={active.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-10 items-center rounded-xl border border-[var(--line)] px-5 text-sm font-semibold text-[var(--ink)] no-underline transition hover:border-[var(--ink)]"
                              >
                                GitHub
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </>
        )}
      </SiteContainer>
    </div>
  );
}
