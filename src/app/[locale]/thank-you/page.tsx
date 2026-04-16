import { setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { GlowOrbs } from "@/components/shared/GlowOrbs";
import { NLO_PRODUCTS } from "@/lib/constants";
import { Check, ArrowLeft, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const colorMap = {
  cyan: "text-[var(--chart-1)]",
  purple: "text-[var(--chart-2)]",
  green: "text-[var(--chart-3)]",
  orange: "text-[var(--chart-4)]",
  pink: "text-[var(--chart-5)]",
  blue: "text-[#3b82f6]",
} as const;

export default async function ThankYouPage({
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
        <ThankYouHero />
        <Meanwhile />
      </main>
      <Footer />
    </>
  );
}

function ThankYouHero() {
  const t = useTranslations("thankYou");
  const steps = t.raw("nextSteps") as string[];

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-28 pb-20">
      <GlowOrbs />
      <div className="absolute inset-0 grid-bg-dense opacity-30" aria-hidden="true" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full neon-border text-xs font-mono uppercase tracking-widest text-primary mb-6">
          <Check className="size-3.5" />
          {t("badge")}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
          <span className="text-gradient">{t("title")}</span>
        </h1>
        <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed mb-12">
          {t("subtitle")}
        </p>

        <div className="glass-elevated p-7 sm:p-9 text-left">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-5">
            {t("nextStepsTitle")}
          </div>
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                <span className="shrink-0 size-6 rounded-full border border-primary/30 bg-[var(--background)] text-primary font-mono text-xs flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10">
          <Link href="/">
            <Button variant="outline" className="neon-border">
              <ArrowLeft className="size-4" />
              {t("backCta")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Meanwhile() {
  const t = useTranslations("thankYou");
  return (
    <section className="relative py-20 sm:py-24 bg-[var(--background-secondary)]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-3 text-center">
          {t("meanwhile")}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {NLO_PRODUCTS.map((p) => {
            const Icon = p.icon;
            return (
              <a
                key={p.key}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass p-5 hover-lift"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("inline-flex items-center justify-center size-9 rounded-lg bg-white/5", colorMap[p.color])}>
                    <Icon className="size-4" />
                  </div>
                  <ExternalLink className="size-3.5 text-foreground-muted group-hover:text-primary transition-colors" />
                </div>
                <h3 className={cn("font-display text-base font-semibold", colorMap[p.color])}>
                  {p.name}
                </h3>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
