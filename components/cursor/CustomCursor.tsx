// components/cursor/CustomCursor.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useMousePosition } from "@/lib/useMousePosition";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dot = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const mouse = useMousePosition();

  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // ── Detect touch device — lazy initializer ───────
  // Double check: pointer: coarse OR any touch points
  // Catches Samsung Internet and iPad configurations
  // that incorrectly report pointer: fine
  const [isTouchDevice] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const hasTouch = navigator.maxTouchPoints > 0;
    return coarsePointer || hasTouch;
  });

  // ── Hover detection ──────────────────────────────
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor='hover']")) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor='hover']")) {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isTouchDevice]);

  // ── rAF lerp loop ────────────────────────────────
  useEffect(() => {
    if (isTouchDevice) return;

    let rafId: number;

    function lerp(current: number, target: number, factor: number) {
      return current + (target - current) * factor;
    }

    function loop() {
      dot.current.x = lerp(dot.current.x, mouse.current.x, 0.15);
      dot.current.y = lerp(dot.current.y, mouse.current.y, 0.15);
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.08);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.08);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dot.current.x}px, ${dot.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isTouchDevice, mouse]);

  // ── Don't render on touch devices ───────────────
  if (isTouchDevice) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-9999 pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <div
          className="rounded-full bg-accent transition-all duration-300 ease-out"
          style={{
            width: isClicking ? "6px" : "8px",
            height: isClicking ? "6px" : "8px",
            transform: "translate(-50%, -50%)",
            opacity: isClicking ? 1 : isHovered ? 0 : 1,
          }}
        />
      </div>

      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-9998 pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <div
          className="rounded-full border border-accent transition-all duration-300 ease-out"
          style={{
            width: isClicking ? "28px" : isHovered ? "60px" : "36px",
            height: isClicking ? "28px" : isHovered ? "60px" : "36px",
            transform: "translate(-50%, -50%)",
            opacity: isHovered ? 0.6 : 0.4,
          }}
        />
      </div>
    </>
  );
}
