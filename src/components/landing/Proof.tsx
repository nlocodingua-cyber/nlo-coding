"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Spotlight } from "@/components/shared/Spotlight";
import { TiltCard } from "@/components/shared/TiltCard";
import { NLO_PRODUCTS } from "@/lib/constants";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const colorMap = {
  cyan: { text: "text-[var(--chart-1)]", bg: "bg-[var(--chart-1)]/10", border: "border-[var(--chart-1)]/25" },
  purple: { text: "text-[var(--chart-2)]", bg: "bg-[var(--chart-2)]/10", border: "border-[var(--chart-2)]/25" },
  green: { text: "text-[var(--chart-3)]", bg: "bg-[var(--chart-3)]/10", border: "border-[var(--chart-3)]/25" },
  orange: { text: "text-[var(--chart-4)]", bg: "bg-[var(--chart-4)]/10", border: "border-[var(--chart-4)]/25" },
  pink: { text: "text-[var(--chart-5)]", bg: "bg-[var(--chart-5)]/10", border: "border-[var(--chart-5)]/25" },
  blue: { text: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10", border: "border-[#3b82f6]/25" },
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function Proof() {
  const t = useTranslations("landing.proof");

  return (
    <section id="cases-proof" className="relative py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 mt-20"
        >
          {NLO_PRODUCTS.map((p) => (
            <motion.div
              key={p.key}
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="h-full"
            >
              <TiltCard maxTilt={6} className="h-full rounded-2xl">
                <ProductCard product={p} />
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: (typeof NLO_PRODUCTS)[number] }) {
  const t = useTranslations("landing.proof");
  const Icon = product.icon;
  const color = colorMap[product.color];

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block h-full rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden transition-all duration-300",
        "hover:border-white/25"
      )}
    >
      <Spotlight className="h-full p-6 flex flex-col">
        <div className="flex items-start justify-between mb-5">
          <div className={cn(
            "inline-flex items-center justify-center size-10 rounded-xl border",
            color.bg, color.text, color.border
          )}>
            <Icon className="size-5" />
          </div>
          <ExternalLink className="size-3.5 text-foreground-muted group-hover:text-primary transition-colors" />
        </div>

        <h3 className={cn(
          "font-display text-lg font-semibold mb-2 tracking-tight",
          color.text
        )}>
          {product.name}
        </h3>

        <p className="text-[13px] text-foreground/65 leading-relaxed flex-1">
          {t(`products.${product.key}`)}
        </p>

        <div className="mt-5 text-[10px] font-mono uppercase tracking-[0.25em] text-foreground-muted group-hover:text-primary transition-colors">
          {t("visitCta")} →
        </div>
      </Spotlight>
    </a>
  );
}
