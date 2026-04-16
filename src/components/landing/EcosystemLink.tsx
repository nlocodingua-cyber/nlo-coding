import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { NLO_ECOSYSTEM_URL, NLO_PRODUCTS } from "@/lib/constants";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function EcosystemLink() {
  const t = useTranslations("landing.ecosystem");

  return (
    <section className="relative py-20 sm:py-24 bg-[var(--background-secondary)]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-elevated neon-card-glow p-8 md:p-12 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 60%)",
            }}
            aria-hidden="true"
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full neon-border-purple text-xs font-mono uppercase tracking-widest text-[var(--neon-purple)] mb-5">
              <Sparkles className="size-3" />
              {t("eyebrow")}
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {t("title")}
            </h2>
            <p className="max-w-2xl mx-auto text-base text-foreground/70 leading-relaxed mb-8">
              {t("subtitle")}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {NLO_PRODUCTS.map((p) => (
                <span
                  key={p.key}
                  className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/5 border border-border text-foreground/70"
                >
                  {p.name}
                </span>
              ))}
            </div>

            <a href={NLO_ECOSYSTEM_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="neon-border-purple">
                {t("cta")}
                <ArrowUpRight className="size-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
