import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { TELEGRAM_URL, CALENDLY_URL, telegramWithUtm } from "@/lib/constants";
import { Send, FileText, CalendarClock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadBlockProps {
  /** UTM campaign tag (source page slug: main, mvp, automation, ai-agents, about, etc.) */
  campaign?: string;
  className?: string;
}

/**
 * Triple-CTA contact block: Telegram (primary), Form, Calendly.
 * Reused on main landing, all target-landings, contact page, and about page.
 */
export function LeadBlock({ campaign = "main", className }: LeadBlockProps) {
  const t = useTranslations("leadBlock");

  const cards = [
    {
      key: "telegram" as const,
      icon: Send,
      href: telegramWithUtm(campaign),
      external: true,
      accent: "bg-[var(--chart-1)]/10 text-[var(--chart-1)] border-[var(--chart-1)]/20",
      recommended: true,
    },
    {
      key: "form" as const,
      icon: FileText,
      href: "/contact",
      external: false,
      accent: "bg-[var(--chart-2)]/10 text-[var(--chart-2)] border-[var(--chart-2)]/20",
      recommended: false,
    },
    {
      key: "calendly" as const,
      icon: CalendarClock,
      href: CALENDLY_URL,
      external: true,
      accent: "bg-[var(--chart-4)]/10 text-[var(--chart-4)] border-[var(--chart-4)]/20",
      recommended: false,
    },
  ];

  return (
    <div className={cn("grid sm:grid-cols-3 gap-5", className)}>
      {cards.map((card) => {
        const Icon = card.icon;
        const content = (
          <div
            className={cn(
              "group relative glass p-7 hover-lift h-full border border-border transition-all",
              card.recommended && "ring-1 ring-primary/25 shadow-[0_0_24px_rgba(0,240,255,0.08)]"
            )}
          >
            {card.recommended && (
              <div className="absolute -top-2 left-6 text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-primary text-primary-foreground">
                ★
              </div>
            )}
            <div
              className={cn(
                "inline-flex items-center justify-center size-11 rounded-lg mb-5 border",
                card.accent
              )}
            >
              <Icon className="size-5" />
            </div>
            <h3 className="font-display text-base font-semibold mb-2">
              {t(`${card.key}.title`)}
            </h3>
            <p className="text-sm text-foreground/70 leading-relaxed mb-5 min-h-[3em]">
              {t(`${card.key}.desc`)}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-primary">
              {t(`${card.key}.cta`)}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        );

        return card.external ? (
          <a
            key={card.key}
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {content}
          </a>
        ) : (
          <Link key={card.key} href={card.href} className="block">
            {content}
          </Link>
        );
      })}
    </div>
  );
}
