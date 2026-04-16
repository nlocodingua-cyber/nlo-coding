"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuroraBg } from "@/components/shared/AuroraBg";
import { Magnetic } from "@/components/shared/Magnetic";
import { Marquee } from "@/components/shared/Marquee";
import { TELEGRAM_URL } from "@/lib/constants";

const TECH_STACK = [
  "Next.js",
  "TypeScript",
  "Supabase",
  "Claude API",
  "OpenAI",
  "Stripe",
  "Trigger.dev",
  "n8n",
  "Vercel",
  "Tailwind CSS",
  "Framer Motion",
  "Cursor",
  "Playwright",
  "PostgreSQL",
];

export function Hero() {
  const t = useTranslations("landing.hero");
  const common = useTranslations("common");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-12">
      <AuroraBg />
      <div className="absolute inset-0 bg-dot-grid opacity-100" aria-hidden="true" />

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3 mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-xs font-mono uppercase tracking-[0.2em] text-foreground/80">
            <Sparkles className="size-3 text-primary" />
            {t("badge")}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-foreground-muted">
            — {common("partOfEcosystem")} —
          </div>
        </motion.div>

        {/* Display headline — huge, tight, multi-line */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-bold text-balance mx-auto"
          style={{
            fontSize: "clamp(2.75rem, 8vw, 6.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.035em",
            maxWidth: "18ch",
          }}
        >
          <span className="display-title">{t("titleLine1")}</span>
          <br />
          <span className="text-gradient">{t("titleLine2")}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-7 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-foreground/65 leading-[1.55] text-balance"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Magnetic>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="shine-cta h-12 px-7 text-[15px] font-semibold shadow-[0_0_40px_rgba(0,240,255,0.25)] hover:shadow-[0_0_60px_rgba(0,240,255,0.4)] transition-shadow"
              >
                <Send className="size-4" />
                {t("ctaPrimary")}
                <ArrowRight className="size-4" />
              </Button>
            </a>
          </Magnetic>
          <Magnetic strength={10}>
            <a href="#cases-proof">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-7 text-[15px] border-white/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.06] hover:border-white/20"
              >
                {t("ctaSecondary")}
              </Button>
            </a>
          </Magnetic>
        </motion.div>

        {/* Meta strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-3 text-xs font-mono uppercase tracking-[0.18em] text-foreground-muted"
        >
          <div>
            <span className="text-primary">6</span> SaaS · 1 year
          </div>
          <div>
            Vibe <span className="text-primary">Coding</span>
          </div>
          <div>
            Ship in <span className="text-primary">2-4 weeks</span>
          </div>
        </motion.div>
      </div>

      {/* Tech marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 inset-x-0"
      >
        <Marquee>
          {TECH_STACK.map((t, i) => (
            <span
              key={i}
              className="font-mono text-xs uppercase tracking-[0.2em] text-foreground-muted/60 flex items-center gap-3 whitespace-nowrap"
            >
              {t}
              <span className="size-1 rounded-full bg-primary/40" aria-hidden="true" />
            </span>
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}
