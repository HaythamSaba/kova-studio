"use client";

import { EXPO_OUT } from "@/lib/easings";
import { Variants, motion } from "framer-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number; // initial delay before stagger starts
  stagger?: number; // delay between each character
  duration?: number; // duration of each character animation
}

const containerVariants = (delay: number, stagger: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren: delay,
      staggerChildren: stagger,
    },
  },
});

// Each Character's animation
const charVariants: Variants = {
  hidden: {
    y: "110%", // start below the baseline (clipped by overflow-hidden)
    opacity: 0,
  },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: EXPO_OUT
    },
  },
};

export default function SplitText({
  text,
  className = "",
  delay = 0,
  stagger = 0.03,
}: SplitTextProps) {
  const words = text.split(" ");

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants(delay, stagger)}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split("").map((char, charIndex) => (
            <span key={charIndex} className="inline-block">
              <motion.span className="inline-block" variants={charVariants}>
                {char}
              </motion.span>
            </span>
          ))}
          {/* Space between words - no animation, juust structural */}
          {wordIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </motion.span>
  );
}
