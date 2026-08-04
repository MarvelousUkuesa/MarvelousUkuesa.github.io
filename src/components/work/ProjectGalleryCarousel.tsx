"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  images: string[];
  label?: string;
};

const INTERVAL_MS = 3000;

/**
 * Single-frame gallery carousel — auto-advances every 3s.
 * Click opens a centered lightbox at ~half viewport.
 */
export function ProjectGalleryCarousel({
  images,
  label = "Project gallery",
}: Props) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const count = images.length;
  const current = images[index] ?? images[0];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (count <= 1 || open || reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [count, open, reduce]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" && count > 1) {
        setIndex((i) => (i + 1) % count);
      }
      if (e.key === "ArrowLeft" && count > 1) {
        setIndex((i) => (i - 1 + count) % count);
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, count]);

  if (!current) return null;

  const lightbox = mounted
    ? createPortal(
        <AnimatePresence>
          {open ? (
            <motion.div
              key="gallery-lightbox"
              className="fixed inset-0 z-[60] flex items-center justify-center bg-[color-mix(in_srgb,var(--ink)_45%,transparent)] p-4 backdrop-blur-[2px]"
              role="dialog"
              aria-modal="true"
              aria-label="Expanded gallery image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
            >
              <motion.div
                className="relative w-[min(100%,50vw)] max-w-3xl overflow-hidden border border-[var(--line)] bg-[var(--bg-elevated)] shadow-[0_24px_80px_-24px_rgba(18,26,22,0.65)] [border-radius:var(--radius)]"
                initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current}
                  alt=""
                  className="aspect-[4/3] w-full bg-[var(--bg)] object-contain object-center sm:aspect-auto sm:max-h-[50vh]"
                />
                <button
                  type="button"
                  onClick={close}
                  className="absolute right-2 top-2 inline-flex h-9 min-w-9 items-center justify-center bg-[color-mix(in_srgb,var(--bg-elevated)_90%,transparent)] px-2 text-sm font-semibold text-[var(--ink)] backdrop-blur-sm transition hover:text-[var(--accent)] [border-radius:var(--radius)]"
                  aria-label="Close"
                >
                  ✕
                </button>
                {count > 1 ? (
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-[color-mix(in_srgb,var(--bg-elevated)_88%,transparent)] px-2 py-2 backdrop-blur-sm">
                    <button
                      type="button"
                      className="inline-flex h-9 min-w-9 items-center justify-center text-sm font-semibold text-[var(--ink)] transition hover:text-[var(--accent)]"
                      aria-label="Previous image"
                      onClick={() =>
                        setIndex((i) => (i - 1 + count) % count)
                      }
                    >
                      ←
                    </button>
                    <span className="font-mono text-[11px] text-[var(--ink-muted)]">
                      {index + 1} / {count}
                    </span>
                    <button
                      type="button"
                      className="inline-flex h-9 min-w-9 items-center justify-center text-sm font-semibold text-[var(--ink)] transition hover:text-[var(--accent)]"
                      aria-label="Next image"
                      onClick={() => setIndex((i) => (i + 1) % count)}
                    >
                      →
                    </button>
                  </div>
                ) : null}
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <>
      <div
        className="relative w-full overflow-hidden border border-[var(--line)] bg-[var(--bg-elevated)] [border-radius:var(--radius)]"
        aria-label={label}
      >
        <button
          type="button"
          className="group relative block w-full appearance-none border-0 bg-transparent p-0 text-left"
          onClick={() => setOpen(true)}
          aria-label="View larger image"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={current}
                src={current}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-top"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.35 }}
              />
            </AnimatePresence>
          </div>
          <span className="pointer-events-none absolute inset-0 bg-[color-mix(in_srgb,var(--ink)_0%,transparent)] transition group-hover:bg-[color-mix(in_srgb,var(--ink)_8%,transparent)]" />
        </button>

        {count > 1 ? (
          <div
            className="absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5"
            role="tablist"
            aria-label="Gallery slides"
          >
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-4 bg-[var(--accent)]"
                    : "w-1.5 bg-[color-mix(in_srgb,var(--ink)_35%,transparent)] hover:bg-[color-mix(in_srgb,var(--ink)_55%,transparent)]"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
      {lightbox}
    </>
  );
}
