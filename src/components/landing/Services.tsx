"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Spotlight } from "@/components/shared/Spotlight";
import { SERVICES } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const colorMap = {
  cyan: { bg: "bg-[var(--chart-1)]/10", text: "text-[var(--chart-1)]", border: "border-[var(--chart-1)]/25" },
  purple: { bg: "bg-[var(--chart-2)]/10", text: "text-[var(--chart-2)]", border: "border-[var(--chart-2)]/25" },
  green: { bg: "bg-[var(--chart-3)]/10", text: "text-[var(--chart-3)]", border: "border-[var(--chart-3)]/25" },
  orange: { bg: "bg-[var(--chart-4)]/10", text: "text-[var(--chart-4)]", border: "border-[var(--chart-4)]/25" },
  pink: { bg: "bg-[var(--chart-5)]/10", text: "text-[var(--chart-5)]", border: "border-[var(--chart-5)]/25" },
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function Services() {
  const t = useTranslations("landing.services");

  return (
    <section id="services" className="relative py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.08 }}
          className="grid sm:grid-cols-2 gap-5 mt-20"
        >
          {SERVICES.map((s) => {
            const Icon = s.icon;
            const color = colorMap[s.color];
            const href = s.hasLanding ? `/${s.slug}` : `/contact`;

            return (
              <motion.div
                key={s.key}
                variants={fadeUp}
                transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <Link href={href} className="group block h-full">
                  <Spotlight
                    className={cn(
                      "relative h-full rounded-2xl bg-white/[0.02] border border-white/10 p-8 backdrop-blur-sm transition-all duration-300",
                      "hover:-translate-y-1 hover:border-white/25"
                    )}
                  >
                    <div className="relative">
                      <div className={cn(
                        "inline-flex items-center justify-center size-12 rounded-xl mb-6 border",
                        color.bg, color.text, color.border
                      )}>
                        <Icon className="size-5" />
                      </div>
                      <h3 className="font-display text-2xl font-semibold mb-3 tracking-tight">
                        {t(`cards.${s.key}.title`)}
                      </h3>
                      <p className="text-[15px] text-foreground/65 leading-relaxed mb-8">
                        {t(`cards.${s.key}.tagline`)}
                      </p>
                      <div className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em]",
                        color.text
                      )}>
                        {t("openCta")}
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Spotlight>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
