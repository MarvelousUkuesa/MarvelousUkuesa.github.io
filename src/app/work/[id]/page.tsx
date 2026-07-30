import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/work/ProjectDetail";
import { getProjects } from "@/lib/content/projects";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.id === id);
  const next = projects[(index + 1) % projects.length] ?? null;
  const prev =
    projects[(index - 1 + projects.length) % projects.length] ?? null;

  return (
    <ProjectDetail
      project={project}
      projects={projects.map((p) => ({ id: p.id, title: p.title }))}
      prev={prev?.id === project.id ? null : prev}
      next={next?.id === project.id ? null : next}
    />
  );
}
