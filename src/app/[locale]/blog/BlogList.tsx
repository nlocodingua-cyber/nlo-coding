"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Article = {
  id: string;
  title: string;
  slug: string;
  meta_description: string | null;
  published_at: string | null;
  word_count: number | null;
  article_type: string | null;
  hero_image_url: string | null;
  keywords: string[] | null;
  translations: Record<string, { title?: string; meta_description?: string }> | null;
};

// ── Semantic categories per site ──────────────────────────────────────────────
type CategoryRule = { en: string; uk: string; test: RegExp };

const SITE_CATEGORIES: Record<string, CategoryRule[]> = {
  // NLO Studio — AI Video Creation
  "805d61c4-0912-4422-a816-a583896d9acc": [
    { en: "AI Avatars",      uk: "AI Аватари",        test: /avatar/i },
    { en: "Video Marketing", uk: "Відеомаркетинг",    test: /marketing|social.media/i },
    { en: "Automation",      uk: "Автоматизація",     test: /automat/i },
    { en: "AI Video",        uk: "AI Відео",           test: /video/i },
    { en: "AI Tools",        uk: "AI Інструменти",    test: /ai/i },
  ],
  // NLO Brand — Personal Branding
  "a90ff33e-6733-4c6a-8153-4fe7ab595f12": [
    { en: "AI Tools",        uk: "AI Інструменти",    test: /ai.tool|ai.software|affordable.ai|best.ai|emerging.ai/i },
    { en: "AI Strategy",     uk: "AI Стратегія",      test: /strateg|tips.for|how.to.use.ai/i },
    { en: "Personal Brand",  uk: "Персональний бренд",test: /personal.brand|what.is.personal|build..*brand/i },
  ],
  // NLO Brain — Knowledge Management
  "d29d58e5-4280-4110-a3e9-840fca655716": [
    { en: "AI Second Brain", uk: "AI Другий мозок",   test: /second.brain|pkm|personal.ai/i },
    { en: "Knowledge Management", uk: "Управління знаннями", test: /knowledge.manag/i },
    { en: "AI Systems",      uk: "AI Системи",         test: /ai/i },
  ],
  // NLO Strategy — AI Business Strategy
  "9493044e-5d4b-4c83-a173-8fe841e2e974": [
    { en: "Bottleneck Analysis", uk: "Аналіз вузьких місць", test: /bottleneck/i },
    { en: "Small Business",  uk: "Малий бізнес",      test: /small.business|startup/i },
    { en: "AI Strategy",     uk: "AI Стратегія",      test: /strateg|planning/i },
    { en: "Business Growth", uk: "Зростання бізнесу", test: /growth|improve|implement/i },
  ],
  // NLO Platform — AI SaaS
  "50d7811d-1701-4dc6-8df3-310cc49f0cac": [
    { en: "SaaS Development",uk: "Розробка SaaS",     test: /develop|build|step|guide|start/i },
    { en: "SaaS Business",   uk: "SaaS Бізнес",       test: /scaling|monetiz|launch|tips|benefit|efficiency/i },
    { en: "SaaS Platforms",  uk: "SaaS Платформи",    test: /platform|what.is|meaning/i },
    { en: "AI Tools",        uk: "AI Інструменти",    test: /tool/i },
  ],
  // NLO Coding — AI Coding
  "7e97a510-bb9c-4a0e-9e89-fd080d84d42d": [
    { en: "Automation",          uk: "Автоматизація",     test: /automat|repetitive/i },
    { en: "Developer Productivity", uk: "Продуктивність", test: /productiv|workflow|accelerat/i },
    { en: "AI Assistants",       uk: "AI Асистенти",      test: /assistant|code.generation/i },
    { en: "AI Tools",            uk: "AI Інструменти",    test: /tool/i },
  ],
};

// Global fallback if site not in map
const GLOBAL_CATEGORIES: CategoryRule[] = [
  { en: "Personal Brand",  uk: "Персональний бренд", test: /personal.brand/i },
  { en: "AI Avatars",      uk: "AI Аватари",         test: /avatar/i },
  { en: "AI Strategy",     uk: "AI Стратегія",       test: /strateg/i },
  { en: "Knowledge Management", uk: "Управління знаннями", test: /knowledge/i },
  { en: "Video Marketing", uk: "Відеомаркетинг",     test: /video.market/i },
  { en: "AI Video",        uk: "AI Відео",            test: /video/i },
  { en: "Automation",      uk: "Автоматизація",      test: /automat/i },
  { en: "Developer Tools", uk: "Інструменти розробника", test: /coding|developer|programming/i },
  { en: "SaaS",            uk: "SaaS",               test: /saas/i },
  { en: "Marketing",       uk: "Маркетинг",          test: /market/i },
  { en: "AI Tools",        uk: "AI Інструменти",     test: /ai/i },
  { en: "General",         uk: "Загальне",            test: /./ },
];

const SITE_ID = process.env.NEXT_PUBLIC_BLOG_WEBSITE_ID ?? "";

function getCategory(keywords: string[] | null, locale: "en" | "uk"): string {
  const rules = SITE_CATEGORIES[SITE_ID] ?? GLOBAL_CATEGORIES;
  const haystack = (keywords ?? []).join(" ").toLowerCase();
  const match = rules.find(r => r.test.test(haystack))
    ?? GLOBAL_CATEGORIES[GLOBAL_CATEGORIES.length - 1];
  return locale === "uk" ? match.uk : match.en;
}

// Translate English category key → localized label for filter buttons
function getCategoryLabel(enKey: string, locale: "en" | "uk"): string {
  if (locale === "en") return enKey;
  const allRules = [...(SITE_CATEGORIES[SITE_ID] ?? []), ...GLOBAL_CATEGORIES];
  return allRules.find(r => r.en === enKey)?.uk ?? enKey;
}

// ── i18n ──────────────────────────────────────────────────────────────────────
const T = {
  en: {
    badge: "Expert Blog",
    heading: "Articles & Guides",
    subtitle: "Practical knowledge from real practice. No fluff.",
    allFilter: "All",
    guide: "Guide",
    words: "words",
    min: "min",
    noArticles: "No articles yet.",
    backSite: "← Back to site",
  },
  uk: {
    badge: "Експертний блог",
    heading: "Статті та гайди",
    subtitle: "Практичні знання з реальної практики. Без води.",
    allFilter: "Всі",
    guide: "Гайд",
    words: "слів",
    min: "хв",
    noArticles: "Статей ще немає.",
    backSite: "← На сайт",
  },
} as const;
type Locale = keyof typeof T;

function readingTime(words: number | null, locale: Locale) {
  const t = T[locale];
  if (!words) return `5 ${t.min}`;
  return `${Math.max(1, Math.ceil(words / 200))} ${t.min}`;
}

function formatDate(date: string | null, locale: Locale) {
  if (!date) return "";
  return new Date(date).toLocaleDateString(locale === "uk" ? "uk-UA" : "en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function getDisplayTitle(article: Article, locale: Locale): string {
  if (locale !== "en") {
    const tr = article.translations?.[locale];
    if (tr?.title) return tr.title;
  }
  return article.title;
}

function getDisplayDesc(article: Article, locale: Locale): string | null {
  if (locale !== "en") {
    const tr = article.translations?.[locale];
    if (tr?.meta_description) return tr.meta_description;
  }
  return article.meta_description;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function BlogList({ articles, locale: rawLocale }: { articles: Article[]; locale: string }) {
  const locale: Locale = rawLocale === "uk" ? "uk" : "en";
  const t = T[locale];
  const [activeTopic, setActiveTopic] = useState<string>(t.allFilter);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    articles.forEach(a => {
      const cat = getCategory(a.keywords, "en"); // always key by English
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat);
  }, [articles]);

  const filtered = activeTopic === t.allFilter
    ? articles
    : articles.filter(a => getCategory(a.keywords, "en") === activeTopic);

  const hasUk = articles.some(a => a.translations?.uk);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg, #0a0a0f)", color: "var(--text, #e2e8f0)" }}>

      {/* ── Back to site ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px 0" }}>
        <a href={`/${locale}`} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          color: "#64748b", textDecoration: "none", fontSize: 14,
          transition: "color 0.15s",
        }}
          onMouseOver={e => (e.currentTarget as HTMLElement).style.color = "#94a3b8"}
          onMouseOut={e => (e.currentTarget as HTMLElement).style.color = "#64748b"}
        >
          {t.backSite}
        </a>
      </div>

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(180deg, rgba(124,58,237,0.12) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "40px 24px 40px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div style={{
              display: "inline-flex", alignItems: "center",
              background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: 20, padding: "4px 16px",
              fontSize: 12, fontWeight: 600, color: "var(--primary, #a855f7)",
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              {t.badge}
            </div>

            {hasUk && (
              <div style={{
                display: "inline-flex",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, overflow: "hidden",
              }}>
                {(["en", "uk"] as const).map(l => {
                  const active = l === locale;
                  return (
                    <a key={l} href={`/${l}/blog`} style={{
                      display: "inline-flex", alignItems: "center",
                      padding: "7px 16px", fontSize: 12,
                      fontWeight: active ? 700 : 400,
                      color: active ? "var(--primary, #a855f7)" : "#64748b",
                      background: active ? "rgba(124,58,237,0.18)" : "transparent",
                      textDecoration: "none",
                      borderRight: l === "en" ? "1px solid rgba(255,255,255,0.1)" : "none",
                    }}>
                      {l === "en" ? "🇬🇧 EN" : "🇺🇦 УКР"}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <h1 style={{
            fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, lineHeight: 1.15,
            letterSpacing: "-0.02em", marginBottom: 14,
            background: "linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            {t.heading}
          </h1>
          <p style={{ fontSize: 17, color: "#64748b", lineHeight: 1.6, maxWidth: 560 }}>
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* ── Filters ── */}
      {categories.length > 1 && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 0" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[t.allFilter, ...categories].map((cat, i) => {
              const isAll = i === 0;
              const enKey = isAll ? t.allFilter : cat;
              const displayLabel = isAll ? t.allFilter : getCategoryLabel(cat, locale);
              const count = isAll ? articles.length : articles.filter(a => getCategory(a.keywords, "en") === cat).length;
              const active = activeTopic === enKey;
              return (
                <button key={cat}
                  onClick={() => setActiveTopic(enKey)}
                  style={{
                    padding: "7px 16px", borderRadius: 8,
                    border: active ? "1px solid var(--primary, #a855f7)" : "1px solid rgba(255,255,255,0.1)",
                    background: active ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.04)",
                    color: active ? "var(--primary, #a855f7)" : "#94a3b8",
                    fontSize: 13, fontWeight: active ? 600 : 400,
                    cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                  }}
                >
                  {displayLabel} <span style={{ opacity: 0.5, fontSize: 11 }}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Grid ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 80px" }}>
        {filtered.length === 0 ? (
          <p style={{ color: "#475569", fontSize: 16, textAlign: "center", padding: "80px 0" }}>{t.noArticles}</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {filtered.map(article => <ArticleCard key={article.id} article={article} locale={locale} t={t} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleCard({ article, locale, t }: { article: Article; locale: Locale; t: typeof T[Locale] }) {
  const isPillar = article.article_type === "pillar";
  const categoryLabel = getCategory(article.keywords, locale);
  const displayTitle = getDisplayTitle(article, locale);
  const displayDesc = getDisplayDesc(article, locale);

  return (
    <Link href={`/${locale}/blog/${article.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <article
        style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16, overflow: "hidden", cursor: "pointer",
          transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
          height: "100%", display: "flex", flexDirection: "column",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(-2px)";
          el.style.borderColor = "rgba(124,58,237,0.4)";
          el.style.boxShadow = "0 8px 32px rgba(124,58,237,0.12)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(0)";
          el.style.borderColor = "rgba(255,255,255,0.07)";
          el.style.boxShadow = "none";
        }}
      >
        {/* Hero Image */}
        <div style={{ position: "relative", paddingBottom: "52%", background: "rgba(124,58,237,0.06)", flexShrink: 0 }}>
          {article.hero_image_url ? (
            <img src={article.hero_image_url} alt={displayTitle}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              loading="lazy" />
          ) : (
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.06) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 44, opacity: 0.22 }}>{isPillar ? "📘" : "📄"}</span>
            </div>
          )}

          {/* Category badge */}
          <div style={{
            position: "absolute", top: 10, left: 10,
            background: "rgba(10,10,15,0.8)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#cbd5e1", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.04em", padding: "3px 10px", borderRadius: 6,
          }}>
            {categoryLabel}
          </div>

          {isPillar && (
            <div style={{
              position: "absolute", top: 10, right: 10,
              background: "rgba(6,182,212,0.85)", backdropFilter: "blur(8px)",
              color: "white", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.06em", textTransform: "uppercase",
              padding: "3px 9px", borderRadius: 6,
            }}>
              {t.guide}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h2 style={{
            fontSize: 16, fontWeight: 700, lineHeight: 1.4,
            color: "#f1f5f9", margin: "0 0 8px",
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {displayTitle}
          </h2>

          {displayDesc && (
            <p style={{
              fontSize: 13, color: "#64748b", lineHeight: 1.55,
              margin: "0 0 14px", flex: 1,
              display: "-webkit-box", WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {displayDesc}
            </p>
          )}

          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            fontSize: 12, color: "#475569",
            marginTop: "auto", paddingTop: 12,
            borderTop: "1px solid rgba(255,255,255,0.05)",
            flexWrap: "wrap",
          }}>
            <span>🕐 {readingTime(article.word_count, locale)}</span>
            <span>·</span>
            <span>{(article.word_count ?? 0).toLocaleString()} {t.words}</span>
            {article.published_at && (
              <>
                <span>·</span>
                <span>{formatDate(article.published_at, locale)}</span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
