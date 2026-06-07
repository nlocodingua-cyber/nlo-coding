import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { marked } from "marked";
import { ArticleView } from "./ArticleView";
import type { RelatedItem } from "@/components/blog/RelatedArticles";
import type { Preview } from "@/components/blog/LinkPreview";

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

const WEBSITE_ID = process.env.NEXT_PUBLIC_BLOG_WEBSITE_ID!;

function trOf(row: Row, locale: string): Tr | null {
  return locale !== "en" ? row.translations?.[locale] ?? null : null;
}
function locTitle(row: Row, locale: string): string {
  return trOf(row, locale)?.title || row.title;
}
function locMeta(row: Row, locale: string): string | null {
  return trOf(row, locale)?.meta_description || row.meta_description;
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
    .select("title, meta_description, hero_image_url, translations")
    .eq("slug", slug)
    .eq("website_id", WEBSITE_ID)
    .single();
  if (!data) return {};
  const row = data as unknown as Row;
  const title = locTitle(row, locale);
  const description = locMeta(row, locale) ?? undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: row.hero_image_url ? [row.hero_image_url] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();

  // Один запит — усі статті сайту (для самої статті, related і preview-мапи).
  const { data: rowsData } = await supabase
    .schema("gc")
    .from("website_articles")
    .select(
      "slug, title, content_md, meta_description, hero_image_url, keywords, article_type, published_at, word_count, translations"
    )
    .eq("website_id", WEBSITE_ID)
    .eq("status", "published");

  const rows = (rowsData ?? []) as unknown as Row[];
  const article = rows.find((r) => r.slug === slug);
  if (!article) notFound();

  // ── Локалізований контент ──
  const tr = trOf(article, locale);
  const displayTitle = tr?.title || article.title;
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
      title: locTitle(r, locale),
      heroImageUrl: r.hero_image_url,
      metaDescription: locMeta(r, locale),
    }));

  // ── Preview-мапа для hover-мініатюр inline-лінків ──
  const previewMap: Record<string, Preview> = {};
  for (const r of rows) {
    previewMap[r.slug] = {
      title: locTitle(r, locale),
      heroImageUrl: r.hero_image_url,
      metaDescription: locMeta(r, locale),
    };
  }

  // ── Автор (persona) ──
  const { data: site } = await supabase
    .schema("gc")
    .from("websites")
    .select("persona_name")
    .eq("id", WEBSITE_ID)
    .single();
  const persona = (site?.persona_name as string) || "Олексій Ніколайчук";
  const byline = locale === "uk" ? `Експертний гайд від ${persona}` : `Expert guide by ${persona}`;
  const relatedHeading = locale === "uk" ? "Читайте також" : "Related articles";

  return (
    <ArticleView
      article={{
        title: displayTitle,
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
  );
}
