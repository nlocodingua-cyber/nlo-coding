"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  className?: string;
  /** Stagger between words (seconds) */
  stagger?: number;
  /** Initial delay before animation starts */
  delay?: number;
  /** Highlight a specific word with gradient (by index, 0-based) */
  highlightIndex?: number;
  /** Wrap long text; defaults to inline */
  as?: "h1" | "h2" | "p" | "span";
}

/**
 * Word-by-word fade+lift reveal — 21st.dev style.
 * Each word starts blurred, fades and un-blurs into place sequentially.
 */
export function AnimatedText({
  text,
  className,
  stagger = 0.08,
  delay = 0,
  highlightIndex,
  as: Tag = "span",
}: AnimatedTextProps) {
  const words = text.split(" ");

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const word = {
    hidden: { opacity: 0, y: 24, filter: "blur(12px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] },
    },
  };

  const MotionTag = motion[Tag];

  return (
    <MotionTag
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn("inline-block", className)}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          variants={word}
          className={cn(
            "inline-block mr-[0.25em] last:mr-0",
            highlightIndex === i && "text-gradient"
          )}
        >
          {w}
        </motion.span>
      ))}
    </MotionTag>
  );
}
