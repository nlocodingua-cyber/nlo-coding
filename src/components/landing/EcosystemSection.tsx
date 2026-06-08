/** The six NLO services. `current` is highlighted (theme color); the rest open in a new tab. */
const PRODUCTS = [
  { key: "studio", name: "NLO Studio", url: "https://nlostudio.com", color: "#a855f7", uk: "Креативна студія та контент-фабрика", en: "Creative studio & content factory" },
  { key: "brand", name: "NLO Brand", url: "https://nlobrand.com", color: "#009688", uk: "Конструктор персонального бренду", en: "Personal brand builder" },
  { key: "strategy", name: "NLO Strategy", url: "https://nlostrategy.com", color: "#10b981", uk: "AI-консультант з маркетинг-стратегії", en: "AI marketing strategy consultant" },
  { key: "finance", name: "NLO Finance", url: "https://nlofinance.com", color: "#f59e0b", uk: "AI-конструктор фінансових моделей", en: "AI financial modeling" },
  { key: "brain", name: "NLO Brain", url: "https://nlobrain.com", color: "#3b82f6", uk: "Другий мозок — база знань", en: "Your second brain — knowledge base" },
  { key: "coding", name: "NLO Coding", url: "https://nlocoding.com", color: "#22d3ee", uk: "Студія розробки SaaS та AI-агентів", en: "SaaS & AI agent dev studio" },
];

const CURRENT = "coding";

export function EcosystemSection({ locale }: { locale: string }) {
  const uk = locale === "uk";

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
      <div className="text-center mb-10">
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary mb-3 block">
          {uk ? "Екосистема NLO" : "NLO Ecosystem"}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          {uk ? "NLO Coding — інженерна основа екосистеми" : "NLO Coding — the engineering core of the ecosystem"}
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
          {uk
            ? "Шість сервісів NLO. Кожен закриває свою частину роботи — обери потрібний."
            : "Six NLO services. Each owns its part of the work — pick what you need."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRODUCTS.map((p) => {
          const isCurrent = p.key === CURRENT;
          const desc = uk ? p.uk : p.en;

          const inner = (
            <>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <h3 className="font-semibold text-white">{p.name}</h3>
                {isCurrent && (
                  <span className="ml-auto text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                    {uk ? "Ти тут" : "You are here"}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </>
          );

          if (isCurrent) {
            return (
              <div
                key={p.key}
                className="h-full rounded-xl p-5 border border-primary/50 bg-primary/[0.08] shadow-[0_0_30px_-12px_var(--primary)]"
              >
                {inner}
              </div>
            );
          }

          return (
            <a
              key={p.key}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full rounded-xl p-5 border border-white/[0.07] bg-white/[0.03] hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-200"
            >
              {inner}
            </a>
          );
        })}
      </div>
    </section>
  );
}
