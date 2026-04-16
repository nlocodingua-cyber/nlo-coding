"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export function LocaleSwitch({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const other = locale === "uk" ? "en" : "uk";

  return (
    <button
      onClick={() => router.replace(pathname, { locale: other })}
      className={cn(
        "text-xs font-mono uppercase tracking-widest text-foreground-muted hover:text-primary transition-colors",
        className
      )}
      aria-label={`Switch to ${other}`}
    >
      {locale === "uk" ? "EN" : "UK"}
    </button>
  );
}
