import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Reverse direction */
  reverse?: boolean;
  /** Pause animation on hover */
  pauseOnHover?: boolean;
}

/**
 * Infinite horizontal marquee — duplicates children for seamless loop.
 * Uses CSS animation from globals.css (.marquee-row).
 */
export function Marquee({ children, className, reverse, pauseOnHover = true }: MarqueeProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
        "[-webkit-mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
        pauseOnHover && "group",
        className
      )}
    >
      <div
        className={cn(
          "marquee-row",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
