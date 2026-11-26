// components/Preloader.tsx
"use client";

import { useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SHARP } from "@/lib/easings";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

// ── Variants ──────────────────────────────────────────

// The full-screen overlay — wipes upward on exit
const overlayVariants = {
  initial: { y: 0 },
  exit: {
    y: "-100%",
    background: "rgba(0, 0, 0, 0)",
    transition: {
      duration: 0.3,
      ease: SHARP, // sharp cubic — feels intentional
      delay: 0.05, // brief pause after count reaches 100
    },
  },
};

// The counter number
const counterVariants = {
  initial: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

// Shown once per browser session, skipped entirely for reduced motion
const SESSION_KEY = "kova-preloader-seen";
const COUNT_DURATION_MS = 600; // 0 → 100 over a fixed ~0.6s
const HOLD_MS = 150; // brief pause once the count hits 100

export default function Preloader() {
  const [count, setCount] = useState(0);
  // Starts visible on both server and client — identical initial
  // markup avoids a hydration mismatch. The layout effect below
  // dismisses it before paint when it shouldn't run at all.
  const [visible, setVisible] = useState(true);

  // ── Skip for reduced motion / a repeat visit this session; ──
  // otherwise count 0 → 100 over a fixed ~600ms. useLayoutEffect,
  // not useEffect: the skip decision runs before the browser
  // paints, so a skip never flashes the full overlay for a frame.
  useLayoutEffect(() => {
    if (prefersReducedMotion() || sessionStorage.getItem(SESSION_KEY)) {
      setVisible(false);
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "1");

    let rafId: number;
    let start: number | null = null;

    function tick(now: number) {
      if (start === null) start = now;
      const progress = Math.min(1, (now - start) / COUNT_DURATION_MS);
      setCount(Math.round(progress * 100));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), HOLD_MS);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="preloader"
          variants={overlayVariants}
          initial="initial"
          exit="exit"
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-bg"
        >
          {/* ── Grain texture overlay ─────────────── */}
          {/* Adds the warm, tactile feel of the brand */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
            }}
          />

          {/* ── Studio name — top left ────────────── */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-8 left-8 font-mono text-eyebrow uppercase tracking-eyebrow text-muted"
          >
            Kova Studio
          </motion.p>

          {/* ── Year — top right ─────────────────── */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-8 right-8 font-mono text-eyebrow uppercase tracking-eyebrow text-muted"
          >
            Est. 2020
          </motion.p>

          {/* ── Counter ───────────────────────────── */}
          <div className="relative flex flex-col items-center gap-6">
            <motion.div variants={counterVariants} className="overflow-hidden">
              {/* The number itself */}
              <motion.p
                key={count} // re-mounts on every count change
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.05, ease: "easeOut" }}
                className="font-serif text-counter-lg leading-none text-text tabular-nums"
              >
                {count}
              </motion.p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-48 h-px bg-border overflow-hidden">
              <motion.div
                className="h-full bg-accent origin-left"
                animate={{ scaleX: count / 100 }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>

            {/* Label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-mono text-eyebrow uppercase tracking-eyebrow text-muted"
            >
              Loading
            </motion.p>
          </div>

          {/* ── Location tag — bottom left ────────── */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute bottom-8 left-8 font-mono text-eyebrow uppercase tracking-eyebrow text-muted"
          >
            Ljubljana, Slovenia
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
