"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export type FocusItem = {
  label: string;
  href?: string;
};

type Props = {
  items: readonly FocusItem[];
};

const FALLBACK: FocusItem[] = [{ label: "writing about the work" }];

/** Rotating “Lately” line — latest posts when available, else static phrases. */
export function FocusCycle({ items }: Props) {
  const list = items.length > 0 ? items : FALLBACK;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [list]);

  useEffect(() => {
    if (list.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [list]);

  const current = list[index % list.length] ?? list[0];

  return (
    <p className="focus-cycle">
      <span className="focus-cycle__label">Lately ·</span>
      <span className="focus-cycle__slot" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.span
            key={`${current.href ?? ""}-${current.label}`}
            className="focus-cycle__phrase"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {current.href ? (
              <Link href={current.href} className="focus-cycle__link">
                {current.label}
              </Link>
            ) : (
              current.label
            )}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}
