"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Spotlight } from "@/components/shared/Spotlight";
import { AlertTriangle } from "lucide-react";

interface PainCard {
  title: string;
  desc: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function Problem() {
  const t = useTranslations("landing.problem");
  const cards = t.raw("cards") as PainCard[];

  return (
    <section className="relative py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.1 }}
          className="grid md:grid-cols-3 gap-5 mt-20"
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <Spotlight className="h-full rounded-2xl bg-white/[0.02] border border-white/10 p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]">
                <div className="relative">
                  <div className="inline-flex items-center justify-center size-11 rounded-xl bg-destructive/10 text-destructive mb-6 border border-destructive/20">
                    <AlertTriangle className="size-5" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3 leading-tight tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-[15px] text-foreground/65 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </Spotlight>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
