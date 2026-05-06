"use client";

import { forwardRef } from "react";
import type { Project } from "@/data/projects";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProjectDetailedCardProps {
  project: Project;
  index: number;
  format: "landscape" | "portrait";
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

const ProjectDetailedCard = forwardRef<
  HTMLDivElement,
  ProjectDetailedCardProps
>(({ project, format, isHovered, onEnter, onLeave }, ref) => {
  return (
    <div
      ref={ref}
      className="group relative will-change-transform"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <Link href={`/work/${project.slug}`} className="block">
        {/* Main Image Container */}
        <div
          className={`relative w-full overflow-hidden bg-surface ${
            format === "landscape" ? "aspect-16/10" : "aspect-3/4"
          }`}
        >
          {/* Parallax Wrapper */}
          <div className="card-image-inner relative w-full h-full scale-110">
            <Image
              src={
                format === "landscape"
                  ? project.images.landscape
                  : project.images.portrait
              }
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Premium Minimal Overlay */}
          <div
            className={`absolute inset-0 bg-bg transition-opacity duration-700 ${isHovered ? "opacity-20" : "opacity-0"}`}
          />

          {/* Project title that appears only on hover inside the card */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.h3
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8,
              }}
              className="text-white font-serif text-5xl z-20"
            >
              View Project
            </motion.h3>
          </div>
        </div>

        {/* Info Block - Kinetic Horizontal shift happens here */}
        <div className="mt-6 flex flex-col gap-1">
          <div className="overflow-hidden">
            <p className="category-tag font-mono text-[10px] uppercase tracking-[0.5em] text-accent/60 will-change-transform">
              {project.category}
            </p>
          </div>

          <div className="flex justify-between items-baseline">
            <h3 className="font-serif text-2xl md:text-3xl text-text">
              {project.title}
            </h3>
            <span className="font-mono text-[10px] text-muted">
              {project.year}
            </span>
          </div>

          {/* Aesthetic progress bar that fills on hover */}
          <div className="w-full h-1px bg-border mt-2 relative overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: isHovered ? "0%" : "-100%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-accent"
            />
          </div>
        </div>
      </Link>
    </div>
  );
});

ProjectDetailedCard.displayName = "ProjectDetailedCard";

export default ProjectDetailedCard;
