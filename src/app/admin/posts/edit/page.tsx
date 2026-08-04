"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";

function EditPostInner() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug")?.trim() ?? "";

  if (!slug) {
    return <p className="admin-error">Missing post slug.</p>;
  }

  return <PostForm mode="edit" slug={slug} />;
}

/** Static export–friendly edit route: /admin/posts/edit/?slug=… */
export default function EditPostPage() {
  return (
    <Suspense fallback={<p className="admin-status">Loading…</p>}>
      <EditPostInner />
    </Suspense>
  );
}
