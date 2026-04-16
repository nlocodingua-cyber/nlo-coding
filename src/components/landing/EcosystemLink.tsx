"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/shared/Magnetic";
import { NLO_ECOSYSTEM_URL, NLO_PRODUCTS } from "@/lib/constants";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function EcosystemLink() {
  const t = useTranslations("landing.ecosystem");

  return (
    <section className="relative py-24 sm:py-28 bg-[var(--background-secondary)]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md p-10 md:p-16 text-center overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-70"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.22) 0%, transparent 60%), radial-gradient(circle at 80% 100%, rgba(0,240,255,0.16) 0%, transparent 60%)",
            }}
            aria-hidden="true"
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--neon-purple)]/30 bg-[var(--neon-purple)]/10 text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--neon-purple)] mb-6">
              <Sparkles className="size-3" />
              {t("eyebrow")}
            </div>

            <h2
              className="font-display font-bold mb-5 text-balance display-title mx-auto"
              style={{
                fontSize: "clamp(1.75rem, 4.5vw, 3.25rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                maxWidth: "20ch",
              }}
            >
              {t("title")}
            </h2>
            <p className="max-w-2xl mx-auto text-[15px] sm:text-base text-foreground/65 leading-relaxed mb-10">
              {t("subtitle")}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {NLO_PRODUCTS.map((p) => (
                <span
                  key={p.key}
                  className="text-xs font-mono px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/10 text-foreground/70"
                >
                  {p.name}
                </span>
              ))}
            </div>

            <Magnetic>
              <a href={NLO_ECOSYSTEM_URL} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-7 border-[var(--neon-purple)]/30 bg-[var(--neon-purple)]/10 hover:bg-[var(--neon-purple)]/20 hover:border-[var(--neon-purple)]/50 text-foreground"
                >
                  {t("cta")}
                  <ArrowUpRight className="size-4" />
                </Button>
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
