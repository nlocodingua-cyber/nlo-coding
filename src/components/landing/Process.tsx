"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";

interface ProcessStep {
  title: string;
  desc: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Process() {
  const t = useTranslations("landing.process");
  const steps = t.raw("steps") as ProcessStep[];

  return (
    <section id="process" className="relative py-28 sm:py-36 bg-[var(--background-secondary)]/50">
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.1 }}
          className="relative mt-20 grid md:grid-cols-5 gap-6"
        >
          <div
            className="hidden md:block absolute top-6 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <motion.li
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="flex md:flex-col items-start gap-4 md:gap-5">
                <div
                  className="shrink-0 size-12 rounded-full border border-primary/30 bg-[var(--background-secondary)] text-primary font-mono text-sm flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                >
                  {(i + 1).toString().padStart(2, "0")}
                </div>
                <div className="flex-1 md:pt-1">
                  <h3 className="font-display text-base font-semibold mb-1.5 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-foreground/60 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
