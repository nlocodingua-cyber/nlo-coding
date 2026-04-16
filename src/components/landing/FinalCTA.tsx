import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { LeadBlock } from "@/components/shared/LeadBlock";

export function FinalCTA() {
  const t = useTranslations("landing.finalCta");

  return (
    <section className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-14">
          <LeadBlock campaign="main" />
        </div>
      </div>
    </section>
  );
}
