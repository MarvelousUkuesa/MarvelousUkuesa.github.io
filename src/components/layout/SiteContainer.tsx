import type { ReactNode } from "react";

/** Shared horizontal bounds — every page section aligns to this edge. */
export const SITE_CONTAINER =
  "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

/** Vertical cadence between main sections. */
export const SECTION_Y = "py-10 sm:py-12 lg:py-20";

/** Gap for primary card / content grids. */
export const GRID_GAP = "gap-6";

/** Gap for tags, chips, and compact sub-items. */
export const CHIP_GAP = "gap-4";

type SiteContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "header" | "footer";
};

export function SiteContainer({
  children,
  className = "",
  as: Tag = "div",
}: SiteContainerProps) {
  return (
    <Tag className={`${SITE_CONTAINER}${className ? ` ${className}` : ""}`}>
      {children}
    </Tag>
  );
}

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  /** When false, children manage their own container (rare). */
  contained?: boolean;
  /** Skip vertical padding (e.g. blog index under page-head). */
  noY?: boolean;
  "aria-labelledby"?: string;
};

export function Section({
  children,
  className = "",
  id,
  contained = true,
  noY = false,
  "aria-labelledby": labelledBy,
}: SectionProps) {
  const y = noY ? "" : SECTION_Y;
  const classes = ["relative", "scroll-mt-0", y, className]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id={id}
      className={classes}
      aria-labelledby={labelledBy}
    >
      {contained ? <SiteContainer>{children}</SiteContainer> : children}
    </section>
  );
}

type SectionHeaderProps = {
  title: string;
  description?: ReactNode;
  id?: string;
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeader({
  title,
  description,
  id,
  as: Tag = "h2",
  className = "",
}: SectionHeaderProps) {
  return (
    <header
      className={`mb-8 text-left lg:mb-10${className ? ` ${className}` : ""}`}
    >
      <Tag
        id={id}
        className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl lg:text-[clamp(2rem,3.5vw,2.75rem)]"
      >
        {title}
      </Tag>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-muted)] sm:text-base">
          {description}
        </p>
      ) : null}
    </header>
  );
}
