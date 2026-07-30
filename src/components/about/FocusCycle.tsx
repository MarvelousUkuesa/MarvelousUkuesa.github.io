"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type Props = {
  phrases: readonly string[];
};

/** Rotating focus line — range without a résumé dump. */
export function FocusCycle({ phrases }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (phrases.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [phrases]);

  return (
    <p className="focus-cycle">
      <span className="focus-cycle__label">Lately ·</span>
      <span className="focus-cycle__slot" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.span
            key={phrases[index]}
            className="focus-cycle__phrase"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {phrases[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}
