"use client";

import { motion, useReducedMotion } from "motion/react";

type Props = {
  /** Active project accent — cloud tint eases toward this color */
  accent?: string;
};

/**
 * Soft floating sage/teal atmosphere behind the Work coverflow.
 * Matches page ambient (--hero-glow / --accent-soft); no hard dark blocks.
 */
export function ColorCloud({ accent = "#a8cfc6" }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        className="absolute left-1/2 top-[42%] h-[min(26rem,65vw)] w-[min(40rem,88%)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[100px] will-change-transform"
        style={{
          background: `radial-gradient(circle at 45% 40%, color-mix(in srgb, ${accent} 55%, var(--hero-glow)), color-mix(in srgb, var(--accent-soft) 70%, transparent) 52%, transparent 72%)`,
          transition: "background 700ms ease",
        }}
        animate={
          reduceMotion
            ? undefined
            : {
                x: [-20, 20, -20],
                y: [-15, 15, -15],
                scale: [1, 1.15, 1],
              }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[28%] top-[28%] h-56 w-72 rounded-full opacity-30 blur-[90px] will-change-transform sm:h-64 sm:w-80"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--hero-glow) 80%, transparent), transparent 70%)",
        }}
        animate={
          reduceMotion
            ? undefined
            : {
                x: [16, -18, 16],
                y: [12, -10, 12],
                scale: [1.05, 0.95, 1.05],
              }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
