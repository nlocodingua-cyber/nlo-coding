"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuroraBg } from "@/components/shared/AuroraBg";
import { Magnetic } from "@/components/shared/Magnetic";
import { Marquee } from "@/components/shared/Marquee";
import { AnimatedText } from "@/components/shared/AnimatedText";
import { NumberTicker } from "@/components/shared/NumberTicker";
import { OrbitBadges } from "@/components/shared/OrbitBadges";
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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-12">
      <AuroraBg />
      <OrbitBadges />
      <div className="absolute inset-0 bg-dot-grid opacity-100" aria-hidden="true" />

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle gradient badge — no more "dev console" mono */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 text-[13px] font-medium">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-white/25" aria-hidden="true" />
            <span className="text-gradient font-display">{t("badge")}</span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-white/25" aria-hidden="true" />
          </div>
        </motion.div>

        {/* Display headline — word-by-word blur reveal */}
        <h1
          className="font-display font-bold text-balance mx-auto"
          style={{
            fontSize: "clamp(2.75rem, 8vw, 6.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.035em",
            maxWidth: "18ch",
          }}
        >
          <AnimatedText
            text={t("titleLine1")}
            as="span"
            className="display-title"
            stagger={0.07}
          />
          <br />
          <AnimatedText
            text={t("titleLine2")}
            as="span"
            className="text-gradient"
            stagger={0.07}
            delay={0.25}
          />
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-7 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-foreground/65 leading-[1.55] text-balance"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
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

        {/* Animated stats — real numbers from Brand Exorcist */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 max-w-3xl mx-auto"
        >
          <Stat value={200} suffix="+" label={t("stats.consultations")} />
          <Stat value={12} suffix="+" label={t("stats.years")} />
          <Stat value={5} label={t("stats.saas")} />
          <Stat value={95} suffix="%" label={t("stats.satisfied")} />
        </motion.div>
      </div>

      {/* Tech marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
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

function Stat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <div
        className="font-display font-bold display-title"
        style={{
          fontSize: "clamp(2rem, 4vw, 3rem)",
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        <NumberTicker value={value} suffix={suffix} />
      </div>
      <div className="mt-2 text-[11px] sm:text-[12px] uppercase tracking-[0.15em] text-foreground/50">
        {label}
      </div>
    </div>
  );
}
