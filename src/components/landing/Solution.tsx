"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Check, Zap } from "lucide-react";

export function Solution() {
  const t = useTranslations("landing.solution");
  const bullets = t.raw("bullets") as string[];

  return (
    <section className="relative py-28 sm:py-36 bg-[var(--background-secondary)]/50">
      <div
        className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="md:col-span-6"
          >
            <SectionHeader
              eyebrow={t("eyebrow")}
              title={t("title")}
              align="left"
            />
            <div className="mt-8 space-y-5 text-[15px] text-foreground/70 leading-[1.7]">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:col-span-6"
          >
            <div className="relative rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md p-8 overflow-hidden">
              <div
                className="absolute -top-20 -right-20 size-72 rounded-full opacity-30 pointer-events-none blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(0,240,255,0.4), transparent 70%)" }}
                aria-hidden="true"
              />
              <div className="relative">
                <div className="inline-flex items-center justify-center size-11 rounded-xl bg-primary/10 border border-primary/20 text-primary mb-6">
                  <Zap className="size-5" />
                </div>
                <ul className="space-y-4">
                  {bullets.map((bullet, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="flex items-start gap-3 text-[15px] text-foreground/85"
                    >
                      <Check className="size-4 text-primary shrink-0 mt-[5px]" />
                      <span>{bullet}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
