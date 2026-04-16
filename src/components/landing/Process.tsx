import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/shared/SectionHeader";

interface ProcessStep {
  title: string;
  desc: string;
}

export function Process() {
  const t = useTranslations("landing.process");
  const steps = t.raw("steps") as ProcessStep[];

  return (
    <section id="process" className="relative py-20 sm:py-28 bg-[var(--background-secondary)]/50">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <ol className="relative mt-16 grid md:grid-cols-5 gap-6">
          <div
            className="hidden md:block absolute top-5 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <li key={i} className="relative">
              <div className="flex md:flex-col items-start gap-4 md:gap-5">
                <div
                  className="shrink-0 size-10 rounded-full border border-primary/30 bg-[var(--background)] text-primary font-mono text-sm flex items-center justify-center relative z-10"
                  style={{ boxShadow: "0 0 12px rgba(0,240,255,0.2)" }}
                >
                  {(i + 1).toString().padStart(2, "0")}
                </div>
                <div className="flex-1 md:pt-0">
                  <h3 className="font-display text-base font-semibold mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-foreground/65 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
