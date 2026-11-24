// components/sections/About.tsx
"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { EXPO_OUT } from "@/lib/easings";
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
  const statsRef = useRef<HTMLDivElement>(null);

  return (
    <section id="about" className="relative py-32 px-8 md:px-16">
      {/* max-w-350 = 87.5rem = 1400px in Tailwind v4 default scale ✓ */}
      <div className="max-w-350 mx-auto">
        {/* ── Section header ──────────────────────── */}
        <SectionHeader leftTitle="The Studio" rightTitle="Est. 2020" />

        {/* ── Split layout ────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* ── Left column ─────────────────────── */}
          <div className="flex flex-col gap-16">
            {/* Headline — Framer, triggered on scroll into view */}
            <ColoredTitle
              Left={["Small studio."]}
              ColoredMiddle="Considered"
              Right="Work."
            />

            {/* Paragraphs — Framer, one trigger each */}
            <div className="flex flex-col gap-10">
              {paragraphs.map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, ease: EXPO_OUT, delay: i * 0.08 }}
                  className="font-sans text-muted text-lg leading-relaxed max-w-md mb-80"
                >
                  {text}
                </motion.p>
              ))}
            </div>

            {/* Credential tags — Framer, triggered on scroll into view */}
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: EXPO_OUT }}
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
            </motion.div>
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
