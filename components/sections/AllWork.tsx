"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import { EXPO_OUT } from "@/lib/easings";
import ProjectDetailedCard from "../ui/ProjectDetailedCard";

gsap.registerPlugin(ScrollTrigger);

function getCardFormat(index: number): "landscape" | "portrait" {
  return index % 2 === 0 ? "landscape" : "portrait";
}

export default function AllWork() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headlineWrapperRef = useRef<HTMLDivElement>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Hero scale-out on scroll ──────────────────
      if (heroRef.current) {
        gsap.to(heroRef.current, {
          scale: 0.96,
          opacity: 0.85,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5, // ← was true
          },
        });
      }

      if (headlineRef.current) {
        // ── Headline parallax — targets wrapper ──────
        // Wrapper moves, chars animate independently
        // No conflict between the two animations
        if (headlineWrapperRef.current) {
          gsap.to(headlineWrapperRef.current, {
            yPercent: 20,
            opacity: 0.7,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }

        // ── Initial char reveal ───────────────────────
        const chars = headlineRef.current.querySelectorAll(".char");
        gsap.fromTo(
          chars,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.04,
            delay: 0.2,
          },
        );
      }

      // ── Card reveals — alternating rotation ──────
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        const direction = i % 2 === 0 ? 1.5 : -1.5;
        const imageInner = card.querySelector(".card-image-inner");

        // Card container reveal
        gsap.fromTo(
          card,
          {
            clipPath: "inset(100% 0% 0% 0%)",
            y: 100,
            opacity: 0,
            rotate: direction,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 30%", // ← was "top 55%"
              scrub: 1.5, // ← was true
            },
          },
        );

        // Image parallax inside card
        if (imageInner) {
          gsap.fromTo(
            imageInner,
            { yPercent: -8, scale: 1.08 },
            {
              yPercent: 8,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-bg text-text min-h-screen">
      {/* HERO */}
      <div
        ref={heroRef}
        className="relative px-8 md:px-16 pt-40 pb-16 border-b border-border overflow-hidden"
      >
        <p
          aria-hidden="true"
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 font-serif text-[20vw] leading-none text-surface select-none pointer-events-none"
        >
          K
        </p>

        <div className="max-w-350 mx-auto h-[80vh] relative">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EXPO_OUT }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-8"
          >
            Selected Work — {projects.length} Projects
          </motion.p>
          <div ref={headlineWrapperRef}>
            <h1
              ref={headlineRef}
              className="font-serif text-[clamp(48px,9vw,144px)] leading-[0.88] tracking-tight text-accent"
            >
              {["Crafted", "with", "intent."].map((word, wi) => (
                <span
                  key={wi}
                  className="inline-block overflow-hidden mr-[0.2em] last:mr-0"
                >
                  {word.split("").map((char, ci) => (
                    <span key={ci} className="char inline-block opacity-0">
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex items-center justify-between mt-12 pt-6 border-t border-border"
          >
            <p className="font-sans text-muted text-sm max-w-xs leading-relaxed">
              A focused body of work across brand identity, web design, art
              direction and digital strategy.
            </p>

            <Link
              href="/#contact"
              className="group hidden md:flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-accent"
            >
              <span className="w-6 h-px bg-accent group-hover:w-12 transition-all duration-500" />
              Start a project
            </Link>
          </motion.div>
        </div>
      </div>

      {/* GRID */}
      <div ref={gridRef} className="px-8 md:px-16 py-16">
        <div className="max-w-350 mx-auto">
          <div className="flex flex-col gap-4">
            {Array.from({
              length: Math.ceil(projects.length / 2),
            }).map((_, rowIndex) => {
              const left = projects[rowIndex * 2];
              const right = projects[rowIndex * 2 + 1];

              return (
                <div
                  key={rowIndex}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4"
                >
                  {left && (
                    <div className="md:col-span-7 img">
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
                    <div className="md:col-span-5 img">
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

          {/* CTA */}
          <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
                Have a project in mind?
              </p>
              <p className="font-sans text-muted text-sm">
                We take on a limited number of projects each year.
              </p>
            </div>

            <Link
              href="/#contact"
              className="group flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-accent shrink-0"
            >
              <span className="w-6 h-px bg-accent group-hover:w-14 transition-all duration-500 ease-out" />
              Let&apos;s talk
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
