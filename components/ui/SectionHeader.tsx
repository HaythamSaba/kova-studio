"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface SectionHeaderProps {
  leftTitle: string;
  rightTitle: string;
}

export default function SectionHeader({
  leftTitle,
  rightTitle,
}: SectionHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      if (headerRef.current) headerRef.current.style.opacity = "1";
      return;
    }

    const ctx = gsap.context(() => {
      // ── Header entrance ───────────────────────

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={headerRef}
      style={{ opacity: 0 }}
      className="flex items-baseline justify-between mb-20 pb-5 border-b border-border p-8"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        {leftTitle}
      </p>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        {rightTitle}
      </p>
    </div>
  );
}
