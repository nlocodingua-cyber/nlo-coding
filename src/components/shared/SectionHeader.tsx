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
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-4">
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
        {title}
        {titleAccent && (
          <>
            <br />
            <span className="text-gradient">{titleAccent}</span>
          </>
        )}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base sm:text-lg text-foreground/70 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
