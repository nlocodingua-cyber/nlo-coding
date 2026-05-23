"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Spotlight } from "@/components/shared/Spotlight";
import { LeadForm } from "@/components/shared/LeadForm";
import { TELEGRAM_URL, telegramWithUtm } from "@/lib/constants";
import { Send, FileText, CalendarClock, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadBlockProps {
  campaign?: string;
  className?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function LeadBlock({ campaign = "main", className }: LeadBlockProps) {
  const t = useTranslations("leadBlock");
  const [formOpen, setFormOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!formOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setFormOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [formOpen]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = formOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [formOpen]);

  const cards = [
    {
      key: "telegram" as const,
      icon: Send,
      href: telegramWithUtm(campaign),
      external: true,
      modal: false,
      iconBg: "bg-[var(--chart-1)]/10 border-[var(--chart-1)]/30 text-[var(--chart-1)]",
      ctaColor: "text-[var(--chart-1)]",
      featured: true,
    },
    {
      key: "form" as const,
      icon: FileText,
      href: null,
      external: false,
      modal: true,
      iconBg: "bg-[var(--chart-2)]/10 border-[var(--chart-2)]/30 text-[var(--chart-2)]",
      ctaColor: "text-[var(--chart-2)]",
      featured: false,
    },
    {
      key: "calendly" as const,
      icon: CalendarClock,
      href: "/booking",
      external: false,
      modal: false,
      iconBg: "bg-[var(--chart-4)]/10 border-[var(--chart-4)]/30 text-[var(--chart-4)]",
      ctaColor: "text-[var(--chart-4)]",
      featured: false,
    },
  ];

  return (
    <>
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
            <div className="relative h-full">
              {card.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-display font-semibold tracking-wide shadow-[0_0_24px_rgba(0,240,255,0.4)]">
                    <span className="size-1.5 rounded-full bg-primary-foreground animate-pulse" />
                    {t(`${card.key}.badge`)}
                  </div>
                </div>
              )}
              <Spotlight
                className={cn(
                  "group rounded-2xl h-full p-8 bg-white/[0.02] border border-white/10 backdrop-blur-sm transition-all duration-300",
                  "hover:border-white/25 hover:-translate-y-1",
                  card.featured && "border-beam"
                )}
              >
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
            </div>
          );

          return (
            <motion.div key={card.key} variants={fadeUp} transition={{ duration: 0.6 }} className="h-full">
              {card.modal ? (
                <button onClick={() => setFormOpen(true)} className="block h-full w-full text-left">
                  {content}
                </button>
              ) : card.external ? (
                <a href={card.href!} target="_blank" rel="noopener noreferrer" className="block h-full">
                  {content}
                </a>
              ) : (
                <Link href={card.href!} className="block h-full">
                  {content}
                </Link>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Form Modal */}
      <AnimatePresence>
        {formOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setFormOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="relative w-full max-w-lg pointer-events-auto">
                <button
                  onClick={() => setFormOpen(false)}
                  className="absolute -top-3 -right-3 z-10 flex items-center justify-center size-8 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  <X className="size-4" />
                </button>
                <LeadForm sourcePage={`modal-${campaign}`} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
