"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Particles } from "@/components/shared/Particles";
import { GlowOrbs } from "@/components/shared/GlowOrbs";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { LeadBlock } from "@/components/shared/LeadBlock";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, Send, ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { telegramWithUtm } from "@/lib/constants";

type ServiceSlug = "mvp" | "automation" | "ai-agents";

interface Pain {
  title: string;
  desc: string;
}

interface TimelineItem {
  title: string;
  desc: string;
}

interface Faq {
  q: string;
  a: string;
}

interface Proof {
  product: string;
  url: string;
  desc: string;
}

interface TargetPageProps {
  /** i18n namespace root (e.g., "mvp", "automation", "aiAgents") */
  namespace: "mvp" | "automation" | "aiAgents";
  /** URL slug used for UTM + form pre-fill */
  slug: ServiceSlug;
  /** Accent color for hero + badges */
  accent: "cyan" | "green" | "purple";
}

const accentMap = {
  cyan: {
    text: "text-[var(--chart-1)]",
    bg: "bg-[var(--chart-1)]/10",
    border: "border-[var(--chart-1)]/25",
    glow: "rgba(0,240,255,0.14)",
  },
  green: {
    text: "text-[var(--chart-3)]",
    bg: "bg-[var(--chart-3)]/10",
    border: "border-[var(--chart-3)]/25",
    glow: "rgba(16,185,129,0.14)",
  },
  purple: {
    text: "text-[var(--chart-2)]",
    bg: "bg-[var(--chart-2)]/10",
    border: "border-[var(--chart-2)]/25",
    glow: "rgba(124,58,237,0.14)",
  },
} as const;

export function TargetPage({ namespace, slug, accent }: TargetPageProps) {
  const t = useTranslations(namespace);
  const shared = useTranslations("targetLanding");
  const a = accentMap[accent];

  const pains = t.raw("pains") as Pain[];
  const included = t.raw("included") as string[];
  const stack = t.raw("stack") as string[];
  const timeline = t.raw("timeline") as TimelineItem[];
  const proof = t.raw("proof") as Proof;
  const faq = t.raw("faq") as Faq[];

  return (
    <main>
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-28 pb-16">
        <GlowOrbs />
        <div className="absolute inset-0 grid-bg-dense opacity-30" aria-hidden="true" />
        <Particles count={35} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest mb-6 border",
              a.bg,
              a.text,
              a.border
            )}
          >
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-5"
          >
            <span className="text-foreground">{t("hero.title")}</span>
            <br />
            <span className="text-gradient">{t("hero.titleAccent")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <a href={telegramWithUtm(slug)} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="animate-glow-pulse">
                <Send className="size-4" />
                {t("hero.cta")}
                <ArrowRight className="size-4" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* PAINS */}
      <section className="relative py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={shared("painTitle")} />
          <div className="grid md:grid-cols-3 gap-5 mt-12">
            {pains.map((p, i) => (
              <div key={i} className="glass p-6 neon-card-glow">
                <div className={cn("size-7 rounded-md mb-4 flex items-center justify-center font-mono text-sm", a.bg, a.text)}>
                  {i + 1}
                </div>
                <h3 className="font-display text-base font-semibold mb-2 leading-snug">
                  {p.title}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="relative py-20 sm:py-24 bg-[var(--background-secondary)]/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={shared("includedTitle")} />
          <div className="glass-elevated p-7 sm:p-10 mt-12">
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {included.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                  <Check className={cn("size-4 shrink-0 mt-0.5", a.text)} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* STACK */}
      <section className="relative py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={shared("stackTitle")} />
          <div className="flex flex-wrap justify-center gap-2.5 mt-10">
            {stack.map((tech, i) => (
              <span
                key={i}
                className="font-mono text-xs px-3 py-1.5 rounded-md bg-white/5 border border-border text-foreground/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative py-20 sm:py-24 bg-[var(--background-secondary)]/50">
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={shared("timelineTitle")} />
          <ol className="grid md:grid-cols-3 gap-5 mt-12">
            {timeline.map((step, i) => (
              <li key={i} className="glass p-6">
                <div className={cn("text-[10px] font-mono uppercase tracking-widest mb-2", a.text)}>
                  STEP {(i + 1).toString().padStart(2, "0")}
                </div>
                <h3 className="font-display text-base font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PROOF */}
      <section className="relative py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={shared("proofTitle")} />
          <a
            href={proof.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block glass-elevated neon-card-glow p-7 mt-12 hover-lift group"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className={cn("font-display text-xl font-semibold", a.text)}>
                {proof.product}
              </h3>
              <ExternalLink className="size-5 text-foreground-muted group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm text-foreground/75 leading-relaxed">
              {proof.desc}
            </p>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20 sm:py-24 bg-[var(--background-secondary)]/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={shared("faqTitle")} />
          <TargetFAQ items={faq} />
        </div>
      </section>

      {/* FINAL LEAD BLOCK */}
      <section className="relative py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeadBlock campaign={slug} />
        </div>
      </section>
    </main>
  );
}

function TargetFAQ({ items }: { items: Faq[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className="mt-12 space-y-3">
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <div key={i} className="glass border border-border overflow-hidden">
            <button
              onClick={() => setOpenIdx(open ? null : i)}
              className="w-full flex items-start justify-between gap-4 text-left p-5 hover:text-primary transition-colors"
              aria-expanded={open}
            >
              <span className="font-medium text-sm sm:text-base leading-snug">{item.q}</span>
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 text-foreground-muted transition-transform mt-0.5",
                  open && "rotate-180 text-primary"
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 text-sm text-foreground/70 leading-relaxed">
                  {item.a}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
