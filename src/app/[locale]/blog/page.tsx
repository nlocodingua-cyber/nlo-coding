import { createClient } from "@/lib/supabase/server";
import { BlogList } from "./BlogList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Expert Articles & Guides",
  description: "In-depth articles, practical guides and real-world insights from our experts.",
};

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  const websiteId = process.env.NEXT_PUBLIC_BLOG_WEBSITE_ID;

  const articles = supabase && websiteId
    ? (await supabase
        .schema("gc")
        .from("website_articles")
        .select("id, title, slug, meta_description, published_at, word_count, article_type, hero_image_url, keywords, translations")
        .eq("website_id", websiteId)
        .eq("status", "published")
        .order("published_at", { ascending: false })
      ).data
    : null;

  return <BlogList articles={articles ?? []} locale={locale} />;
}
