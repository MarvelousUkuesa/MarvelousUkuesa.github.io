"use client";

import { useRef, useState, type PointerEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { site } from "@/content/site";
import { FadeIn } from "@/components/motion/FadeIn";
import { Magnetic } from "@/components/motion/Magnetic";
import { Section } from "@/components/layout/SiteContainer";

export function Contact() {
  const ref = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);
  const [tip, setTip] = useState(false);
  const tipX = useMotionValue(0);
  const tipY = useMotionValue(0);
  const springTipX = useSpring(tipX, { stiffness: 280, damping: 22 });
  const springTipY = useSpring(tipY, { stiffness: 280, damping: 22 });

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    tipX.set(e.clientX - rect.left - rect.width / 2);
    tipY.set(e.clientY - rect.top - rect.height / 2 - 36);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <Section
      id="contact"
      className="contact border-t border-[var(--line)]"
      aria-labelledby="contact-heading"
    >
      <div className="contact__stage">
        <FadeIn>
          <p className="contact__eyebrow">Contact</p>
          <h2 id="contact-heading" className="contact__headline">
            {site.contact.headline}
          </h2>
          <p className="contact__invite">{site.contact.invite}</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="contact__mail-wrap">
            <Magnetic radius={36} strength={0.28}>
              <button
                ref={ref}
                type="button"
                className="contact__mail"
                onClick={copyEmail}
                onPointerEnter={() => setTip(true)}
                onPointerMove={onMove}
                onPointerLeave={() => {
                  setTip(false);
                  tipX.set(0);
                  tipY.set(0);
                }}
                aria-label={`Copy email ${site.email}`}
              >
                {site.email}
              </button>
            </Magnetic>

            <AnimatePresence>
              {tip || copied ? (
                <motion.span
                  className={`contact__tooltip${copied ? " contact__tooltip--ok" : ""}`}
                  style={{ x: springTipX, y: springTipY }}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  {copied ? "Copied" : "Click to copy"}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>

          <p className="contact__prompt">{site.contact.prompt}</p>
          <div className="contact__alt">
            <a
              href={site.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <span aria-hidden="true">·</span>
            <a href={`mailto:${site.email}`}>Open mail app</a>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
