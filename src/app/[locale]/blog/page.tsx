import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  const websiteId = process.env.NEXT_PUBLIC_BLOG_WEBSITE_ID;

  const { data: articles } = await supabase
    .schema("gc")
    .from("website_articles")
    .select("id, title, slug, meta_description, published_at, word_count, article_type")
    .eq("website_id", websiteId!)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Blog</h1>
      <p style={{ fontSize: 16, color: "#94a3b8", marginBottom: 40 }}>Expert insights and guides</p>
      <div style={{ display: "grid", gap: 24 }}>
        {(articles ?? []).map((article) => (
          <Link key={article.id} href={`/${locale}/blog/${article.slug}`} style={{ textDecoration: "none" }}>
            <article style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: "24px 28px",
            }}>
              <span style={{ fontSize: 12, color: "#00f0ff", textTransform: "uppercase", letterSpacing: 1 }}>
                {article.article_type === "pillar" ? "Guide" : "Article"}
              </span>
              <h2 style={{ fontSize: 20, fontWeight: 600, margin: "8px 0", color: "#f1f5f9" }}>{article.title}</h2>
              {article.meta_description && (
                <p style={{ fontSize: 15, color: "#94a3b8", margin: "0 0 12px" }}>{article.meta_description}</p>
              )}
              <div style={{ fontSize: 13, color: "#64748b" }}>
                {article.published_at ? new Date(article.published_at).toLocaleDateString(locale) : ""} · {article.word_count} words
              </div>
            </article>
          </Link>
        ))}
        {(!articles || articles.length === 0) && (
          <p style={{ color: "#64748b" }}>No articles yet.</p>
        )}
      </div>
    </main>
  );
}
