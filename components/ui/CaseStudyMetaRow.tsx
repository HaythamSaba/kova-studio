"use client";

import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { Project } from "@/data/projects";
import { EXPO_OUT } from "@/lib/easings";

const CaseStudyMetaRow = forwardRef<HTMLDivElement, { project: Project }>(
  function CaseStudyMetaRow({ project }, ref) {
    const [hoveredMeta, setHoveredMeta] = useState<number | null>(null);

    return (
      <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-px mb-20">
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
                  hoveredMeta === i ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
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
    );
  },
);

export default CaseStudyMetaRow;
