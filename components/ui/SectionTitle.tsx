"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface ColoredTitleProps {
  as?: HeadingTag;
  Left: Array<string>;
  ColoredMiddle: string;
  Right?: string | null;
  className?: string;
  style?: React.CSSProperties;
}
export default function SectionTitle({
  as: Tag = "h2",
  Left,
  ColoredMiddle,
  Right = null,
  className,
  style,
}: ColoredTitleProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Delay setup — About is deep in the page.
    // We need the full page height to be known
    // before ScrollTrigger measures positions.
    let ctx: gsap.Context | undefined;

    const setupTimer = setTimeout(() => {
      if (prefersReducedMotion()) {
        // Make all elements visible immediately
        if (headlineRef.current) headlineRef.current.style.opacity = "1";
        return;
      }

      ctx = gsap.context(() => {
        // ── Headline entrance ───────────────────────
        if (headlineRef.current) {
          gsap.fromTo(
            headlineRef.current,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: headlineRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        ScrollTrigger.refresh();
      });
    }, 500);

    return () => {
      clearTimeout(setupTimer);
      ctx?.revert();
    };
  }, []);

  return (
    <Tag
      ref={headlineRef}
      style={{ opacity: 0, ...style }}
      className={`font-serif text-[clamp(36px,4.5vw,72px)] leading-[0.92] text-text ${className}`}
    >
      {Left.map((item, i) => (
        <span key={i}>
          {item}
          {i < Left.length - 1 && <br />}
        </span>
      ))}
      <br />
      <em className="text-accent">{ColoredMiddle}</em>
      <br />
      {Right}
    </Tag>
  );
}
