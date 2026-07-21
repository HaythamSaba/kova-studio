// components/Navbar.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useSpring, useScroll } from "framer-motion";
import { EXPO_OUT } from "@/lib/easings";
import { useLenis } from "@/lib/useLenis";
import Image from "next/image";

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

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Studio", href: "#capabilities" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // ── Mounted guard — prevents hydration mismatch ──
  // useScroll produces different values on server vs client.
  // We only render the progress line after mount.

  const lenis = useLenis();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // ── IntersectionObserver ──────────────────────────
  useEffect(() => {
    const sentinel = document.querySelector("#hero-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // ── Mobile menu: Escape to close, Tab trap, focus restore ─
  useEffect(() => {
    if (!menuOpen) return;

    const hamburger = hamburgerRef.current;
    firstMenuLinkRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus to the trigger on every close path (Escape,
      // clicking a link, clicking outside), not just Escape.
      hamburger?.focus();
    };
  }, [menuOpen]);

  // ── Smooth scroll via Lenis ───────────────────────
  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    e.preventDefault();

    const target = document.querySelector(href);
    if (!target) return;

    if (lenis) {
      lenis.scrollTo(target as HTMLElement, {
        offset: -100,
        duration: 2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }

    setMenuOpen(false);
  }

  const state = scrolled ? "frosted" : "transparent";

  return (
    <>
      {/* Scroll progress line — client only, no SSR */}
      <motion.div
        suppressHydrationWarning
        className="fixed top-0 left-0 right-0 z-60 h-px bg-accent origin-left"
        style={{ scaleX }}
      />

      {/* Main navbar */}
      <motion.header
        variants={navVariants}
        animate={state}
        transition={{ duration: 0.4, ease: EXPO_OUT }}
        className="fixed top-0 left-0 right-0 z-50 border-b"
      >
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Kova Studio"
              width={32}
              height={32}
              priority
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-sans text-sm relative group transition-colors duration-300 cursor-pointer"
                  style={{
                    color: scrolled
                      ? "rgba(240,235,227,1)"
                      : "rgba(240,235,227,0.7)",
                  }}
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300 ease-out" />
                </a>
              </li>
            ))}
          </ul>

          {/* CTA — uses Lenis scroll */}
          <div className="hidden md:block">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="font-mono text-xs uppercase tracking-widest bg-accent text-bg border border-accent px-4 py-2 hover:bg-text hover:text-bg transition-colors duration-300 cursor-pointer"
            >
              Let&apos;s talk
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
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

      {/* Mobile menu */}
      <AnimatePresence mode="wait">
        {menuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: EXPO_OUT }}
            className="fixed inset-0 z-40 bg-bg flex flex-col items-center justify-center gap-10"
          >
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                ref={i === 0 ? firstMenuLinkRef : undefined}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                onClick={(e) =>
                  handleNavClick(
                    e as React.MouseEvent<HTMLAnchorElement>,
                    link.href,
                  )
                }
                className="font-serif text-5xl italic text-text hover:text-accent transition-colors duration-300 cursor-pointer"
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
              onClick={(e) =>
                handleNavClick(
                  e as React.MouseEvent<HTMLAnchorElement>,
                  "#contact",
                )
              }
              className="font-mono text-xs uppercase tracking-widest text-bg bg-accent px-4 py-2 mt-4 cursor-pointer"
            >
              Let&apos;s talk
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}