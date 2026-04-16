import { setRequestLocale, getTranslations } from "next-intl/server";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { Proof } from "@/components/landing/Proof";
import { LeadBlock } from "@/components/shared/LeadBlock";
import { GlowOrbs } from "@/components/shared/GlowOrbs";
import { Button } from "@/components/ui/button";
import { BRAND_EXORCIST_URL } from "@/lib/constants";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage({
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
        <AboutHero />
        <Philosophy />
        <FounderStory />
        <Proof />
        <AboutCTA />
      </main>
      <Footer />
    </>
  );
}

function AboutHero() {
  const t = useTranslations("about.hero");
  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-28 pb-16">
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

function Philosophy() {
  const t = useTranslations("about.philosophy");
  return (
    <section className="relative py-20 sm:py-24 bg-[var(--background-secondary)]/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-8 text-center">
          {t("title")}
        </h2>
        <div className="space-y-5 text-base text-foreground/80 leading-relaxed">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </div>
      </div>
    </section>
  );
}

function FounderStory() {
  const t = useTranslations("about.founder");
  return (
    <section className="relative py-20 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-8 text-center">
          {t("title")}
        </h2>
        <div className="space-y-5 text-base text-foreground/80 leading-relaxed">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </div>
        <div className="flex justify-center mt-10">
          <a href={BRAND_EXORCIST_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="neon-border">
              {t("exorcistCta")}
              <ArrowUpRight className="size-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

function AboutCTA() {
  const t = useTranslations("about.cta");
  return (
    <section className="relative py-20 sm:py-24 bg-[var(--background-secondary)]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-center">
          {t("title")}
        </h2>
        <p className="text-base text-foreground/70 text-center max-w-2xl mx-auto mb-14">
          {t("subtitle")}
        </p>
        <LeadBlock campaign="about" />
      </div>
    </section>
  );
}
