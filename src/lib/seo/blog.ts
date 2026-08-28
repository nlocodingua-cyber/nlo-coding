import type { Metadata } from "next";

/**
 * SEO/GEO-шар блогу: метадата окремо для кожної мови + structured data.
 *
 * Домен зашитий навмисно. NEXT_PUBLIC_APP_URL у частині проєктів дорівнює
 * localhost, і якщо він поїде у збірку — canonical поведе краулера на localhost.
 */
export const SITE = {
  url: "https://nlocoding.com",
  name: "NLO Coding",
  locales: ["uk", "en"] as const,
  /** Мова оригіналу: у базі це базові поля, а не translations. */
  sourceLocale: "en",
  /** Кого показати читачеві, чия мова не збіглася з жодною. */
  defaultLocale: "en",
};

export type Tr = {
  title?: string;
  content_md?: string;
  meta_description?: string;
  keywords?: string[];
};

export type SeoRow = {
  slug: string;
  title: string;
  meta_title?: string | null;
  meta_description: string | null;
  keywords: string[] | null;
  hero_image_url: string | null;
  hero_image_alt?: string | null;
  published_at: string | null;
  updated_at?: string | null;
  word_count?: number | null;
  translations: Record<string, Tr> | null;
};

const OG_LOCALE: Record<string, string> = { uk: "uk_UA", en: "en_US", ru: "ru_RU" };

/** Переклад для мови. Для мови оригіналу перекладу немає — там базові поля. */
export function trOf(row: SeoRow, locale: string): Tr | null {
  return locale === SITE.sourceLocale ? null : row.translations?.[locale] ?? null;
}

/** Мови, якими стаття справді існує: вигадувати адресу під відсутній переклад не можна. */
export function localesOf(row: SeoRow): string[] {
  return SITE.locales.filter(
    (l) => l === SITE.sourceLocale || Boolean(row.translations?.[l]?.title),
  );
}

/**
 * Заголовок для видачі.
 *
 * meta_title у базі написаний під пошук («…: 2026 Guide»), а title — під верстку,
 * і в ньому трапляється «Ai» замість «AI». Для мови оригіналу беремо meta_title,
 * для решти мов — заголовок перекладу.
 */
export function seoTitle(row: SeoRow, locale: string): string {
  const tr = trOf(row, locale);
  if (tr?.title) return tr.title;
  return row.meta_title?.trim() || row.title;
}

/** Заголовок у тілі сторінки — без хвоста бренду. */
export function displayTitle(row: SeoRow, locale: string): string {
  return trOf(row, locale)?.title || row.title;
}

export function seoDescription(row: SeoRow, locale: string): string | undefined {
  return trOf(row, locale)?.meta_description || row.meta_description || undefined;
}

/**
 * Ключові слова тією ж мовою, що й сторінка.
 *
 * У базі keywords лежать лише англійською. Якщо перекладу ключових немає,
 * цільовою фразою цієї мови є її ж заголовок — це чесніше, ніж підставляти
 * англійські слова під українську сторінку.
 */
export function seoKeywords(row: SeoRow, locale: string): string[] {
  const tr = trOf(row, locale);
  if (tr?.keywords?.length) return tr.keywords;
  if (locale === SITE.sourceLocale) return row.keywords ?? [];
  const localized = tr?.title?.toLowerCase();
  return localized ? [localized] : row.keywords ?? [];
}

export const articleUrl = (locale: string, slug: string) =>
  `${SITE.url}/${locale}/blog/${slug}`;

/** hreflang-мапа: лише мови, якими стаття існує, плюс x-default. */
function languagesFor(row: SeoRow): Record<string, string> {
  const available = localesOf(row);
  const langs: Record<string, string> = {};
  for (const l of available) langs[l] = articleUrl(l, row.slug);
  const fallback = available.includes(SITE.defaultLocale) ? SITE.defaultLocale : available[0];
  if (fallback) langs["x-default"] = articleUrl(fallback, row.slug);
  return langs;
}

/** Метадата статті: свої title / description / keywords на кожну мову. */
export function articleMetadata(row: SeoRow, locale: string): Metadata {
  const title = seoTitle(row, locale);
  const description = seoDescription(row, locale);
  const keywords = seoKeywords(row, locale);
  const url = articleUrl(locale, row.slug);
  const image = row.hero_image_url;
  const alt = row.hero_image_alt || displayTitle(row, locale);

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url, languages: languagesFor(row) },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: SITE.name,
      locale: OG_LOCALE[locale] ?? locale,
      alternateLocale: localesOf(row)
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l] ?? l),
      publishedTime: row.published_at ?? undefined,
      modifiedTime: row.updated_at ?? row.published_at ?? undefined,
      images: image ? [{ url: image, alt }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

/**
 * Пари «питання — відповідь» для FAQPage.
 *
 * Основний формат у статтях — розкривний блок:
 *   <details class="faq-item"><summary>Питання</summary><div>Відповідь</div></details>
 * Запасний — заголовок H2, що є питанням, і текст під ним. Саме такі пари
 * ШІ-пошуковики цитують охоче: з них видно готову відповідь без здогадів.
 */
export function faqFromHtml(html: string, limit = 10): { q: string; a: string }[] {
  const strip = (s: string) =>
    s
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();

  const out: { q: string; a: string }[] = [];
  const push = (q: string, a: string) => {
    if (q.length > 8 && a.length > 40 && out.length < limit) out.push({ q, a: a.slice(0, 900) });
  };

  // 1. Розкривні блоки FAQ
  const details = html.split(/<details[^>]*>/i).slice(1);
  for (const block of details) {
    const body = block.split(/<\/details>/i)[0];
    const sum = body.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i);
    if (!sum) continue;
    push(strip(sum[1]), strip(body.replace(/<summary[^>]*>[\s\S]*?<\/summary>/i, "")));
  }
  if (out.length) return out;

  // 2. Запасний варіант: H2-питання і текст під ним
  const blocks = html.split(/<h2[^>]*>/i).slice(1);
  for (const block of blocks) {
    const close = block.indexOf("</h2>");
    if (close < 0) continue;
    const q = strip(block.slice(0, close));
    if (!q.endsWith("?")) continue;
    push(q, strip(block.slice(close + 5).split(/<h[23][^>]*>/i)[0]));
  }
  return out;
}

type LdOptions = {
  /** Готовий HTML статті — з нього збирається FAQPage. */
  html?: string;
  /** Ім'я автора. Ставимо Person лише коли за іменем стоїть жива людина. */
  authorPerson?: string | null;
};

/**
 * Structured data сторінки статті.
 *
 * Автором за замовчуванням стоїть організація. Вигадану персону як Person із
 * біографією подавати не можна: для пошукових систем це заявка на досвід, якої
 * немає, і саме за такі заявки сайт летить у спам.
 */
export function articleJsonLd(
  row: SeoRow,
  locale: string,
  opts: LdOptions = {},
): Record<string, unknown>[] {
  const url = articleUrl(locale, row.slug);
  const title = displayTitle(row, locale);
  const description = seoDescription(row, locale);
  const lang = locale;

  const publisher = {
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: { "@type": "ImageObject", url: `${SITE.url}/icon.svg` },
  };

  const blogPosting: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: title.slice(0, 110),
    description,
    image: row.hero_image_url ? [row.hero_image_url] : undefined,
    datePublished: row.published_at ?? undefined,
    dateModified: row.updated_at ?? row.published_at ?? undefined,
    inLanguage: lang,
    wordCount: row.word_count ?? undefined,
    keywords: seoKeywords(row, locale).join(", ") || undefined,
    author: opts.authorPerson
      ? { "@type": "Person", name: opts.authorPerson }
      : publisher,
    publisher,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };

  const home = locale === "uk" ? "Головна" : locale === "ru" ? "Главная" : "Home";
  const blog = locale === "uk" ? "Блог" : locale === "ru" ? "Блог" : "Blog";
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: home, item: `${SITE.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: blog, item: `${SITE.url}/${locale}/blog` },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  };

  const out: Record<string, unknown>[] = [blogPosting, breadcrumb];

  const faq = opts.html ? faqFromHtml(opts.html) : [];
  if (faq.length >= 2) {
    out.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      inLanguage: lang,
      mainEntity: faq.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    });
  }

  return out;
}

/**
 * alternates для звичайної сторінки: canonical на саму себе.
 *
 * Ставити це в layout не можна: layout не знає шляху сторінки і підписує
 * canonical головної під кожною сторінкою сайту — тобто сам просить пошуковик
 * не індексувати нічого, крім головної.
 */
export function pageAlternates(locale: string, path = "") {
  const languages: Record<string, string> = {};
  for (const l of SITE.locales) languages[l] = `${SITE.url}/${l}${path}`;
  languages["x-default"] = `${SITE.url}/${SITE.defaultLocale}${path}`;
  return { canonical: `${SITE.url}/${locale}${path}`, languages };
}

/** Метадата сторінки-списку блогу — теж своя на кожну мову. */
export function blogIndexMetadata(locale: string, copy: {
  title: string;
  description: string;
}): Metadata {
  const alternates = pageAlternates(locale, "/blog");

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      ...alternates,
      // Стрічку шукають агрегатори й ШІ-пошуковики — на неї треба вказати.
      types: { "application/rss+xml": `${SITE.url}/${locale}/rss.xml` },
    },
    openGraph: {
      type: "website",
      title: copy.title,
      description: copy.description,
      url: alternates.canonical,
      siteName: SITE.name,
      locale: OG_LOCALE[locale] ?? locale,
    },
  };
}
