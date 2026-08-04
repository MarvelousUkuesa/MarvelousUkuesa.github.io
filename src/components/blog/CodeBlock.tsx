"use client";

import { useState, type ReactNode } from "react";

type Props = {
  code: string;
  language?: string;
  children?: ReactNode;
};

export function CodeBlock({ code, language = "text", children }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-lg">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-300">
          {language === "text" ? "diagram" : language}
        </span>
        <button
          type="button"
          onClick={copy}
          className="rounded-md px-2 py-1 text-[11px] font-semibold text-neutral-300 transition hover:bg-white/10 hover:text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-neutral-100">
        <code className="font-mono">{children ?? code}</code>
      </pre>
    </div>
  );
}
