import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { LeadBlock } from "@/components/shared/LeadBlock";

export function FinalCTA() {
  const t = useTranslations("landing.finalCta");

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,240,255,0.18) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-16">
          <LeadBlock campaign="main" />
        </div>
      </div>
    </section>
  );
}
