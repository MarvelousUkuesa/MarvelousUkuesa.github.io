"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type PanInfo,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/schemas/project";
import { MobileProjectStrip } from "@/components/work/MobileProjectStrip";
import { ColorCloud } from "@/components/work/ColorCloud";
import {
  circularRelativeIndex,
  coverflowPhysics,
  useBreakpoint,
} from "@/hooks/useBreakpoint";

type Props = {
  projects: Project[];
};

function coverFor(project: Project) {
  return project.gallery?.[0] ?? project.image;
}

const VISIBLE_RANGE = 3;
const Z_MAX = 220;
const TILT_MAX = 8;
const SPREAD_DESKTOP = 128;

const MOCK_THEMES = [
  { bg: "#1a2420", panel: "#243530", accent: "#9ec9c0", ink: "#e8ece9", muted: "#8a9a92" },
  { bg: "#141c18", panel: "#1e2a24", accent: "#a8cfc6", ink: "#f4f6f4", muted: "#7a8b82" },
  { bg: "#1c2824", panel: "#2a3832", accent: "#c8e0db", ink: "#e8ece9", muted: "#8a9a92" },
  { bg: "#161e1a", panel: "#202c26", accent: "#7eb8ae", ink: "#f4f6f4", muted: "#6b7c74" },
  { bg: "#1a2218", panel: "#283428", accent: "#b8c9a0", ink: "#e8ece9", muted: "#8a9a92" },
  { bg: "#1c2018", panel: "#2a3024", accent: "#c4b896", ink: "#f4f6f4", muted: "#8a8a7a" },
] as const;

function themeFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i) * 17) % MOCK_THEMES.length;
  }
  return MOCK_THEMES[hash] ?? MOCK_THEMES[0];
}

function MockupScreen({ project }: { project: Project }) {
  const theme = themeFor(project.id);
  const chips = project.tech.slice(0, 3);

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden"
      style={{ background: theme.bg, color: theme.ink }}
    >
      <div
        className="flex items-center gap-1.5 border-b px-3 py-2.5"
        style={{ borderColor: `${theme.ink}14`, background: theme.panel }}
      >
        <span className="h-2 w-2 rounded-full" style={{ background: "#f87171" }} />
        <span className="h-2 w-2 rounded-full" style={{ background: "#fbbf24" }} />
        <span className="h-2 w-2 rounded-full" style={{ background: "#4ade80" }} />
        <span
          className="ml-2 truncate text-[10px] font-medium tracking-wide"
          style={{ color: theme.muted }}
        >
          {project.title.toLowerCase().replace(/\s+/g, "-")}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 gap-2 p-3">
        <div
          className="hidden w-[22%] flex-col gap-1.5 rounded-md p-2 sm:flex"
          style={{ background: theme.panel }}
        >
          {[0.9, 0.55, 0.4, 0.65].map((w, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full"
              style={{
                width: `${w * 100}%`,
                background: i === 0 ? theme.accent : `${theme.ink}22`,
              }}
            />
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="rounded-md px-3 py-2" style={{ background: theme.panel }}>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: theme.accent }}
            >
              Preview
            </p>
            <p className="mt-1 truncate text-sm font-bold tracking-tight">
              {project.title}
            </p>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-2 gap-2">
            <div
              className="rounded-md"
              style={{
                background: `linear-gradient(145deg, ${theme.accent}55, ${theme.panel})`,
              }}
            />
            <div className="flex flex-col gap-2">
              <div className="h-1/2 rounded-md" style={{ background: `${theme.ink}12` }} />
              <div className="h-1/2 rounded-md" style={{ background: theme.panel }} />
            </div>
          </div>

          {chips.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {chips.map((t) => (
                <span
                  key={t}
                  className="rounded px-1.5 py-0.5 text-[9px] font-medium"
                  style={{
                    background: `${theme.accent}22`,
                    color: theme.accent,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ProjectPreview({
  project,
  isCenter,
}: {
  project: Project;
  isCenter: boolean;
}) {
  const src = coverFor(project);
  const gallery = project.gallery?.length
    ? project.gallery.slice(0, 3)
    : src
      ? [src]
      : [];

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] shadow-[0_18px_48px_-28px_rgba(18,26,22,0.35)]">
      <div className="relative min-h-0 flex-1 bg-[color-mix(in_srgb,var(--accent)_10%,var(--bg))]">
        {gallery.length === 1 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gallery[0]}
            alt=""
            draggable={false}
            className="pointer-events-none h-full w-full object-cover"
          />
        ) : gallery.length > 1 ? (
          <div className="grid h-full grid-cols-2 gap-1.5 bg-[color-mix(in_srgb,var(--accent)_8%,var(--bg))] p-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gallery[0]}
              alt=""
              draggable={false}
              className="pointer-events-none col-span-2 h-[58%] w-full rounded-lg object-cover"
            />
            {gallery.slice(1, 3).map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt=""
                draggable={false}
                className="pointer-events-none h-full w-full rounded-md object-cover"
              />
            ))}
          </div>
        ) : (
          <MockupScreen project={project} />
        )}
      </div>

      <div className="shrink-0 border-t border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-3 text-left">
        <p className="truncate font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-[var(--ink)] sm:text-base">
          {project.title}
        </p>
        {isCenter ? (
          <p className="mt-0.5 line-clamp-2 text-xs text-[var(--ink-muted)]">
            {project.description}
          </p>
        ) : project.tech[0] ? (
          <p className="mt-0.5 truncate text-xs text-[var(--accent)]">
            {project.tech.slice(0, 2).join(" · ")}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function cardMotion(
  offset: number,
  reduceMotion: boolean | null,
  rotateMax: number,
  zStep: number,
) {
  const abs = Math.abs(offset);
  const visible = abs <= VISIBLE_RANGE;

  let rotateY = 0;
  if (!reduceMotion && abs > 0.001 && rotateMax > 0) {
    const t = Math.min(abs, 1);
    rotateY = Math.sign(offset) * -rotateMax * t;
  }

  const z = reduceMotion || zStep === 0 ? 0 : -Math.min(Z_MAX, abs * zStep);
  // Center full size; flanking cards recede as depth (≈ scale-80 / scale-75)
  const scale =
    abs < 0.001 ? 1 : abs < 1.25 ? 0.8 : Math.max(0.72, 0.78 - (abs - 1.25) * 0.04);
  const opacity = !visible
    ? 0
    : abs < 0.001
      ? 1
      : Math.max(0.4, 0.55 - abs * 0.08);

  return {
    rotateY,
    z,
    scale,
    opacity,
    zIndex: Math.round(100 - abs),
  };
}

function CenterTilt({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 16 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 16 });

  useEffect(() => {
    if (!enabled || reduce) {
      rotateX.set(0);
      rotateY.set(0);
    }
  }, [enabled, reduce, rotateX, rotateY]);

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled || reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * TILT_MAX * 2);
    rotateX.set(-py * TILT_MAX * 2);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className="h-full w-full"
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: "preserve-3d",
      }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}

export function CoverflowCarousel({ projects }: Props) {
  const router = useRouter();
  const bp = useBreakpoint();
  const physics = coverflowPhysics(bp);
  const count = projects.length;
  const [active, setActive] = useState(() =>
    count > 0 ? Math.floor(count / 2) : 0,
  );
  const [dragX, setDragX] = useState(0);
  const [spread, setSpread] = useState(physics.spread || SPREAD_DESKTOP);
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const dragMoved = useRef(false);

  useEffect(() => {
    if (!count) return;
    setActive((prev) => {
      if (prev >= 0 && prev < count) return prev;
      return Math.floor(count / 2);
    });
  }, [count]);

  useEffect(() => {
    if (bp === "mobile") return;
    setSpread(physics.spread);
  }, [bp, physics.spread]);

  const goTo = useCallback(
    (index: number) => {
      if (!count) return;
      setActive(((index % count) + count) % count);
      setDragX(0);
    },
    [count],
  );

  const onDrag = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 6) dragMoved.current = true;
    setDragX(info.offset.x);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const projected = info.offset.x + info.velocity.x * 0.18;
    const delta = Math.round(-projected / Math.max(spread, 1));
    setDragX(0);
    window.setTimeout(() => {
      dragMoved.current = false;
    }, 0);
    if (delta !== 0) goTo(active + delta);
  };

  const safeActive = count ? Math.min(active, count - 1) : 0;
  const current = count ? projects[safeActive] : null;
  const accent = current ? themeFor(current.id).accent : "#a8cfc6";
  const progress = safeActive - (spread ? dragX / spread : 0);
  const isDesktop = bp === "desktop";
  const cardW = isDesktop
    ? "clamp(14rem, 18vw, 16.5rem)"
    : bp === "tablet"
      ? "clamp(14rem, 28vw, 16.5rem)"
      : "clamp(18rem, 30vw, 22.5rem)";
  const cardH = isDesktop
    ? "360px"
    : bp === "tablet"
      ? "clamp(18rem, 38vw, 22rem)"
      : "clamp(24rem, 40vw, 28.5rem)";

  if (!count || !current) return null;

  if (bp === "mobile" || !physics.enable3d) {
    return (
      <div className="relative w-full">
        <MobileProjectStrip
          projects={projects}
          activeId={current.id}
          onActiveChange={setActive}
        />
        <div className="relative z-[2] mx-auto mt-4 max-w-lg text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
            <Link
              href={`/work/${current.id}`}
              className="inline-flex min-h-11 items-center font-semibold text-[var(--accent)] no-underline"
            >
              View project
            </Link>
            <Link
              href="/work"
              className="inline-flex min-h-11 items-center font-semibold text-[var(--accent)] no-underline"
            >
              All projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full touch-pan-y overflow-x-clip" ref={stageRef}>
      <ColorCloud accent={accent} />

      {/* Center-anchored stage: active card at x=0, flanks via circular offsets */}
      <div className="relative z-[1] mx-auto w-full overflow-x-clip">
        <div
          className="relative mx-auto flex h-[min(28rem,72vw)] w-full items-center justify-center overflow-x-clip pt-2 sm:h-[30rem] sm:pt-4 lg:h-[400px] lg:max-h-[400px] lg:pt-2"
          style={{
            perspective: reduceMotion ? undefined : physics.perspective,
            perspectiveOrigin: "50% 45%",
          }}
        >
          <motion.div
            className="relative cursor-grab touch-pan-y active:cursor-grabbing lg:max-h-[360px]"
            style={{
              width: cardW,
              height: cardH,
              maxHeight: isDesktop ? 360 : undefined,
              transformStyle: "preserve-3d",
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
          >
            {projects.map((project, index) => {
              const offset = circularRelativeIndex(index, progress, count);
              const abs = Math.abs(offset);
              const isCenter = abs < 0.5;
              const base = cardMotion(
                offset,
                reduceMotion,
                physics.rotateY,
                physics.zStep,
              );

              return (
                <motion.div
                  key={project.id}
                  className="absolute left-0 top-0 will-change-transform lg:max-h-[360px]"
                  style={{
                    width: cardW,
                    height: cardH,
                    maxHeight: isDesktop ? 360 : undefined,
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    zIndex: base.zIndex,
                  }}
                  initial={false}
                  animate={{
                    x: offset * spread,
                    rotateY: base.rotateY,
                    z: base.z,
                    scale: base.scale,
                    opacity: base.opacity,
                  }}
                  transition={dragX !== 0 ? { duration: 0 } : physics.spring}
                >
                  <button
                    type="button"
                    className="h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0"
                    style={{
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                    }}
                    onClick={() => {
                      if (dragMoved.current) return;
                      if (!isCenter) {
                        goTo(index);
                        return;
                      }
                      router.push(`/work/${project.id}`);
                    }}
                    aria-label={`Open ${project.title}`}
                    aria-current={isCenter ? "true" : undefined}
                    tabIndex={isCenter ? 0 : -1}
                  >
                    <CenterTilt enabled={isCenter && physics.enableTilt}>
                      <ProjectPreview project={project} isCenter={isCenter} />
                    </CenterTilt>
                  </button>

                  {!reduceMotion ? (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-10 top-full mt-2 h-3 rounded-[100%] bg-[color-mix(in_srgb,var(--ink)_14%,transparent)] blur-md"
                      style={{ opacity: isCenter ? 0.45 : 0.2 }}
                    />
                  ) : null}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <div className="relative z-[2] mx-auto mt-2 max-w-lg text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={
              bp === "tablet"
                ? { opacity: 0, scale: 0.97 }
                : { opacity: 0, y: 6 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm"
          >
            <Link
              href={`/work/${current.id}`}
              className="inline-flex min-h-11 items-center font-semibold text-[var(--accent)] no-underline hover:text-[var(--ink)]"
            >
              View project
            </Link>
            {current.repoUrl ? (
              <a
                href={current.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center font-semibold text-[var(--accent)] no-underline hover:text-[var(--ink)]"
              >
                Repository
              </a>
            ) : null}
            <Link
              href="/work"
              className="inline-flex min-h-11 items-center font-semibold text-[var(--accent)] no-underline hover:text-[var(--ink)]"
            >
              All projects
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-[2] mt-4 flex items-center justify-center gap-3 sm:mt-6">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-label="Previous project"
          className="flex h-11 w-11 items-center justify-center rounded-full text-xl text-[var(--ink-muted)] transition hover:text-[var(--accent)]"
        >
          ‹
        </button>
        <div
          className="flex items-center gap-2"
          role="tablist"
          aria-label="Featured projects"
        >
          {projects.map((project, index) => {
            const tint = themeFor(project.id).accent;
            return (
              <button
                key={project.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`Show ${project.title}`}
                onClick={() => goTo(index)}
                className="flex h-11 min-w-11 items-center justify-center"
              >
                <span
                  className="rounded-full transition-all duration-300"
                  style={
                    index === active
                      ? { height: 8, width: 24, background: tint }
                      : {
                          height: 8,
                          width: 8,
                          background:
                            "color-mix(in srgb, var(--ink) 20%, transparent)",
                        }
                  }
                />
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          aria-label="Next project"
          className="flex h-11 w-11 items-center justify-center rounded-full text-xl text-[var(--ink-muted)] transition hover:text-[var(--accent)]"
        >
          ›
        </button>
      </div>
    </div>
  );
}
