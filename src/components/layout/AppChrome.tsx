"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingContextNav } from "@/components/layout/FloatingContextNav";
import { AmbientField } from "@/components/motion/AmbientField";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isArticle = /^\/blog\/[^/]+$/.test(pathname);
  const isProject = /^\/work\/[^/]+\/?$/.test(pathname);

  if (isAdmin) {
    return <div className="shell shell--admin">{children}</div>;
  }

  return (
    <SmoothScroll>
      <div className="shell">
        <div className="page-noise" aria-hidden="true" />
        <AmbientField />
        {!isArticle ? <ScrollProgress /> : null}
        <main className="shell__main">{children}</main>
        {!isProject ? <SiteFooter /> : null}
        <FloatingContextNav />
      </div>
    </SmoothScroll>
  );
}
