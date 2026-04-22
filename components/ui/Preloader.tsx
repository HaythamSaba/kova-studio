// components/Preloader.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SHARP } from "@/lib/easings";

// ── Variants ──────────────────────────────────────────

// The full-screen overlay — wipes upward on exit
const overlayVariants = {
  initial: { y: 0 },
  exit: {
    y: "-100%",
    transition: {
      duration: 0.9,
      ease: SHARP,// sharp cubic — feels intentional
      delay: 0.3, // brief pause after count reaches 100
    },
  },
};

// The counter number
const counterVariants = {
  initial: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);

  // ── Count from 0 → 100 ───────────────────────────
  useEffect(() => {
    // We don't use a fixed interval — we use a variable
    // delay that starts slow, speeds up, then hesitates
    // near 100. This feels organic, not robotic.
    let current = 0;

    function tick() {
      // How far along are we? (0 → 1)
      const progress = current / 100;

      // Delay curve: fast in middle, slow at start and end
      // At 0%: ~80ms, at 50%: ~20ms, at 95%+: ~60ms
      const delay = progress < 0.9 ? Math.max(20, 80 - progress * 80) : 60;

      current += 1;
      setCount(current);

      if (current < 100) {
        setTimeout(tick, delay);
      } else {
        // At 100 — wait briefly then dismiss
        setTimeout(() => setVisible(false), 600);
      }
    }

    // Small initial pause before counting starts
    const startTimer = setTimeout(tick, 300);
    return () => clearTimeout(startTimer);
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
            className="absolute top-8 left-8 font-mono text-xs uppercase tracking-[0.25em] text-muted"
          >
            Kova Studio
          </motion.p>

          {/* ── Year — top right ─────────────────── */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-8 right-8 font-mono text-xs uppercase tracking-[0.25em] text-muted"
          >
            Est. 2020
          </motion.p>

          {/* ── Counter ───────────────────────────── */}
          <div className="relative flex flex-col items-center gap-6">
            <motion.div variants={counterVariants} className="overflow-hidden">
              {/* The number itself */}
              <motion.p
                key={count} // re-mounts on every count change
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="font-serif text-[clamp(80px,15vw,160px)] leading-none text-text tabular-nums"
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
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted"
            >
              Loading
            </motion.p>
          </div>

          {/* ── Location tag — bottom left ────────── */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute bottom-8 left-8 font-mono text-[10px] uppercase tracking-[0.25em] text-muted"
          >
            Ljubljana, Slovenia
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
