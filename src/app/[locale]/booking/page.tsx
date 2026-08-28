import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/shared/Nav";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { pageAlternates } from "@/lib/seo/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("booking");
  return {
    alternates: pageAlternates(locale, "/booking"),
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default function BookingPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <BookingFlow />
        </div>
      </main>
    </>
  );
}
