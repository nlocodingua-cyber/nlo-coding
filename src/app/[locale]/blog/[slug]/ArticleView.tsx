"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { LinkPreview, type Preview } from "@/components/blog/LinkPreview";
import { RelatedArticles, type RelatedItem } from "@/components/blog/RelatedArticles";

type Props = {
  article: {
    title: string;
    htmlContent: string;
    publishedAt: string | null;
    wordCount: number | null;
    heroImageUrl: string | null;
    isPillar: boolean;
    readingTime: number;
    hasOtherLocale: boolean;
  };
  headings: { id: string; text: string }[];
  locale: string;
  slug: string;
  related: RelatedItem[];
  relatedHeading: string;
  previewMap: Record<string, Preview>;
  byline: string;
};

const T = {
  en: {
    backBlog: "← Blog",
    backAll: "← Back to all articles",
    backSite: "← Back to site",
    guide: "📘 Guide",
    article: "📄 Article",
    minRead: "min read",
    words: "words",
    toc: "Table of Contents",
    switchTo: (slug: string) => `🇺🇦 Read in Ukrainian`,
  },
  uk: {
    backBlog: "← Блог",
    backAll: "← До всіх статей",
    backSite: "← На сайт",
    guide: "📘 Гайд",
    article: "📄 Стаття",
    minRead: "хв читання",
    words: "слів",
    toc: "Зміст",
    switchTo: (slug: string) => `🇬🇧 Read in English`,
  },
} as const;

function formatDate(date: string | null, locale: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString(locale === "uk" ? "uk-UA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      background: "rgba(255,255,255,0.06)",
      zIndex: 9999,
    }}>
      <div style={{
        height: "100%",
        width: `${progress}%`,
        background: "linear-gradient(90deg, var(--primary, #a855f7), #06b6d4)",
        transition: "width 0.1s linear",
      }} />
    </div>
  );
}

const ARTICLE_STYLES = `
  /* ── Base ── */
  .article-body { font-size: 17px; line-height: 1.8; color: #cbd5e1; }
  .article-body h2 {
    font-size: 1.5rem; font-weight: 700; color: #f1f5f9;
    margin: 2.5rem 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--primary, #a855f7);
  }
  .article-body h3 {
    font-size: 1.2rem; font-weight: 600; color: #e2e8f0;
    margin: 2rem 0 0.75rem;
  }
  .article-body p { margin-bottom: 1.25rem; }
  .article-body a { color: var(--primary, #a855f7); text-decoration: underline; text-underline-offset: 3px; }
  .article-body a:hover { opacity: 0.8; }
  .article-body ul, .article-body ol { margin: 1rem 0 1.5rem 1.5rem; }
  .article-body li { margin-bottom: 0.5rem; }
  .article-body strong { color: #f1f5f9; font-weight: 600; }
  .article-body em { color: #94a3b8; }
  .article-body code {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 2px 7px; border-radius: 5px;
    font-size: 0.88em; font-family: 'JetBrains Mono', monospace;
  }
  .article-body pre {
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; padding: 1.25rem 1.5rem;
    overflow-x: auto; margin: 1.5rem 0;
  }
  .article-body pre code { background: none; border: none; padding: 0; font-size: 0.9em; }
  .article-body blockquote {
    border-left: 3px solid var(--primary, #a855f7);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    background: rgba(124,58,237,0.06);
    border-radius: 0 8px 8px 0;
    color: #94a3b8;
    font-style: italic;
  }
  .article-body hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 2rem 0; }

  /* ── Tables ── */
  .article-body table {
    width: 100%; border-collapse: collapse;
    margin: 1.5rem 0; font-size: 0.9rem;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px; overflow: hidden;
  }
  .article-body th {
    background: rgba(124,58,237,0.12);
    padding: 12px 16px; text-align: left;
    font-weight: 600; color: #e2e8f0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .article-body td {
    padding: 11px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    color: #94a3b8;
  }
  .article-body tr:last-child td { border-bottom: none; }
  .article-body tr:hover td { background: rgba(255,255,255,0.02); }

  /* ── Callout Boxes ── */
  .callout {
    display: flex; gap: 14px;
    padding: 16px 20px; border-radius: 10px;
    margin: 1.5rem 0; border-left: 3px solid;
  }
  .callout-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 2px; }
  .callout-content { font-size: 0.93rem; line-height: 1.6; color: #cbd5e1; }
  .callout-content strong { display: block; margin-bottom: 4px; }
  .callout-tip {
    background: rgba(34,197,94,0.07);
    border-color: #22c55e;
  }
  .callout-tip .callout-content strong { color: #4ade80; }
  .callout-warning {
    background: rgba(245,158,11,0.07);
    border-color: #f59e0b;
  }
  .callout-warning .callout-content strong { color: #fbbf24; }
  .callout-info {
    background: rgba(59,130,246,0.07);
    border-color: #3b82f6;
  }
  .callout-info .callout-content strong { color: #60a5fa; }

  /* ── Stat Highlights ── */
  .stat-highlight {
    display: flex; flex-direction: column; align-items: center;
    text-align: center;
    background: rgba(124,58,237,0.08);
    border: 1px solid rgba(124,58,237,0.2);
    border-radius: 12px;
    padding: 24px 32px;
    margin: 1.5rem 0;
  }
  .stat-number {
    font-size: 3rem; font-weight: 800;
    background: linear-gradient(135deg, var(--primary, #a855f7), #06b6d4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
    margin-bottom: 8px;
  }
  .stat-label {
    font-size: 0.95rem; color: #64748b;
    max-width: 280px; line-height: 1.4;
  }

  /* ── FAQ ── */
  details.faq-item {
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px; margin-bottom: 10px;
    overflow: hidden;
  }
  details.faq-item summary {
    padding: 16px 20px; cursor: pointer;
    font-weight: 600; color: #e2e8f0;
    font-size: 0.97rem;
    list-style: none;
    display: flex; justify-content: space-between; align-items: center;
    user-select: none;
  }
  details.faq-item summary::-webkit-details-marker { display: none; }
  details.faq-item summary::after {
    content: '+';
    font-size: 1.2rem; color: var(--primary, #a855f7);
    transition: transform 0.2s;
    flex-shrink: 0;
  }
  details.faq-item[open] summary::after { content: '−'; }
  .faq-answer {
    padding: 0 20px 16px;
    font-size: 0.93rem; color: #94a3b8; line-height: 1.65;
  }
  details.faq-item[open] { background: rgba(255,255,255,0.02); }

  /* ── Sources ── */
  .article-body h2#sources, .article-body h2:has(+ ol a[href]) {
    font-size: 1.1rem; color: #64748b;
    border-color: rgba(255,255,255,0.08);
  }

  /* ── Internal links (з hover-мініатюрою) ── */
  .internal-link {
    border-bottom: 1px dashed rgba(168,85,247,0.7);
    text-decoration: none;
    color: var(--primary, #a855f7);
    font-weight: 500;
    border-radius: 2px;
    transition: background 0.15s, border-color 0.15s;
  }
  .internal-link:hover {
    background: rgba(168,85,247,0.12);
    border-bottom-color: var(--primary, #a855f7);
    opacity: 1;
  }
  /* ── External links (джерела, нова вкладка) ── */
  .external-link::after {
    content: " ↗";
    font-size: 0.78em;
    opacity: 0.6;
  }
`;

export function ArticleView({ article, headings, locale, slug, related, relatedHeading, previewMap, byline }: Props) {
  const [activeId, setActiveId] = useState<string>("");
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0% -70% 0%", threshold: 0 }
    );
    document.querySelectorAll(".article-body h2[id]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const { title, htmlContent, publishedAt, wordCount, heroImageUrl, isPillar, readingTime, hasOtherLocale } = article;
  const t = locale === "uk" ? T.uk : T.en;
  const otherLocale = locale === "en" ? "uk" : "en";

  return (
    <>
      <style>{ARTICLE_STYLES}</style>
      <ReadingProgress />
      <ShareButtons title={article.title} />
      <LinkPreview map={previewMap} byline={byline} />

      <div style={{ minHeight: "100vh", background: "var(--bg, #0a0a0f)", color: "var(--text, #e2e8f0)" }}>

        {/* ── Back to Blog + Locale Switcher ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <Link href={`/${locale}/blog`} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "#64748b", textDecoration: "none", fontSize: 14,
            transition: "color 0.15s",
          }}>
            {t.backBlog}
          </Link>
          {hasOtherLocale && (
            <div style={{
              display: "inline-flex",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, overflow: "hidden",
            }}>
              {(["en", "uk"] as const).map(l => {
                const active = l === locale;
                return (
                  <a
                    key={l}
                    href={`/${l}/blog/${slug}`}
                    style={{
                      display: "inline-flex", alignItems: "center",
                      padding: "6px 14px",
                      fontSize: 12,
                      fontWeight: active ? 700 : 400,
                      color: active ? "var(--primary, #a855f7)" : "#64748b",
                      background: active ? "rgba(124,58,237,0.18)" : "transparent",
                      textDecoration: "none",
                      borderRight: l === "en" ? "1px solid rgba(255,255,255,0.1)" : "none",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {l === "en" ? "🇬🇧 EN" : "🇺🇦 УКР"}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Hero Image ── */}
        {heroImageUrl && (
          <div style={{ maxWidth: 1200, margin: "24px auto 0", padding: "0 24px" }}>
            <div style={{
              borderRadius: 16, overflow: "hidden",
              position: "relative", paddingBottom: "42%",
              background: "rgba(124,58,237,0.08)",
            }}>
              <img
                src={heroImageUrl}
                alt={title}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(0deg, rgba(10,10,15,0.7) 0%, transparent 60%)",
              }} />
            </div>
          </div>
        )}

        {/* ── Article Header ── */}
        <div style={{ maxWidth: 860, margin: "0 auto", padding: heroImageUrl ? "32px 24px 0" : "48px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{
              background: isPillar ? "rgba(6,182,212,0.15)" : "rgba(124,58,237,0.15)",
              border: isPillar ? "1px solid rgba(6,182,212,0.3)" : "1px solid rgba(124,58,237,0.3)",
              color: isPillar ? "#22d3ee" : "var(--primary, #a855f7)",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.07em",
              textTransform: "uppercase", padding: "4px 12px", borderRadius: 20,
            }}>
              {isPillar ? t.guide : t.article}
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(24px, 4vw, 40px)",
            fontWeight: 800, lineHeight: 1.25,
            letterSpacing: "-0.02em", color: "#f1f5f9",
            marginBottom: 20,
          }}>
            {title}
          </h1>

          <div style={{
            display: "flex", flexWrap: "wrap", gap: 16,
            fontSize: 13, color: "#64748b",
            paddingBottom: 24,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            marginBottom: 0,
          }}>
            {publishedAt && <span>📅 {formatDate(publishedAt, locale)}</span>}
            <span>🕐 {readingTime} {t.minRead}</span>
            {wordCount && <span>📝 {wordCount.toLocaleString()} {t.words}</span>}
          </div>
        </div>

        {/* ── Layout: Article + TOC ── */}
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px",
          display: "grid",
          gridTemplateColumns: headings.length > 2 ? "1fr 260px" : "1fr",
          gap: 48,
          alignItems: "start",
        }}>

          {/* Article Body */}
          <article
            className="article-body"
            style={{ paddingTop: 36, minWidth: 0 }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* TOC Sidebar */}
          {headings.length > 2 && (
            <aside style={{
              position: "sticky", top: 80,
              paddingTop: 36,
            }}>
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: "20px 20px",
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "#475569",
                  marginBottom: 16,
                }}>
                  {t.toc}
                </div>
                <nav>
                  {headings.map(h => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      style={{
                        display: "block",
                        padding: "6px 10px",
                        borderRadius: 6,
                        fontSize: 13,
                        lineHeight: 1.4,
                        color: activeId === h.id ? "var(--primary, #a855f7)" : "#64748b",
                        textDecoration: "none",
                        borderLeft: activeId === h.id ? "2px solid var(--primary, #a855f7)" : "2px solid transparent",
                        background: activeId === h.id ? "rgba(124,58,237,0.06)" : "transparent",
                        transition: "all 0.15s",
                        marginBottom: 2,
                      }}
                      onClick={e => {
                        e.preventDefault();
                        const el = document.getElementById(h.id);
                        if (!el) return;
                        const offset = 90;
                        const top = el.getBoundingClientRect().top + window.scrollY - offset;
                        window.scrollTo({ top, behavior: "smooth" });
                      }}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>

        <RelatedArticles items={related} locale={locale} heading={relatedHeading} />

        {/* ── Footer navigation ── */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "32px 24px",
          maxWidth: 860, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <Link href={`/${locale}/blog`} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            color: "var(--primary, #a855f7)", textDecoration: "none",
            fontSize: 14, fontWeight: 500,
          }}>
            {t.backAll}
          </Link>
          <a href={`/${locale}`} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "#64748b", textDecoration: "none", fontSize: 14,
          }}>
            {t.backSite}
          </a>
        </div>
      </div>
    </>
  );
}