"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";

/**
 * Floating directory nav for Work / Writing sub-pages.
 * Sharp radius + home tokens so it reads with the rest of the site.
 */
export function FloatingContextNav() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [showTop, setShowTop] = useState(false);

  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");
  const isWork = pathname === "/work" || pathname.startsWith("/work/");
  const isProject = /^\/work\/[^/]+\/?$/.test(pathname);
  const isWriting = pathname === "/blog" || pathname.startsWith("/blog/");
  const isArticle = /^\/blog\/[^/]+$/.test(pathname);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isHome || isAdmin || isProject) return null;

  const scrollTop = () => {
    if (lenis) lenis.scrollTo(0, { offset: 0 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const linkClass = (active: boolean) =>
    active
      ? "bg-[var(--ink)] px-3 py-1.5 text-[var(--bg-elevated)]"
      : "px-3 py-1.5 text-[var(--ink-muted)] transition hover:text-[var(--ink)]";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4 sm:bottom-6">
      <nav
        aria-label="Directory"
        className="pointer-events-auto flex max-w-full items-center gap-0.5 border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-elevated)_92%,transparent)] p-1 shadow-[0_12px_40px_-16px_rgba(18,26,22,0.45)] backdrop-blur-md [border-radius:var(--radius)]"
      >
        <Link
          href="/"
          className="inline-flex min-h-10 items-center px-3 py-1.5 text-sm font-semibold text-[var(--ink)] no-underline transition hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] [border-radius:var(--radius)]"
        >
          ← Home
        </Link>
        <span className="mx-0.5 h-4 w-px bg-[var(--line)]" aria-hidden />
        <Link
          href="/work"
          className={`inline-flex min-h-10 items-center text-sm font-semibold no-underline [border-radius:var(--radius)] ${linkClass(isWork)}`}
        >
          Work
        </Link>
        <Link
          href="/blog"
          className={`inline-flex min-h-10 items-center text-sm font-semibold no-underline [border-radius:var(--radius)] ${linkClass(isWriting)}`}
        >
          Writing
        </Link>

        {isProject ? (
          <>
            <span className="mx-0.5 h-4 w-px bg-[var(--line)]" aria-hidden />
            <Link
              href="/work"
              className="inline-flex min-h-10 items-center px-3 py-1.5 text-sm font-semibold text-[var(--accent)] no-underline transition hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] [border-radius:var(--radius)]"
            >
              Back to Work
            </Link>
          </>
        ) : null}

        {isArticle ? (
          <>
            <span className="mx-0.5 h-4 w-px bg-[var(--line)]" aria-hidden />
            <Link
              href="/blog"
              className="inline-flex min-h-10 items-center px-3 py-1.5 text-sm font-semibold text-[var(--accent)] no-underline transition hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] [border-radius:var(--radius)]"
            >
              All Writing
            </Link>
          </>
        ) : null}

        {showTop ? (
          <>
            <span className="mx-0.5 h-4 w-px bg-[var(--line)]" aria-hidden />
            <button
              type="button"
              onClick={scrollTop}
              className="inline-flex min-h-10 items-center px-3 py-1.5 text-sm font-semibold text-[var(--ink-muted)] transition hover:text-[var(--ink)] [border-radius:var(--radius)]"
            >
              Top ↑
            </button>
          </>
        ) : null}
      </nav>
    </div>
  );
}
