"use client";

import type { Project } from "@/lib/schemas/project";
import type { Post } from "@/lib/schemas/post";
import { WorkPageBlogColumn } from "@/components/work/WorkPageBlogColumn";
import { WorkPageCoverflow } from "@/components/work/WorkPageCoverflow";
import {
  GRID_GAP,
  SECTION_Y,
  SiteContainer,
} from "@/components/layout/SiteContainer";

type Props = {
  projects: Project[];
  posts: Post[];
};

/** /work page — stacks on mobile, split Work | Blog from lg up. */
export function WorkPageLayout({ projects, posts }: Props) {
  return (
    <div className={SECTION_Y}>
      <SiteContainer>
        <div
          className={`flex flex-col lg:grid lg:grid-cols-[1.35fr_1fr] lg:items-start ${GRID_GAP} lg:gap-8`}
        >
          <section className="min-w-0" aria-labelledby="work-page-heading">
            <header className="mb-8 text-left lg:mb-10">
              <h1
                id="work-page-heading"
                className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl lg:text-[clamp(2.4rem,4.5vw,3.25rem)]"
              >
                Work
              </h1>
            </header>
            <WorkPageCoverflow projects={projects} />
          </section>

          <aside className="min-w-0 lg:sticky lg:top-24" aria-label="Blog">
            <WorkPageBlogColumn posts={posts} />
          </aside>
        </div>
      </SiteContainer>
    </div>
  );
}
