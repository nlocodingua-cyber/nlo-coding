import { Eyebrow } from "./Eyebrow";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Shared section header — gradient eyebrow + large display title
 * (with optional accent line) + muted subtitle.
 */
export function SectionHeader({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && <Eyebrow className="mb-6" align={align}>{eyebrow}</Eyebrow>}
      <h2
        className="font-display font-bold text-balance display-title"
        style={{
          fontSize: "clamp(2rem, 5vw, 3.75rem)",
          lineHeight: 1.02,
          letterSpacing: "-0.03em",
        }}
      >
        {title}
        {titleAccent && (
          <>
            <br />
            <span className="text-gradient">{titleAccent}</span>
          </>
        )}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base sm:text-lg text-foreground/65 leading-[1.55] text-balance">
          {subtitle}
        </p>
      )}
    </div>
  );
}
