"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";

type FadeInProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
  y?: number;
};

/** Section-edge enter animation. Mobile uses fade+scale; larger viewports use slide. */
export function FadeIn({
  children,
  delay = 0,
  y = 16,
  className,
  ...props
}: FadeInProps) {
  const bp = useBreakpoint();
  const reduce = useReducedMotion();
  const mobile = bp === "mobile";

  const initial = reduce
    ? false
    : mobile
      ? { opacity: 0, scale: 0.95 }
      : { opacity: 0, y };

  const animate = reduce
    ? undefined
    : mobile
      ? { opacity: 1, scale: 1 }
      : { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: mobile ? 0.4 : 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
