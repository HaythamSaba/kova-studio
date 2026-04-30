// components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useSpring, useScroll } from "framer-motion";
import { EXPO_OUT } from "@/lib/easings";

// ── Animation variants ────────────────────────────────
const navVariants = {
  transparent: {
    backgroundColor: "rgba(14, 12, 10, 0)",
    backdropFilter: "blur(0px)",
    borderBottomColor: "rgba(42, 36, 32, 0)",
  },
  frosted: {
    backgroundColor: "rgba(14, 12, 10, 0.3)",
    backdropFilter: "blur(5px)",
    borderBottomColor: "rgba(42, 36, 32, 0.5)",
  },
};

// ── Nav links ─────────────────────────────────────────
const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Studio", href: "#capabilities" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // ── IntersectionObserver ──────────────────────────
  useEffect(() => {
    // We observe a tiny invisible div placed at the
    // bottom of the hero. When it leaves the viewport
    // (scrolled past), we flip to "frosted" state.
    const sentinel = document.querySelector("#hero-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // isIntersecting = hero bottom is still visible
        // !isIntersecting = we've scrolled past it
        setScrolled(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  const state = scrolled ? "frosted" : "transparent";
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 z-60 h-px bg-accent origin-left"
        style={{ scaleX }}
      />
      {/* ── Main navbar ─────────────────────────────── */}
      <motion.header
        variants={navVariants}
        animate={state}
        transition={{ duration: 0.4, ease: EXPO_OUT }}
        className="fixed top-0 left-0 right-0 z-50 border-b"
      >
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-mono text-sm uppercase tracking-[0.2em] text-text"
          >
            Kova
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <li key={link.href}>
                <motion.a
                  href={link.href}
                  className="font-sans text-sm relative group transition-colors duration-300"
                  style={{
                    color: scrolled
                      ? "rgba(240,235,227,1)"
                      : "rgba(240,235,227,0.7)",
                  }}
                >
                  {link.label}
                  {/* Underline on hover */}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300 ease-out" />
                </motion.a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className="font-mono text-xs uppercase tracking-widest bg-accent text-bg border border-accent px-4 py-2 hover:bg-text hover:text-bg transition-colors duration-300"
            >
              Let&apos;s talk
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col gap-1.5 p-1"
            data-cursor="hover"
          >
            <motion.span
              animate={
                menuOpen
                  ? { rotate: 45, y: 7.5, backgroundColor: "#c17f3e" }
                  : { rotate: 0, y: 0, backgroundColor: "#f0ebe3" }
              }
              transition={{ duration: 0.3 }}
              className="block w-6 h-px origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-6 h-px bg-text"
            />
            <motion.span
              animate={
                menuOpen
                  ? { rotate: -45, y: -7, backgroundColor: "#c17f3e" }
                  : { rotate: 0, y: 0, backgroundColor: "#f0ebe3" }
              }
              transition={{ duration: 0.3 }}
              className="block w-6 h-px origin-center"
            />
          </button>
        </nav>
      </motion.header>
      {/* ── Mobile menu overlay ───────────────────────── */}
      <AnimatePresence mode="wait">
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: EXPO_OUT }}
            className="fixed inset-0 z-40 bg-bg flex flex-col items-center justify-center gap-10"
          >
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-5xl italic text-text hover:text-accent transition-colors duration-300"
              >
                {link.label}
              </motion.a>
            ))}

            <motion.a
              href="#contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setMenuOpen(false)}
              className="font-mono text-xs uppercase tracking-widest text-bg mt-4"
            >
              Let&apos;s talk
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
