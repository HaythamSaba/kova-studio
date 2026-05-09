"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const items = [
  "Brand Identity",
  "Web Design",
  "Digital Strategy",
  "Art Direction",
  "Motion",
  "Typography",
  "Editorial",
  "Web Experience",
];

function Separator() {
  return (
    <span
      aria-hidden="true"
      className="inline-block w-1.5 h-1.5 rounded-full bg-accent mx-8 shrink-0 rotate-45"
    />
  );
}

export default function Marquee() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(0);
  const lastScrollRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    // show content statically - no animation or movement
    if (trackRef.current) {
      trackRef.current.style.transform = "translateX(0)";
    }
    return;
  };

    const track = trackRef.current;
    if (!track) return;

    const singleWidth = track.scrollWidth / 2;

    tweenRef.current = gsap.to(track, {
      x: -singleWidth,
      duration: 18,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % singleWidth),
      },
    });

    function handleScroll() {
      const currentScroll = window.scrollY;
      velocityRef.current = currentScroll - lastScrollRef.current;
      lastScrollRef.current = currentScroll;

      if (tweenRef.current) {
        const boost = Math.min(
          4,
          Math.max(1, 1 + Math.abs(velocityRef.current) * 0.05),
        );
        gsap.to(tweenRef.current, {
          timeScale: boost,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        });

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // After scroll stops, return to normal speed
        scrollTimeoutRef.current = setTimeout(() => {
          if (tweenRef.current) {
            gsap.to(tweenRef.current, {
              timeScale: 1,
              duration: 1,
              ease: "power2.out",
              overwrite: true,
            });
          }
        }, 150);
      }
    }

    // ── Hover — pause on enter, resume on leave ──────
    function handleMouseEnter() {
      if (tweenRef.current) {
        gsap.to(tweenRef.current, {
          timeScale: -1, // almost stops — not fully, feels better
          duration: 0.6,
          ease: "power2.out",
          overwrite: true,
        });
      }
    }
    function handleMouseLeave() {
      if (tweenRef.current) {
        gsap.to(tweenRef.current, {
          timeScale: 1,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true,
        });
      }
    }

    const wrapper = wrapperRef.current;
    window.addEventListener("scroll", handleScroll, { passive: true });
    wrapper?.addEventListener("mouseenter", handleMouseEnter);
    wrapper?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      tweenRef.current?.kill();

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      window.removeEventListener("scroll", handleScroll);
      wrapper?.removeEventListener("mouseenter", handleMouseEnter);
      wrapper?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative py-5 border-y border-border overflow-hidden bg-bg"
      aria-hidden="true"
    >
      {/* /* Fade masks — left and right edges fade out */}
      {/* Creates the illusion of infinite content    */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, #0e0c0a, transparent)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to left, #0e0c0a, transparent)",
        }}
      />

      {/* Track - contains two identical sets - GSAP moves this leftward continuously */}
      <div
        ref={trackRef}
        className="flex items-center whitespace-nowrap will-change-transform"
      >
        <MarqueeItems />
        <MarqueeItems />
      </div>
    </div>
  );
}

function MarqueeItems() {
  return (
    <div className="flex items-center shrink-0">
      {items.map((item, i) => (
        <span key={i} className="flex items-center shrink-0">
          <span className="font-serif font-bold text-[20px] uppercase tracking-[0.25em] text-white hover:text-accent transition-colors duration-300 cursor-default">
            {item}
          </span>
          <Separator />
        </span>
      ))}
    </div>
  );
}
