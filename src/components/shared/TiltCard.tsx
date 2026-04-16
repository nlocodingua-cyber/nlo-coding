"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum tilt angle in degrees. Default 8. */
  maxTilt?: number;
  /** Show glare reflection on hover */
  glare?: boolean;
}

/**
 * 3D tilt card with cursor tracking + spring damping + optional glare overlay.
 * Disabled on touch via CSS (no mouse events).
 */
export function TiltCard({ children, className, maxTilt = 8, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 200,
    damping: 20,
  });

  const glareX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
    glareOpacity.set(0.15);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
    glareOpacity.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={cn("relative", className)}
    >
      <div style={{ transform: "translateZ(0)" }} className="relative h-full">
        {children}
        {glare && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
            style={{
              opacity: glareOpacity,
              background: useTransform(
                [glareX, glareY] as never,
                ([gx, gy]: [string, string]) =>
                  `radial-gradient(600px circle at ${gx} ${gy}, rgba(255,255,255,0.3), transparent 40%)`
              ),
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
