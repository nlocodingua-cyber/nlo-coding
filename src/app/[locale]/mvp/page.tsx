import { setRequestLocale, getTranslations } from "next-intl/server";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { TargetPage } from "@/components/target/TargetPage";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mvp.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function MvpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <TargetPage namespace="mvp" slug="mvp" accent="cyan" />
      <Footer />
    </>
  );
}
