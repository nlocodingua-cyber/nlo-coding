import { setRequestLocale, getTranslations } from "next-intl/server";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { AuroraBg } from "@/components/shared/AuroraBg";
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
    <section className="relative min-h-[45vh] flex items-center overflow-hidden pt-32 pb-12">
      <AuroraBg />
      <div className="absolute inset-0 bg-dot-grid opacity-60" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-mono uppercase tracking-[0.25em] text-foreground/80 mb-7">
          <span className="size-1 rounded-full bg-primary" />
          {t("eyebrow")}
        </div>
        <h1
          className="font-display font-bold text-balance mx-auto"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            lineHeight: 0.98,
            letterSpacing: "-0.035em",
          }}
        >
          <span className="text-gradient">{t("title")}</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-foreground/65 max-w-2xl mx-auto leading-[1.55] text-balance">
          {t("subtitle")}
        </p>
      </div>
    </section>
  );
}

function ContactOptions() {
  return (
    <section className="relative py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <LeadBlock campaign="contact" />
      </div>
    </section>
  );
}

function ContactForm() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <LeadForm sourcePage="contact" />
      </div>
    </section>
  );
}
