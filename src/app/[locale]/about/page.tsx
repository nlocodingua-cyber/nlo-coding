import { setRequestLocale, getTranslations } from "next-intl/server";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { Proof } from "@/components/landing/Proof";
import { LeadBlock } from "@/components/shared/LeadBlock";
import { AuroraBg } from "@/components/shared/AuroraBg";
import { Eyebrow } from "@/components/shared/Eyebrow";
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
    <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-32 pb-20">
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
            maxWidth: "20ch",
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

function Philosophy() {
  const t = useTranslations("about.philosophy");
  return (
    <section className="relative py-24 sm:py-28 bg-[var(--background-secondary)]/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="font-display font-bold text-balance mb-10 text-center display-title"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.02, letterSpacing: "-0.03em" }}
        >
          {t("title")}
        </h2>
        <div className="space-y-6 text-[15px] sm:text-base text-foreground/80 leading-[1.7]">
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
    <section className="relative py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-[360px_1fr] gap-10 md:gap-14 items-start">
          {/* Фото */}
          <div className="relative mx-auto md:mx-0 w-[280px] md:w-full shrink-0">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,240,255,0.08)]">
              <img
                src="/alex.png"
                alt="Олексій Ніколайчук — Brand Exorcist"
                className="w-full h-auto object-cover"
              />
            </div>
            <div
              className="absolute -inset-4 rounded-3xl -z-10 opacity-50 blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)" }}
              aria-hidden="true"
            />
          </div>

          {/* Текст */}
          <div>
            <h2
              className="font-display font-bold text-balance mb-8 display-title"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.02, letterSpacing: "-0.03em" }}
            >
              {t("title")}
            </h2>
            <div className="space-y-6 text-[15px] sm:text-base text-foreground/80 leading-[1.7]">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
              <p>{t("p3")}</p>
            </div>
            <div className="mt-8">
              <a href={BRAND_EXORCIST_URL} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="h-11 px-6 border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20"
                >
                  {t("exorcistCta")}
                  <ArrowUpRight className="size-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutCTA() {
  const t = useTranslations("about.cta");
  return (
    <section className="relative py-24 sm:py-28 bg-[var(--background-secondary)]/50">
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
        <LeadBlock campaign="about" />
      </div>
    </section>
  );
}
