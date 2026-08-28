import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { marked } from "marked";
import { ArticleView } from "./ArticleView";
import type { RelatedItem } from "@/components/blog/RelatedArticles";
import type { Preview } from "@/components/blog/LinkPreview";
import {
  articleJsonLd,
  articleMetadata,
  displayTitle,
  type SeoRow,
} from "@/lib/seo/blog";

type Props = { params: Promise<{ locale: string; slug: string }> };

type Tr = { title?: string; content_md?: string; meta_description?: string };
type Row = {
  slug: string;
  title: string;
  content_md: string | null;
  meta_description: string | null;
  hero_image_url: string | null;
  keywords: string[] | null;
  article_type: string | null;
  published_at: string | null;
  word_count: number | null;
  translations: Record<string, Tr> | null;
};

/** Легкий рядок для «читайте також» і hover-мініатюр: без тіла статті. */
type ListRow = {
  slug: string;
  title: string;
  meta_description: string | null;
  hero_image_url: string | null;
  keywords: string[] | null;
  published_at: string | null;
  tr_title: string | null;
  tr_desc: string | null;
};

const WEBSITE_ID = process.env.NEXT_PUBLIC_BLOG_WEBSITE_ID!;

/** Колонки, потрібні для метадати й structured data. */
const SEO_COLUMNS =
  "slug, title, meta_title, meta_description, keywords, hero_image_url, hero_image_alt, published_at, updated_at, word_count, translations";

/**
 * Колонки для списку сусідніх статей.
 *
 * Тіло статті сюди не входить навмисно: у translations лежить повний текст
 * усіма мовами, і вибірка «всі статті разом із translations» роздувала
 * сторінку до мегабайта. Потрібні лише заголовок і опис потрібною мовою.
 */
const listColumns = (locale: string) =>
  "slug, title, meta_description, hero_image_url, keywords, published_at, " +
  `tr_title:translations->${locale}->>title, ` +
  `tr_desc:translations->${locale}->>meta_description`;

function trOf(row: Row, locale: string): Tr | null {
  return locale !== "en" ? row.translations?.[locale] ?? null : null;
}

const STOP = new Set([
  "the", "and", "for", "with", "what", "are", "you", "your", "how", "this", "that",
  "guide", "expert", "2026", "тощо", "для", "що", "як", "це", "які", "гайд",
]);
function tokens(s: string): string[] {
  return (s.toLowerCase().match(/[a-zа-яіїєґ0-9]+/giu) || []).filter(
    (t) => t.length > 2 && !STOP.has(t)
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createClient();
  if (!supabase) return {};
  const { data } = await supabase
    .schema("gc")
    .from("website_articles")
    .select(SEO_COLUMNS)
    .eq("slug", slug)
    .eq("website_id", WEBSITE_ID)
    .eq("status", "published")
    .maybeSingle();
  if (!data) return {};
  return articleMetadata(data as unknown as SeoRow, locale);
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();

  // Сама стаття — з текстом; сусідні — окремим легким запитом.
  const [{ data: articleData }, { data: listData }] = await Promise.all([
    supabase
      .schema("gc")
      .from("website_articles")
      .select(
        "slug, title, meta_title, meta_description, keywords, hero_image_url, hero_image_alt, article_type, published_at, updated_at, word_count, content_md, translations"
      )
      .eq("website_id", WEBSITE_ID)
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle(),
    supabase
      .schema("gc")
      .from("website_articles")
      .select(listColumns(locale))
      .eq("website_id", WEBSITE_ID)
      .eq("status", "published"),
  ]);

  if (!articleData) notFound();
  const article = articleData as unknown as Row;
  const seoRow = articleData as unknown as SeoRow;
  const rows = (listData ?? []) as unknown as ListRow[];

  // ── Локалізований контент ──
  const tr = trOf(article, locale);
  const shownTitle = displayTitle(seoRow, locale);
  const displayContent = tr?.content_md || article.content_md || "";

  const cleanContent = displayContent
    .replace(/^```(?:markdown)?\s*\n/, "")
    .replace(/\n```\s*$/, "")
    .trim();

  const htmlContent = cleanContent ? await marked(cleanContent) : "";

  // ── TOC: H2 заголовки ──
  const headings: { id: string; text: string }[] = [];
  const headingRegex = /<h2[^>]*>(.*?)<\/h2>/gi;
  let match;
  let headingIndex = 0;
  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const raw = match[1].replace(/<[^>]*>/g, "").trim();
    const text = raw
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
    headings.push({ id: `section-${headingIndex++}`, text });
  }

  let sectionCounter = 0;
  const htmlWithIds = htmlContent.replace(
    /<h2([^>]*)>(.*?)<\/h2>/gi,
    (_, attrs, content) => `<h2${attrs} id="section-${sectionCounter++}">${content}</h2>`
  );

  // Розрізнити внутрішні (з hover-мініатюрою) та зовнішні лінки
  const htmlLinked = htmlWithIds
    .replace(/<a (href="\/[^"]*\/blog\/[^"]+")/g, '<a class="internal-link" $1')
    .replace(/<a (href="https?:\/\/[^"]+")/g, '<a class="external-link" target="_blank" rel="noopener noreferrer" $1');

  const readingTime = Math.max(1, Math.ceil((article.word_count ?? 0) / 200));
  const isPillar = article.article_type === "pillar";
  const hasOtherLocale =
    locale === "en" ? !!article.translations?.uk : !!article.content_md;

  // ── Related: топ-3 за збігом keywords/заголовка ──
  const curTokens = new Set(tokens(`${article.title} ${(article.keywords ?? []).join(" ")}`));
  const related: RelatedItem[] = rows
    .filter((r) => r.slug !== slug)
    .map((r) => {
      const t = tokens(`${r.title} ${(r.keywords ?? []).join(" ")}`);
      let score = 0;
      for (const tok of t) if (curTokens.has(tok)) score++;
      return { r, score };
    })
    .sort((a, b) => b.score - a.score || (b.r.published_at ?? "").localeCompare(a.r.published_at ?? ""))
    .slice(0, 3)
    .map(({ r }) => ({
      slug: r.slug,
      title: r.tr_title || r.title,
      heroImageUrl: r.hero_image_url,
      metaDescription: r.tr_desc || r.meta_description,
    }));

  // ── Preview-мапа для hover-мініатюр inline-лінків ──
  const previewMap: Record<string, Preview> = {};
  for (const r of rows) {
    previewMap[r.slug] = {
      title: r.tr_title || r.title,
      heroImageUrl: r.hero_image_url,
      metaDescription: r.tr_desc || r.meta_description,
    };
  }

  // ── Автор (persona) ──
  const { data: site } = await supabase
    .schema("gc")
    .from("websites")
    .select("persona_name")
    .eq("id", WEBSITE_ID)
    .maybeSingle();
  const persona = (site?.persona_name as string) || "Олексій Ніколайчук";
  const byline = locale === "uk" ? `Експертний гайд від ${persona}` : `Expert guide by ${persona}`;
  const relatedHeading = locale === "uk" ? "Читайте також" : "Related articles";

  // Structured data: BlogPosting + хлібні крихти + FAQ, зібраний із H2-питань.
  const jsonLd = articleJsonLd(seoRow, locale, { html: htmlWithIds });

  return (
    <>
      {jsonLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <ArticleView
        article={{
          title: shownTitle,
          htmlContent: htmlLinked,
          publishedAt: article.published_at,
          wordCount: article.word_count,
          heroImageUrl: article.hero_image_url,
          isPillar,
          readingTime,
          hasOtherLocale,
        }}
        headings={headings}
        locale={locale}
        slug={slug}
        related={related}
        relatedHeading={relatedHeading}
        previewMap={previewMap}
        byline={byline}
      />
    </>
  );
}
