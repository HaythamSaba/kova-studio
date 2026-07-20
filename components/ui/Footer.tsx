"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EXPO_OUT } from "@/lib/easings";
import { EMAIL } from "@/lib/constants";
const footerLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Studio", href: "#capabilities" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative px-8 md:px-16 pt-16 pb-10 border-t border-border">
      <div className="max-w-350 mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-60 relative">
          <div className="col-span-2 md:col-span flex flex-col gap-4">
            <Link
              href="/"
              className="font-mono text-sm uppercase tracking-[0.25em] text-text"
            >
              Kova
            </Link>
            <p className="font-sans text-muted text-sm leading-relaxed max-w-50">
              Crafted with intent.
              <br />
              Built to endure.
            </p>
          </div>
          <div
            aria-hidden="true"
            className="absolute -right-2 -top-30 font-serif md:text-[100px] lg:text-[400px] tracking-[-0.09em] leading-none text-accent select-none pointer-events-none"
            style={{ opacity: 0.7 }}
          >
            KOVA
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-20">
          {/* Studio Info */}

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-sm uppercase tracking-[0.5em] mb-1">
              Navigate
            </p>
            {footerLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-sans text-sm text-muted hover:text-accent transition-colors duration-300 w-fit"
                data-cursor="hover"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-mono text-sm uppercase tracking-[0.5em] mb-1">
              Contact
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="font-sans text-sm text-muted hover:text-accent transition-colors duration-300 w-fit"
              data-cursor="hover"
            >
              {EMAIL}
            </a>
            <p className="font-sans text-sm text-muted">Ljubljana, Slovenia</p>
          </div>

          {/* Recognition */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-sm uppercase tracking-[0.5em] mb-1">
              Recognition
            </p>
            <p className="font-sans text-sm text-muted">Awwwards Nominee</p>
            <p className="font-sans text-sm text-muted">CSS Design Awards</p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row item-start md:items-center justify-between gap-4 pt-8 border-t border-border">
          {/* Copyright */}
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
            Kova Studio © {year} — Ljubljana, Slovenia
          </p>

          {/* Back to top */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.3, ease: EXPO_OUT }}
            data-cursor="hover"
            className="group border border-accent p-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white hover:bg-accent hover:border-none transition-colors duration-300"
          >
            Back to top
            <motion.div
              className="inline-block"
              animate={{ y: [0, -3, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: EXPO_OUT,
              }}
            >
              ↑
            </motion.div>
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
