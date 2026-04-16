"use client";

import { useEffect, useState } from "react";

/**
 * Floating particles — sci-fi ambient background.
 * Client-only to avoid hydration mismatches with random positions.
 */
export function Particles({ count = 40 }: { count?: number }) {
  const [particles, setParticles] = useState<
    Array<{ left: number; top: number; delay: number; duration: number; size: number }>
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 4 + Math.random() * 6,
      size: 1 + Math.random() * 2,
    }));
    setParticles(generated);
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute block rounded-full bg-primary/40"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `pulse-neon ${p.duration}s ease-in-out ${p.delay}s infinite, float-slow ${p.duration * 1.4}s ease-in-out ${p.delay}s infinite`,
            boxShadow: "0 0 8px rgba(0,240,255,0.6)",
          }}
        />
      ))}
    </div>
  );
}
