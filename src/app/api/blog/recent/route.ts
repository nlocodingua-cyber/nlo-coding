import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const locale = new URL(request.url).searchParams.get("locale") || "en";
  const websiteId = process.env.NEXT_PUBLIC_BLOG_WEBSITE_ID;
  const supabase = await createClient();
  if (!supabase || !websiteId) return NextResponse.json([]);

  const { data } = await supabase
    .schema("gc")
    .from("website_articles")
    .select("id, title, slug, meta_description, published_at, word_count, article_type, hero_image_url, translations")
    .eq("website_id", websiteId)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(12);

  type Tr = { title?: string; meta_description?: string };
  const localized = (data ?? [])
    // Strict locale binding: on non-English locales only surface articles that
    // actually have a translation — never fall back to the English title.
    .filter((a) => {
      if (locale === "en") return true;
      const tr = ((a.translations ?? {}) as Record<string, Tr>)[locale];
      return Boolean(tr?.title);
    })
    .slice(0, 3)
    .map((a) => {
      const trMap = (a.translations ?? {}) as Record<string, Tr>;
      const tr = locale !== "en" ? trMap[locale] : null;
      return {
        id: a.id,
        title: tr?.title || a.title,
        slug: a.slug,
        meta_description: tr?.meta_description || a.meta_description,
        published_at: a.published_at,
        word_count: a.word_count,
        article_type: a.article_type,
        hero_image_url: a.hero_image_url,
      };
    });

  return NextResponse.json(localized);
}
