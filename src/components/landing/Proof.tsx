import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { NLO_PRODUCTS } from "@/lib/constants";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const colorMap = {
  cyan: "text-[var(--chart-1)]",
  purple: "text-[var(--chart-2)]",
  green: "text-[var(--chart-3)]",
  orange: "text-[var(--chart-4)]",
  pink: "text-[var(--chart-5)]",
  blue: "text-[#3b82f6]",
} as const;

export function Proof() {
  const t = useTranslations("landing.proof");
  const cta = useTranslations("landing.proof");

  return (
    <section id="cases-proof" className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-16">
          {NLO_PRODUCTS.map((p) => {
            const Icon = p.icon;
            return (
              <a
                key={p.key}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass neon-card-glow p-6 hover-lift"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("inline-flex items-center justify-center size-10 rounded-lg bg-white/5", colorMap[p.color])}>
                    <Icon className="size-5" />
                  </div>
                  <ExternalLink className="size-4 text-foreground-muted group-hover:text-primary transition-colors" />
                </div>
                <h3 className={cn("font-display text-lg font-semibold mb-2", colorMap[p.color])}>
                  {p.name}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {t(`products.${p.key}`)}
                </p>
                <div className="mt-5 text-[10px] font-mono uppercase tracking-widest text-foreground-muted group-hover:text-primary transition-colors">
                  {cta("visitCta")} →
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
