"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";
import { projects } from "@/data/projects";
import ProjectDetailedCard from "../ui/ProjectDetailedCard";
import AllWorkHero from "../ui/AllWorkHero";

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
    if (prefersReducedMotion()) {
      // Show all cards immediately
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.style.clipPath = "inset(0% 0% 0% 0%)";
        card.style.opacity = "1";
      });
      return;
    }
    
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

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="bg-bg text-text min-h-screen">
      {/* HERO */}
      <AllWorkHero
        ref={heroRef}
        headlineRef={headlineRef}
        headlineWrapperRef={headlineWrapperRef}
        ghostRef={ghostRef}
      />

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
                    <div className="md:col-span-7">
                      <ProjectDetailedCard
                        project={left}
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
                    <div className="md:col-span-5 pt-0 md:pt-32">
                      <ProjectDetailedCard
                        project={right}
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
