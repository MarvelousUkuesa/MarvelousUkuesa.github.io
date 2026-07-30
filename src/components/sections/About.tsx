import { site } from "@/content/site";
import { FadeIn } from "@/components/motion/FadeIn";
import { FocusCycle } from "@/components/about/FocusCycle";
import { CraftField } from "@/components/about/CraftField";
import { Section, SectionHeader } from "@/components/layout/SiteContainer";

export function About() {
  return (
    <Section id="about" className="about" aria-labelledby="about-heading">
      <FadeIn>
        <SectionHeader
          id="about-heading"
          title="About"
          description="A little signal, not a sales sheet."
        />
      </FadeIn>

      <div className="about__grid">
        <FadeIn>
          <div className="about__copy">
            <p className="about__lead">{site.about.lead}</p>
            <p className="about__body">{site.about.body}</p>
            <FocusCycle phrases={site.about.focus} />
          </div>
        </FadeIn>
        <FadeIn delay={0.12}>
          <CraftField craft={site.about.craft} />
        </FadeIn>
      </div>
    </Section>
  );
}
