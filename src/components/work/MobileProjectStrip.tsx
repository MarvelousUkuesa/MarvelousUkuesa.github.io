"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Project } from "@/lib/schemas/project";

type Props = {
  projects: Project[];
  activeId?: string;
  onActiveChange?: (index: number) => void;
};

function coverFor(project: Project) {
  return project.gallery?.[0] ?? project.image;
}

/**
 * Native horizontal snap strip for mobile — better touch ergonomics than 3D coverflow.
 */
export function MobileProjectStrip({
  projects,
  activeId,
  onActiveChange,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const fromScroll = useRef(false);
  const lastIndex = useRef(-1);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !onActiveChange) return;

    const onScroll = () => {
      const cards = Array.from(
        el.querySelectorAll<HTMLElement>("[data-project-card]"),
      );
      if (!cards.length) return;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const center = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      if (best === lastIndex.current) return;
      lastIndex.current = best;
      fromScroll.current = true;
      onActiveChange(best);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [onActiveChange, projects.length]);

  useEffect(() => {
    if (!activeId || !scrollerRef.current) return;
    if (fromScroll.current) {
      fromScroll.current = false;
      return;
    }
    const card = scrollerRef.current.querySelector<HTMLElement>(
      `[data-project-id="${activeId}"]`,
    );
    card?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeId]);

  return (
    <div className="relative w-full">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3 pt-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {projects.map((project) => {
          const src = coverFor(project);
          return (
            <Link
              key={project.id}
              href={`/work/${project.id}`}
              data-project-card
              data-project-id={project.id}
              className="w-[min(78vw,20rem)] shrink-0 snap-center overflow-hidden rounded-2xl border border-neutral-800/30 bg-neutral-950 text-white no-underline shadow-xl"
            >
              <div className="relative aspect-[3/4] bg-[#0b1220]">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="flex h-full flex-col justify-between p-4">
                    <span className="w-fit rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/90">
                      Architecture View
                    </span>
                    <div>
                      <p className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
                        {project.title}
                      </p>
                      <p className="mt-2 line-clamp-3 text-sm text-white/60">
                        {project.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="border-t border-white/10 bg-white px-4 py-3 text-[var(--ink)]">
                <p className="truncate font-[family-name:var(--font-display)] text-sm font-semibold">
                  {project.title}
                </p>
                {project.tech[0] ? (
                  <p className="mt-0.5 truncate text-xs text-[var(--accent)]">
                    {project.tech.slice(0, 2).join(" · ")}
                  </p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
      <p className="mt-1 text-center text-xs text-[var(--ink-muted)]">
        Swipe to browse · tap to open
      </p>
    </div>
  );
}
