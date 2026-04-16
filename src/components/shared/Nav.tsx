"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LocaleSwitch } from "./LocaleSwitch";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Send } from "lucide-react";
import { TELEGRAM_URL } from "@/lib/constants";

export function Nav() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: Array<{ href: string; key: "services" | "process" | "cases" | "about" }> = [
    { href: "/#services", key: "services" },
    { href: "/#process", key: "process" },
    { href: "/cases", key: "cases" },
    { href: "/about", key: "about" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-xl bg-[var(--background)]/70 border-b border-white/[0.06]"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-bold text-lg tracking-tight"
          aria-label="NLO Coding"
        >
          <span className="text-gradient-static">NLO</span>
          <span className="text-foreground/90"> Coding</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) =>
            l.href.startsWith("/#") ? (
              <a
                key={l.key}
                href={l.href}
                className="text-sm text-foreground/65 hover:text-foreground transition-colors"
              >
                {t(l.key)}
              </a>
            ) : (
              <Link
                key={l.key}
                href={l.href}
                className="text-sm text-foreground/65 hover:text-foreground transition-colors"
              >
                {t(l.key)}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          <LocaleSwitch className="hidden sm:inline" />
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-block">
            <Button size="sm" className="h-9 px-4 gap-1.5 shadow-[0_0_24px_rgba(0,240,255,0.2)]">
              <Send className="size-3.5" />
              {t("cta")}
            </Button>
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-foreground/80 hover:text-primary"
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden backdrop-blur-xl bg-[var(--background)]/90 border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
            {links.map((l) =>
              l.href.startsWith("/#") ? (
                <a
                  key={l.key}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-foreground/80 hover:text-primary py-1.5"
                >
                  {t(l.key)}
                </a>
              ) : (
                <Link
                  key={l.key}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-foreground/80 hover:text-primary py-1.5"
                >
                  {t(l.key)}
                </Link>
              )
            )}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              <LocaleSwitch />
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                <Button size="sm" className="h-9 gap-1.5">
                  <Send className="size-3.5" />
                  {t("cta")}
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
