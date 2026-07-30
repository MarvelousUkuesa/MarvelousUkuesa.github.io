"use client";

import { site } from "@/content/site";
import { SiteContainer } from "@/components/layout/SiteContainer";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <SiteContainer className="site-footer__inner">
        <div className="site-footer__left">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="site-footer__availability" aria-live="polite">
            <span className="availability-dot" aria-hidden="true" />
            Available for Q3 projects
          </p>
        </div>
        <p className="site-footer__links">
          <a href={site.links.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <span aria-hidden="true">·</span>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </SiteContainer>
    </footer>
  );
}
