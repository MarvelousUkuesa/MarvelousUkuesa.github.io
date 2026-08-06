"use client";

import {
  motion,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/schemas/project";
import { ColorCloud } from "@/components/work/ColorCloud";
import { MobileProjectStrip } from "@/components/work/MobileProjectStrip";
import { ProjectDetailPanel } from "@/components/work/ProjectDetailPanel";
import {
  circularRelativeIndex,
  coverflowPhysics,
  useBreakpoint,
} from "@/hooks/useBreakpoint";

type Props = {
  projects: Project[];
};

const VISIBLE = 4;

const THEMES = [
  { bg: "#1a2420", accent: "#9ec9c0" },
  { bg: "#141c18", accent: "#a8cfc6" },
  { bg: "#1c2824", accent: "#c8e0db" },
  { bg: "#161e1a", accent: "#7eb8ae" },
  { bg: "#1c2018", accent: "#c4b896" },
] as const;

function themeFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) % THEMES.length;
  return THEMES[h] ?? THEMES[0];
}

function ArchitectureCard({ project }: { project: Project }) {
  const theme = themeFor(project.id);
  const nodes = [
    { label: "DATA AGENT", color: "#9ec9c0" },
    { label: "ORCHESTRATOR", color: "#c8e0db" },
    { label: "CODE AGENT", color: "#7eb8ae" },
    { label: "TOOL ROUTER", color: "#a8cfc6" },
  ];

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] shadow-[0_16px_40px_-24px_rgba(18,26,22,0.4)]"
      style={{ background: theme.bg }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(circle at 28% 18%, rgba(168,207,198,0.28), transparent 46%), radial-gradient(circle at 78% 72%, rgba(10,92,84,0.18), transparent 42%)",
        }}
      />
      <div className="relative z-[1] px-3 pt-3">
        <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white/90">
          Architecture View
        </span>
      </div>
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col justify-center gap-3 p-4">
        <div className="mx-auto grid w-full max-w-[14rem] grid-cols-2 gap-2">
          {nodes.map((n) => (
            <div
              key={n.label}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-2.5 text-center"
              style={{ boxShadow: `0 0 18px -12px ${n.color}` }}
            >
              <span
                className="mb-1 inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: n.color }}
              />
              <p className="text-[9px] font-bold tracking-wider text-white/90">
                {n.label}
              </p>
            </div>
          ))}
        </div>
        <div className="mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-[var(--accent-soft)] to-transparent" />
        <p className="text-center font-[family-name:var(--font-display)] text-sm font-bold text-white">
          {project.title}
        </p>
      </div>
    </div>
  );
}

export function WorkPageCoverflow({ projects }: Props) {
  const router = useRouter();
  const bp = useBreakpoint();
  const physics = coverflowPhysics(bp);
  const count = projects.length;
  const [active, setActive] = useState(() =>
    count > 0 ? Math.floor(count / 2) : 0,
  );
  const [dragX, setDragX] = useState(0);
  const [viewportW, setViewportW] = useState(1280);
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const dragMoved = useRef(false);

  const cardW =
    bp === "desktop"
      ? "min(30vw, 28rem)"
      : bp === "tablet"
        ? "min(40vw, 24rem)"
        : "clamp(13.5rem, 20vw, 17rem)";
  const cardH =
    bp === "desktop"
      ? "320px"
      : bp === "tablet"
        ? "clamp(16rem, 36vw, 20rem)"
        : "clamp(17.5rem, 26vw, 21.5rem)";

  useEffect(() => {
    const sync = () => setViewportW(window.innerWidth);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const spread =
    bp === "desktop"
      ? Math.min(viewportW * 0.12, 180)
      : bp === "tablet"
        ? Math.min(viewportW * 0.12, 160)
        : physics.spread;

  const goTo = useCallback(
    (i: number) => {
      if (!count) return;
      setActive(((i % count) + count) % count);
      setDragX(0);
    },
    [count],
  );

  const safe = count ? Math.min(active, count - 1) : 0;
  const current = count ? projects[safe] : null;
  const accent = current ? themeFor(current.id).accent : "#a8cfc6";
  const progress = safe - (spread ? dragX / spread : 0);

  useEffect(() => {
    if (!count) return;
    setActive((prev) => (prev >= 0 && prev < count ? prev : Math.floor(count / 2)));
  }, [count]);

  if (!count || !current) return null;

  if (bp === "mobile" || !physics.enable3d) {
    return (
      <div className="relative w-full">
        <MobileProjectStrip
          projects={projects}
          activeId={current.id}
          onActiveChange={setActive}
        />
        <div className="relative z-[2] mt-2">
          <ProjectDetailPanel project={current} />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={stageRef}
      className="relative w-full touch-pan-y overflow-x-clip"
    >
      <ColorCloud accent={accent} />

      <div
        className="relative mx-auto flex h-[20rem] w-full items-center justify-center overflow-x-clip pt-3 sm:h-[24rem] md:h-[25rem] lg:h-[360px] lg:max-h-[360px] lg:pt-1"
        style={{
          perspective: reduce ? undefined : physics.perspective,
          perspectiveOrigin: "50% 40%",
        }}
      >
        <motion.div
          className="relative cursor-grab touch-pan-y active:cursor-grabbing lg:max-h-[320px]"
          style={{
            width: cardW,
            height: cardH,
            maxHeight: bp === "desktop" ? 320 : undefined,
            transformStyle: "preserve-3d",
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.14}
          onDrag={(_, info: PanInfo) => {
            if (Math.abs(info.offset.x) > 6) dragMoved.current = true;
            setDragX(info.offset.x);
          }}
          onDragEnd={(_, info: PanInfo) => {
            const delta = Math.round(
              -(info.offset.x + info.velocity.x * 0.18) / spread,
            );
            setDragX(0);
            window.setTimeout(() => {
              dragMoved.current = false;
            }, 0);
            if (delta) goTo(active + delta);
          }}
        >
          {projects.map((project, index) => {
            const offset = circularRelativeIndex(index, progress, count);
            const abs = Math.abs(offset);
            const isCenter = abs < 0.5;
            const rotateY =
              reduce || abs < 0.001
                ? 0
                : Math.sign(offset) * -physics.rotateY * Math.min(abs, 1);
            const visible = abs <= VISIBLE;

            return (
              <motion.div
                key={project.id}
                className="absolute left-0 top-0 will-change-transform lg:max-h-[320px]"
                style={{
                  width: cardW,
                  height: cardH,
                  maxHeight: bp === "desktop" ? 320 : undefined,
                  zIndex: Math.round(100 - abs),
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
                initial={false}
                animate={{
                  x: offset * spread,
                  rotateY,
                  z: reduce ? 0 : -Math.min(180, abs * physics.zStep),
                  scale:
                    abs < 0.001 ? 1 : abs < 1.25 ? 0.8 : Math.max(0.72, 0.78 - (abs - 1.25) * 0.04),
                  opacity: !visible
                    ? 0
                    : abs < 0.001
                      ? 1
                      : Math.max(0.4, 0.55 - abs * 0.08),
                }}
                transition={dragX !== 0 ? { duration: 0 } : physics.spring}
              >
                <button
                  type="button"
                  className="h-full w-full appearance-none border-0 bg-transparent p-0"
                  style={{ height: "100%" }}
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
                >
                  {project.gallery?.[0] || project.image ? (
                    <div className="h-full w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] shadow-[0_16px_40px_-24px_rgba(18,26,22,0.4)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.gallery?.[0] ?? project.image}
                        alt=""
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    </div>
                  ) : (
                    <ArchitectureCard project={project} />
                  )}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="relative z-[2]">
        <ProjectDetailPanel project={current} />
      </div>
    </div>
  );
}
