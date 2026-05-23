import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .schema("gc")
    .from("website_articles")
    .select("title, meta_description")
    .eq("slug", slug)
    .eq("website_id", process.env.NEXT_PUBLIC_BLOG_WEBSITE_ID!)
    .single();
  if (!data) return {};
  return { title: data.title, description: data.meta_description ?? undefined };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .schema("gc")
    .from("website_articles")
    .select("title, content_md, published_at, word_count")
    .eq("slug", slug)
    .eq("website_id", process.env.NEXT_PUBLIC_BLOG_WEBSITE_ID!)
    .single();
  if (!article) notFound();
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
      <nav style={{ marginBottom: 24, fontSize: 14 }}>
        <a href={`/${locale}/blog`} style={{ color: "#00f0ff" }}>← Blog</a>
      </nav>
      <h1 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.3, marginBottom: 16 }}>{article.title}</h1>
      <div style={{ fontSize: 14, color: "#64748b", marginBottom: 40 }}>
        {article.published_at ? new Date(article.published_at).toLocaleDateString(locale) : ""} · {article.word_count} words
      </div>
      <div
        style={{ fontSize: 17, lineHeight: 1.8, color: "#cbd5e1" }}
        dangerouslySetInnerHTML={{ __html: article.content_md ?? "" }}
      />
    </main>
  );
}
