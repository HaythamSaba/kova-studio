"use client";

import { Project, projects } from "@/data/projects";
import { EXPO_OUT } from "@/lib/easings";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// ── fadeUp — used on tagline and copy sections ────────
const fadeUp = {
  hidden: { y: 32, opacity: 0 },
  visible: (delay: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay,
      duration: 0.8,
      ease: EXPO_OUT,
    },
  }),
};

export default function CaseStudy({ project }: { project: Project }) {
  const detailsRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const prevProject =
    projects[(currentIndex - 1 + projects.length) % projects.length];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (detailsRef.current) {
        const items = detailsRef.current.querySelectorAll(".detail-item");
        gsap.fromTo(
          items,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 2,
            stagger: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: detailsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }
      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return (
    <article className="bg-bg text-text min-h-screen">
      {/* ── Hero ──────────────────────────────────── */}
      <div className="relative h-screen flex items-end pb-16 px-8 md:px-16">
        <div className="absolute inset-0">
          <Image
            src={project.images.landscape}
            alt={`${project.title} hero`}
            fill
            className="object-cover"
            // Hero image — above the fold, load immediately
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 40%, rgba(14,12,10,0.9) 100%)",
            }}
          />
        </div>

        <div className="relative max-w-350 mx-auto w-full">
          {/* ── Back link — text outside the line span ── */}

          {/* ── Project title ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 2, ease: EXPO_OUT }}
          >
            <h1 className="font-serif text-[clamp(48px,8vw,128px)] leading-[0.9] text-white">
              {project.title}
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
              {project.category} — {project.location}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: EXPO_OUT }}
            className=""
          >
            <Link
              href="/"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors duration-300"
            >
              {/* Line — decorative only, no text inside */}
              <span className="w-6 h-px bg-current group-hover:w-10 transition-all duration-300" />
              Back
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Project details ──────────────────────── */}
      <div className="px-8 md:px-16 py-16">
        <div className="max-w-350 mx-auto">
          {/* Meta row — GSAP stagger */}
          <div
            ref={detailsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-px mb-20 "
          >
            {[
              { label: "Client", value: project.title, i: 0 },
              { label: "Category", value: project.category, i: 1 },
              { label: "Location", value: project.location, i: 2 },
              { label: "Year", value: project.year, i: 3 },
            ].map(({ label, value, i }) => (
              <motion.div
                key={label}
                className="detail-item relative px-6 py-8 flex flex-col gap-2 border-l-2"
                style={{
                  borderColor: project.color,
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                data-cursor="hover"
              >
                <motion.div
                  animate={{
                    clipPath:
                      hoveredIndex === i
                        ? "inset(0 0 0% 0)"
                        : "inset(0% 100% 0% 0% )",
                  }}
                  transition={{ duration: 1, ease: EXPO_OUT }}
                  className="absolute inset-0 pointer-events-none z-[-1]"
                  style={{ backgroundColor: project.color }}
                />
                <motion.div>
                  <p className="font-mono text-[11px] uppercase mb-2 tracking-[0.3em] text-text">
                    {label}
                  </p>
                  <p className="font-sans text-text text-sm">{value}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* ── Tagline — fadeUp used here ───────── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            custom={0}
            className="mb-20 max-w-2xl"
          >
            <p className="font-serif text-[clamp(24px,3.5vw,48px)] leading-[1.1] text-text">
              &quot;{project.tagline}&quot;
            </p>
          </motion.div>

          {/* Image placeholders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <motion.div
              className="relative aspect-4/3 w-full overflow-hidden group cursor-pointer"
              whileHover="hover"
            >
              {/* Image */}
              <Image
                src={project.images.landscape}
                alt={`${project.title} detail`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Overlay Content */}
              <motion.div
                className="absolute inset-0 z-10 flex flex-col bg-surface/90 p-8"
                variants={{
                  hidden: {
                    opacity: 0,
                    y: "-100%",
                  },
                  hover: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                transition={{
                  duration: 0.55,
                  ease: EXPO_OUT,
                }}
              >
                <p className="m-auto font-serif text-base uppercase tracking-[0.3em] text-white mb-6">
                  . The Brief .
                </p>

                <p className="font-sans text-white text-base leading-relaxed max-w-md">
                  A full case study for {project.title} will live here —
                  covering the brief, process, key decisions, and outcomes. Real
                  copy coming in the content pass.
                </p>
              </motion.div>
            </motion.div>

            <div className="relative aspect-4/3 w-full overflow-hidden">
              <Image
                src={project.images.portrait}
                alt={`${project.title} identity`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="relative w-full aspect-16/7 mb-20 overflow-hidden">
            <Image
              src={project.images.landscape}
              alt={`${project.title} full spread`}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {/* ── Placeholder copy — fadeUp used here ─ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={0}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-6">
                The Brief
              </p>
              <p className="font-sans text-muted text-base leading-relaxed">
                A full case study for {project.title} will live here — covering
                the brief, process, key decisions, and outcomes. Real copy
                coming in the content pass.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={0.15}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-6">
                The Outcome
              </p>
              <p className="font-sans text-muted text-base leading-relaxed">
                Placeholder for results, client feedback, and measurable impact
                of the {project.category.toLowerCase()} work delivered in
                {project.location}.
              </p>
            </motion.div>
          </div>

          {/* ── Project navigation ────────────────── */}
          <div className="grid grid-cols-2 gap-px bg-border border-t border-border pt-px">
            <Link
              href={`/work/${prevProject.slug}`}
              data-cursor="hover"
              className="group bg-bg px-8 py-10 flex flex-col gap-4 hover:bg-surface transition-colors duration-300"
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
                ← Previous
              </p>
              <p className="font-serif text-2xl text-text group-hover:text-accent transition-colors duration-300">
                {prevProject.title}
              </p>
            </Link>

            <Link
              href={`/work/${nextProject.slug}`}
              data-cursor="hover"
              className="group bg-bg px-8 py-10 flex flex-col gap-4 hover:bg-surface transition-colors duration-300 text-right"
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
                Next →
              </p>
              <p className="font-serif text-2xl text-text group-hover:text-accent transition-colors duration-300">
                {nextProject.title}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
