"use client";

import { Project, projects } from "@/data/projects";
import { EXPO_OUT } from "@/lib/easings";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import CaseStudyHero from "../ui/CaseStudyHero";
import CaseStudyMetaRow from "../ui/CaseStudyMetaRow";
import CaseStudyImageGrid from "../ui/CaseStudyImageGrid";
import CaseStudyFooterNav from "../ui/CaseStudyFooterNav";

export default function CaseStudy({ project }: { project: Project }) {
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
          <CaseStudyMetaRow ref={detailsRef} project={project} />

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
          <CaseStudyImageGrid
            ref={imageGridRef}
            project={project}
            imageInnerRefs={imageInnerRefs}
          />

          {/* ── Wide image → background for nav ─────────── */}
          <CaseStudyFooterNav
            ref={wideImageRef}
            imageInnerRef={imageInnerRef}
            project={project}
            prevProject={prevProject}
            nextProject={nextProject}
          />
        </div>
      </div>
    </article>
  );
}
