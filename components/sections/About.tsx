// components/sections/About.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// ── Stats ─────────────────────────────────────────────
const stats = [
  { value: 28, suffix: "+", label: "Projects delivered" },
  { value: 4, suffix: "", label: "Years in practice" },
  { value: 3, suffix: "", label: "People on the team" },
];

// ── Paragraphs ────────────────────────────────────────
const paragraphs = [
  "Kova is a small digital studio working across brand identity and web. We work with a focused list of clients at a time.",
  "We're based in Ljubljana, and work with clients across Europe.",
  "We don't take every project. We take the right ones.",
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paraRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const tagsRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Delay setup — About is deep in the page.
    // We need the full page height to be known
    // before ScrollTrigger measures positions.
    const setupTimer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // ── Headline entrance ───────────────────────
        if (headlineRef.current) {
          gsap.fromTo(
            headlineRef.current,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: headlineRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // ── Paragraph entrances (one trigger each) ──
        // Each paragraph is independent — they fire
        // as the user scrolls into each one.
        // GSAP only. No Framer Motion on these.
        paraRefs.current.forEach((el, i) => {
          if (!el) return;

          gsap.fromTo(
            el,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              delay: i * 0.08, // slight cascade between paragraphs
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            },
          );
        });

        // ── Tags row entrance ───────────────────────
        if (tagsRef.current) {
          gsap.fromTo(
            tagsRef.current,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: tagsRef.current,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // ── Stat counters ───────────────────────────
        // Tween a proxy object { val: 0 } → { val: target }
        // and write the rounded value to textContent each frame.
        counterRefs.current.forEach((el, i) => {
          if (!el) return;

          const target = stats[i].value;
          const proxy = { val: 0 };

          gsap.fromTo(
            proxy,
            { val: 0 },
            {
              val: target,
              duration: 2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: statsRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
              },
              onUpdate: () => {
                el.textContent = Math.round(proxy.val).toString();
              },
            },
          );
        });

        // Recalculate positions after all triggers registered
        ScrollTrigger.refresh();
      }, sectionRef);

      return () => ctx.revert();
    }, 500);

    return () => clearTimeout(setupTimer);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 md:py-48 px-8 md:px-16 border-t border-border"
    >
      {/* max-w-350 = 87.5rem = 1400px in Tailwind v4 default scale ✓ */}
      <div className="max-w-350 mx-auto">
        {/* ── Section header ──────────────────────── */}
        <div className="flex items-baseline justify-between mb-24 pb-5 border-b border-border">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            The Studio
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            Est. 2020
          </p>
        </div>

        {/* ── Split layout ────────────────────────── */}
        {/* Default grid stretch (no items-start) so  */}
        {/* right column = left column height.        */}
        {/* This is what gives sticky room to work.   */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* ── Left column ─────────────────────── */}
          <div className="flex flex-col gap-16">
            {/* Headline — GSAP triggered, not Framer Motion */}
            {/* style opacity:0 prevents flash before GSAP    */}
            <h2
              ref={headlineRef}
              style={{ opacity: 0 }}
              className="font-serif text-[clamp(36px,4.5vw,72px)] leading-[0.92] text-text"
            >
              Small studio.
              <br />
              <em className="text-accent">Considered</em>
              <br />
              work.
            </h2>

            {/* Paragraphs — GSAP only, no Framer Motion */}
            {/* style opacity:0 = initial state for GSAP  */}
            {/* Never use Tailwind opacity-0 + GSAP together */}
            <div className="flex flex-col gap-10">
              {paragraphs.map((text, i) => (
                <p
                  key={i}
                  ref={(el) => {
                    paraRefs.current[i] = el;
                  }}
                  style={{ opacity: 0 }}
                  className="font-sans text-muted text-lg leading-relaxed max-w-md mb-80"
                >
                  {text}
                </p>
              ))}
            </div>

            {/* Credential tags — GSAP triggered */}
            <div
              ref={tagsRef}
              style={{ opacity: 0 }}
              className="flex flex-wrap gap-3"
            >
              {[
                "Brand Identity",
                "Web Design",
                "Art Direction",
                "Digital Strategy",
              ].map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted border border-border px-3 py-1.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right column — sticky image ──────── */}
          {/* h-full fills grid row = left col height */}
          {/* This is the parent sticky needs to be   */}
          {/* taller than its sticky child            */}
          <div className="hidden md:block relative h-full">
            <div className="sticky top-[10vh]">
              {/* Image */}
              <div className="w-full h-100 aspect-3/4 relative mb-4 overflow-hidden">
                <Image
                  src="/images/studio/studio-photo.png"
                  alt="Kova Studio workspace in Ljubljana"
                  fill
                  className="object-cover"
                  // This image is below the fold — lazy load is fine
                  // sizes matches the column width (roughly half viewport
                  // on desktop, capped at 700px)
                  // sizes="(max-width: 768px) 100vw, 700px"
                />

                {/* Amber accent line */}
                <div className="absolute top-0 left-0 w-px h-20 bg-accent z-10" />

                {/* Bottom label */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
                    Ljubljana, Slovenia
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30">
                    2024
                  </p>
                </div>

                {/* Vignette */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, transparent 40%, rgba(14,12,10,0.5) 100%)",
                  }}
                />
              </div>

              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted/40 text-right">
                Studio — 2024
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats row ───────────────────────────── */}
        <div
          ref={statsRef}
          className="grid grid-cols-3 mt-32 pt-16 border-t border-border"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col gap-3 px-8 first:pl-0 last:pr-0 border-r border-border last:border-r-0"
            >
              <div className="flex items-baseline gap-1">
                <span
                  ref={(el) => {
                    counterRefs.current[i] = el;
                  }}
                  className="font-serif text-[clamp(48px,6vw,96px)] leading-none text-text tabular-nums"
                >
                  0
                </span>
                {stat.suffix && (
                  <span className="font-serif text-[clamp(24px,3vw,48px)] text-accent">
                    {stat.suffix}
                  </span>
                )}
              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                {stat.label}
              </p>

              <div className="w-8 h-px bg-border" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
