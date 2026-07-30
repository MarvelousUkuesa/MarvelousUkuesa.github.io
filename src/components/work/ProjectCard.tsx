import type { Project } from "@/lib/schemas/project";
import { MediaGallery } from "@/components/media/MediaGallery";

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
  const gallery = project.gallery?.length
    ? project.gallery
    : project.image
      ? [project.image]
      : [];

  return (
    <article className="project-card">
      <div className="project-card__meta">
        {project.featured ? <span className="pill">Featured</span> : null}
        {typeof project.stars === "number" ? (
          <span className="muted">{project.stars}★</span>
        ) : null}
      </div>
      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__desc">{project.description}</p>
      <MediaGallery images={gallery} label={`${project.title} gallery`} />
      {project.tech.length > 0 ? (
        <ul className="tech-list">
          {project.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      ) : null}
      <div className="project-card__links">
        {project.repoUrl ? (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
            Repository
          </a>
        ) : null}
        {project.demoUrl ? (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
            Live demo
          </a>
        ) : null}
      </div>
    </article>
  );
}
