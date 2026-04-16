"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  /** Value prefix (e.g., "$") */
  prefix?: string;
  /** Value suffix (e.g., "+") */
  suffix?: string;
  /** Duration in seconds */
  duration?: number;
  className?: string;
}

/**
 * Animated number counter — counts from 0 to value when scrolled into view.
 * Uses Framer Motion spring for smooth deceleration.
 */
export function NumberTicker({
  value,
  prefix = "",
  suffix = "",
  duration = 2,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 60,
    damping: 15,
    duration: duration * 1000,
  });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest).toLocaleString()}${suffix}`;
      }
    });
  }, [spring, prefix, suffix]);

  return (
    <motion.span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}0{suffix}
    </motion.span>
  );
}
