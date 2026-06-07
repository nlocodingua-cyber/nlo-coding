"use client";

import { useEffect, useRef, useState } from "react";

/**
 * LinkPreview — hover-мініатюра для inline-лінків у тілі статті (як на aisaasbox.com).
 * Делегує наведення на всі <a href*="/blog/"> усередині .article-body і показує
 * картку: hero-зображення + заголовок + опис + рядок автора.
 * Дані беруться з map (slug → preview), який готує серверний page.tsx.
 */

export type Preview = {
  title: string;
  heroImageUrl: string | null;
  metaDescription: string | null;
};

const CARD_W = 340;
const CARD_H = 300;

export function LinkPreview({
  map,
  byline,
}: {
  map: Record<string, Preview>;
  byline: string;
}) {
  const [active, setActive] = useState<{
    p: Preview;
    left: number;
    top: number;
    placement: "top" | "bottom";
  } | null>(null);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const body = document.querySelector(".article-body");
    if (!body) return;

    function slugFromHref(href: string): string | null {
      try {
        const path = href.startsWith("http") ? new URL(href).pathname : href;
        const parts = path.split("#")[0].split("?")[0].split("/").filter(Boolean);
        const i = parts.indexOf("blog");
        if (i >= 0 && parts[i + 1]) return parts[i + 1];
        return parts[parts.length - 1] || null;
      } catch {
        return null;
      }
    }

    // Префетч hero всіх внутрішніх лінків + позначення класом
    const preloaded = new Set<string>();
    body.querySelectorAll('a[href*="/blog/"]').forEach((a) => {
      a.classList.add("internal-link");
      const slug = slugFromHref(a.getAttribute("href") || "");
      const hero = slug && map[slug]?.heroImageUrl;
      if (hero && !preloaded.has(hero)) {
        preloaded.add(hero);
        const img = new Image();
        img.src = hero;
      }
    });

    // Делегування на контейнер — ловить hover на ВСІХ лінках (навіть у callout/FAQ)
    function onOver(e: Event) {
      const a = (e.target as Element)?.closest?.('a[href*="/blog/"]') as HTMLAnchorElement | null;
      if (!a || !body!.contains(a)) return;
      const slug = slugFromHref(a.getAttribute("href") || "");
      if (!slug || !map[slug]) return;
      const r = a.getBoundingClientRect();
      let left = r.left + r.width / 2 - CARD_W / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - CARD_W - 12));
      const placement: "top" | "bottom" = r.top > CARD_H + 16 ? "top" : "bottom";
      const top = placement === "top" ? r.top - 10 : r.bottom + 10;
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      setActive({ p: map[slug], left, top, placement });
    }
    function onOut(e: Event) {
      const a = (e.target as Element)?.closest?.('a[href*="/blog/"]');
      if (!a) return;
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setActive(null), 120);
    }

    body.addEventListener("mouseover", onOver);
    body.addEventListener("mouseout", onOut);
    return () => {
      body.removeEventListener("mouseover", onOver);
      body.removeEventListener("mouseout", onOut);
    };
  }, [map]);

  if (!active) return null;
  const { p, left, top, placement } = active;

  return (
    <div
      style={{
        position: "fixed",
        left,
        top,
        transform: placement === "top" ? "translateY(-100%)" : "none",
        width: CARD_W,
        zIndex: 100,
        pointerEvents: "none",
        background: "#0d1117",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
        animation: "lp-fade 0.14s ease",
      }}
    >
      <style>{`@keyframes lp-fade { from { opacity: 0 } to { opacity: 1 } }`}</style>
      <div
        style={{
          aspectRatio: "16/9",
          overflow: "hidden",
          background: "linear-gradient(135deg,#1e1b4b,#312e81)",
        }}
      >
        {p.heroImageUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={p.heroImageUrl}
            alt=""
            loading="eager"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#f1f5f9",
            lineHeight: 1.35,
            marginBottom: 6,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {p.title}
        </div>
        {p.metaDescription && (
          <div
            style={{
              fontSize: 13,
              color: "#94a3b8",
              lineHeight: 1.5,
              marginBottom: 8,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {p.metaDescription}
          </div>
        )}
        <div style={{ fontSize: 12, color: "#64748b" }}>{byline}</div>
      </div>
    </div>
  );
}
