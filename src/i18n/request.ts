import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import uk from "../../messages/uk.json";
import en from "../../messages/en.json";

const allMessages: Record<string, typeof uk> = { uk, en };

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "uk" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: allMessages[locale] ?? uk,
  };
});
