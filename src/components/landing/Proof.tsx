"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Spotlight } from "@/components/shared/Spotlight";
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

  const featured = NLO_PRODUCTS[0]; // Platform — featured with border-beam
  const rest = NLO_PRODUCTS.slice(1);

  return (
    <section id="cases-proof" className="relative py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.07 }}
          className="grid md:grid-cols-6 gap-5 mt-20"
        >
          {/* Featured card — spans 2 rows on md+ with border-beam */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="md:col-span-3 md:row-span-2"
          >
            <ProductCard product={featured} featured />
          </motion.div>

          {rest.map((p) => (
            <motion.div
              key={p.key}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="md:col-span-3"
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  featured,
}: {
  product: (typeof NLO_PRODUCTS)[number];
  featured?: boolean;
}) {
  const t = useTranslations("landing.proof");
  const Icon = product.icon;
  const color = colorMap[product.color];

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden transition-all duration-300 h-full",
        "hover:border-white/20 hover:-translate-y-1",
        featured && "border-beam"
      )}
    >
      <Spotlight className={cn("h-full", featured ? "p-10 md:p-12" : "p-7")}>
        <div className="relative flex flex-col h-full">
          <div className="flex items-start justify-between mb-5">
            <div className={cn(
              "inline-flex items-center justify-center rounded-xl border",
              color.bg, color.text, color.border,
              featured ? "size-14" : "size-11"
            )}>
              <Icon className={featured ? "size-6" : "size-5"} />
            </div>
            <ExternalLink className="size-4 text-foreground-muted group-hover:text-primary transition-colors" />
          </div>

          <h3 className={cn(
            "font-display font-semibold mb-3 tracking-tight",
            color.text,
            featured ? "text-3xl md:text-4xl" : "text-xl"
          )}>
            {product.name}
          </h3>

          <p className={cn(
            "text-foreground/65 leading-relaxed flex-1",
            featured ? "text-base md:text-lg" : "text-[14px]"
          )}>
            {t(`products.${product.key}`)}
          </p>

          <div className={cn(
            "mt-6 text-[10px] font-mono uppercase tracking-[0.25em] text-foreground-muted group-hover:text-primary transition-colors"
          )}>
            {t("visitCta")} →
          </div>
        </div>
      </Spotlight>
    </a>
  );
}
