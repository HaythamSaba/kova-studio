"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { projects } from "@/data/projects";
import { EXPO_OUT } from "@/lib/easings";
import ProjectDetailedCard from "../ui/ProjectDetailedCard";

function getCardFormat(index: number): "landscape" | "portrait" {
  return index % 2 === 0 ? "landscape" : "portrait";
}

export default function AllWork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headlineWrapperRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLParagraphElement>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Parallax (Cleaner, no scale)
      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 100,
        opacity: 0,
        ease: "none",
      });

      // 2. The Kinetic Grid Reveal
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        const innerImage = card.querySelector(".card-image-inner");
        const categoryTag = card.querySelector(".category-tag");

        // Entrance: Scale + Y-Travel + Auto-Alpha
        gsap.fromTo(
          card,
          {
            y: 100,
            scale: 0.9,
            opacity: 0,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              end: "top 70%",
              scrub: 1,
            },
          },
        );

        // Smooth Image Parallax (The "Window" Effect)
        if (innerImage) {
          gsap.to(innerImage, {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        // Horizontal Ghosting of the category tag
        if (categoryTag) {
          gsap.to(categoryTag, {
            x: i % 2 === 0 ? 30 : -30, // Move right if left column, left if right column
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="bg-bg text-text min-h-screen">
      {/* HERO */}
      <div
        ref={heroRef}
        className="relative px-8 md:px-16 pt-40 pb-16 border-b border-border overflow-hidden perspective-1000"
      >
        <p
          ref={ghostRef}
          aria-hidden="true"
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 font-serif text-[25vw] leading-none text-surface select-none pointer-events-none z-0 opacity-40"
        >
          K
        </p>

        <div className="max-w-350 mx-auto h-[70vh] relative z-10 flex flex-col justify-end">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EXPO_OUT }}
            className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted mb-8"
          >
            Selected Work — {projects.length} Projects
          </motion.p>

          <div ref={headlineWrapperRef}>
            <h1
              ref={headlineRef}
              className="font-serif text-[clamp(48px,11vw,160px)] last-word-accent leading-[0.85] tracking-tight text-accent"
              style={{ perspective: "1000px" }}
            >
              {["Crafted", "with", "intent."].map((word, wi) => (
                <span
                  key={wi}
                  className="inline-block overflow-hidden mr-[0.25em] pb-2 last:mr-0 "
                >
                  {word.split("").map((char, ci) => (
                    <span
                      key={ci}
                      className="char inline-block will-change-transform"
                    >
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex items-center justify-between mt-12 pt-6 border-t border-border"
          >
            <p className="font-sans text-muted text-sm max-w-xs leading-relaxed italic">
              A focused body of work across brand identity and digital strategy.
            </p>

            <Link
              href="/#contact"
              className="group hidden md:flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-accent"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              Start a project
            </Link>
          </motion.div>
        </div>
      </div>

      {/* GRID */}
      <div ref={gridRef} className="px-8 md:px-16 py-32">
        <div className="max-w-350 mx-auto">
          <div className="flex flex-col gap-24 md:gap-40">
            {Array.from({
              length: Math.ceil(projects.length / 2),
            }).map((_, rowIndex) => {
              const left = projects[rowIndex * 2];
              const right = projects[rowIndex * 2 + 1];

              return (
                <div
                  key={rowIndex}
                  className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center"
                >
                  {left && (
                    <div className="md:col-span-7 will-change-transform">
                      <ProjectDetailedCard
                        project={left}
                        index={rowIndex * 2}
                        format={getCardFormat(rowIndex * 2)}
                        isHovered={hoveredIndex === rowIndex * 2}
                        onEnter={() => setHoveredIndex(rowIndex * 2)}
                        onLeave={() => setHoveredIndex(null)}
                        ref={(el) => {
                          cardRefs.current[rowIndex * 2] = el;
                        }}
                      />
                    </div>
                  )}

                  {right && (
                    <div className="md:col-span-5 pt-0 md:pt-32 will-change-transform">
                      <ProjectDetailedCard
                        project={right}
                        index={rowIndex * 2 + 1}
                        format={getCardFormat(rowIndex * 2 + 1)}
                        isHovered={hoveredIndex === rowIndex * 2 + 1}
                        onEnter={() => setHoveredIndex(rowIndex * 2 + 1)}
                        onLeave={() => setHoveredIndex(null)}
                        ref={(el) => {
                          cardRefs.current[rowIndex * 2 + 1] = el;
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* BOTTOM CTA omitted for brevity - remains the same but with higher top margin */}
        </div>
      </div>
    </main>
  );
}
