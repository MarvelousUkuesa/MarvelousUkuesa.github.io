import { site } from "@/content/site";
import { FadeIn } from "@/components/motion/FadeIn";
import { FocusCycle, type FocusItem } from "@/components/about/FocusCycle";
import { CraftField } from "@/components/about/CraftField";
import { Section, SectionHeader } from "@/components/layout/SiteContainer";
import type { Post } from "@/lib/schemas/post";
import type { Project } from "@/lib/schemas/project";

type Props = {
  latestPosts?: Post[];
  projects?: Project[];
};

export function About({ latestPosts = [], projects = [] }: Props) {
  const focusItems: FocusItem[] =
    latestPosts.length > 0
      ? latestPosts.map((post) => ({
          label: post.title,
          href: `/blog/${post.slug}`,
        }))
      : site.about.focus.map((phrase) => ({ label: phrase }));

  const craftProjects = projects
    .filter((p) => !p.draft)
    .map((p) => ({
      id: p.id,
      title: p.title,
      tech: p.tech,
    }));

  return (
    <Section id="about" className="about" aria-labelledby="about-heading">
      <FadeIn>
        <SectionHeader
          id="about-heading"
          title="About"
          description="A little about who I am and how I got here."
        />
      </FadeIn>

      <div className="about__grid">
        <FadeIn>
          <div className="about__copy">
            <p className="about__lead">{site.about.lead}</p>
            {site.about.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="about__body">
                {paragraph}
              </p>
            ))}
            <FocusCycle items={focusItems} />
          </div>
        </FadeIn>
        <FadeIn delay={0.12}>
          <CraftField craft={site.about.craft} projects={craftProjects} />
        </FadeIn>
      </div>
    </Section>
  );
}
