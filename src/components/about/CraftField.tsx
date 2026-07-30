"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useBreakpoint } from "@/hooks/useBreakpoint";

type Craft = {
  word: string;
  note: string;
};

type Props = {
  craft: readonly Craft[];
};

/**
 * Interactive skill cloud — hover dims siblings, scales the active tag.
 * Desktop: hover scale. Mobile/tablet: tap to select (no hover physics).
 */
export function CraftField({ craft }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const bp = useBreakpoint();
  const current = craft.find((c) => c.word === active) ?? null;
  const hovering = active !== null;
  const canHover = bp === "desktop";

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
            <motion.p
              key={current.word}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28 }}
            >
              {current.note}
            </motion.p>
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
