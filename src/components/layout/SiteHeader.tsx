import Link from "next/link";
import { site } from "@/content/site";
import { SiteContainer } from "@/components/layout/SiteContainer";

const nav = [
  { href: "/#about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <SiteContainer className="flex items-center justify-between gap-4 py-3.5">
        <Link href="/" className="brand">
          {site.name}
        </Link>
        <nav className="nav" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="nav__link">
              {item.label}
            </Link>
          ))}
          <a
            href={site.links.github}
            className="nav__link nav__link--external"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </SiteContainer>
    </header>
  );
}
