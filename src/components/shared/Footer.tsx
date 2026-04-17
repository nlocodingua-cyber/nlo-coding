import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { NLO_PRODUCTS, BRAND_EXORCIST_URL, NLO_ECOSYSTEM_URL, TELEGRAM_URL } from "@/lib/constants";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.06] mt-12 bg-[var(--background-secondary)]/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="font-display font-bold text-lg tracking-tight">
            <span className="text-gradient-static">NLO</span>
            <span className="text-foreground/90"> Coding</span>
          </Link>
          <p className="mt-4 text-[13px] text-foreground-muted leading-relaxed">
            {t("tagline")}
          </p>
        </div>

        <div>
          <h4 className="text-sm text-foreground/65 mb-4">
            {t("services")}
          </h4>
          <ul className="space-y-2.5 text-[13px]">
            <li><Link href="/ai-agents" className="text-foreground/70 hover:text-primary transition-colors">{t("serviceAgents")}</Link></li>
            <li><Link href="/automation" className="text-foreground/70 hover:text-primary transition-colors">{t("serviceAutomation")}</Link></li>
            <li><Link href="/contact" className="text-foreground/70 hover:text-primary transition-colors">{t("serviceSystems")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm text-foreground/65 mb-4">
            {t("ecosystem")}
          </h4>
          <ul className="space-y-2.5 text-[13px]">
            {NLO_PRODUCTS.slice(0, 5).map((p) => (
              <li key={p.key}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  {p.name}
                </a>
              </li>
            ))}
            <li>
              <a
                href={NLO_ECOSYSTEM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                NLO Ecosystem ↗
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm text-foreground/65 mb-4">
            {t("contact")}
          </h4>
          <ul className="space-y-2.5 text-[13px]">
            <li>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                Telegram ↗
              </a>
            </li>
            <li><Link href="/contact" className="text-foreground/70 hover:text-primary transition-colors">{t("contactPage")}</Link></li>
            <li><Link href="/about" className="text-foreground/70 hover:text-primary transition-colors">{t("about")}</Link></li>
            <li>
              <a
                href={BRAND_EXORCIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                Brand Exorcist ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-[11px] font-mono uppercase tracking-[0.2em] text-foreground-muted text-center">
          © {year} · NLO Coding · {t("builtBy")}
        </div>
      </div>
    </footer>
  );
}
