"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useEffect, useRef } from "react";
import { setGlobalLenis } from "@/lib/useLenis";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
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
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // 3.1 Prevent GSAP from adding its own lagSmoothing
    gsap.ticker.lagSmoothing(0);

    // 4. Cleanup on unmount
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []); // empty dependency array = run once on mount

  return <>{children}</>;
}
