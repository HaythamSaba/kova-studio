// app/layout.tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import CustomCursor from "@/components/cursor/CustomCursor";
import Navbar from "@/components/ui/Navbar";
import PageTransition from "@/components/sections/PageTransition";
import { Analytics } from "@vercel/analytics/next";

// ─── Font definitions ──────────────────────────────
// next/font downloads fonts at build time, self-hosts them,
// and injects a CSS variable onto <html>. Zero layout shift.

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant", // matches our @theme token
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
  preload: true,
});

// ─── Metadata ──────────────────────────────────────
export const metadata: Metadata = {
  title: {
    template: "%s | Kova Studio",
    default: "Kova Studio — Crafted with intent. Built to endure.",
  },
  description:
    "We build digital identities and web experiences for brands that take the long view.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

// ─── Root Layout ───────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body>
        <CustomCursor />
        <Navbar />
        <LenisProvider>
          <PageTransition>{children}</PageTransition>
        </LenisProvider>
        <Analytics />
      </body>
    </html>
  );
}
