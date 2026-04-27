"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const variants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: {
      duration: 0.3,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  },
};

// The curtain - full screen wipe between pages
// Sits above everytging, wipes down then back up

const curtainVariants = {
  initial: {
    scaleY: 0,
    originY: 0,
  },
  enter: {
    scaleY: 0,
    originY: 1,
    transition: {
      duration: 0.5,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
      delay: 0.1,
    },
  },
  exit: {
    scaleY: 1,
    originY: 0,
    transition: {
      duration: 0.4,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  },
};

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();

  return (
    <>
      {/* Full Screen curtain */}
      {/* Wipes over the pge during navigation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathName + "-curtain"}
          variants={curtainVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          className="fixed inset-0 z-80 bg-surface pointer-events-none"
          aria-hidden="true"
        />
      </AnimatePresence>
      {/* Page content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathName}
          variants={variants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
