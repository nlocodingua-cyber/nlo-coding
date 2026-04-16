import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { BRAND_EXORCIST_URL } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export function FounderBlock() {
  const t = useTranslations("landing.founder");

  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-4 text-center">
          {t("eyebrow")}
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-3">
          {t("title")}
        </h2>
        <p className="text-base text-foreground/70 text-center max-w-2xl mx-auto mb-6">
          {t("subtitle")}
        </p>
        <p className="text-base text-foreground/80 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("p")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/about">
            <Button variant="outline" className="neon-border">
              {t("cta")}
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <a href={BRAND_EXORCIST_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost">
              {t("exorcistCta")}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
