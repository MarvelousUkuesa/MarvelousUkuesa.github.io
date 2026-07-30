import type { Project } from "@/lib/schemas/project";
import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import { WorkCoverflow } from "@/components/work/WorkCoverflow";
import { Section, SectionHeader } from "@/components/layout/SiteContainer";

type Props = {
  projects: Project[];
};

export function FeaturedWork({ projects }: Props) {
  if (projects.length === 0) return null;

  return (
    <Section
      id="work"
      className="relative overflow-x-clip"
      aria-labelledby="work-heading"
    >
      <FadeIn>
        <SectionHeader
          id="work-heading"
          title="Work"
          description={
            <>
              <span className="sm:hidden">Swipe through featured projects.</span>
              <span className="hidden sm:inline">
                Drag or click through featured projects.
              </span>
            </>
          }
        />
      </FadeIn>
      <FadeIn delay={0.06}>
        <WorkCoverflow projects={projects} />
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="section__more mt-8 text-left lg:mt-10">
          <Link href="/work">View all projects →</Link>
        </p>
      </FadeIn>
    </Section>
  );
}
