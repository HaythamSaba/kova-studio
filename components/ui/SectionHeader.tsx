"use client";

import { motion } from "framer-motion";
import { EXPO_OUT } from "@/lib/easings";

interface SectionHeaderProps {
  leftTitle: string;
  rightTitle: string;
}

export default function SectionHeader({
  leftTitle,
  rightTitle,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: EXPO_OUT }}
      className="flex items-baseline justify-between mb-20 pb-5 border-b border-border p-8"
    >
      <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-muted">
        {leftTitle}
      </p>
      <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-muted">
        {rightTitle}
      </p>
    </motion.div>
  );
}
