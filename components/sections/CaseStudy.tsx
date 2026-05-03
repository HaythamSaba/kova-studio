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

export default function CaseStudy({ project }: { project: Project }) {
  // ── Renamed for clarity — two different hover targets ──
  const [hoveredMeta, setHoveredMeta] = useState<number | null>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const detailsRef = useRef<HTMLDivElement>(null);

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
            duration: 0.7, // ← fixed from 2
            stagger: 0.08, // ← fixed from 0.3
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

      {/* ── Project details ──────────────────────── */}
      <div className="px-8 md:px-16 py-16">
        <div className="max-w-350 mx-auto">
          {/* ── Meta row — GSAP stagger ─────────────── */}
          <div
            ref={detailsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-px mb-20"
          >
            {[
              { label: "Client", value: project.title, i: 0 },
              { label: "Category", value: project.category, i: 1 },
              { label: "Location", value: project.location, i: 2 },
              { label: "Year", value: project.year, i: 3 },
            ].map(({ label, value, i }) => (
              <motion.div
                key={label}
                className="detail-item relative px-6 py-8 flex flex-col gap-2 border-l-2 overflow-hidden"
                style={{ borderColor: project.color }}
                onMouseEnter={() => setHoveredMeta(i)}
                onMouseLeave={() => setHoveredMeta(null)}
                data-cursor="hover"
              >
                {/* Colour fill — z-0 so content sits above it */}
                <motion.div
                  animate={{
                    clipPath:
                      hoveredMeta === i
                        ? "inset(0 0% 0 0)"
                        : "inset(0 100% 0 0)",
                  }}
                  transition={{ duration: 1, ease: EXPO_OUT }}
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{ backgroundColor: project.color }}
                />

                {/* Content — z-10 sits above fill ─── */}
                <div className="relative z-10">
                  <p className="font-mono text-[11px] uppercase mb-2 tracking-[0.3em] text-text">
                    {label}
                  </p>
                  <p className="font-sans text-text text-sm">{value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Tagline ──────────────────────────────── */}
          <motion.div
            initial={{ y: 32, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: EXPO_OUT }}
            className="mb-20 max-w-2xl"
          >
            <p className="font-serif text-[clamp(24px,3.5vw,48px)] leading-[1.1] text-text">
              &quot;{project.tagline}&quot;
            </p>
          </motion.div>

          {/* ── Image grid — hover reveals content ───── */}
          {/* mb-20 so wide image below has breathing room */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
            {[
              { src: project.images.landscape, alt: `${project.title} detail` },
              {
                src: project.images.portrait,
                alt: `${project.title} identity`,
              },
            ].map((img, i) => (
              <motion.div
                key={i}
                className="relative aspect-4/3 w-full overflow-hidden cursor-pointer"
                onHoverStart={() => setHoveredImage(i)}
                onHoverEnd={() => setHoveredImage(null)}
              >
                {/* Image — scales on hover */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: hoveredImage === i ? 1.05 : 1 }}
                  transition={{ duration: 0.7, ease: EXPO_OUT }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>

                {/* Content overlay — slides down from top on hover */}
                <motion.div
                  className="absolute inset-0 z-10 flex flex-col bg-surface/50 p-8"
                  variants={{
                    hidden: { opacity: 1, y: "-100%" },
                    hover: { opacity: 1, y: "0%" },
                  }}
                  initial="hidden"
                  animate={hoveredImage === i ? "hover" : "hidden"}
                  transition={{ duration: 0.55, ease: EXPO_OUT }}
                >
                  {i === 0 ? (
                    <div>
                      <p className="font-serif text-base uppercase tracking-[0.3em] text-white mb-6">
                        . The Brief .
                      </p>
                      <p className="font-sans text-white text-base leading-relaxed max-w-md">
                        A full case study for {project.title} will live here —
                        covering the brief, process, key decisions, and
                        outcomes. Real copy coming in the content pass.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-serif text-base uppercase tracking-[0.3em] text-white mb-6">
                        . The Outcome .
                      </p>
                      <p className="font-sans text-white text-base leading-relaxed">
                        Placeholder for results, client feedback, and measurable
                        impact of the {project.category.toLowerCase()} work
                        delivered in {project.location}.
                      </p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* ── Wide image ───────────────────────────── */}
          <motion.div
            className="relative w-full aspect-16/7 mb-20 overflow-hidden"
            initial={{ scale: 0.5 }}
            whileInView={{ scale: 1 }}
          >
            <Image
              src={project.images.landscape}
              alt={`${project.title} full spread`}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>

          {/* ── Project navigation ────────────────────── */}
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
