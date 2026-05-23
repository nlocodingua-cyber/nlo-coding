import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BookingFlow } from "@/components/booking/BookingFlow";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("booking");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default function BookingPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <BookingFlow />
      </div>
    </main>
  );
}
