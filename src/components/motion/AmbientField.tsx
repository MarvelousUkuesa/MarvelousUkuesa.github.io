"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Site-wide sage/teal color cloud — soft blobs drift in the atmosphere,
 * and a primary glow eases toward the cursor (same language as Work coverflow).
 */
export function AmbientField({ accent = "#a8cfc6" }: { accent?: string }) {
  const spotRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = spotRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reduce.matches || !fine.matches) {
      el.style.opacity = "0.35";
      return;
    }

    let frame = 0;
    let targetX = 0.65;
    let targetY = 0.28;
    let x = targetX;
    let y = targetY;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
    };

    const tick = () => {
      x += (targetX - x) * 0.07;
      y += (targetY - y) * 0.07;
      el.style.setProperty("--spot-x", `${(x * 100).toFixed(2)}%`);
      el.style.setProperty("--spot-y", `${(y * 100).toFixed(2)}%`);
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="ambient-field" aria-hidden="true">
      {/* Cursor-following primary cloud */}
      <div ref={spotRef} className="ambient-field__spot" />

      {/* Drifting color clouds (coverflow language) */}
      <motion.div
        className="ambient-field__cloud ambient-field__cloud--a"
        style={{
          background: `radial-gradient(circle at 45% 40%, color-mix(in srgb, ${accent} 55%, var(--hero-glow)), color-mix(in srgb, var(--accent-soft) 70%, transparent) 52%, transparent 72%)`,
        }}
        animate={
          reduceMotion
            ? undefined
            : {
                x: [-24, 28, -24],
                y: [-18, 20, -18],
                scale: [1, 1.12, 1],
              }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="ambient-field__cloud ambient-field__cloud--b"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--hero-glow) 80%, transparent), transparent 70%)",
        }}
        animate={
          reduceMotion
            ? undefined
            : {
                x: [18, -22, 18],
                y: [14, -12, 14],
                scale: [1.05, 0.92, 1.05],
              }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="ambient-field__cloud ambient-field__cloud--c"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent-soft) 65%, transparent), transparent 68%)",
        }}
        animate={
          reduceMotion
            ? undefined
            : {
                x: [-12, 16, -12],
                y: [10, -14, 10],
                scale: [0.95, 1.08, 0.95],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
