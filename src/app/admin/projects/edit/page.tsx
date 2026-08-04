"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";

function EditProjectInner() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id")?.trim() ?? "";

  if (!projectId) {
    return <p className="admin-error">Missing project id.</p>;
  }

  return <ProjectForm mode="edit" projectId={projectId} />;
}

/** Static export–friendly edit route: /admin/projects/edit/?id=… */
export default function EditProjectPage() {
  return (
    <Suspense fallback={<p className="admin-status">Loading…</p>}>
      <EditProjectInner />
    </Suspense>
  );
}
