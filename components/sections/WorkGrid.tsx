"use client";
import { projects } from "@/data/projects";
import { EXPO_OUT } from "@/lib/easings";
import { useMousePosition } from "@/lib/useMousePosition";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProjectRow from "./ProjectRow";
import SectionHeader from "../ui/SectionHeader";
const imageVariants = {
  initial: {
    opacity: 0,
    scale: 0.88,
    filter: "blur(8px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: EXPO_OUT,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    filter: "blur(4px)",
    transition: {
      duration: 0.3,
      ease: EXPO_OUT,
    },
  },
};

export default function WorkGrid() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const mouse = useMousePosition();

  // THe floating image element - animate directly via style
  const imageRef = useRef<HTMLDivElement>(null);
  // Current lerp position
  const imgPos = useRef({ x: 0, y: 0 });

  const activeProject = projects.find((p) => p.slug === activeSlug) ?? null;

  // rAF lerp loop for floating image
  useEffect(() => {
    let rafId: number;
    function lerp(current: number, target: number, factor: number) {
      return current + (target - current) * factor;
    }
    function loop() {
      if (!imageRef.current) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      imgPos.current.x = lerp(imgPos.current.x, mouse.current.x, 0.06);
      imgPos.current.y = lerp(imgPos.current.y, mouse.current.y, 0.06);

      // Offset so the image centre is slightly above-right of cursor
      // Adjust these offsets to taste
      const offsetX = 40;
      const offsetY = -120;

      imageRef.current.style.transform = `translate(
        ${imgPos.current.x + offsetX}px,
        ${imgPos.current.y + offsetY}px
      )`;

      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [mouse]);

  return (
    <section id="work" className="relative py-32 px-8 md:px-16">
      {/* Section Header */}
      <div className="max-w-200 mx-auto">
        <SectionHeader leftTitle="Selected Work" rightTitle={`${projects.length} Projects`} />

        {/* Project rows */}
        <ul className="divide-y divide-border">
          {projects.map((project, index) => (
            <ProjectRow
              key={project.slug}
              project={project}
              index={index}
              isActive={activeSlug === project.slug}
              isDimmed={activeSlug !== null && activeSlug !== project.slug}
              onEnter={() => setActiveSlug(project.slug)}
              onLeave={() => setActiveSlug(null)}
            />
          ))}
        </ul>
        <div className="mt-16 pt-5 border-t border-border flex justify-end">
          <Link
            href="/work"
            data-cursor="hover"
            className="group flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors duration-300"
          >
            All Projects
            <span className="w-6 h-px bg-current group-hover:w-10 transition-all duration-500" />
          </Link>
        </div>
      </div>

      {/* Floating image - ONE element, outside the list */}
      {/* Fixed position, driven by the rAF loop above */}
      <div
        ref={imageRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-30 pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <AnimatePresence mode="wait">
          {activeProject && (
            <motion.div
              key={activeProject.slug}
              variants={imageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-95 h-70 md:w-115 md:h-85 overflow-hidden"
            >
              {/* Color placeholder — in case the image fails to load */}
              <div className="relative w-full h-full" 
              style={{ backgroundColor: activeProject.color }}>
                <Image
                  src={activeProject.images.landscape}
                  alt={`${activeProject.title} project`}
                  fill
                  className="object-cover"
                  sizes="460px"
                />

                {/* Project label overlay */}
                <div className="w-full h-full flex-flex-col justify-end p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 mb-1">
                    {activeProject.category}
                  </p>
                  <p className="font-serif text-2xl text-white/90">
                    {activeProject.title}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
