import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Check, Zap } from "lucide-react";

export function Solution() {
  const t = useTranslations("landing.solution");
  const bullets = t.raw("bullets") as string[];

  return (
    <section className="relative py-20 sm:py-28 bg-[var(--background-secondary)]/50">
      <div
        className="absolute inset-0 grid-bg opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <SectionHeader
              eyebrow={t("eyebrow")}
              title={t("title")}
              align="left"
            />
            <p className="mt-6 text-base text-foreground/70 leading-relaxed">
              {t("p1")}
            </p>
            <p className="mt-4 text-base text-foreground/70 leading-relaxed">
              {t("p2")}
            </p>
          </div>

          <div className="glass-elevated p-8 space-y-4">
            <div className="inline-flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary mb-2">
              <Zap className="size-5" />
            </div>
            <ul className="space-y-3">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                  <Check className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
