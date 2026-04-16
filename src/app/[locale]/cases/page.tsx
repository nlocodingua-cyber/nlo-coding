import { setRequestLocale, getTranslations } from "next-intl/server";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { AuroraBg } from "@/components/shared/AuroraBg";
import { LeadBlock } from "@/components/shared/LeadBlock";
import { Spotlight } from "@/components/shared/Spotlight";
import { TiltCard } from "@/components/shared/TiltCard";
import { Eyebrow } from "@/components/shared/Eyebrow";
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
    <section className="relative min-h-[55vh] flex items-center overflow-hidden pt-32 pb-16">
      <AuroraBg />
      <div className="absolute inset-0 bg-dot-grid opacity-60" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Eyebrow className="mb-8">{t("eyebrow")}</Eyebrow>
        <h1
          className="font-display font-bold text-balance mx-auto"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            lineHeight: 0.98,
            letterSpacing: "-0.035em",
            maxWidth: "18ch",
          }}
        >
          <span className="display-title">{t("title")}</span>
          <br />
          <span className="text-gradient">{t("titleAccent")}</span>
        </h1>
        <p className="mt-7 text-base sm:text-lg text-foreground/65 max-w-2xl mx-auto leading-[1.55] text-balance">
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
              <TiltCard key={p.key} maxTilt={5} className="h-full rounded-2xl">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden hover:border-white/25 transition-all duration-300"
                >
                  <Spotlight className="p-8">
                    <div className="flex items-start justify-between mb-5">
                      <div className={cn("inline-flex items-center justify-center size-12 rounded-xl bg-white/5 border border-white/10", colorMap[p.color])}>
                        <Icon className="size-5" />
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground-muted">
                        {t(`items.${p.key}.duration`)}
                      </div>
                    </div>
                    <div className={cn("text-[10px] font-mono uppercase tracking-[0.25em] mb-2", colorMap[p.color])}>
                      {t(`items.${p.key}.category`)}
                    </div>
                    <h3 className="font-display text-2xl font-semibold mb-3 tracking-tight">
                      {t(`items.${p.key}.title`)}
                    </h3>
                    <p className="text-[14px] text-foreground/65 leading-relaxed mb-6">
                      {t(`items.${p.key}.desc`)}
                    </p>
                    <div className="text-xs font-mono text-foreground-muted mb-5">
                      {t(`items.${p.key}.stack`)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-primary">
                      {t("visitCta")}
                      <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Spotlight>
                </a>
              </TiltCard>
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
    <section className="relative py-24 sm:py-28 bg-[var(--background-secondary)]/50 mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2
            className="font-display font-bold text-balance mb-4 display-title"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.02, letterSpacing: "-0.03em" }}
          >
            {t("title")}
          </h2>
          <p className="text-[15px] sm:text-base text-foreground/65 max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
        <LeadBlock campaign="cases" />
      </div>
    </section>
  );
}
