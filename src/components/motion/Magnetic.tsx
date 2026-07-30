"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  useRef,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** Attraction radius in px */
  radius?: number;
  /** How strongly the element follows (0–1) */
  strength?: number;
  as?: "div" | "span";
};

/**
 * Springs toward the pointer when it enters a radius around the element.
 * Disabled on mobile / reduced motion — hover physics are desktop-only.
 */
export function Magnetic({
  children,
  className,
  radius = 30,
  strength = 0.35,
  as = "div",
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const bp = useBreakpoint();
  const enabled = !reduce && bp === "desktop";
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  const onMove = (e: ReactPointerEvent) => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > radius + Math.max(rect.width, rect.height) / 2) {
      x.set(0);
      y.set(0);
      return;
    }
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Comp = as === "span" ? motion.span : motion.div;

  return (
    <Comp
      ref={ref}
      className={className}
      style={{
        x: enabled ? springX : 0,
        y: enabled ? springY : 0,
        display: as === "span" ? "inline-flex" : undefined,
      }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </Comp>
  );
}

export { EASE_EXPO };
