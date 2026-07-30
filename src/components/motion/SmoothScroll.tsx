"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Inertia scrolling via Lenis. Falls back to native scroll when reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!enabled) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: true,
        anchors: {
          offset: 0,
        },
      }}
    >
      {children}
    </ReactLenis>
  );
}
