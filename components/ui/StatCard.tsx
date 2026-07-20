// components/ui/StatCard.tsx
"use client";

import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";
import { useEffect, useRef } from "react";

interface StatProps {
  stat: { value: number; suffix: string; label: string };
  statsRef: React.RefObject<HTMLDivElement | null>;
}

export default function StatCard({ stat, statsRef }: StatProps) {
  // One ref per card — this card's counter span only
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.textContent = stat.value.toString();
      return;
    }

    const proxy = { val: 0 };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        proxy,
        { val: 0 },
        {
          val: stat.value,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            el.textContent = Math.round(proxy.val).toString();
          },
        },
      );
    });

    return () => ctx.revert();
  }, [stat.value, statsRef]);

  return (
    <div className="flex flex-col gap-3 px-8 first:pl-0 last:pr-0 border-r border-border last:border-r-0">
      <div className="flex items-baseline gap-1">
        {/* Single ref — this card's counter only */}
        <span
          ref={counterRef}
          className="font-serif text-[clamp(48px,6vw,96px)] leading-none text-text tabular-nums"
        >
          0
        </span>
        {stat.suffix && (
          <span className="font-serif text-[clamp(24px,3vw,48px)] text-accent">
            {stat.suffix}
          </span>
        )}
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
        {stat.label}
      </p>

      <div className="w-8 h-px bg-border" />
    </div>
  );
}
