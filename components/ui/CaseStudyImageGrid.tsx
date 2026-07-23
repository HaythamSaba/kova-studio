"use client";

import { forwardRef, MutableRefObject, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Project } from "@/data/projects";
import { EXPO_OUT } from "@/lib/easings";

const CaseStudyImageGrid = forwardRef<
  HTMLDivElement,
  {
    project: Project;
    imageInnerRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  }
>(function CaseStudyImageGrid({ project, imageInnerRefs }, ref) {
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  return (
    <div ref={ref} className="relative mb-20">
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
  );
});

export default CaseStudyImageGrid;
