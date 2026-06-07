"use client";

import { useEffect, useState, type ReactNode, type CSSProperties } from "react";

/**
 * ShareButtons — вертикальний стовпчик кнопок «поділитись» (як blog.sandler.com.ua).
 * Sticky збоку від статті: Facebook, X, Telegram, LinkedIn, Copy link.
 * Ховається на вузьких екранах (<1180px), де поряд зі статтею немає місця.
 */

type Btn = { key: string; bg: string; href?: string; label: string };

const ICON: Record<string, ReactNode> = {
  fb: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  ),
  x: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93Zm-1.29 19.5h2.04L6.48 3.24H4.29L17.61 20.65Z" />
    </svg>
  ),
  tg: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.91 3.79 20.3 20.84c-.25 1.21-.98 1.5-1.99.94l-5.5-4.07-2.66 2.57c-.3.3-.55.56-1.1.56l.38-5.56 10.12-9.15c.44-.39-.1-.61-.68-.22L6.4 13.4l-5.45-1.7c-1.18-.37-1.2-1.18.25-1.75l21.3-8.22c.97-.36 1.83.23 1.51 1.76Z" />
    </svg>
  ),
  in: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z" />
    </svg>
  ),
  copy: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
};

export function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const enc = encodeURIComponent;
  const btns: Btn[] = [
    { key: "fb", bg: "#1877f2", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { key: "x", bg: "#000000", label: "X", href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}` },
    { key: "tg", bg: "#229ED9", label: "Telegram", href: `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}` },
    { key: "in", bg: "#0A66C2", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard недоступний — ігноруємо */
    }
  };

  const circle: CSSProperties = {
    width: 44, height: 44, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", textDecoration: "none",
    boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
    transition: "transform 0.15s ease, filter 0.15s ease",
    cursor: "pointer", border: "none",
  };

  return (
    <>
      <style>{`
        .share-rail {
          position: fixed; left: clamp(16px, calc((100vw - 860px) / 2 - 64px), 80px);
          top: 50%; transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 14px; z-index: 50;
        }
        .share-rail a:hover, .share-rail button:hover { transform: scale(1.08); filter: brightness(1.08); }
        @media (max-width: 1180px) { .share-rail { display: none; } }
      `}</style>
      <div className="share-rail">
        {btns.map((b) => (
          <a key={b.key} href={b.href} target="_blank" rel="noopener noreferrer" aria-label={`Поділитись у ${b.label}`} style={{ ...circle, background: b.bg }}>
            {ICON[b.key]}
          </a>
        ))}
        <button onClick={copy} aria-label="Копіювати посилання" style={{ ...circle, background: copied ? "#22c55e" : "#475569" }}>
          {copied ? ICON.check : ICON.copy}
        </button>
      </div>
    </>
  );
}
