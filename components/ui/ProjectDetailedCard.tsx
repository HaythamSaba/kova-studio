import { forwardRef } from "react";
import type { Project } from "@/data/projects";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { EXPO_OUT } from "@/lib/easings";

interface ProjectDetailedCard {
  project: Project;
  index: number;
  format: "landscape" | "portrait";
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

const ProjectDetailedCard = forwardRef<HTMLDivElement, ProjectDetailedCard>(
  function ProjectDetailedCard(
    { project, index, format, isHovered, onEnter, onLeave },
    ref,
  ) {
    return (
      <div
        ref={ref}
        style={{ clipPath: "inset(100% 0% 0% 0%)", opacity: 0 }}
        className="group relative overflow-hidden"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        data-cursor="hover"
      >
        <Link href={`/work/${project.slug}`} className="block">
          {/* ── Image container ─────────────────── */}
          {/* Aspect ratio changes based on format   */}
          <div
            className={`relative w-full overflow-hidden ${format === "landscape" ? "aspect-16/10" : "aspect-3/4"}`}
          >
            {/* Background color while image loads */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: project.color }}
            />

            {/* Project Image */}
            <Image
              src={
                format === "landscape"
                  ? project.images.landscape
                  : project.images.portrait
              }
              alt={`${project.title} — ${project.category}`}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes={
                format === "landscape"
                  ? "(max-width: 768px) 100vw, 60vw"
                  : "(max-width: 768px) 100vw, 40vw"
              }
            />

            {/* Hover overlay */}
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-bg/60"
            />

            {/* ── Large index number ─────────────── */}
            {/* Blooms upward from bottom on hover    */}
            <motion.p
              aria-hidden="true"
              animate={{
                y: isHovered ? "0%" : "30%",
                opacity: isHovered ? 0.12 : 0,
              }}
              transition={{ duration: 0.6, ease: EXPO_OUT }}
              className="absolute bottom-0 right-4 font-serif text-[clamp(80px,14vw,200px)] leading-none text-white select-none pointer-events-none"
            >
              {String(index + 1).padStart(2, "0")}
            </motion.p>

            {/* Project details - slides up */}
            <motion.div
              animate={{
                y: isHovered ? "0%" : "100%",
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.5, ease: EXPO_OUT }}
              className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
            >
              {/* Accent line */}
              <div className="w-8 h-px bg-accent mb-4" />

              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/50 mb-2">
                {project.category}
              </p>
              <div className="flex items-end justify-between">
                <p className="font-serif text-[clamp(20px,2.5vw,36px)] text-white leading-tight">
                  {project.title}
                </p>

                {/* Arrow */}
                <motion.span
                  animate={{
                    x: isHovered ? 0 : -8,
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="font-mono text-sm text-accent mb-1"
                >
                  →
                </motion.span>
              </div>
            </motion.div>
          </div>

          {/* Card footer - always visible */}
          <div className="flex items-center justify-between pt-4 pb-2">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[9px] text-muted tracking-widest">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-lg text-text transition-colors duration-300 group-hover:text-accent">
                {project.title}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-sans text-xs text-muted hidden md:block">
                {project.location}
              </span>
              <span className="font-mono text-[9px] text-muted/50 uppercase tracking-widest">
                {project.year}
              </span>
            </div>
          </div>
        </Link>
      </div>
    );
  },
);

export default ProjectDetailedCard;