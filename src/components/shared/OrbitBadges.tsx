"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Cpu,
  Database,
  Sparkles,
  Zap,
  Code2,
  Workflow,
  Braces,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Badge {
  icon: LucideIcon;
  color: string;
}

const BADGES: Badge[] = [
  { icon: Code2, color: "var(--chart-1)" },
  { icon: Bot, color: "var(--chart-2)" },
  { icon: Database, color: "var(--chart-3)" },
  { icon: Workflow, color: "var(--chart-4)" },
  { icon: Sparkles, color: "var(--chart-5)" },
  { icon: Cpu, color: "var(--chart-1)" },
  { icon: Zap, color: "var(--chart-2)" },
  { icon: Braces, color: "var(--chart-3)" },
];

/**
 * Orbiting technology badges — floating around the hero content area.
 * Each badge rotates on its own ring at different speed/direction.
 */
export function OrbitBadges({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none hidden lg:block", className)} aria-hidden="true">
      {/* Inner ring */}
      <OrbitRing radius={340} duration={35} badges={BADGES.slice(0, 4)} />
      {/* Outer ring, reversed */}
      <OrbitRing radius={480} duration={55} reverse badges={BADGES.slice(4)} />
    </div>
  );
}

function OrbitRing({
  radius,
  duration,
  reverse,
  badges,
}: {
  radius: number;
  duration: number;
  reverse?: boolean;
  badges: Badge[];
}) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: radius * 2, height: radius * 2 }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {badges.map((badge, i) => {
        const angle = (i / badges.length) * 360;
        return (
          <BadgeItem
            key={i}
            badge={badge}
            angle={angle}
            radius={radius}
            counterRotate={reverse ? 360 : -360}
            duration={duration}
          />
        );
      })}
    </motion.div>
  );
}

function BadgeItem({
  badge,
  angle,
  radius,
  counterRotate,
  duration,
}: {
  badge: Badge;
  angle: number;
  radius: number;
  counterRotate: number;
  duration: number;
}) {
  const Icon = badge.icon;
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ x, y }}
      animate={{ rotate: counterRotate }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <div
        className="size-11 rounded-xl flex items-center justify-center backdrop-blur-md bg-white/[0.04] border border-white/10 -translate-x-1/2 -translate-y-1/2"
        style={{
          color: badge.color,
          boxShadow: `0 0 24px ${badge.color.replace("var(--chart-1)", "rgba(0,240,255,0.15)").replace("var(--chart-2)", "rgba(124,58,237,0.15)").replace("var(--chart-3)", "rgba(16,185,129,0.15)").replace("var(--chart-4)", "rgba(245,158,11,0.15)").replace("var(--chart-5)", "rgba(236,72,153,0.15)")}`,
        }}
      >
        <Icon className="size-4" />
      </div>
    </motion.div>
  );
}
