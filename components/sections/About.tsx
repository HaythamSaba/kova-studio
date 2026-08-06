// components/sections/About.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";
import Image from "next/image";
import AboutImage from "@/public/images/studio/studio-photo.png";
import SectionHeader from "../ui/SectionHeader";
import StatCard from "../ui/StatCard";
import { stats } from "@/data/projects";
import ColoredTitle from "../ui/SectionTitle";

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
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Delay setup — About is deep in the page.

    let ctx: gsap.Context | undefined;

    const setupTimer = setTimeout(() => {
      if (prefersReducedMotion()) {
        // Make all elements visible immediately
        paraRefs.current.forEach((el) => {
          if (el) el.style.opacity = "1";
        });
        if (statsRef.current) statsRef.current.style.opacity = "1";
        return;
      }

      ctx = gsap.context(() => {
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

        // ── Paragraph entrances (one trigger each)
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
              delay: i * 0.08,
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
        ScrollTrigger.refresh();
      }, sectionRef);
    }, 500);

    return () => {
      clearTimeout(setupTimer);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 px-8 md:px-16"
    >
      {/* max-w-350 = 87.5rem = 1400px in Tailwind v4 default scale ✓ */}
      <div className="max-w-350 mx-auto">
        {/* ── Section header ──────────────────────── */}
        <SectionHeader leftTitle="The Studio" rightTitle="Est. 2020" />

        {/* ── Split layout ────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* ── Left column ─────────────────────── */}
          <div className="flex flex-col gap-16">
            {/* Headline — GSAP triggered */}
            <ColoredTitle
              Left={["Small studio."]}
              ColoredMiddle="Considered"
              Right="Work."
            />

            {/* Paragraphs — GSAP triggered */}
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
                  className="font-mono text-[9px] uppercase tracking-[0.25em] text-text border border-accent px-3 py-1.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right column — sticky image ──────── */}
          <div className="hidden md:block relative h-full">
            <div className="sticky top-[20vh]">
              {/* Image */}
              <div className="w-full h-100 aspect-3/4 relative mb-4 overflow-hidden">
                <Image
                  src={AboutImage}
                  alt="Kova Studio workspace in Ljubljana"
                  fill
                  placeholder="blur" // Lazy load
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 700px"
                />

                {/* Amber accent line */}
                <div className="absolute top-0 left-0 w-px h-20 bg-accent z-10" />

                {/* Bottom label */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
                    Ljubljana, Slovenia
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white">
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

              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-text text-right">
                Studio — 2024
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats row ───────────────────────────── */}
        <div
          ref={statsRef}
          className="grid grid-cols-3 mt-32 pt-16 border-t border-accent"
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} statsRef={statsRef} />
          ))}
        </div>
      </div>
    </section>
  );
}
