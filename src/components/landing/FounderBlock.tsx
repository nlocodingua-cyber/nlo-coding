"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/shared/Magnetic";
import { BRAND_EXORCIST_URL } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export function FounderBlock() {
  const t = useTranslations("landing.founder");

  return (
    <section id="about" className="relative py-28 sm:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-mono uppercase tracking-[0.25em] text-foreground/80 mb-6">
          <span className="size-1 rounded-full bg-primary" aria-hidden="true" />
          {t("eyebrow")}
        </div>

        <h2
          className="font-display font-bold text-balance mb-5"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
          }}
        >
          <span className="display-title">{t("title")}</span>
        </h2>
        <p className="text-[15px] sm:text-base text-foreground/65 max-w-2xl mx-auto mb-6 leading-relaxed">
          {t("subtitle")}
        </p>
        <p className="text-[15px] sm:text-base text-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("p")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Magnetic>
            <Link href="/about">
              <Button
                variant="outline"
                className="h-11 px-6 border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20"
              >
                {t("cta")}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </Magnetic>
          <a href={BRAND_EXORCIST_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" className="h-11 px-6 text-foreground/70 hover:text-primary">
              {t("exorcistCta")}
            </Button>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
