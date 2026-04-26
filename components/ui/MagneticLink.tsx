"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function MagneticLink({ href, children }: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    // Distance from cursor to element centre
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    // Dampen the movement — 0.3 = 30% of full cursor offset
    setPos({ x: x * 0.3, y: y * 0.3 });
  }

  function handleMouseLeave() {
    // Spring back to origin
    setPos({ x: 0, y: 0 });
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      data-cursor="hover"
      className="group inline-flex items-center gap-3 font-sans text-muted hover:text-accent transition-colors duration-300 w-fit"
    >
      <motion.span
        animate={{ width: pos.x !== 0 ? "24px" : "12px" }}
        transition={{ duration: 0.3 }}
        className="h-px bg-current"
      />
      {children}
      <span className="font-mono text-[10px] text-muted/40 group-hover:text-accent/60 transition-colors duration-300">
        ↗
      </span>
    </motion.a>
  );
}
