"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EXPO_OUT } from "@/lib/easings";
import SectionHeader from "../ui/SectionHeader";
import SectionTitle from "../ui/SectionTitle";

// ── Services data ─────────────────────────────────────
const services = [
  {
    index: "01",
    title: "Brand Identity",
    description:
      "Logo systems, visual language, typography, colour, and the full set of marks a brand needs to hold its shape across every surface.",
    detail: "Strategy → Visual Identity → Brand Guidelines → Asset Library",
  },
  {
    index: "02",
    title: "Web Design",
    description:
      "From concept to deployed product. We design and build sites that move with intention — not just look good in a mockup.",
    detail: "UX → UI Design → Development → CMS Integration",
  },
  {
    index: "03",
    title: "Art Direction",
    description:
      "Visual oversight across photography, motion, and campaign work. We ensure every pixel serves the brand, not the other way around.",
    detail: "Creative Direction → Photography → Motion → Campaign",
  },
  {
    index: "04",
    title: "Digital Strategy",
    description:
      "Market positioning, content architecture, and the thinking that sits behind good execution. We help brands decide before they build.",
    detail: "Positioning → Content Strategy → Roadmap → Go-to-Market",
  },
];

export default function Capabilities() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="capabilities"
      className="relative py-32 md:py-48 px-8 md:px-16 border-t border-border"
    >
      <div className="max-w-350 mx-auto">
        {/* Section header */}
        <SectionHeader
          leftTitle="What We Do"
          rightTitle={`${services.length} Services`}
        />

        {/* Intro headline */}
        <div className="flex flex-col p-8">
          <div className="relative mb-20">
            <div className="w-48 sm:w-64 md:w-80 h-30 bg-accent -top-16 absolute" />
            <SectionTitle
              as="h2"
              Left={["Craft at every"]}
              ColoredMiddle="layer."
            />
          </div>

          {/* Tiles grid */}
          {/* 2*2 on desktop, 1 column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {services.map((service, i) => (
              <motion.div
                key={service.index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease: EXPO_OUT, delay: i * 0.15 }}
                className="capability-tile relative bg-bg p-10 flex flex-col gap-8 group min-h-85"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                data-cursor="hover"
              >
                {/* ── Hover fill ─────────────────────── */}
                <motion.div
                  animate={{
                    clipPath:
                      hoveredIndex === i
                        ? "inset(0 0 0% 0)"
                        : "inset(50% 0 50% 0)",
                  }}
                  transition={{ duration: 1, ease: EXPO_OUT }}
                  className="absolute inset-0 bg-accent pointer-events-none"
                />
                {/* Tile content */}
                <div className="relative flex flex-col gap-8">
                  {/* Top row - index + arrow */}
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-eyebrow uppercase tracking-eyebrow"
                      style={{
                        color:
                          hoveredIndex === i
                            ? "var(--color-surface)"
                            : "var(--color-muted)",
                      }}
                    >
                      {service.index}
                    </span>

                    {/* Arrow - rotates on hover */}
                    <motion.span
                      animate={{ rotate: hoveredIndex === i ? -45 : 0 }}
                      transition={{ duration: 0.3, ease: EXPO_OUT }}
                      className="font-mono text-sm transition-colors duration-300"
                      style={{
                        color:
                          hoveredIndex === i
                            ? "var(--color-bg)"
                            : "var(--color-muted)",
                      }}
                    >
                      →
                    </motion.span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-tile-title leading-[0.95] text-text">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="font-sans text-sm leading-relaxed max-w-xs"
                    style={{
                      color:
                        hoveredIndex === i
                          ? "var(--color-surface)"
                          : "var(--color-muted)",
                    }}
                  >
                    {service.description}
                  </p>

                  {/* Detail line - slides in on hover */}
                  <AnimatePresence>
                    {hoveredIndex === i ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.3, ease: EXPO_OUT }}
                        className="flex items-center gap-3 pt-4 border-t border-border"
                      >
                        <span
                          className="font-mono text-eyebrow uppercase tracking-eyebrow"
                          style={{
                            color:
                              hoveredIndex === i
                                ? "var(--color-surface)"
                                : "var(--color-muted)",
                          }}
                        >
                          {service.detail}
                        </span>
                      </motion.div>
                    ) : (
                      <div></div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mt-16 p-8 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="font-sans text-muted text-sm max-w-sm leading-relaxed">
            Every engagement starts with a conversation. No briefs, no decks —
            just a direct discussion about what you&apos;re building and why.
          </p>
          <a
            href="#contact"
            data-cursor="hover"
            className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-accent shrink-0"
          >
            <span className="w-6 h-px bg-accent group-hover:w-12 transition-all duration-500" />
            Start a conversation
          </a>
        </div>
      </div>
    </section>
  );
}
