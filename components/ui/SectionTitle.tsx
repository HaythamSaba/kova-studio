"use client";

import { motion } from "framer-motion";
import { EXPO_OUT } from "@/lib/easings";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface ColoredTitleProps {
  as?: HeadingTag;
  Left: Array<string>;
  Middle: string;
  Right?: string | null;
  accentMiddle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export default function SectionTitle({
  as: Tag = "h2",
  Left,
  Middle,
  Right = null,
  accentMiddle = false,
  className,
  style,
}: ColoredTitleProps) {
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: EXPO_OUT }}
      style={style}
      className={`font-sans text-heading leading-[0.92] font-semibold text-text ${className}`}
    >
      {Left.map((item, i) => (
        <span key={i}>
          {item}
          {i < Left.length - 1 && <br />}
        </span>
      ))}
      <br />
      {accentMiddle ? (
        <em className="font-serif text-accent font-normal">{Middle}</em>
      ) : (
        Middle
      )}
      <br />
      {Right}
    </MotionTag>
  );
}
