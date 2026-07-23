"use client";

import { forwardRef, RefObject } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { projects } from "@/data/projects";
import { EXPO_OUT } from "@/lib/easings";

const AllWorkHero = forwardRef<
  HTMLDivElement,
  {
    headlineRef: RefObject<HTMLHeadingElement | null>;
    headlineWrapperRef: RefObject<HTMLDivElement | null>;
    ghostRef: RefObject<HTMLParagraphElement | null>;
  }
>(function AllWorkHero({ headlineRef, headlineWrapperRef, ghostRef }, ref) {
  return (
    <div
      ref={ref}
      className="relative px-8 md:px-16 pt-40 pb-16 border-b border-border overflow-hidden perspective-1000"
    >
      <p
        ref={ghostRef}
        aria-hidden="true"
        className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 font-serif text-[25vw] leading-none text-surface select-none pointer-events-none z-0 opacity-40"
      >
        K
      </p>

      <div className="max-w-350 mx-auto h-[70vh] relative z-10 flex flex-col justify-end">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: EXPO_OUT }}
          className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted mb-8"
        >
          Selected Work — {projects.length} Projects
        </motion.p>

        <div ref={headlineWrapperRef}>
          <h1
            ref={headlineRef}
            className="font-serif text-[clamp(48px,11vw,160px)] last-word-accent leading-[0.85] tracking-tight text-accent"
            style={{ perspective: "1000px" }}
          >
            {["Crafted", "with", "intent."].map((word, wi) => (
              <span
                key={wi}
                className="inline-block overflow-hidden mr-[0.25em] pb-2 last:mr-0 "
              >
                {word.split("").map((char, ci) => (
                  <span
                    key={ci}
                    className="char inline-block will-change-transform"
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex items-center justify-between mt-12 pt-6 border-t border-border"
        >
          <p className="font-sans text-muted text-sm max-w-xs leading-relaxed italic">
            A focused body of work across brand identity and digital strategy.
          </p>

          <Link
            href="/#contact"
            className="group hidden md:flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-accent"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </span>
            Start a project
          </Link>
        </motion.div>
      </div>
    </div>
  );
});

export default AllWorkHero;
