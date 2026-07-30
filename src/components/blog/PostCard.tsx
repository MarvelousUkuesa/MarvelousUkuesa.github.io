import Link from "next/link";
import type { Post } from "@/lib/schemas/post";

type Props = {
  post: Post;
};

export function PostCard({ post }: Props) {
  const date = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="post-card">
      <div className="post-card__meta">
        <time dateTime={post.date}>{date}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readingTime}</span>
      </div>
      <h3 className="post-card__title">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="post-card__summary">{post.summary}</p>
      {post.tags.length > 0 ? (
        <ul className="tag-list">
          {post.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
