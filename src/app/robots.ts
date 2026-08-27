import type { MetadataRoute } from "next";

const BASE_URL = "https://nlocoding.com";

/**
 * robots.txt — пускаємо звичайних краулерів і генеративні двигуни
 * (GPTBot, PerplexityBot, ClaudeBot та інші), щоб статті блогу могли
 * потрапляти у відповіді AI-пошуку. CCBot закриваємо: це збір
 * тренувальних даних без зворотного посилання.
 */
export default function robots(): MetadataRoute.Robots {
  const allowAll = { allow: "/", disallow: ["/api/", "/uk/thank-you", "/en/thank-you"] };

  return {
    rules: [
      { userAgent: "*", ...allowAll },
      { userAgent: "GPTBot", ...allowAll },
      { userAgent: "ChatGPT-User", ...allowAll },
      { userAgent: "OAI-SearchBot", ...allowAll },
      { userAgent: "PerplexityBot", ...allowAll },
      { userAgent: "ClaudeBot", ...allowAll },
      { userAgent: "anthropic-ai", ...allowAll },
      { userAgent: "Claude-Web", ...allowAll },
      { userAgent: "Google-Extended", ...allowAll },
      { userAgent: "Bingbot", ...allowAll },
      { userAgent: "CCBot", disallow: "/" },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
