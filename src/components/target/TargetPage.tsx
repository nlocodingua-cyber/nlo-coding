"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AuroraBg } from "@/components/shared/AuroraBg";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Spotlight } from "@/components/shared/Spotlight";
import { Magnetic } from "@/components/shared/Magnetic";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { LeadBlock } from "@/components/shared/LeadBlock";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, Send, ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { telegramWithUtm } from "@/lib/constants";

type ServiceSlug = "mvp" | "automation" | "ai-agents";

interface Pain { title: string; desc: string }
interface TimelineItem { title: string; desc: string }
interface Faq { q: string; a: string }
interface ProofData { product: string; url: string; desc: string }

interface TargetPageProps {
  namespace: "mvp" | "automation" | "aiAgents";
  slug: ServiceSlug;
  accent: "cyan" | "green" | "purple";
}

const accentMap = {
  cyan: {
    text: "text-[var(--chart-1)]",
    bg: "bg-[var(--chart-1)]/10",
    border: "border-[var(--chart-1)]/25",
  },
  green: {
    text: "text-[var(--chart-3)]",
    bg: "bg-[var(--chart-3)]/10",
    border: "border-[var(--chart-3)]/25",
  },
  purple: {
    text: "text-[var(--chart-2)]",
    bg: "bg-[var(--chart-2)]/10",
    border: "border-[var(--chart-2)]/25",
  },
} as const;

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export function TargetPage({ namespace, slug, accent }: TargetPageProps) {
  const t = useTranslations(namespace);
  const shared = useTranslations("targetLanding");
  const a = accentMap[accent];

  const pains = t.raw("pains") as Pain[];
  const included = t.raw("included") as string[];
  const stack = t.raw("stack") as string[];
  const timeline = t.raw("timeline") as TimelineItem[];
  const proof = t.raw("proof") as ProofData;
  const faq = t.raw("faq") as Faq[];

  return (
    <main>
      {/* HERO */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden pt-32 pb-20">
        <AuroraBg />
        <div className="absolute inset-0 bg-dot-grid opacity-60" aria-hidden="true" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-7"
          >
            <Eyebrow>{t("hero.badge")}</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold text-balance mx-auto"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.035em",
              maxWidth: "18ch",
            }}
          >
            <span className="display-title">{t("hero.title")}</span>
            <br />
            <span className="text-gradient">{t("hero.titleAccent")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-7 max-w-2xl mx-auto text-base sm:text-lg text-foreground/65 leading-[1.55] text-balance"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* Offer strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-6 inline-block px-5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
          >
            {shared("offer")}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 flex justify-center"
          >
            <Magnetic>
              <a href={telegramWithUtm(slug)} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="shine-cta h-12 px-7 text-[15px] font-semibold shadow-[0_0_40px_rgba(0,240,255,0.25)]"
                >
                  <Send className="size-4" />
                  {t("hero.cta")}
                  <ArrowRight className="size-4" />
                </Button>
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* PAINS */}
      <section className="relative py-24 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={shared("painTitle")} />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.08 }}
            className="grid md:grid-cols-3 gap-5 mt-16"
          >
            {pains.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.6 }}
              >
                <Spotlight className="h-full rounded-2xl bg-white/[0.02] border border-white/10 p-7 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
                  <div className={cn("size-9 rounded-lg mb-4 flex items-center justify-center font-mono text-sm border", a.bg, a.text, a.border)}>
                    {i + 1}
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-3 leading-snug tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-[14px] text-foreground/65 leading-relaxed">
                    {p.desc}
                  </p>
                </Spotlight>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="relative py-24 sm:py-28 bg-[var(--background-secondary)]/50">
        <div className="absolute inset-0 bg-dot-grid opacity-40" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={shared("includedTitle")} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md p-8 sm:p-10 mt-12 overflow-hidden"
          >
            <div
              className="absolute -top-24 right-0 size-72 rounded-full opacity-30 blur-3xl"
              style={{ background: `radial-gradient(circle, ${a.text.includes("chart-1") ? "rgba(0,240,255,0.4)" : a.text.includes("chart-2") ? "rgba(124,58,237,0.4)" : "rgba(16,185,129,0.4)"}, transparent 70%)` }}
              aria-hidden="true"
            />
            <ul className="relative grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {included.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-foreground/85">
                  <Check className={cn("size-4 shrink-0 mt-[5px]", a.text)} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* STACK */}
      <section className="relative py-24 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={shared("stackTitle")} />
          <div className="flex flex-wrap justify-center gap-2.5 mt-12">
            {stack.map((tech, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="font-mono text-[13px] px-4 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-foreground/80 hover:border-white/20 hover:bg-white/[0.06] transition-all"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative py-24 sm:py-28 bg-[var(--background-secondary)]/50">
        <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={shared("timelineTitle")} />
          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.1 }}
            className="grid md:grid-cols-3 gap-5 mt-12"
          >
            {timeline.map((step, i) => (
              <motion.li key={i} variants={fadeUp} transition={{ duration: 0.5 }}>
                <Spotlight className="h-full rounded-2xl bg-white/[0.02] border border-white/10 p-7 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
                  <div className={cn("text-[10px] font-mono uppercase tracking-[0.25em] mb-3", a.text)}>
                    Крок {(i + 1).toString().padStart(2, "0")}
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-foreground/65 leading-relaxed">
                    {step.desc}
                  </p>
                </Spotlight>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* PROOF */}
      <section className="relative py-24 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={shared("proofTitle")} />
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            href={proof.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md overflow-hidden mt-12 border-beam hover:-translate-y-1 transition-transform duration-300"
          >
            <Spotlight className="p-8 sm:p-10 group">
              <div className="relative flex items-start justify-between gap-4 mb-4">
                <h3 className={cn("font-display text-2xl sm:text-3xl font-semibold tracking-tight", a.text)}>
                  {proof.product}
                </h3>
                <ExternalLink className="size-5 text-foreground-muted group-hover:text-primary transition-colors mt-1" />
              </div>
              <p className="text-[15px] text-foreground/75 leading-relaxed">
                {proof.desc}
              </p>
            </Spotlight>
          </motion.a>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-24 sm:py-28 bg-[var(--background-secondary)]/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={shared("faqTitle")} />
          <TargetFAQ items={faq} />
        </div>
      </section>

      {/* FINAL LEAD BLOCK */}
      <section className="relative py-24 sm:py-28">
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,240,255,0.18) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeadBlock campaign={slug} />
        </div>
      </section>
    </main>
  );
}

function TargetFAQ({ items }: { items: Faq[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className="mt-12 space-y-2">
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <div
            key={i}
            className={cn(
              "rounded-xl border overflow-hidden transition-all duration-300",
              open ? "border-primary/30 bg-primary/[0.03]" : "border-white/10 bg-white/[0.02] hover:border-white/20"
            )}
          >
            <button
              onClick={() => setOpenIdx(open ? null : i)}
              className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
              aria-expanded={open}
            >
              <span className="font-display font-medium text-base sm:text-lg leading-snug tracking-tight">{item.q}</span>
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 transition-all",
                  open ? "rotate-180 text-primary" : "text-foreground-muted"
                )}
              />
            </button>
            <div className={cn("grid transition-all duration-300", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <div className="px-6 pb-6 text-[15px] text-foreground/65 leading-relaxed">{item.a}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
