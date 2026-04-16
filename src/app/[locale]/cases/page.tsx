import { setRequestLocale, getTranslations } from "next-intl/server";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { GlowOrbs } from "@/components/shared/GlowOrbs";
import { LeadBlock } from "@/components/shared/LeadBlock";
import { NLO_PRODUCTS } from "@/lib/constants";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cases.meta" });
  return { title: t("title"), description: t("description") };
}

const colorMap = {
  cyan: "text-[var(--chart-1)]",
  purple: "text-[var(--chart-2)]",
  green: "text-[var(--chart-3)]",
  orange: "text-[var(--chart-4)]",
  pink: "text-[var(--chart-5)]",
  blue: "text-[#3b82f6]",
} as const;

export default async function CasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main>
        <CasesHero />
        <CasesGrid />
        <CasesCTA />
      </main>
      <Footer />
    </>
  );
}

function CasesHero() {
  const t = useTranslations("cases.hero");
  return (
    <section className="relative min-h-[50vh] flex items-center overflow-hidden pt-28 pb-16">
      <GlowOrbs />
      <div className="absolute inset-0 grid-bg-dense opacity-30" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-6">
          {t("eyebrow")}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
          <span className="text-foreground">{t("title")}</span>
          <br />
          <span className="text-gradient">{t("titleAccent")}</span>
        </h1>
        <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
      </div>
    </section>
  );
}

function CasesGrid() {
  const t = useTranslations("cases");
  return (
    <section className="relative py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-5">
          {NLO_PRODUCTS.map((p) => {
            const Icon = p.icon;
            return (
              <a
                key={p.key}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass neon-card-glow p-7 hover-lift"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("inline-flex items-center justify-center size-11 rounded-lg bg-white/5", colorMap[p.color])}>
                    <Icon className="size-5" />
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted">
                    {t(`items.${p.key}.duration`)}
                  </div>
                </div>
                <div className={cn("text-[10px] font-mono uppercase tracking-widest mb-2", colorMap[p.color])}>
                  {t(`items.${p.key}.category`)}
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {t(`items.${p.key}.title`)}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed mb-5">
                  {t(`items.${p.key}.desc`)}
                </p>
                <div className="text-xs font-mono text-foreground-muted mb-5">
                  {t(`items.${p.key}.stack`)}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-primary">
                  {t("visitCta")}
                  <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CasesCTA() {
  const t = useTranslations("cases.cta");
  return (
    <section className="relative py-20 sm:py-24 bg-[var(--background-secondary)]/50 mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-center">
          {t("title")}
        </h2>
        <p className="text-base text-foreground/70 text-center max-w-2xl mx-auto mb-14">
          {t("subtitle")}
        </p>
        <LeadBlock campaign="cases" />
      </div>
    </section>
  );
}
