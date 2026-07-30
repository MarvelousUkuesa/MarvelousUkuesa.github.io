"use client";

import { use } from "react";
import { ProjectForm } from "@/components/admin/ProjectForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditProjectPage({ params }: Props) {
  const { id } = use(params);
  return <ProjectForm mode="edit" projectId={id} />;
}
