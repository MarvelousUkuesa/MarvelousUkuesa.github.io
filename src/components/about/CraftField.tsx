"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useBreakpoint } from "@/hooks/useBreakpoint";

type Craft = {
  word: string;
  note: string;
};

type CraftProject = {
  id: string;
  title: string;
  tech: string[];
};

type Props = {
  craft: readonly Craft[];
  projects?: readonly CraftProject[];
};

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9+.#]/g, "");
}

/** Match craft word to a project whose tech tag overlaps (e.g. AWS ↔ AWS Lambda). */
function findProjectForWord(
  word: string,
  projects: readonly CraftProject[],
): CraftProject | null {
  const needle = normalize(word);
  if (!needle) return null;

  const scored = projects
    .map((project) => {
      let best = 0;
      for (const tag of project.tech) {
        const hay = normalize(tag);
        if (!hay) continue;
        if (hay === needle) best = Math.max(best, 3);
        else if (hay.includes(needle) || needle.includes(hay))
          best = Math.max(best, 2);
      }
      return { project, best };
    })
    .filter((x) => x.best > 0)
    .sort((a, b) => b.best - a.best);

  return scored[0]?.project ?? null;
}

/**
 * Interactive skill cloud — hover dims siblings, scales the active tag.
 * When a project shares that tech tag, surface it as a link.
 */
export function CraftField({ craft, projects = [] }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const bp = useBreakpoint();
  const current = craft.find((c) => c.word === active) ?? null;
  const hovering = active !== null;
  const canHover = bp === "desktop";

  const matchedProject = useMemo(() => {
    if (!active) return null;
    return findProjectForWord(active, projects);
  }, [active, projects]);

  return (
    <div className="craft-field">
      <p className="craft-field__hint">
        {canHover ? "Hover a word" : "Touch a word"}
      </p>
      <ul
        className="craft-field__words"
        onMouseLeave={() => {
          if (canHover) setActive(null);
        }}
      >
        {craft.map((item) => {
          const isOn = active === item.word;
          return (
            <li key={item.word}>
              <motion.button
                type="button"
                className={`craft-word${isOn ? " craft-word--on" : ""}`}
                onMouseEnter={() => {
                  if (canHover) setActive(item.word);
                }}
                onFocus={() => setActive(item.word)}
                onBlur={() => {
                  if (canHover) setActive(null);
                }}
                onClick={() =>
                  setActive((prev) => (prev === item.word ? null : item.word))
                }
                aria-describedby="craft-note"
                animate={{
                  opacity: hovering ? (isOn ? 1 : 0.35) : 1,
                  scale: isOn && canHover ? 1.05 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: canHover ? 320 : 280,
                  damping: canHover ? 24 : 28,
                }}
              >
                {item.word}
              </motion.button>
            </li>
          );
        })}
      </ul>
      <div className="craft-field__note" id="craft-note" aria-live="polite">
        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={current.word}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28 }}
            >
              <p>{current.note}</p>
              {matchedProject ? (
                <p className="craft-field__project">
                  <span className="craft-field__project-label">In work · </span>
                  <Link
                    href={`/work/${matchedProject.id}`}
                    className="craft-field__project-link"
                  >
                    {matchedProject.title}
                  </Link>
                </p>
              ) : null}
            </motion.div>
          ) : (
            <motion.p
              key="idle"
              className="craft-field__idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              What I reach for when the work gets real.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
