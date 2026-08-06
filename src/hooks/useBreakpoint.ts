"use client";

import { useEffect, useState } from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

function resolveBreakpoint(width: number): Breakpoint {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

/**
 * Viewport breakpoint for layout + motion physics.
 * SSR-safe: starts as "desktop" then syncs after mount.
 */
export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("desktop");

  useEffect(() => {
    const sync = () => setBp(resolveBreakpoint(window.innerWidth));
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return bp;
}

export function useMediaQuery(query: string, defaultMatches = false) {
  const [matches, setMatches] = useState(defaultMatches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);

  return matches;
}

/** Coverflow physics tuned per viewport */
export function coverflowPhysics(bp: Breakpoint) {
  if (bp === "mobile") {
    return {
      rotateY: 0,
      spread: 0,
      zStep: 0,
      perspective: undefined as string | undefined,
      enable3d: false,
      enableTilt: false,
      enableGlowFollow: false,
      spring: { type: "spring" as const, stiffness: 320, damping: 32, mass: 0.8 },
    };
  }
  if (bp === "tablet") {
    return {
      rotateY: 28,
      spread: 220,
      zStep: 70,
      perspective: "1100px" as string | undefined,
      enable3d: true,
      enableTilt: false,
      enableGlowFollow: false,
      spring: { type: "spring" as const, stiffness: 260, damping: 28, mass: 0.9 },
    };
  }
  return {
    rotateY: 36,
    spread: 280,
    zStep: 90,
    perspective: "1200px" as string | undefined,
    enable3d: true,
    enableTilt: true,
    enableGlowFollow: true,
    spring: { type: "spring" as const, stiffness: 250, damping: 25, mass: 0.9 },
  };
}

/**
 * Shortest signed ring distance so the active item stays centered
 * and neighbors fan left/right even at the array ends (infinite loop).
 */
export function circularRelativeIndex(
  index: number,
  progress: number,
  count: number,
): number {
  if (count <= 0) return 0;
  let offset = index - progress;
  const half = count / 2;
  while (offset > half) offset -= count;
  while (offset < -half) offset += count;
  return offset;
}
