"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  children: ReactNode;
  className?: string;
  /** Stop propagation of mouse tracking to nested spotlight parents */
  as?: "div" | "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

/**
 * Wrapper that tracks cursor position and exposes it as CSS custom properties
 * (--spot-x, --spot-y) for the `.spotlight` utility class to render a
 * cursor-following radial glow.
 */
export function Spotlight({ children, className, as = "div", href, target, rel, onClick }: SpotlightProps) {
  const ref = useRef<HTMLElement | null>(null);

  function handleMove(e: MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  const commonProps = {
    ref: ref as never,
    onMouseMove: handleMove,
    className: cn("spotlight", className),
  };

  if (as === "a") {
    return (
      <a {...commonProps} href={href} target={target} rel={rel} onClick={onClick}>
        {children}
      </a>
    );
  }
  if (as === "button") {
    return (
      <button {...commonProps} onClick={onClick} type="button">
        {children}
      </button>
    );
  }
  return <div {...commonProps}>{children}</div>;
}
