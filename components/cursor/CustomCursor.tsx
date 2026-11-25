// components/cursor/CustomCursor.tsx
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useMousePosition } from "@/lib/useMousePosition";

// ── Detect touch device ─────────────────────────────
// useSyncExternalStore reads this external (non-React) browser state
// safely across SSR/hydration: the server snapshot is always `false`,
// matching the client's first render, then it re-syncs to the real
// value right after mount — no hydration mismatch, no setState-in-effect.
// Checking pointer: coarse OR any touch points catches Samsung Internet
// and iPad configurations that incorrectly report pointer: fine.
function subscribe() {
  return () => {};
}
function getSnapshot() {
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const hasTouch = navigator.maxTouchPoints > 0;
  return coarsePointer || hasTouch;
}
function getServerSnapshot() {
  return false;
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dot = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const mouse = useMousePosition();

  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const isTouchDevice = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

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
          className="rounded-full bg-accent w-2 h-2 transition-[transform,opacity] duration-300 ease-out"
          style={{
            transform: `translate(-50%, -50%) scale(${isClicking ? 6 / 8 : 1})`,
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
          className="rounded-full border border-accent w-15 h-15 transition-[transform,opacity] duration-300 ease-out"
          style={{
            transform: `translate(-50%, -50%) scale(${isClicking ? 28 / 60 : isHovered ? 1 : 36 / 60})`,
            opacity: isHovered ? 0.6 : 0.4,
          }}
        />
      </div>
    </>
  );
}
