"use client";

import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

interface MagneticProps {
  children: ReactNode;
  /** Strength of pull (lower = stronger). Default 6. */
  strength?: number;
  className?: string;
}

/**
 * Magnetic hover effect — element follows cursor with spring damping.
 * Disabled on touch devices via CSS media query.
 */
export function Magnetic({ children, strength = 6, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.3 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.3 });

  const x = useTransform(springX, (v) => v / strength);
  const y = useTransform(springY, (v) => v / strength);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
