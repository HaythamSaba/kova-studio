"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import SplitText from "@/components/ui/SplitText";
import { EXPO_OUT } from "@/lib/easings";

// ── CTA + tagline entrance variants ──────────────────
const fadeUpVariants = {
  hidden:  { y: 24, opacity: 0 },
  visible: (delay: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay,
      duration: 0.7,
      ease: EXPO_OUT,
    },
  }),
};

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-end pb-20 px-8 md:px-16 overflow-hidden bg-[url('/images/bg.png')] bg-cover bg-center"
    >
      {/* ── Background grain ──────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Top-right label ───────────────────────── */}
      <motion.p
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={1.2}
        className="absolute top-32 right-8 md:right-16 font-mono text-[10px] uppercase tracking-[0.3em] text-muted max-w-30 text-right leading-relaxed"
      >
        Digital Studio<br />Ljubljana
      </motion.p>

      {/* ── Main content ──────────────────────────── */}
      <div className="relative max-w-350 w-full mx-auto">

        {/* Eyebrow */}
        <motion.p
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={0.8}
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-black mb-8"
        >
          Selected Work — 2024
        </motion.p>

        {/* Headline — staggered characters */}
        <h1 className="font-serif text-[clamp(48px,7.5vw,128px)] leading-[0.92] tracking-tight text-text mb-12">
          <SplitText
            text="We forge brands"
            delay={0.9}
            stagger={0.025}
          />
          <br />
          {/* Italic line — slight extra delay */}
          <em>
            <SplitText
              text="that hold their shape."
              delay={1.2}
              stagger={0.02}
            />
          </em>
        </h1>

        {/* Bottom row — tagline + CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">

          {/* Tagline */}
          <motion.p
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={1.5}
            className="font-sans text-muted text-base max-w-sm leading-relaxed"
          >
            We build digital identities and web experiences
            for brands that take the long view.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={1.6}
            className="flex items-center gap-8"
          >
            <a
              href="#work"
              data-cursor="hover"
              className="group flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-text"
            >
              <span
                className="w-8 h-px bg-accent group-hover:w-14 transition-all duration-500 ease-out"
              />
              View Work
            </a>

            <a
              href="#contact"
              data-cursor="hover"
              className="font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors duration-300"
            >
              Start a project
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────── */}
      <motion.div
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={1.8}
        className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="w-px h-10 bg-linear-to-b from-transparent to-accent"
        />
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted rotate-90 origin-center mt-2">
          Scroll
        </p>
      </motion.div>
    </section>
  );
}