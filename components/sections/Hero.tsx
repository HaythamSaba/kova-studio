"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SplitText from "@/components/ui/SplitText";
import { EXPO_OUT } from "@/lib/easings";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Image from "next/image";

// ── CTA + side elements entrance ───────────────────
const fadeUpVariants = {
  hidden: { y: 24, opacity: 0 },
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
  const HeroImgRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (
        prefersReducedMotion ||
        !containerRef.current ||
        !HeroImgRef.current ||
        !heroContentRef.current
      )
        return;

      // ── Initial states ───────────────────────────
      gsap.set(".hero-item", {
        opacity: 0,
        y: 40,
      });

      // ── Master timeline ──────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2000",
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // ── Image expansion ──────────────────────────
      tl.fromTo(
        HeroImgRef.current,
        {
          clipPath: "outset(25% 25% 25% 25% round 100%)",
          scale: 0.5,
        },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          scale: 1,
          ease: "none",
          duration: 1,
        },
      );

      // ── Text reveal near end of expansion ───────
      tl.to(
        ".hero-item",
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.45,
          ease: "power3.out",
        },
        0.82,
      );

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden min-h-screen flex flex-col justify-end pb-20 px-8 md:px-16"
    >
      {/* ── Background image ──────────────────────── */}
      <div ref={HeroImgRef} className="absolute inset-0 z-0">
        <Image
          src="/images/bg.png"
          alt=""
          fill
          className="object-cover object-center"
          // Hero image — above the fold, load immediately
          priority
          sizes="(max-width: 768px) 100vw, 33vw" // Keep the ref on the wrapper, not the Image
        />
      </div>

      {/* ── Top-right label ──────────────────────── */}
      <motion.p
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={1.2}
        className="absolute top-32 right-8 md:right-16 z-20 font-mono text-[10px] uppercase tracking-[0.3em] text-muted max-w-30 text-right leading-relaxed"
      >
        Digital Studio
        <br />
        Ljubljana
      </motion.p>

      {/* ── Main content ─────────────────────────── */}
      <div
        ref={heroContentRef}
        className="relative z-20 max-w-350 w-full mx-auto"
      >
        {/* Eyebrow */}
        <p className="hero-item font-mono text-[11px] uppercase tracking-[0.3em] text-accent mb-8">
          Selected Work — 2024
        </p>

        {/* Headline */}
        <h1 className="hero-item font-serif text-[clamp(48px,7.5vw,128px)] leading-[0.92] tracking-tight text-text mb-12">
          <SplitText text="We forge brands" delay={0} stagger={0.025} />

          <br />

          <em>
            <SplitText
              text="that hold their shape."
              delay={0.05}
              stagger={0.02}
            />
          </ em>
        </h1>

        {/* Bottom row */}
        <div className="hero-item flex flex-col md:flex-row md:items-end justify-between gap-8">
          {/* Tagline */}
          <p className="font-sans text-muted text-base max-w-sm leading-relaxed">
            We build digital identities and web experiences for brands that take
            the long view.
          </p>

          {/* CTA */}
          <div className="flex items-center gap-8">
            <a
              href="#work"
              data-cursor="hover"
              className="group flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-text"
            >
              <span className="w-8 h-px bg-accent group-hover:w-14 transition-all duration-500 ease-out" />
              View Work
            </a>

            <a
              href="#contact"
              data-cursor="hover"
              className="font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors duration-300"
            >
              Start a project
            </a>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────── */}
      <motion.div
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={1.8}
        className="absolute bottom-8 right-8 md:right-16 z-20 flex flex-col items-center gap-2"
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
