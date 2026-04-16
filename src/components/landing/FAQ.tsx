"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  q: string;
  a: string;
}

export function FAQ() {
  const t = useTranslations("landing.faq");
  const items = t.raw("items") as FaqItem[];
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="relative py-28 sm:py-36 bg-[var(--background-secondary)]/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-16 space-y-2"
        >
          {items.map((item, i) => {
            const open = openIdx === i;
            return (
              <div
                key={i}
                className={cn(
                  "rounded-xl border overflow-hidden transition-all duration-300",
                  open
                    ? "border-primary/30 bg-primary/[0.03]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                )}
              >
                <button
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 transition-colors"
                  aria-expanded={open}
                >
                  <span className="font-display font-medium text-base sm:text-lg leading-snug tracking-tight">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 transition-all",
                      open ? "rotate-180 text-primary" : "text-foreground-muted"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-[15px] text-foreground/65 leading-relaxed">
                      {item.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
