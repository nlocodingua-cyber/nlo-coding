"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Spotlight } from "@/components/shared/Spotlight";
import { TiltCard } from "@/components/shared/TiltCard";
import { Headphones, MessagesSquare, Package, BarChart3, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CaseKey = "support" | "sales" | "orders" | "dashboard" | "research";

interface UseCase {
  key: CaseKey;
  icon: LucideIcon;
  color: "cyan" | "purple" | "green" | "orange" | "pink";
}

const CASES: UseCase[] = [
  { key: "support", icon: Headphones, color: "purple" },
  { key: "sales", icon: MessagesSquare, color: "green" },
  { key: "orders", icon: Package, color: "cyan" },
  { key: "dashboard", icon: BarChart3, color: "orange" },
  { key: "research", icon: Search, color: "pink" },
];

const colorMap = {
  cyan: { text: "text-[var(--chart-1)]", bg: "bg-[var(--chart-1)]/10", border: "border-[var(--chart-1)]/25" },
  purple: { text: "text-[var(--chart-2)]", bg: "bg-[var(--chart-2)]/10", border: "border-[var(--chart-2)]/25" },
  green: { text: "text-[var(--chart-3)]", bg: "bg-[var(--chart-3)]/10", border: "border-[var(--chart-3)]/25" },
  orange: { text: "text-[var(--chart-4)]", bg: "bg-[var(--chart-4)]/10", border: "border-[var(--chart-4)]/25" },
  pink: { text: "text-[var(--chart-5)]", bg: "bg-[var(--chart-5)]/10", border: "border-[var(--chart-5)]/25" },
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
          {CASES.map((c) => (
            <motion.div
              key={c.key}
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="h-full"
            >
              <TiltCard maxTilt={6} className="h-full rounded-2xl">
                <CaseCard useCase={c} />
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CaseCard({ useCase }: { useCase: UseCase }) {
  const t = useTranslations("landing.proof.cases");
  const Icon = useCase.icon;
  const color = colorMap[useCase.color];

  return (
    <div className="group relative h-full rounded-2xl bg-white/[0.02] border border-white/10 transition-all duration-300 hover:border-white/25">
      <Spotlight className="h-full p-6 flex flex-col">
        <div className="flex items-start justify-between mb-5">
          <div className={cn(
            "inline-flex items-center justify-center size-10 rounded-xl border",
            color.bg, color.text, color.border
          )}>
            <Icon className="size-5" />
          </div>
        </div>

        <div className={cn("font-display text-2xl sm:text-[1.75rem] font-bold mb-1 tracking-tight leading-none", color.text)}>
          {t(`${useCase.key}.impact`)}
        </div>

        <h3 className="font-display text-base font-semibold mb-2 tracking-tight">
          {t(`${useCase.key}.title`)}
        </h3>

        <p className="text-[13px] text-foreground/65 leading-relaxed flex-1">
          {t(`${useCase.key}.desc`)}
        </p>
      </Spotlight>
    </div>
  );
}
