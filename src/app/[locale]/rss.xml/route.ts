import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/seo/blog";

/**
 * RSS-стрічка блогу, окрема на кожну мову.
 *
 * Потрібна не читачам у рідері, а машинам: агрегатори й ШІ-пошуковики беруть
 * свіжі матеріали саме зі стрічки, і вона ж дає готовий список адрес для
 * миттєвої подачі в індекс.
 */
export const revalidate = 3600;

const WEBSITE_ID = process.env.NEXT_PUBLIC_BLOG_WEBSITE_ID!;
const LIMIT = 50;

type Row = {
  slug: string;
  title: string;
  meta_description: string | null;
  published_at: string | null;
  hero_image_url: string | null;
  tr_title: string | null;
  tr_desc: string | null;
};

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data } = supabase
    ? await supabase
        .schema("gc")
        .from("website_articles")
        .select(
          "slug, title, meta_description, published_at, hero_image_url, " +
            `tr_title:translations->${locale}->>title, ` +
            `tr_desc:translations->${locale}->>meta_description`,
        )
        .eq("website_id", WEBSITE_ID)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(LIMIT)
    : { data: [] };

  const rows = (data ?? []) as unknown as Row[];
  // Іншими мовами віддаємо лише те, що справді перекладено: англійський текст
  // під українською адресою — це не «краще, ніж нічого», це підміна.
  const items = rows.filter((r) => locale === SITE.sourceLocale || Boolean(r.tr_title));

  const self = `${SITE.url}/${locale}/rss.xml`;
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)}</title>
    <link>${SITE.url}/${locale}/blog</link>
    <description>${esc(SITE.name)} — ${locale === "uk" ? "блог" : locale === "ru" ? "блог" : "blog"}</description>
    <language>${locale}</language>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
${items
  .map((r) => {
    const title = r.tr_title || r.title;
    const description = r.tr_desc || r.meta_description || "";
    const url = `${SITE.url}/${locale}/blog/${r.slug}`;
    const date = r.published_at ? new Date(r.published_at).toUTCString() : "";
    return `    <item>
      <title>${esc(title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(description)}</description>${date ? `\n      <pubDate>${date}</pubDate>` : ""}${
        r.hero_image_url ? `\n      <enclosure url="${esc(r.hero_image_url)}" type="image/jpeg" />` : ""
      }
    </item>`;
  })
  .join("\n")}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
