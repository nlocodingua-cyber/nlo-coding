"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Spotlight } from "@/components/shared/Spotlight";
import { TELEGRAM_URL, CALENDLY_URL, telegramWithUtm } from "@/lib/constants";
import { Send, FileText, CalendarClock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadBlockProps {
  /** UTM campaign tag (source page slug: main, mvp, automation, ai-agents, about, etc.) */
  campaign?: string;
  className?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Triple-CTA contact block: Telegram (featured, border-beam), Form, Calendly.
 */
export function LeadBlock({ campaign = "main", className }: LeadBlockProps) {
  const t = useTranslations("leadBlock");

  const cards = [
    {
      key: "telegram" as const,
      icon: Send,
      href: telegramWithUtm(campaign),
      external: true,
      iconBg: "bg-[var(--chart-1)]/10 border-[var(--chart-1)]/30 text-[var(--chart-1)]",
      ctaColor: "text-[var(--chart-1)]",
      featured: true,
    },
    {
      key: "form" as const,
      icon: FileText,
      href: "/contact",
      external: false,
      iconBg: "bg-[var(--chart-2)]/10 border-[var(--chart-2)]/30 text-[var(--chart-2)]",
      ctaColor: "text-[var(--chart-2)]",
      featured: false,
    },
    {
      key: "calendly" as const,
      icon: CalendarClock,
      href: CALENDLY_URL,
      external: true,
      iconBg: "bg-[var(--chart-4)]/10 border-[var(--chart-4)]/30 text-[var(--chart-4)]",
      ctaColor: "text-[var(--chart-4)]",
      featured: false,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ staggerChildren: 0.08 }}
      className={cn("grid sm:grid-cols-3 gap-5", className)}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const content = (
          <Spotlight
            className={cn(
              "relative group rounded-2xl h-full p-8 bg-white/[0.02] border border-white/10 backdrop-blur-sm transition-all duration-300",
              "hover:border-white/25 hover:-translate-y-1",
              card.featured && "border-beam"
            )}
          >
            {card.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-display font-semibold tracking-wide shadow-[0_0_24px_rgba(0,240,255,0.4)]">
                  <span className="size-1.5 rounded-full bg-primary-foreground animate-pulse" />
                  {t(`${card.key}.badge`)}
                </div>
              </div>
            )}
            <div className="relative flex flex-col h-full">
              <div className={cn("inline-flex items-center justify-center size-12 rounded-xl mb-6 border", card.iconBg)}>
                <Icon className="size-5" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2 tracking-tight">
                {t(`${card.key}.title`)}
              </h3>
              <p className="text-[14px] text-foreground/65 leading-relaxed mb-8 flex-1">
                {t(`${card.key}.desc`)}
              </p>
              <div className={cn("inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em]", card.ctaColor)}>
                {t(`${card.key}.cta`)}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Spotlight>
        );

        return (
          <motion.div key={card.key} variants={fadeUp} transition={{ duration: 0.6 }} className="h-full">
            {card.external ? (
              <a href={card.href} target="_blank" rel="noopener noreferrer" className="block h-full">
                {content}
              </a>
            ) : (
              <Link href={card.href} className="block h-full">
                {content}
              </Link>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
