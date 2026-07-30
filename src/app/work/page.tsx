import type { Metadata } from "next";
import { WorkDirectory } from "@/components/work/WorkDirectory";
import { getProjects } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected agentic systems, infrastructure builds, and open-source projects.",
};

export default async function WorkPage() {
  const projects = await getProjects();
  return <WorkDirectory projects={projects} />;
}
