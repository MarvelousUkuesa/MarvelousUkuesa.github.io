"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { CodeBlock } from "@/components/blog/CodeBlock";

type Props = {
  content: string;
};

/** Allow common article HTML while stripping scripts/events. */
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ...(defaultSchema.attributes?.code ?? []),
      ["className", /^language-./],
    ],
    span: [...(defaultSchema.attributes?.span ?? []), ["className"]],
    div: [...(defaultSchema.attributes?.div ?? []), ["className"]],
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      ["className"],
      ["loading"],
    ],
    a: [...(defaultSchema.attributes?.a ?? []), ["className"], ["target"], ["rel"]],
    table: [...(defaultSchema.attributes?.table ?? []), ["className"]],
    th: [...(defaultSchema.attributes?.th ?? []), ["className"], ["align"]],
    td: [...(defaultSchema.attributes?.td ?? []), ["className"], ["align"]],
  },
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "video",
    "source",
    "figure",
    "figcaption",
    "section",
    "header",
    "footer",
  ],
};

function languageFromClassName(className?: string) {
  const match = /language-([\w-]+)/.exec(className ?? "");
  return match?.[1] ?? "text";
}

const components: Components = {
  pre({ children }) {
    return <>{children}</>;
  },
  code({ className, children, ...props }) {
    const text = String(children).replace(/\n$/, "");
    const isBlock = Boolean(className) || text.includes("\n");

    if (!isBlock) {
      return (
        <code
          className="rounded bg-[color-mix(in_srgb,var(--ink)_8%,transparent)] px-1.5 py-0.5 font-mono text-[0.88em] text-[var(--ink)]"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <CodeBlock code={text} language={languageFromClassName(className)}>
        {text}
      </CodeBlock>
    );
  },
  blockquote({ children }) {
    return (
      <aside className="not-prose my-8 rounded-r-xl border-l-4 border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent-soft)_45%,var(--bg-elevated))] p-5 text-[var(--ink)]">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Takeaway
        </p>
        <div className="text-[0.98rem] leading-relaxed text-[var(--ink)] [&_p]:m-0">
          {children}
        </div>
      </aside>
    );
  },
};

/**
 * Renders post body as Markdown and/or HTML.
 * HTML is parsed via rehype-raw and sanitized before display.
 */
export function Markdown({ content }: Props) {
  return (
    <div className="prose prose-slate article-prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
