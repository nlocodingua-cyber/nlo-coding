import { createClient } from "@/lib/supabase/server";
import { BlogList } from "./BlogList";
import type { Metadata } from "next";
import { blogIndexMetadata } from "@/lib/seo/blog";

/** Заголовок і опис списку — окремі для кожної мови, не переклад на льоту. */
const COPY: Record<string, { title: string; description: string }> = {
  en: {
    title: "Blog — Expert Articles & Guides",
    description:
      "In-depth articles, practical guides and real-world insights from our experts.",
  },
  uk: {
    title: "Блог — експертні статті та гайди",
    description:
      "Докладні розбори, практичні гайди та досвід із перших рук.",
  },
  ru: {
    title: "Блог — экспертные статьи и гайды",
    description:
      "Подробные разборы, практические гайды и опыт из первых рук.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return blogIndexMetadata(locale, COPY[locale] ?? COPY.en);
}

type Raw = {
  id: string;
  title: string;
  slug: string;
  meta_description: string | null;
  published_at: string | null;
  word_count: number | null;
  article_type: string | null;
  hero_image_url: string | null;
  keywords: string[] | null;
  tr_title: string | null;
  tr_desc: string | null;
  uk_title: string | null;
};

/**
 * Колонки списку.
 *
 * Колонку translations цілком тягнути не можна: у ній лежить повний текст
 * статті всіма мовами, і сторінка списку через це важила понад мегабайт.
 * Беремо лише заголовок і опис потрібною мовою плюс ознаку, що український
 * переклад узагалі є — за нею список вирішує, чи показувати перемикач мов.
 */
const listColumns = (locale: string) =>
  "id, title, slug, meta_description, published_at, word_count, article_type, " +
  "hero_image_url, keywords, " +
  `tr_title:translations->${locale}->>title, ` +
  `tr_desc:translations->${locale}->>meta_description, ` +
  "uk_title:translations->uk->>title";

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  const websiteId = process.env.NEXT_PUBLIC_BLOG_WEBSITE_ID;

  const raw = supabase && websiteId
    ? (await supabase
        .schema("gc")
        .from("website_articles")
        .select(listColumns(locale))
        .eq("website_id", websiteId)
        .eq("status", "published")
        .order("published_at", { ascending: false })
      ).data as unknown as Raw[] | null
    : null;

  // Повертаємо формі translations вигляд, якого чекає список: спершу ознака
  // українського перекладу, потім поточна мова — щоб на /uk другий не затер опис.
  const articles = (raw ?? []).map((r) => {
    const translations: Record<string, { title?: string; meta_description?: string }> = {};
    if (r.uk_title) translations.uk = { title: r.uk_title };
    if (r.tr_title || r.tr_desc) {
      translations[locale] = {
        title: r.tr_title ?? undefined,
        meta_description: r.tr_desc ?? undefined,
      };
    }
    return {
      id: r.id,
      title: r.title,
      slug: r.slug,
      meta_description: r.meta_description,
      published_at: r.published_at,
      word_count: r.word_count,
      article_type: r.article_type,
      hero_image_url: r.hero_image_url,
      keywords: r.keywords,
      translations,
    };
  });

  return <BlogList articles={articles} locale={locale} />;
}
