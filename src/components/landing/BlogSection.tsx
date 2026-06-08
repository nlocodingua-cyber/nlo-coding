"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  meta_description: string | null;
  published_at: string | null;
  word_count: number | null;
  article_type: string | null;
  hero_image_url: string | null;
}

export function BlogSection({ locale }: { locale: string }) {
  const uk = locale === "uk";
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch(`/api/blog/recent?locale=${locale}`)
      .then((r) => r.json())
      .then(setArticles)
      .catch(() => {});
  }, [locale]);

  if (articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary mb-3 block">
            {uk ? "З блогу" : "From the Blog"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {uk ? "Статті про код та AI-розробку" : "Insights on code & AI development"}
          </h2>
        </div>
        <Link
          href={`/${locale}/blog`}
          className="hidden md:inline-flex items-center gap-2 text-sm text-primary hover:text-[var(--primary-hover)] transition-colors font-medium"
        >
          {uk ? "Всі статті" : "All posts"} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <Link key={a.id} href={`/${locale}/blog/${a.slug}`} className="group block h-full">
            <article className="h-full rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.03] hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-300 flex flex-col">
              {a.hero_image_url && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={a.hero_image_url}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-2 block">
                  {a.article_type === "pillar" ? (uk ? "Гайд" : "Guide") : uk ? "Стаття" : "Article"}
                </span>
                <h3 className="text-base font-semibold text-white mb-2 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {a.title}
                </h3>
                {a.meta_description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{a.meta_description}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground/70 mt-auto pt-3">
                  {a.published_at && (
                    <span>
                      {new Date(a.published_at).toLocaleDateString(uk ? "uk-UA" : "en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {a.word_count && (
                    <>
                      <span>·</span>
                      <span>
                        {Math.max(1, Math.ceil(a.word_count / 200))} {uk ? "хв" : "min"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
