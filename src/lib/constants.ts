import type { LucideIcon } from "lucide-react";
import {
  Rocket,
  Workflow,
  Bot,
  Layers,
  Film,
  UserCircle2,
  Target,
  DollarSign,
  Brain,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-unused-vars */

/* ═══════════════════════════════════════════
   NLO Coding — Services & Ecosystem Constants
   ═══════════════════════════════════════════ */

export type ServiceKey = "mvp" | "automation" | "ai-agents" | "integrations";

export interface Service {
  key: ServiceKey;
  /** Slug used in URLs: /{slug} */
  slug: string;
  icon: LucideIcon;
  /** Accent color — one of chart-1..5 */
  color: "cyan" | "purple" | "green" | "orange" | "pink";
  /** Has dedicated target-landing page? */
  hasLanding: boolean;
}

export const SERVICES: Service[] = [
  {
    key: "mvp",
    slug: "mvp",
    icon: Rocket,
    color: "cyan",
    hasLanding: true,
  },
  {
    key: "automation",
    slug: "automation",
    icon: Workflow,
    color: "green",
    hasLanding: true,
  },
  {
    key: "ai-agents",
    slug: "ai-agents",
    icon: Bot,
    color: "purple",
    hasLanding: true,
  },
  {
    key: "integrations",
    slug: "contact",
    icon: Layers,
    color: "orange",
    hasLanding: false,
  },
];

/* ═══════════════════════════════════════════
   NLO Ecosystem Products — Proof + Footer
   ═══════════════════════════════════════════ */

export type ProductKey = "platform" | "studio" | "brand" | "strategy" | "finance" | "brain";

export interface Product {
  key: ProductKey;
  name: string;
  url: string;
  color: "cyan" | "purple" | "green" | "orange" | "pink" | "blue";
  icon: LucideIcon;
}

/**
 * 5 NLO SaaS продуктів, які показуємо у Proof/Cases секціях.
 * NLO Platform свідомо виключено — це AI agent meta-platform, що керує
 * розробкою інших продуктів (частина інфраструктури NLO Coding, не окремий кейс).
 */
export const NLO_PRODUCTS: Product[] = [
  {
    key: "studio",
    name: "NLO Studio",
    url: "https://nlostudio.com",
    color: "purple",
    icon: Film,
  },
  {
    key: "strategy",
    name: "NLO Strategy",
    url: "https://nlostrategy.com",
    color: "green",
    icon: Target,
  },
  {
    key: "finance",
    name: "NLO Finance",
    url: "https://nlofinance.com",
    color: "orange",
    icon: DollarSign,
  },
  {
    key: "brand",
    name: "NLO Brand",
    url: "https://nlobrand.com",
    color: "pink",
    icon: UserCircle2,
  },
  {
    key: "brain",
    name: "NLO Brain",
    url: "https://nlobrain.com",
    color: "blue",
    icon: Brain,
  },
];

/* ═══════════════════════════════════════════
   External links
   ═══════════════════════════════════════════ */

export const TELEGRAM_URL = "https://t.me/lex36";
export const CALENDLY_URL = "https://calendly.com/brandexorcist/discovery";
export const BRAND_EXORCIST_URL = "https://brandexorcist.com.ua";
export const NLO_ECOSYSTEM_URL = "https://nloeco.com";

/**
 * Build a Telegram URL with UTM campaign param (page slug).
 * Telegram ignores query params but they survive in link analytics.
 */
export function telegramWithUtm(campaign: string): string {
  return `${TELEGRAM_URL}?utm_source=nlocoding&utm_medium=web&utm_campaign=${campaign}`;
}
