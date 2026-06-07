import Link from "next/link";

/**
 * RelatedArticles — блок «Читайте також» під статтею: до 3 карток
 * споріднених статей того ж сайту (за збігом keywords). Картки з hero-зображенням,
 * заголовком і описом — у стилі блок-карток лендінгу.
 */

export type RelatedItem = {
  slug: string;
  title: string;
  heroImageUrl: string | null;
  metaDescription: string | null;
};

export function RelatedArticles({
  items,
  locale,
  heading,
}: {
  items: RelatedItem[];
  locale: string;
  heading: string;
}) {
  if (!items.length) return null;

  return (
    <section
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "8px 24px 72px",
      }}
    >
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#f1f5f9",
          margin: "0 0 24px",
          paddingBottom: 12,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {heading}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {items.map((a) => (
          <Link
            key={a.slug}
            href={`/${locale}/blog/${a.slug}`}
            style={{ textDecoration: "none", display: "block" }}
          >
            <article
              style={{
                background: "rgba(139,92,246,0.06)",
                border: "1px solid rgba(139,92,246,0.12)",
                borderRadius: 14,
                overflow: "hidden",
                height: "100%",
                transition: "border-color 0.2s, background 0.2s",
              }}
            >
              {a.heroImageUrl && (
                <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.heroImageUrl}
                    alt={a.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}
              <div style={{ padding: "16px 20px" }}>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#f1f5f9",
                    margin: "0 0 8px",
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {a.title}
                </h3>
                {a.metaDescription && (
                  <p
                    style={{
                      fontSize: 13.5,
                      color: "#94a3b8",
                      margin: 0,
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {a.metaDescription}
                  </p>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
