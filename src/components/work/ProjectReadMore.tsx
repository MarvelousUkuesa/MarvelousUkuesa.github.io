"use client";

import { useMemo, useState } from "react";

type Props = {
  text: string;
  /** Characters before collapsing (word-boundary aware). */
  limit?: number;
};

/** Split long copy into sentences / short paragraphs for scannability. */
function toParagraphs(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const byLine = trimmed
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (byLine.length > 1) return byLine;

  const sentences = trimmed.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) ?? [
    trimmed,
  ];
  const cleaned = sentences.map((s) => s.trim()).filter(Boolean);
  if (cleaned.length <= 2) return cleaned;

  const chunks: string[] = [];
  let buf = "";
  for (const sentence of cleaned) {
    const next = buf ? `${buf} ${sentence}` : sentence;
    if (next.length > 220 && buf) {
      chunks.push(buf);
      buf = sentence;
    } else {
      buf = next;
    }
  }
  if (buf) chunks.push(buf);
  return chunks;
}

/** Justified long copy with optional Read more — matches home body type. */
export function ProjectReadMore({ text, limit = 420 }: Props) {
  const [open, setOpen] = useState(false);
  const paragraphs = useMemo(() => toParagraphs(text), [text]);
  const flat = paragraphs.join(" ");
  const needsToggle = flat.length > limit;

  const visible = (() => {
    if (!needsToggle || open) return paragraphs;
    const out: string[] = [];
    let used = 0;
    for (const p of paragraphs) {
      if (used >= limit) break;
      if (used + p.length <= limit) {
        out.push(p);
        used += p.length;
      } else {
        const slice = p.slice(0, Math.max(40, limit - used));
        const lastSpace = slice.lastIndexOf(" ");
        out.push(
          `${(lastSpace > 40 ? slice.slice(0, lastSpace) : slice).trim()}…`,
        );
        break;
      }
    }
    return out.length > 0 ? out : paragraphs.slice(0, 1);
  })();

  if (paragraphs.length === 0) return null;

  return (
    <div className="max-w-[42rem]">
      <div className="space-y-3">
        {visible.map((p) => (
          <p
            key={p.slice(0, 48)}
            className="text-justify font-[family-name:var(--font-serif)] text-[0.95rem] leading-[1.65] text-[var(--ink-muted)] sm:text-base"
          >
            {p}
          </p>
        ))}
      </div>
      {needsToggle ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-2 text-sm font-semibold text-[var(--accent)] transition hover:underline"
        >
          {open ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  );
}
