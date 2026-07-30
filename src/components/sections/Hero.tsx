"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import type { MouseEvent } from "react";
import { site } from "@/content/site";
import { Magnetic, EASE_EXPO } from "@/components/motion/Magnetic";
import { RevealLines } from "@/components/motion/RevealLines";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { SiteContainer } from "@/components/layout/SiteContainer";

export function Hero() {
  const reduce = useReducedMotion();
  const bp = useBreakpoint();
  const mobile = bp === "mobile";
  const lenis = useLenis();

  const scrollToSection = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    if (lenis) {
      lenis.scrollTo(el, { offset: 0 });
    } else {
      el.scrollIntoView({
        behavior: reduce ? "instant" : "smooth",
        block: "start",
      });
    }

    window.history.pushState(null, "", `#${id}`);
  };

  return (
    <section
      id="hero"
      className="hero"
      aria-labelledby="hero-heading"
    >
      <div className="hero__atmosphere" aria-hidden="true" />
      <div className="hero__noise" aria-hidden="true" />
      <SiteContainer className="hero__inner">
        <RevealLines
          text={site.name}
          as="p"
          className="hero__brand"
          delay={0.05}
        />

        <h1 id="hero-heading" className="hero__title">
          <RevealLines
            text={site.tagline}
            as="span"
            byWord
            delay={0.22}
            className="hero__title-reveal"
          />
        </h1>

        <motion.p
          className="hero__lede"
          initial={
            reduce
              ? false
              : mobile
                ? { opacity: 0, scale: 0.95 }
                : { opacity: 0, y: 16 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.45 }}
        >
          Selected GitHub work, writing about the craft, and a quiet sense of
          how I build.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={
            reduce
              ? false
              : mobile
                ? { opacity: 0, scale: 0.95 }
                : { opacity: 0, y: 12 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.58 }}
        >
          <Magnetic radius={30} strength={0.4} className="magnetic-btn">
            <a
              href="#work"
              className="btn btn--primary"
              onClick={scrollToSection("work")}
            >
              View work
            </a>
          </Magnetic>
          <Magnetic radius={30} strength={0.4} className="magnetic-btn">
            <a
              href="#about"
              className="btn btn--ghost"
              onClick={scrollToSection("about")}
            >
              About me
            </a>
          </Magnetic>
        </motion.div>
      </SiteContainer>
    </section>
  );
}
