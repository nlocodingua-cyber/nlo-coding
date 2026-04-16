"use client";

import { motion } from "framer-motion";

/**
 * Animated laser beam — svg stroke-dashoffset animation.
 * Use as absolute-positioned decorative element behind sections.
 */
export function AnimatedBeam({
  className,
  direction = "horizontal",
  delay = 0,
}: {
  className?: string;
  direction?: "horizontal" | "diagonal";
  delay?: number;
}) {
  const isDiagonal = direction === "diagonal";

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 800 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`beam-grad-${delay}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="30%" stopColor="rgba(0, 240, 255, 0.5)" />
          <stop offset="50%" stopColor="rgba(0, 240, 255, 0.9)" />
          <stop offset="70%" stopColor="rgba(124, 58, 237, 0.5)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <motion.path
        d={isDiagonal ? "M 0 180 Q 400 20 800 150" : "M 0 100 Q 400 60 800 100"}
        stroke={`url(#beam-grad-${delay})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 0.6] }}
        transition={{
          pathLength: { duration: 2.5, delay, ease: "easeInOut" },
          opacity: { duration: 2.5, delay, times: [0, 0.3, 1] },
        }}
      />
    </svg>
  );
}
