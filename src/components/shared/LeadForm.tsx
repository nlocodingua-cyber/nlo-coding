"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SERVICE_KEYS = ["mvp", "automation", "ai-agents", "integrations", "other"] as const;
const BUDGET_KEYS = ["under-3k", "3k-10k", "10k-30k", "30k+", "unknown"] as const;

type ServiceKey = (typeof SERVICE_KEYS)[number];
type BudgetKey = (typeof BUDGET_KEYS)[number];

interface LeadFormProps {
  /** Pre-select service type when form is embedded on a target landing */
  defaultService?: ServiceKey;
  /** Which page the form is on — saved for funnel analytics */
  sourcePage?: string;
}

export function LeadForm({ defaultService, sourcePage = "contact" }: LeadFormProps) {
  const t = useTranslations("leadForm");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      telegram: String(form.get("telegram") || "").trim() || null,
      service_type: String(form.get("service_type") || "") || null,
      description: String(form.get("description") || "").trim(),
      budget_range: String(form.get("budget_range") || "") || null,
      source_page: sourcePage,
      utm_source: new URLSearchParams(window.location.search).get("utm_source"),
      utm_medium: new URLSearchParams(window.location.search).get("utm_medium"),
      utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign"),
    };

    if (!payload.name || !payload.email || !payload.description) {
      toast.error(t("error"));
      return;
    }

    setSubmitting(true);
    try {
      if (!isSupabaseConfigured) {
        // Dev / preview fallback — still redirect to thank-you
        console.warn("[LeadForm] Supabase not configured; logging payload only", payload);
        router.push("/thank-you");
        return;
      }
      const supabase = getSupabase();
      if (!supabase) throw new Error("Supabase client unavailable");

      const { error } = await supabase.from("leads").insert(payload);
      if (error) throw error;

      router.push("/thank-you");
    } catch (err) {
      console.error("[LeadForm]", err);
      toast.error(t("error"));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-elevated p-6 sm:p-8 space-y-5">
      <div>
        <h3 className="font-display text-xl font-semibold mb-1">{t("title")}</h3>
        <p className="text-sm text-foreground/60">{t("subtitle")}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t("nameLabel")}>
          <input
            name="name"
            required
            placeholder={t("namePlaceholder")}
            className="form-input"
          />
        </Field>
        <Field label={t("emailLabel")}>
          <input
            name="email"
            type="email"
            required
            placeholder={t("emailPlaceholder")}
            className="form-input"
          />
        </Field>
      </div>

      <Field label={t("telegramLabel")}>
        <input
          name="telegram"
          placeholder={t("telegramPlaceholder")}
          className="form-input"
        />
      </Field>

      <Field label={t("serviceLabel")}>
        <select
          name="service_type"
          defaultValue={defaultService || ""}
          className="form-input"
        >
          <option value="" disabled>
            {t("servicePlaceholder")}
          </option>
          {SERVICE_KEYS.map((k) => (
            <option key={k} value={k}>
              {t(`serviceOptions.${k}`)}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t("descLabel")}>
        <textarea
          name="description"
          required
          rows={5}
          placeholder={t("descPlaceholder")}
          className="form-input resize-y"
        />
      </Field>

      <Field label={t("budgetLabel")}>
        <select name="budget_range" defaultValue="" className="form-input">
          <option value="">{t("budgetPlaceholder")}</option>
          {BUDGET_KEYS.map((k) => (
            <option key={k} value={k}>
              {t(`budgetOptions.${k}`)}
            </option>
          ))}
        </select>
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="w-full animate-glow-pulse"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t("submitting")}
          </>
        ) : (
          <>
            <Send className="size-4" />
            {t("submit")}
          </>
        )}
      </Button>

      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          border-radius: 0.5rem;
          background: rgba(0, 240, 255, 0.02);
          border: 1px solid var(--border);
          color: var(--foreground);
          transition: all 150ms ease;
          outline: none;
        }
        .form-input:focus {
          border-color: rgba(0, 240, 255, 0.4);
          background: rgba(0, 240, 255, 0.04);
          box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.08);
        }
        .form-input::placeholder {
          color: var(--foreground-muted);
        }
        select.form-input {
          cursor: pointer;
        }
        textarea.form-input {
          font-family: inherit;
          line-height: 1.5;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-mono uppercase tracking-widest text-foreground-muted mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  );
}
