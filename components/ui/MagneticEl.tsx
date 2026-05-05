// components/ui/MagneticEl.tsx
"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticElProps {
  children: React.ReactNode;
  // How strongly the element follows the cursor
  // 0.1 = subtle, 0.5 = dramatic
  strength?: number;
  // Spring config — stiffer = snappier return
  stiffness?: number;
  damping?: number;
  className?: string;
}

export default function MagneticEl({
  children,
  strength = 0.3,
  stiffness = 200,
  damping = 15,
  className = "",
}: MagneticElProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    // Distance from cursor to element centre
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    // Apply strength multiplier
    setPos({ x: x * strength, y: y * strength });
  }

  function handleMouseLeave() {
    // Spring back to origin
    setPos({ x: 0, y: 0 });
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{
        type: "spring",
        stiffness: stiffness,
        damping: damping,
        mass: 0.1, // low mass = snappy feel
      }}
      className={className}
      data-cursor="hover"
    >
      {children}
    </motion.div>
  );
}
