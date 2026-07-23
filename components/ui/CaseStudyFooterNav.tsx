"use client";

import { forwardRef, RefObject } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/data/projects";

const CaseStudyFooterNav = forwardRef<
  HTMLDivElement,
  {
    project: Project;
    imageInnerRef: RefObject<HTMLDivElement | null>;
    prevProject: Project;
    nextProject: Project;
  }
>(function CaseStudyFooterNav(
  { project, imageInnerRef, prevProject, nextProject },
  ref,
) {
  return (
    <div ref={ref} className="relative mb-0 overflow-hidden p-5">
      {/* ── Image — absolutely fills the wrapper ─────── */}
      {/* clipPath animated by GSAP — starts inset,       */}
      {/* expands to cover everything including nav        */}
      <div
        ref={imageInnerRef}
        className="absolute inset-0 z-0 top-20"
        style={{
          // Initial state matches GSAP fromTo clipPath
          clipPath: "inset(0 40% 35% 40% round 40px)",
        }}
      >
        <Image
          src={project.images.landscape}
          alt={`${project.title} full spread`}
          fill
          className="object-cover"
          sizes="100vw"
        />

        {/* Dark gradient over image so nav text stays readable */}
        {/* Gradient is heavier at the bottom where nav sits   */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(14,12,10,0.2) 0%, rgba(14,12,10,0.75) 60%, rgba(14,12,10,0.92) 100%)",
          }}
        />
      </div>

      {/* ── Spacer — reserves the image's visual height ─ */}
      {/* This is what makes the image "appear" to grow    */}
      {/* from this aspect ratio upward as scroll expands  */}
      <div className="relative z-10 w-full aspect-16/7" />

      {/* ── Project navigation — sits on top of image ─── */}
      {/* z-10 keeps it above the expanding image          */}
      {/* Text is white since image is now the background  */}
      <div className="relative z-10 grid grid-cols-2">
        {/* Divider line between cards */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10" />

        {/* Previous project */}
        <Link
          href={`/work/${prevProject.slug}`}
          data-cursor="hover"
          className="group px-8 md:px-14 py-12 md:py-16 flex flex-col gap-4"
        >
          {/* Hover fill — subtle white tint */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-white/5 pointer-events-none"
          />

          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/70 group-hover:text-white transition-colors duration-300">
            ← Previous
          </p>

          {/* Project image thumbnail on hover */}
          <div className="relative">
            <p className="font-serif text-[clamp(20px,3vw,36px)] text-white/80 group-hover:text-white transition-colors duration-500 leading-tight">
              {prevProject.title}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/60 mt-2 group-hover:text-white/80 transition-colors duration-300">
              {prevProject.category}
            </p>
          </div>

          {/* Arrow slides right on hover */}
          <motion.span
            animate={{ x: 0 }}
            whileHover={{ x: 6 }}
            className="font-mono text-xs text-accent"
          >
            ←
          </motion.span>
        </Link>

        {/* Next project */}
        <Link
          href={`/work/${nextProject.slug}`}
          data-cursor="hover"
          className="group relative px-8 md:px-14 py-12 md:py-16 flex flex-col gap-4 items-end text-right"
        >
          {/* Hover fill */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-white/5 pointer-events-none"
          />

          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/70 group-hover:text-white transition-colors duration-300">
            Next →
          </p>

          <div className="relative">
            <p className="font-serif text-[clamp(20px,3vw,36px)] text-white/80 group-hover:text-white transition-colors duration-500 leading-tight">
              {nextProject.title}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/60 mt-2 group-hover:text-white/80 transition-colors duration-300">
              {nextProject.category}
            </p>
          </div>

          <motion.span
            animate={{ x: 0 }}
            whileHover={{ x: -6 }}
            className="font-mono text-xs text-accent"
          >
            →
          </motion.span>
        </Link>
      </div>
    </div>
  );
});

export default CaseStudyFooterNav;
