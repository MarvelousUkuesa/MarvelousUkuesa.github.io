"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_EXPO } from "@/components/motion/Magnetic";

type Props = {
  text: string;
  className?: string;
  as?: "h1" | "p" | "span";
  /** Stagger between lines / words */
  delay?: number;
  /** Split by words instead of treating whole string as one line */
  byWord?: boolean;
};

/**
 * Clipped slide-up reveal — editorial title entrance.
 */
export function RevealLines({
  text,
  className,
  as = "p",
  delay = 0,
  byWord = false,
}: Props) {
  const reduce = useReducedMotion();
  const parts = byWord ? text.split(" ") : [text];
  const Tag = as;

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      {parts.map((part, i) => (
        <span
          key={`${part}-${i}`}
          className="reveal-line"
          style={{ display: byWord ? "inline-block" : "block" }}
        >
          <motion.span
            className="reveal-line__inner"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.8,
              ease: EASE_EXPO,
              delay: delay + i * 0.08,
            }}
            style={{ display: "inline-block" }}
          >
            {part}
            {byWord && i < parts.length - 1 ? "\u00A0" : null}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
