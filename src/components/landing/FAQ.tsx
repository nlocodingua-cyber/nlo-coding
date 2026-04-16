"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
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
    <section className="relative py-20 sm:py-28 bg-[var(--background-secondary)]/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />

        <div className="mt-12 space-y-3">
          {items.map((item, i) => {
            const open = openIdx === i;
            return (
              <div
                key={i}
                className="glass border border-border overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full flex items-start justify-between gap-4 text-left p-5 hover:text-primary transition-colors"
                  aria-expanded={open}
                >
                  <span className="font-medium text-sm sm:text-base leading-snug">
                    {item.q}
                  </span>
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
      </div>
    </section>
  );
}
