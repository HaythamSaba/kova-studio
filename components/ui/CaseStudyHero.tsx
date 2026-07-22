"use client";

import { Project } from "@/data/projects";
import { EXPO_OUT } from "@/lib/easings";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function CaseStudyHero({ project }: { project: Project }) {
  return (
    <div className="relative h-screen flex items-end pb-16 px-8 md:px-16">
      <div className="absolute inset-0">
        <Image
          src={project.images.landscape}
          alt={`${project.title} hero`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 50%, rgba(14,12,10,0.9) 100%)",
          }}
        />
      </div>

      <div className="relative max-w-350 mx-auto w-full mb-20">
        {/* ── Back link — ABOVE the title ─────────── */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: EXPO_OUT }}
          className="mb-10"
        >
          <Link
            href="/"
            data-cursor="hover"
            className="group inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors duration-300"
          >
            <span className="w-6 h-px bg-current group-hover:w-10 transition-all duration-300" />
            Back
          </Link>
        </motion.div>

        {/* ── Project title — category as eyebrow ─── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: EXPO_OUT }}
        >
          {/* Eyebrow ABOVE title — standard editorial pattern */}
          <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-white/50 mb-4">
            {project.category} — {project.location}
          </p>
          <h1 className="font-serif text-[clamp(48px,8vw,128px)] leading-[0.9] text-white">
            {project.title}
          </h1>
        </motion.div>
      </div>
    </div>
  );
}
