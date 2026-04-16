import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AlertTriangle } from "lucide-react";

interface PainCard {
  title: string;
  desc: string;
}

export function Problem() {
  const t = useTranslations("landing.problem");
  const cards = t.raw("cards") as PainCard[];

  return (
    <section className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {cards.map((card, i) => (
            <div
              key={i}
              className="glass neon-card-glow p-7 hover-lift"
            >
              <div className="inline-flex items-center justify-center size-10 rounded-lg bg-destructive/10 text-destructive mb-5">
                <AlertTriangle className="size-5" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-3 leading-snug">
                {card.title}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
