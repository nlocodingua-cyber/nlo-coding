import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

// Домен зашитий навмисно: NEXT_PUBLIC_APP_URL локально дорівнює localhost,
// і якщо він же поїде у збірку — мапа сайту вкаже краулеру на localhost.
const BASE_URL = "https://nlocoding.com";
const LOCALES = ["uk", "en"] as const;
const WEBSITE_ID =
  process.env.NEXT_PUBLIC_BLOG_WEBSITE_ID ?? "7e97a510-bb9c-4a0e-9e89-fd080d84d42d";

/** Публічні сторінки. /thank-you та службові екрани в мапу не йдуть. */
const PAGES = [
  "",
  "/about",
  "/ai-agents",
  "/automation",
  "/cases",
  "/booking",
  "/contact",
  "/blog",
  "/privacy",
  "/terms",
  "/cookies",
];

// ISR: авто-опубліковані статті потрапляють у мапу без передеплою.
export const revalidate = 3600;

type Row = {
  slug: string;
  published_at: string | null;
  translations: Record<string, unknown> | null;
};

/** Статті читає anon-ключ — RLS віддає лише status='published'. */
async function fetchArticles(): Promise<Row[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  try {
    const { data } = await createClient(url, key, {
      db: { schema: "gc" },
      auth: { persistSession: false, autoRefreshToken: false },
    })
      .from("website_articles")
      .select("slug, published_at, translations")
      .eq("website_id", WEBSITE_ID)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    return (data ?? []) as Row[];
  } catch {
    // Мапа з самих лише статичних сторінок краща за 500 на /sitemap.xml.
    return [];
  }
}

const alternatesFor = (path: string, locales: readonly string[]) => ({
  languages: {
    ...Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}${path}`])),
    // x-default = мова оригіналу: статті пишуться англійською, і саме її
    // має бачити читач, чия мова не збіглася з жодною. Те саме значення
    // стоїть на самих сторінках — суперечливий hreflang Google ігнорує.
    "x-default": `${BASE_URL}/en${path}`,
  },
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of PAGES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency:
          path === "" ? "weekly" : path === "/blog" ? "daily" : "monthly",
        priority: path === "" ? 1 : path === "/blog" ? 0.8 : 0.5,
        alternates: alternatesFor(path, LOCALES),
      });
    }
  }

  for (const row of await fetchArticles()) {
    const path = `/blog/${row.slug}`;
    const lastModified = row.published_at ? new Date(row.published_at) : now;
    // uk-адресу подаємо лише коли переклад справді існує, інакше краулер
    // отримає англійський текст під українською адресою.
    const available = LOCALES.filter(
      (l) => l === "en" || Boolean(row.translations?.[l]),
    );

    for (const locale of available) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: alternatesFor(path, available),
      });
    }
  }

  return entries;
}
