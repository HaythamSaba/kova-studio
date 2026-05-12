"use client";

import { projects } from "@/data/projects";
import { useEffect, useRef } from "react";
import ProjectCard from "../ui/ProjectCard";
import { gsap } from "@/lib/gsap";
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

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;
    // total scrollable width = track width - viewport width
    const getScrollDistance = () => track.scrollWidth - window.innerWidth;

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

    return () => ctx.revert(); // clean up all ScrollTriggers on unmount
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-bg"
    >
      <SectionHeader leftTitle="Case Studies" rightTitle="Scroll to explore" />

      {/* Progress bar */}
      {/* Fixed at bottom of the pinned section */}
      <div className="absolute bottom-8 left-8 md:left-16 right-8 md:right-16 z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
            01
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
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
      {/* Horizontal track - This is what GSAP translates leftward   */}
      <div
        ref={trackRef}
        className="absolute top-0 left-0 h-full flex items-center"
        style={{ paddingLeft: "8vw", paddingRight: "8vw", gap: "3vw" }}
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
