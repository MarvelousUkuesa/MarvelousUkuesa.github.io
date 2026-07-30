"use client";

import { use } from "react";
import { PostForm } from "@/components/admin/PostForm";

type Props = {
  params: Promise<{ slug: string }>;
};

export default function EditPostPage({ params }: Props) {
  const { slug } = use(params);
  return <PostForm mode="edit" slug={slug} />;
}
