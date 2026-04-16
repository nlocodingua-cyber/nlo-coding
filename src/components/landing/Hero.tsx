"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/shared/Particles";
import { GlowOrbs } from "@/components/shared/GlowOrbs";
import { TELEGRAM_URL } from "@/lib/constants";

export function Hero() {
  const t = useTranslations("landing.hero");
  const common = useTranslations("common");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      <GlowOrbs />
      <div className="absolute inset-0 grid-bg-dense opacity-40" aria-hidden="true" />
      <Particles count={50} />

      <div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none"
        style={{ animation: "scan-line 8s linear infinite" }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full neon-border text-xs font-mono uppercase tracking-widest text-primary mb-4">
            <Sparkles className="size-3" />
            {t("badge")}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-foreground-muted mb-8">
            {common("partOfEcosystem")}
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          <span className="text-foreground">{t("titleLine1")}</span>
          <br />
          <span className="text-gradient">{t("titleLine2")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-base sm:text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="w-full sm:w-auto animate-glow-pulse">
              <Send className="size-4" />
              {t("ctaPrimary")}
              <ArrowRight className="size-4" />
            </Button>
          </a>
          <a href="#cases-proof">
            <Button size="lg" variant="outline" className="w-full sm:w-auto neon-border">
              {t("ctaSecondary")}
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-14 text-xs font-mono uppercase tracking-widest text-foreground-muted"
        >
          {t("hint")}
        </motion.div>
      </div>
    </section>
  );
}
