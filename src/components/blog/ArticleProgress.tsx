"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/** Thin reading progress bar using site accent palette. */
export function ArticleProgress({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(rect.bottom <= window.innerHeight ? 1 : 0);
        return;
      }
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(scrolled / total);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref}>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px] origin-left bg-[var(--accent)]"
        style={{
          transform: `scaleX(${progress})`,
          opacity: progress > 0.01 ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
        aria-hidden
      />
      {children}
    </div>
  );
}
