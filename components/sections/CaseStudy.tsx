"use client";

import { Project, projects } from "@/data/projects";
import { EXPO_OUT } from "@/lib/easings";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import CaseStudyHero from "../ui/CaseStudyHero";

export default function CaseStudy({ project }: { project: Project }) {
  // ── Renamed for clarity — two different hover targets ──
  const [hoveredMeta, setHoveredMeta] = useState<number | null>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const detailsRef = useRef<HTMLDivElement>(null);

  const imageGridRef = useRef<HTMLDivElement>(null);
  const imageInnerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const wideImageRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);

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
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: detailsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      if (!prefersReducedMotion() && imageGridRef.current) {
        ScrollTrigger.create({
          trigger: imageGridRef.current,
          start: "top 25%",
          end: "+=900",
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
        const imageInners = imageInnerRefs.current.filter(
          (el): el is HTMLDivElement => el !== null,
        );
        if (imageInners.length > 0) {
          gsap.fromTo(
            imageInners,
            { clipPath: "inset(10% 15% 10% 15% round 100%)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              ease: "none",
              scrollTrigger: {
                trigger: imageGridRef.current,
                start: "top 25%",
                end: "+=900",
                scrub: 1.5,
              },
            },
          );
        }
      }

      if (wideImageRef.current && imageInnerRef.current) {
        gsap.fromTo(
          imageInnerRef.current,
          {
            clipPath: "inset(0 40% 55% 40% round 40px)",
            scale: 1,
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            scale: 1.5,
            ease: "none",
            scrollTrigger: {
              trigger: wideImageRef.current,
              start: "top 50%",
              end: "bottom bottom",
              scrub: 2,
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
      <CaseStudyHero project={project} />

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

          {/* ── Image grid ──────────────────────────── */}
          <div ref={imageGridRef} className="relative mb-20">
            {/* ── Sticky inner — stays centred during pin ──── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  src: project.images.landscape,
                  alt: `${project.title} detail`,
                },
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
                  {/* clipPath div — GSAP animates this */}
                  <div
                    ref={(el) => {
                      imageInnerRefs.current[i] = el;
                    }}
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      clipPath: "inset(10% 15% 10% 15% round 100%)",
                    }}
                  >
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
                  </div>

                  {/* Hover overlay — unchanged */}
                  <motion.div
                    className="absolute inset-0 z-10 flex flex-col justify-center items-center bg-surface/50 p-8"
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
                        <p className="font-sans text-white text-base leading-relaxed">
                          {project.copy.brief}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-serif text-base uppercase tracking-[0.3em] text-white mb-6">
                          . The Outcome .
                        </p>
                        <p className="font-sans text-white text-base leading-relaxed">
                          {project.copy.outcome}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Wide image → background for nav ─────────── */}
          {/* Single wrapper contains both image and nav.     */}
          {/* Image expands via clipPath scrub to cover nav.  */}
          <div
            ref={wideImageRef}
            className="relative mb-0 overflow-hidden p-5"
            // Height = image area + nav area combined
            // Image starts contained, expands to fill all of this
          >
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
        </div>
      </div>
    </article>
  );
}
