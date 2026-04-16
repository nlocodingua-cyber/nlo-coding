import { setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { AuroraBg } from "@/components/shared/AuroraBg";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Spotlight } from "@/components/shared/Spotlight";
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
    <section className="relative min-h-[75vh] flex items-center overflow-hidden pt-32 pb-20">
      <AuroraBg />
      <div className="absolute inset-0 bg-dot-grid opacity-60" aria-hidden="true" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Eyebrow className="mb-7">
          <span className="inline-flex items-center gap-1.5">
            <Check className="size-3.5" />
            {t("badge")}
          </span>
        </Eyebrow>
        <h1
          className="font-display font-bold text-balance mx-auto mb-6"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            lineHeight: 0.98,
            letterSpacing: "-0.035em",
          }}
        >
          <span className="text-gradient">{t("title")}</span>
        </h1>
        <p className="text-base sm:text-lg text-foreground/65 max-w-2xl mx-auto leading-[1.55] mb-12 text-balance">
          {t("subtitle")}
        </p>

        <div className="relative rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md p-8 sm:p-10 text-left border-beam">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-6">
            {t("nextStepsTitle")}
          </div>
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-4 text-[15px] text-foreground/85">
                <span className="shrink-0 size-7 rounded-full border border-primary/30 bg-[var(--background)] text-primary font-mono text-xs flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12">
          <Link href="/">
            <Button variant="outline" className="h-11 px-6 border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20">
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
    <section className="relative py-24 sm:py-28 bg-[var(--background-secondary)]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-10">
          {t("meanwhile")}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NLO_PRODUCTS.map((p) => {
            const Icon = p.icon;
            return (
              <a
                key={p.key}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <Spotlight className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("inline-flex items-center justify-center size-9 rounded-lg bg-white/5 border border-white/10", colorMap[p.color])}>
                      <Icon className="size-4" />
                    </div>
                    <ExternalLink className="size-3.5 text-foreground-muted group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className={cn("font-display text-base font-semibold tracking-tight", colorMap[p.color])}>
                    {p.name}
                  </h3>
                </Spotlight>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
