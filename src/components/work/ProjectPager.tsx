"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

export type ProjectNavItem = {
  id: string;
  title: string;
};

type Props = {
  projects: ProjectNavItem[];
  currentId: string;
  prevId: string | null;
  nextId: string | null;
};

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

/**
 * Developer-focused floating pager: [ ← ] [ Projects ] [ → ]
 * with J / K and Shift+Arrow keybindings + all-projects flyout.
 */
export function ProjectPager({
  projects,
  currentId,
  prevId,
  nextId,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const hoverCloseTimer = useRef<number | null>(null);

  const go = useCallback(
    (id: string | null) => {
      if (!id || id === currentId) return;
      setOpen(false);
      router.push(`/work/${id}`);
    },
    [currentId, router],
  );

  const clearHoverClose = () => {
    if (hoverCloseTimer.current != null) {
      window.clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
  };

  const scheduleHoverClose = () => {
    clearHoverClose();
    hoverCloseTimer.current = window.setTimeout(() => setOpen(false), 160);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key;
      const shiftArrow =
        e.shiftKey && (key === "ArrowLeft" || key === "ArrowRight");

      if (key === "k" || key === "K" || (shiftArrow && key === "ArrowLeft")) {
        if (!prevId) return;
        e.preventDefault();
        go(prevId);
        return;
      }
      if (key === "j" || key === "J" || (shiftArrow && key === "ArrowRight")) {
        if (!nextId) return;
        e.preventDefault();
        go(nextId);
        return;
      }
      if (key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, nextId, prevId]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  useEffect(() => () => clearHoverClose(), []);

  const onProjectsKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
    } else if (e.key === "ArrowDown" && open) {
      e.preventDefault();
      const first = rootRef.current?.querySelector<HTMLElement>(
        `[data-project-item]`,
      );
      first?.focus();
    }
  };

  const btn =
    "inline-flex h-10 min-w-10 items-center justify-center px-2.5 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] hover:text-[var(--accent)] disabled:pointer-events-none disabled:opacity-35";

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex flex-col items-center gap-2 px-4 sm:bottom-6"
    >
      <div
        id={listId}
        role="menu"
        aria-label="All projects"
        hidden={!open}
        className={`pointer-events-auto max-h-[min(20rem,50vh)] w-[min(16.5rem,calc(100vw-2rem))] overflow-y-auto border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elevated)_96%,transparent)] py-1 shadow-[0_16px_48px_-20px_rgba(18,26,22,0.55)] backdrop-blur-md [border-radius:var(--radius)] ${
          open ? "block" : "hidden"
        }`}
        onMouseEnter={() => {
          clearHoverClose();
          setOpen(true);
        }}
        onMouseLeave={scheduleHoverClose}
      >
        <Link
          href="/work"
          role="menuitem"
          className="flex items-center justify-between gap-2 border-b border-[var(--line)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)] no-underline hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]"
          onClick={() => setOpen(false)}
        >
          ← Back to Work
          <span className="font-mono text-[10px] normal-case tracking-normal text-[var(--ink-muted)]">
            /
          </span>
        </Link>
        <ul className="m-0 list-none p-0">
          {projects.map((p) => {
            const active = p.id === currentId;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  role="menuitem"
                  data-project-item
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                    active
                      ? "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] font-semibold text-[var(--ink)]"
                      : "font-medium text-[var(--ink-muted)] hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] hover:text-[var(--ink)]"
                  }`}
                  onClick={() => go(p.id)}
                >
                  <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-display)]">
                    {p.title}
                  </span>
                  {active ? (
                    <span className="shrink-0 font-mono text-[10px] text-[var(--accent)]">
                      ●
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div
        className="pointer-events-auto flex items-center border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elevated)_92%,transparent)] p-0.5 shadow-[0_12px_40px_-16px_rgba(18,26,22,0.45)] backdrop-blur-md [border-radius:var(--radius)]"
        role="group"
        aria-label="Project pager"
        onMouseLeave={open ? scheduleHoverClose : undefined}
      >
        <button
          type="button"
          className={btn}
          style={{ borderRadius: "var(--radius)" }}
          disabled={!prevId}
          aria-label="Previous project (K)"
          title="Previous · K"
          onClick={() => go(prevId)}
        >
          <span aria-hidden>←</span>
          <kbd className="ml-1 hidden font-mono text-[10px] font-medium text-[var(--ink-muted)] sm:inline">
            K
          </kbd>
        </button>

        <span className="h-5 w-px bg-[var(--line)]" aria-hidden />

        <button
          type="button"
          className={`${btn} gap-1.5 px-3`}
          style={{ borderRadius: "var(--radius)" }}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={listId}
          title="All projects"
          onClick={() => {
            clearHoverClose();
            setOpen((v) => !v);
          }}
          onMouseEnter={() => {
            clearHoverClose();
            setOpen(true);
          }}
          onKeyDown={onProjectsKeyDown}
        >
          <kbd className="hidden font-mono text-[10px] font-medium text-[var(--ink-muted)] sm:inline">
            ⌘
          </kbd>
          <span>Projects</span>
        </button>

        <span className="h-5 w-px bg-[var(--line)]" aria-hidden />

        <button
          type="button"
          className={btn}
          style={{ borderRadius: "var(--radius)" }}
          disabled={!nextId}
          aria-label="Next project (J)"
          title="Next · J"
          onClick={() => go(nextId)}
        >
          <kbd className="mr-1 hidden font-mono text-[10px] font-medium text-[var(--ink-muted)] sm:inline">
            J
          </kbd>
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
