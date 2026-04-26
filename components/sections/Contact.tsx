// components/sections/Contact.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPO_OUT } from "@/lib/easings";
import MagneticLink from "../ui/MagneticLink";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "haythamsaba@gmail.com";

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);
  const [toastId, setToastId] = useState(0); // increment to re-trigger toast

  // ── Copy to clipboard ─────────────────────────────
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      // Increment key so AnimatePresence treats each
      // toast as a new element — re-triggers animation
      setToastId((n) => n + 1);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for browsers without clipboard API
      window.location.href = `mailto:${EMAIL}`;
    }
  }

  // ── Scroll animations ─────────────────────────────
  useEffect(() => {
    const setupTimer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Headline — large text wipes in from below
        if (headlineRef.current) {
          gsap.fromTo(
            headlineRef.current,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: headlineRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // Content row — staggered children
        if (contentRef.current) {
          const children = contentRef.current.children;
          gsap.fromTo(
            children,
            { y: 32, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: contentRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        ScrollTrigger.refresh();
      }, sectionRef);

      return () => ctx.revert();
    }, 500);

    return () => clearTimeout(setupTimer);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-32 md:py-48 px-8 md:px-16 border-t border-border overflow-hidden"
    >
      {/* ── Background accent mark ────────────────── */}
      {/* Large faint serif character — pure decoration */}
      <div
        aria-hidden="true"
        className="absolute -right-8 top-1/2 -translate-y-1/2 font-serif text-[400px] leading-none text-surface select-none pointer-events-none"
        style={{ opacity: 0.9 }}
      >
        K
      </div>

      <div className="max-w-350 mx-auto relative">
        {/* ── Section header ───────────────────────── */}
        <div className="flex items-baseline justify-between mb-20 pb-5 border-b border-border">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            Contact
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            Ljubljana, EU
          </p>
        </div>

        {/* ── Main headline ────────────────────────── */}
        {/* clamp ensures it fills the viewport without */}
        {/* overflowing — scales between min and max    */}
        <h2
          ref={headlineRef}
          className="font-serif leading-[0.88] tracking-tight text-text mb-20"
          style={{
            fontSize: "clamp(48px, 9vw, 160px)",
            opacity: 0,
          }}
        >
          Let&apos;s build
          <br />
          something
          <br />
          <em className="text-accent">worth keeping.</em>
        </h2>

        {/* ── Content row ──────────────────────────── */}
        <div
          ref={contentRef}
          className="flex flex-col md:flex-row justify-around gap-10 md:gap-0"
        >
          {/* ── Email block ──────────────────────── */}
          <div className="flex flex-col gap-2 md:gap-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              Write to us
            </p>

            {/* Clickable email — copies on click */}
            <button
              onClick={handleCopy}
              data-cursor="hover"
              className="group flex items-center gap-3 text-left"
            >
              <span className="font-sans text-text text-lg hover:text-accent transition-colors duration-300">
                {EMAIL}
              </span>
              {/* Copy icon — swaps on copy */}
              <motion.span
                animate={{ rotate: copied ? 360 : 0 }}
                transition={{ duration: 0.4, ease: EXPO_OUT }}
                className="font-mono text-xs text-muted group-hover:text-accent transition-colors duration-300"
              >
                {copied ? "✓" : "⌘C"}
              </motion.span>
            </button>

            <p className="font-sans text-muted text-sm leading-relaxed">
              We respond to every inquiry within two business days.
            </p>
          </div>

          {/* ── Based in block ───────────────────── */}
          <div className="flex flex-col gap-2 md:gap-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              Based in
            </p>
            <div>
              <p className="font-serif text-2xl text-text mb-1">Ljubljana</p>
              <p className="font-sans text-muted text-sm">
                Slovenia, Central Europe
              </p>
            </div>
            <p className="font-sans text-muted text-sm leading-relaxed">
              Working with clients across the European market.
            </p>
          </div>

          {/* ── Socials block ────────────────────── */}
          <div className="flex flex-col gap-2 md:gap-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              Follow
            </p>
            <div className="flex flex-col gap-3">
              {socialLinks.map((link) => (
                <MagneticLink key={link.label} href={link.href}>
                  {link.label}
                </MagneticLink>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Toast notification ───────────────────────── */}
      {/* Fixed bottom-centre — appears on email copy    */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-200 pointer-events-none">
        <AnimatePresence mode="wait">
          {copied && (
            <motion.div
              key={toastId} // new key = new animation instance
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.35, ease: EXPO_OUT }}
              className="flex items-center gap-3 px-5 py-3 bg-surface border border-border"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="font-mono text-xs uppercase tracking-widest text-text">
                Copied to clipboard
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Magnetic Link Component ───────────────────────────
// Subtle magnetic hover — the link moves slightly
// toward the cursor when nearby. Uses mouse position
// relative to the element's centre.
