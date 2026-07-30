"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/schemas/project";
import { FeaturedProjectCard } from "@/components/work/FeaturedProjectCard";
import { WorkProjectCard } from "@/components/work/WorkProjectCard";
import {
  WORK_FILTERS,
  projectCategory,
  type WorkFilterId,
} from "@/lib/work/categories";
import {
  CHIP_GAP,
  GRID_GAP,
  SECTION_Y,
  SectionHeader,
  SiteContainer,
} from "@/components/layout/SiteContainer";

type Props = {
  projects: Project[];
};

export function WorkIndex({ projects }: Props) {
  const [filter, setFilter] = useState<WorkFilterId>("all");

  const featured = useMemo(() => {
    const pool =
      filter === "all"
        ? projects
        : projects.filter((p) => projectCategory(p) === filter);
    return pool.find((p) => p.featured) ?? pool[0] ?? null;
  }, [projects, filter]);

  const secondary = useMemo(() => {
    const pool =
      filter === "all"
        ? projects
        : projects.filter((p) => projectCategory(p) === filter);
    return pool.filter((p) => p.id !== featured?.id);
  }, [projects, filter, featured]);

  return (
    <div className={SECTION_Y}>
      <SiteContainer>
        <SectionHeader
          as="h1"
          title="Work"
          description="Selected agentic systems, infrastructure builds, and open-source projects."
        />

        <LayoutGroup>
          <motion.div
            layout
            className={`mb-8 flex flex-wrap ${CHIP_GAP} text-left lg:mb-10`}
            role="tablist"
            aria-label="Project filters"
          >
            {WORK_FILTERS.map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(tab.id)}
                  className={
                    active
                      ? "relative min-h-11 rounded-full px-4 py-2 text-sm font-semibold text-[var(--bg-elevated)]"
                      : "relative min-h-11 rounded-full border border-[var(--line)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--ink-muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
                  }
                >
                  {active ? (
                    <motion.span
                      layoutId="work-filter-pill"
                      className="absolute inset-0 rounded-full bg-[var(--ink)]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  ) : null}
                  <span className="relative z-[1]">{tab.label}</span>
                </button>
              );
            })}
          </motion.div>

          <AnimatePresence mode="wait">
            {featured ? (
              <motion.div
                key={`featured-${filter}-${featured.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="mb-8"
              >
                <FeaturedProjectCard project={featured} />
              </motion.div>
            ) : (
              <p className="mb-8 text-[var(--ink-muted)]">
                No projects in this filter.
              </p>
            )}
          </AnimatePresence>

          {secondary.length > 0 ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${GRID_GAP}`}>
              <AnimatePresence mode="popLayout">
                {secondary.map((project, i) => (
                  <WorkProjectCard
                    key={project.id}
                    project={project}
                    index={i}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : null}
        </LayoutGroup>
      </SiteContainer>
    </div>
  );
}
