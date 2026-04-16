"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  className?: string;
  /** Stagger between words (seconds) */
  stagger?: number;
  /** Initial delay before animation starts */
  delay?: number;
}

/**
 * Word-by-word fade+lift reveal — 21st.dev style.
 * Always rendered as <motion.span>; wrap in <h1>/<h2> etc at the call site.
 */
export function AnimatedText({
  text,
  className,
  stagger = 0.07,
  delay = 0,
}: AnimatedTextProps) {
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const word: Variants = {
    hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn("inline-block", className)}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          variants={word}
          className="inline-block mr-[0.25em] last:mr-0"
        >
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}
