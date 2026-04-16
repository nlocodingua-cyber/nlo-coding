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
 * Shared section header — eyebrow (small uppercase label), title (with optional gradient accent),
 * and subtitle. Used across landing sections and target pages.
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
      {eyebrow && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-mono uppercase tracking-[0.25em] text-foreground/80 mb-5">
          <span className="size-1 rounded-full bg-primary" aria-hidden="true" />
          {eyebrow}
        </div>
      )}
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
