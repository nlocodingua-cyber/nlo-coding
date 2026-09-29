/**
 * Список джерел у кінці статті блогу.
 *
 * Перегенерація ферми дала статтям живі `source_urls`, і в тексті з'явились
 * виноски [1]..[N] за номерами цього масиву. Але блог їх не показував: поля
 * не було ні в запиті, ні в шаблоні. Для читача це виноски в нікуди — вигляд
 * роботи з джерелами, який неможливо перевірити. Тобто рівно той клас вади,
 * який перегенерація й закривала.
 */

const ПІДПИС: Record<string, string> = {
  uk: "Джерела",
  en: "Sources",
  ru: "Источники",
};

function esc(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Скільки з цих посилань справді придатні показати. */
export function живіДжерела(urls: string[] | null | undefined): string[] {
  return (urls ?? []).filter((u) => typeof u === "string" && /^https?:\/\//i.test(u));
}

/**
 * Робить виноски [N] у готовому HTML посиланнями на список джерел.
 *
 * Номер, для якого джерела немає (модель могла написати [9] на сім джерел),
 * лишається звичайним текстом: краще видима нерівність, ніж посилання в
 * порожнечу. Код не чіпаємо — у прикладах команд [1] означає індекс масиву.
 */
export function виноскиВПосилання(html: string, кількість: number): string {
  if (кількість <= 0) return html;
  const частини = html.split(/(<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>|<[^>]+>)/gi);
  return частини
    .map((ч, i) => {
      if (i % 2 === 1) return ч;
      return ч.replace(/\[(\d{1,2})\]/g, (m, n) => {
        const idx = parseInt(n, 10);
        if (idx < 1 || idx > кількість) return m;
        return `<sup class="footnote-ref"><a href="#src-${idx}">[${idx}]</a></sup>`;
      });
    })
    .join("");
}

/** Розмітка секції джерел. Порожній рядок, якщо показувати нічого. */
export function розміткаДжерел(urls: string[] | null | undefined, locale: string): string {
  const список = живіДжерела(urls);
  if (список.length === 0) return "";
  const підпис = ПІДПИС[locale] ?? ПІДПИС.en;
  const пункти = список
    .map((u, i) => {
      let хост = u;
      let шлях = "";
      try {
        const p = new URL(u);
        хост = p.hostname.replace(/^www\./, "");
        шлях = (p.pathname + p.search).replace(/\/$/, "");
      } catch {
        /* нерозбірливе посилання показуємо як є */
      }
      const короткий = шлях.length > 72 ? шлях.slice(0, 72) + "…" : шлях;
      return (
        `<li id="src-${i + 1}">` +
        `<a href="${esc(u)}" target="_blank" rel="nofollow noopener noreferrer">${esc(хост)}</a>` +
        (короткий ? `<span class="source-path">${esc(короткий)}</span>` : "") +
        `</li>`
      );
    })
    .join("");
  return (
    `<section class="article-sources" id="sources">` +
    `<h2>${esc(підпис)}</h2><ol>${пункти}</ol>` +
    `</section>`
  );
}
