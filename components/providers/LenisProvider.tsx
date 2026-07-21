"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useEffect, useRef } from "react";
import { setGlobalLenis } from "@/lib/useLenis";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced motion — native scroll is the right fallback
    if (prefersReducedMotion()) return;

    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    setGlobalLenis(lenis);
    lenisRef.current = lenis;

    // 2. Wire Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // 3. Wire GSAP ticker to Lenis
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);

    // 3.1 Prevent GSAP from adding its own lagSmoothing
    gsap.ticker.lagSmoothing(0);

    // 4. Cleanup on unmount
    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []); // empty dependency array = run once on mount

  return <>{children}</>;
}
