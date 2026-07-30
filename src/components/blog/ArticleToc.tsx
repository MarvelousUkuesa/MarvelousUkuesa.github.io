"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; text: string };

/**
 * Builds a sticky mini TOC from article h2 headings after mount.
 */
export function ArticleToc({ rootId = "article-body" }: { rootId?: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;

    const headings = Array.from(root.querySelectorAll("h2"));
    const mapped: TocItem[] = headings.map((h, i) => {
      if (!h.id) {
        h.id = `section-${i + 1}`;
      }
      return { id: h.id, text: h.textContent?.trim() || `Section ${i + 1}` };
    });
    setItems(mapped);

    if (!mapped.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.5, 1] },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [rootId]);

  if (items.length < 2) return null;

  return (
    <nav
      aria-label="On this page"
      className="hidden xl:block xl:sticky xl:top-24"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
        On this page
      </p>
      <ul className="mt-3 space-y-2 border-l border-[var(--line)]">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block border-l-2 py-1 pl-3 text-sm no-underline transition ${
                active === item.id
                  ? "-ml-px border-[var(--accent)] font-semibold text-[var(--accent)]"
                  : "-ml-px border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
