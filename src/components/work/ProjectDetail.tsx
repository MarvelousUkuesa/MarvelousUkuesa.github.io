import type { Project } from "@/lib/schemas/project";
import { FadeIn } from "@/components/motion/FadeIn";
import {
  ProjectPager,
  type ProjectNavItem,
} from "@/components/work/ProjectPager";
import { ProjectReadMore } from "@/components/work/ProjectReadMore";
import {
  formatUpdated,
  projectCategory,
  projectStatus,
} from "@/lib/work/categories";
import { SiteContainer } from "@/components/layout/SiteContainer";

type Props = {
  project: Project;
  projects: ProjectNavItem[];
  prev: Project | null;
  next: Project | null;
};

const ROLE_BY_CATEGORY = {
  ai: "Systems / Agents",
  cloud: "Infrastructure",
  tools: "Product Engineering",
} as const;

function yearFrom(project: Project) {
  if (project.updatedAt) {
    const y = new Date(project.updatedAt).getFullYear();
    if (!Number.isNaN(y)) return String(y);
  }
  if (project.createdAt) {
    const y = new Date(project.createdAt).getFullYear();
    if (!Number.isNaN(y)) return String(y);
  }
  return new Date().getFullYear().toString();
}

function galleryImages(project: Project): string[] {
  const fromGallery = (project.gallery ?? []).filter(Boolean);
  if (fromGallery.length > 0) return fromGallery;
  if (project.image) return [project.image];
  return [];
}

function leadSentence(description: string) {
  const text = description.trim();
  if (!text) return "";
  const match = text.match(/^(.+?[.!?])(\s|$)/);
  if (match?.[1] && match[1].length <= 160) return match[1];
  if (text.length <= 140) return text;
  const slice = text.slice(0, 140);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 50 ? slice.slice(0, lastSpace) : slice).trim()}…`;
}

export function ProjectDetail({ project, projects, prev, next }: Props) {
  const images = galleryImages(project);
  const singleImage = images.length === 1 ? images[0] : undefined;
  const multiImages = images.length > 1 ? images : [];
  const status = projectStatus(project);
  const category = projectCategory(project);
  const role = ROLE_BY_CATEGORY[category];
  const year = yearFrom(project);
  const updated = formatUpdated(project.updatedAt);
  const highlights = project.highlights.filter(Boolean);
  const hasStats =
    project.commits != null ||
    project.prs != null ||
    typeof project.stars === "number";
  const lead = leadSentence(project.description);

  const showPrev = prev && prev.id !== project.id ? prev : null;
  const showNext = next && next.id !== project.id ? next : null;

  return (
    <article className="relative pb-28 pt-10 sm:pt-12 lg:pt-16">
      <ProjectPager
        projects={projects}
        currentId={project.id}
        prevId={showPrev?.id ?? null}
        nextId={showNext?.id ?? null}
      />
      <SiteContainer>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start md:gap-10 lg:gap-12">
          {/* Main column — same type rhythm as home About / section heads */}
          <div className="min-w-0 space-y-10 md:col-span-7 lg:col-span-8">
            <FadeIn>
              <header className="border-b border-[var(--line)] pb-8">
                <p className="contact__eyebrow !mb-0">
                  Project
                  <span className="mx-1.5 text-[var(--line)]">/</span>
                  {year}
                  <span className="mx-1.5 text-[var(--line)]">·</span>
                  {status}
                </p>

                <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl lg:text-[clamp(2rem,3.5vw,2.75rem)] lg:leading-[1.1]">
                  {project.title}
                </h1>

                {lead ? (
                  <p className="about__lead mt-4 max-w-[42rem] text-justify">
                    {lead}
                  </p>
                ) : null}
              </header>
            </FadeIn>

            <FadeIn>
              <section aria-labelledby="overview-heading">
                <h2
                  id="overview-heading"
                  className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-[var(--ink)] sm:text-2xl"
                >
                  Problem & context
                </h2>
                <div className="mt-4">
                  <ProjectReadMore text={project.description} />
                </div>
              </section>
            </FadeIn>

            {highlights.length > 0 ? (
              <FadeIn delay={0.02}>
                <section aria-labelledby="features-heading">
                  <h2
                    id="features-heading"
                    className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-[var(--ink)] sm:text-2xl"
                  >
                    Key features
                  </h2>
                  <ul className="mt-4 max-w-[42rem] space-y-2.5">
                    {highlights.map((h) => (
                      <li
                        key={h}
                        className="flex gap-3 text-justify text-sm leading-relaxed text-[var(--ink-muted)] sm:text-base"
                      >
                        <span
                          className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1">{h}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </FadeIn>
            ) : null}

            {hasStats ? (
              <FadeIn delay={0.03}>
                <dl className="grid max-w-md grid-cols-3 gap-3 border border-[var(--line)] bg-[var(--bg-elevated)] p-4 [border-radius:var(--radius)]">
                  {project.commits != null ? (
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                        Commits
                      </dt>
                      <dd className="mt-0.5 font-[family-name:var(--font-display)] text-lg font-bold tabular-nums">
                        {project.commits}
                      </dd>
                    </div>
                  ) : null}
                  {project.prs != null ? (
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                        PRs
                      </dt>
                      <dd className="mt-0.5 font-[family-name:var(--font-display)] text-lg font-bold tabular-nums">
                        {project.prs}
                      </dd>
                    </div>
                  ) : null}
                  {typeof project.stars === "number" ? (
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                        Stars
                      </dt>
                      <dd className="mt-0.5 font-[family-name:var(--font-display)] text-lg font-bold tabular-nums">
                        {project.stars}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </FadeIn>
            ) : null}
          </div>

          {/* Sidebar — project-card language from home */}
          <aside className="flex w-full flex-col gap-5 md:col-span-5 md:self-start lg:sticky lg:top-6 lg:col-span-4 lg:self-start">
            <FadeIn delay={0.03}>
              <div className="project-card w-full !gap-0 p-5 sm:p-6">
                <p className="contact__eyebrow !mb-0">At a glance</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                      Role
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-[var(--ink)]">
                      {role}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                      Year
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-[var(--ink)]">
                      {year}
                    </p>
                  </div>
                  {updated ? (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                        Updated
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-[var(--ink)]">
                        {updated}
                      </p>
                    </div>
                  ) : null}
                  {project.tech.length > 0 ? (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                        Stack
                      </p>
                      <ul className="tech-list mt-2">
                        {project.tech.slice(0, 8).map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {highlights.length > 0 ? (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                        Highlights
                      </p>
                      <ul className="mt-1.5 space-y-1">
                        {highlights.slice(0, 4).map((h) => (
                          <li
                            key={h}
                            className="text-sm leading-snug text-[var(--ink)]"
                          >
                            · {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {(project.demoUrl || project.repoUrl) && (
                    <div className="flex flex-col gap-2 border-t border-[var(--line)] pt-4">
                      {project.demoUrl ? (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn--primary w-full"
                        >
                          Live demo →
                        </a>
                      ) : null}
                      {project.repoUrl ? (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn--ghost w-full"
                        >
                          GitHub
                        </a>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>

            {singleImage ? (
              <FadeIn delay={0.04}>
                <div className="w-full overflow-hidden border border-[var(--line)] bg-[var(--bg-elevated)] [border-radius:var(--radius)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={singleImage}
                    alt=""
                    className="aspect-[4/3] w-full object-cover object-top"
                  />
                </div>
              </FadeIn>
            ) : null}

            {multiImages.length > 0 ? (
              <FadeIn delay={0.04}>
                <ul className="grid w-full grid-cols-1 gap-3">
                  {multiImages.map((src) => (
                    <li
                      key={src}
                      className="w-full overflow-hidden border border-[var(--line)] bg-[var(--bg-elevated)] [border-radius:var(--radius)]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover object-top"
                      />
                    </li>
                  ))}
                </ul>
              </FadeIn>
            ) : null}
          </aside>
        </div>
      </SiteContainer>
    </article>
  );
}
