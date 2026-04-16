import { cn } from "@/lib/utils";

/**
 * Modern section eyebrow — replaces the old uppercase/mono "dev console" style
 * with a gradient-text lowercase label, ornamental lines on each side.
 */
export function Eyebrow({
  children,
  className,
  align = "center",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-[13px] font-medium",
        align === "center" ? "justify-center" : "justify-start",
        className
      )}
    >
      {align === "center" && (
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/20" aria-hidden="true" />
      )}
      <span className="text-gradient font-display">{children}</span>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/20" aria-hidden="true" />
    </div>
  );
}
