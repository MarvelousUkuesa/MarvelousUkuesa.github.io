"use client";

import type { Project } from "@/lib/schemas/project";
import { CoverflowCarousel } from "@/components/work/CoverflowCarousel";

type Props = {
  projects: Project[];
};

/** Work-section wrapper — keeps imports stable for FeaturedWork. */
export function WorkCoverflow({ projects }: Props) {
  return <CoverflowCarousel projects={projects} />;
}
