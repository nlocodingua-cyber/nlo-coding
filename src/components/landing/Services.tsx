import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { SERVICES } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const colorMap = {
  cyan: { bg: "bg-[var(--chart-1)]/10", text: "text-[var(--chart-1)]", border: "hover:border-[var(--chart-1)]/30" },
  purple: { bg: "bg-[var(--chart-2)]/10", text: "text-[var(--chart-2)]", border: "hover:border-[var(--chart-2)]/30" },
  green: { bg: "bg-[var(--chart-3)]/10", text: "text-[var(--chart-3)]", border: "hover:border-[var(--chart-3)]/30" },
  orange: { bg: "bg-[var(--chart-4)]/10", text: "text-[var(--chart-4)]", border: "hover:border-[var(--chart-4)]/30" },
  pink: { bg: "bg-[var(--chart-5)]/10", text: "text-[var(--chart-5)]", border: "hover:border-[var(--chart-5)]/30" },
} as const;

export function Services() {
  const t = useTranslations("landing.services");

  return (
    <section id="services" className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="grid sm:grid-cols-2 gap-6 mt-16">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            const color = colorMap[s.color];
            const href = s.hasLanding ? `/${s.slug}` : `/contact`;

            return (
              <Link
                key={s.key}
                href={href}
                className={cn(
                  "group glass p-7 hover-lift border border-border transition-all",
                  color.border
                )}
              >
                <div className={cn("inline-flex items-center justify-center size-11 rounded-lg mb-5", color.bg, color.text)}>
                  <Icon className="size-5" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  {t(`cards.${s.key}.title`)}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed mb-5">
                  {t(`cards.${s.key}.tagline`)}
                </p>
                <div className={cn("inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest", color.text)}>
                  {t("openCta")}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
