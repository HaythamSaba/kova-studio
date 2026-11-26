"use client";

import { projects } from "@/data/projects";
import { useEffect, useRef } from "react";
import ProjectCard from "../ui/ProjectCard";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";
import SectionHeader from "../ui/SectionHeader";
import SidePanel from "../ui/SidePanel";

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;

    if (!section || !track || !progress) return;

    if (prefersReducedMotion()) return;
    // total scrollable width = track width - viewport width
    const getScrollDistance = () => track.scrollWidth - window.innerWidth;

    // Pin + horizontal scrub on desktop; a simple vertical fade-in on
    // mobile, where the section scrolls natively and pin + scrub + Lenis
    // is a well-documented source of jank (see K8).
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progress) {
                progress.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });
        tl.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
        });
      }, section);

      return () => ctx.revert();
    });

    mm.add("(max-width: 767px)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          track.children,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert(); // clean up all ScrollTriggers on unmount
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-bg overflow-x-auto md:h-screen md:overflow-hidden"
    >
      <SectionHeader leftTitle="Case Studies" rightTitle="Scroll to explore" />

      {/* Progress bar — tied to the pinned desktop scrub only */}
      <div className="hidden md:block absolute bottom-8 left-8 md:left-16 right-8 md:right-16 z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-muted">
            01
          </p>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-muted">
            {String(projects.length).padStart(2, "0")}
          </p>
        </div>
        {/* Track */}
        <div className="w-full h-px bg-border overflow-hidden">
          {/* Fill - scaled from 0 to 1 via ScrollTrigger onUpdate */}
          <div
            ref={progressRef}
            className="h-full bg-accent origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
      {/* Horizontal track — GSAP translates this leftward on desktop;
          on mobile it scrolls natively inside the section's overflow-x */}
      <div
        ref={trackRef}
        className="relative flex items-center gap-6 px-8 py-20 md:absolute md:top-0 md:left-0 md:h-full md:gap-[3vw] md:px-[8vw] md:py-0"
      >
        {/* Intro card - First "card" is just text */}
        <div className="shrink-0 flex flex-col justify-center h-[65vh] w-[30vw] max-w-90 pl-8 border-l border-border" />

        <SidePanel
          label="Selected Cases"
          titleLeft={["Work that"]}
          titleMiddle="leaves a mark."
          className="w-[40vw] max-w-120"
        >
          <p className="font-sans text-muted text-sm leading-relaxed max-w-xs">
            Each project is a collaboration built on trust, clarity, and a
            shared belief that design should outlast the brief.
          </p>
        </SidePanel>

        {/* Project cards */}
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}

        {/* Outro card - Call to action */}
        <SidePanel
          label="Start a project"
          titleLeft={["Have something"]}
          titleMiddle="worth building?"
          className="w-[30vw] max-w-90 pl-8 border-l border-border"
        >
          <a className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
            <span className="w-6 h-px bg-accent group-hover:w-12 transition-all duration-500" />
            Let&apos;s talk
          </a>
        </SidePanel>

        <div className="shrink-0 flex flex-col justify-center h-[65vh] w-[30vw] max-w-90 pl-8 border-l border-border" />
      </div>
    </section>
  );
}
