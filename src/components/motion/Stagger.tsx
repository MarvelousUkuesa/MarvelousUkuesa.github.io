"use client";

import { motion } from "motion/react";
import {
  Children,
  type ReactNode,
  isValidElement,
} from "react";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

/** Stagger children on scroll-in. Each direct child gets a delay. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        return (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 14 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
