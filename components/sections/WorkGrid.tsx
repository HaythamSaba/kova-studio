"use client";
import { Project, projects } from "@/data/projects";
import { EXPO_OUT } from "@/lib/easings";
import { useMousePosition } from "@/lib/useMousePosition";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

const rowVariants = {
  initial: {
    opacity: 1,
  },
  dimmed: {
    opacity: 0.3,
    transition: {
      duration: 0.3,
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
        <div className="flex items-baseline justify-between mb-16 pb-5 border-b border-border">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            Selected Work
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            {projects.length} Projects
          </p>
        </div>
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
              {/* Color placeholder — replace with next/image later */}
              <div
                className="w-full h-full"
                style={{ backgroundColor: activeProject.color }}
              >
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

interface ProjectRowProps {
  project: Project;
  index: number;
  isActive: boolean;
  isDimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

function ProjectRow({
  project,
  index,
  isActive,
  isDimmed,
  onEnter,
  onLeave,
}: ProjectRowProps) {
  return (
    <motion.li
      animate={isDimmed ? "dimmed" : "initial"}
      variants={rowVariants}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group "
      data-cursor="hover"
    >
      <Link
        href={`/work/${project.slug}`}
        className="flex items-center justify-between py-7 md:py-9 gap-4"
      >
        {/* Left: index + title */}
        <div className="flex items-baseline gap-6 md:gap-10">
          <span className="font-mono text-[10px] text-muted tracking-widest w-6 shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-serif text-[clamp(28px,4.5vw,72px)] leading-none text-text group-hover:text-accent transition-colors duration-500">
            {project.title}
          </span>
        </div>
        {/* Right: meta */}
        <div className="hidden: md:flex items-center gap-10 shrink-0">
          <span className="font-sans text-sm text-muted">
            {project.category}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted w-20 text-right">
            {project.location}
          </span>
          {/* Arrow - slides in on hover */}
          <motion.span
            animate={{ x: isActive ? 0 : -6, opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.3, ease: EXPO_OUT }}
            className="font-mono text-sm text-accent"
          >
            →
          </motion.span>
        </div>
      </Link>
    </motion.li>
  );
}
