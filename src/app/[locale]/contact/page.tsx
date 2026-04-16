import { setRequestLocale, getTranslations } from "next-intl/server";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { GlowOrbs } from "@/components/shared/GlowOrbs";
import { LeadBlock } from "@/components/shared/LeadBlock";
import { LeadForm } from "@/components/shared/LeadForm";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function ContactPage({
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
        <ContactHero />
        <ContactOptions />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}

function ContactHero() {
  const t = useTranslations("contact.hero");
  return (
    <section className="relative min-h-[40vh] flex items-center overflow-hidden pt-28 pb-12">
      <GlowOrbs />
      <div className="absolute inset-0 grid-bg-dense opacity-30" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-6">
          {t("eyebrow")}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
          <span className="text-gradient">{t("title")}</span>
        </h1>
        <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
      </div>
    </section>
  );
}

function ContactOptions() {
  return (
    <section className="relative py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <LeadBlock campaign="contact" />
      </div>
    </section>
  );
}

function ContactForm() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <LeadForm sourcePage="contact" />
      </div>
    </section>
  );
}
