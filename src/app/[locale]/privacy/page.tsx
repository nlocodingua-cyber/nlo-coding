import { setRequestLocale, getTranslations } from "next-intl/server";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.privacy" });
  return { title: t("title"), description: t("description") };
}

export default async function PrivacyPage({
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
        <LegalContent namespace="legal.privacy" />
      </main>
      <Footer />
    </>
  );
}

function LegalContent({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);
  const sections = t.raw("sections") as Array<{ heading: string; body: string }>;

  return (
    <section className="relative pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1
          className="font-display font-bold mb-4 display-title"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
        >
          {t("title")}
        </h1>
        <p className="text-sm text-foreground/50 mb-12">{t("lastUpdated")}</p>

        <div className="space-y-10">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-display text-lg font-semibold mb-3 text-foreground/90">
                {s.heading}
              </h2>
              <div
                className="text-[15px] text-foreground/70 leading-[1.7] whitespace-pre-line"
              >
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
