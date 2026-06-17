# DESIGN.md — NLO Coding

> AI-readable design system. Read this before generating or editing any UI in this repo.
> Source of truth = `src/app/globals.css` (`:root` tokens + utility classes). This file documents intent; the CSS variables are canonical. If they disagree, the CSS wins — update this file.

---

## 1. Product & tone

- **Product:** NLO Coding — B2B-сервіс кастомної автоматизації для власників бізнесу, які хочуть скоротити витрати на операційний персонал без vendor lock-in.
- **Tagline / слоган:** «Економлю $3–8K/міс на зарплатах. За 3 тижні. Код залишається клієнту.»
- **Differentiator:** Не SaaS, не агенція. 100% репо клієнту — без підписок на інструмент, без прив'язки до підрядника.
- **Audience:** Власники бізнесу (SMB, 5–50 осіб), фаундери, операційні директори. Ухвалюють рішення за ROI і строками, не за технічними деталями.
- **Visual metaphor:** Схема · Точність. Логіка схеми плат / circuit — не магія, а зрозуміла архітектура. Сигнал лого = тарілка + схема.
- **Philosophy — Next Level Ownership** (3 стовпи, brand book v1.0):
  1. **Свобода** — клієнт отримує вихідний код і більше не залежить від Coding.
  2. **Система** — повторювана задача → процес → автоматизація. Кожен результат відтворюваний.
  3. **AI-first** — AI є командою, а не інструментом для команди. Виконавець найнятий, а не підключений.
- **UI copy language:** Ukrainian first (`/uk` default, `/en` second). Brand terms stay as-is (Next Level Ownership, NLO Coding, Brand Exorcist).

### Voice & tone — applies to every UI string, button, empty state, toast

ROI-first · власник, не продавець · конкретні числа, конкретні строки.

**ТАК (do):**
- Число першим. «$6.4K економії/міс. ROI за 2.1 міс» — не "значна економія".
- Говори як власник. «Я роблю», «ти отримуєш» — не «наше рішення допомагає клієнтам…».
- Порівнюй з тим, що замінюєш. «1 автоматизація замість 0.4 ставки/рік».
- Показуй систему, не фічу. «Код у твоєму репо на першій добі» — не «гнучка архітектура».
- Вкорочуй речення. Крапки, не коми. Впевненість читається коротко.

**НІ (don't):**
- «Інноваційний провайдер рішень» — корпоративний шум, знищує довіру.
- "Empowering / unlocking / leveraging" — дієслова без дії.
- Купа прикметників. «Потужний, масштабований, enterprise-grade» — обери одне або жодного.
- Ховати ціну або строки. Якщо є число — веди з числа.
- Робити з AI магію. AI — найнятий виконавець. Говори що він *робить*, а не що він «розуміє».

**B2B-специфіка (відрізняє Coding від ECO):**
- ROI-картки та кейси клієнтів — обов'язкові блоки на кожній ключовій секції.
- Слоган, числа окупності, строки впровадження мають бути в hero і above-the-fold.
- Coding = B2B-клієнт, голос ROI. ECO = споживчий хаб, голос свободи. Палітра однакова — тон і контент різні. **Не змінюй колір щоб відрізнитись — змінюй смисл.**

---

## 2. Color (canonical — from `globals.css :root`)

**Surfaces**
| Token | Value | Use |
|---|---|---|
| `--background` | `#06080f` | page canvas (deep space black) |
| `--background-secondary` | `#0c0f1a` | raised sections |
| `--card` / `--popover` | `#0c0f1a` | cards, popovers |
| `--sidebar` | `#050710` | sidebar (darker than canvas) |
| `--muted` / `--accent` | `#111827` | muted blocks |

**Text**
| Token | Value | Use |
|---|---|---|
| `--foreground` | `#e2e8f0` | primary text |
| `--foreground-muted` | `--muted-foreground #64748b` | secondary / muted text |

**Brand**
| Token | Value | Use |
|---|---|---|
| `--primary` | `#00f0ff` | cyan neon — primary action, focus ring |
| `--primary-hover` | `#00d4e0` | primary hover state |
| `--primary-foreground` | `#06080f` | text ON primary (dark, never white) |
| `--secondary` | `#7c3aed` | purple — secondary accent |
| `--primary-muted` | `rgba(0,240,255,0.08)` | tinted fills |

**Signature gradient:** `linear-gradient(135deg, #00f0ff 0%, #7c3aed 100%)` (cyan → purple).

**Semantic:** `--success #10b981` · `--warning #f59e0b` · `--danger/--destructive #ef4444` · `--info #3b82f6`.

**Neon palette (effects only):** cyan `#00f0ff` · purple `#7c3aed` · green `#10b981` · pink `#ec4899` · orange `#f59e0b`.

**Card extras:** `--card-hover rgba(0,240,255,0.04)` · `--card-border rgba(0,240,255,0.08)`.

**Sidebar extras:** `--sidebar-foreground #64748b` · `--sidebar-primary #00f0ff` · `--sidebar-primary-foreground #06080f` · `--sidebar-accent rgba(0,240,255,0.06)`.

**Borders:** hairline cyan, very low alpha — `--border rgba(0,240,255,0.06)`. Never solid grey borders.

**Coding vs ECO — палітра ідентична** (brand book v1.0 це підтверджує). Coding ділить cyan/purple/#06080F з ECO. Відрізняй голосом і контентом (ROI-картки, кейси, строки), а не кольором.

---

## 3. Typography

| Role | Font | CSS var (layout) | Notes |
|---|---|---|---|
| Display / headings | **Onest** | `--font-onest` → `--font-display` | cyrillic ✓, weights 500–900 |
| Body / UI | **Inter** | `--font-inter` → `--font-sans` | cyrillic ✓, weight 400–700 |
| Code / data / ROI-числа | **JetBrains Mono** | `--font-jetbrains-mono` → `--font-mono` | cyrillic ✓, weight 400–600 |

**⚠ Важливо — display-шрифт НЕ Space Grotesk:**
Globals.css `--font-display` прив'язаний до `--font-onest` (Onest), а не Space Grotesk. Onest завантажується з `subsets: ["latin", "cyrillic"]` — кирилиця працює. Це **відхилення від brand book v1.0** (де задекларовано Space Grotesk), але перевага коду очевидна: Onest рендерить українські заголовки без fallback на Inter. Не змінюй на Space Grotesk — він latin-only.

**Type scale (brand book v1.0)** — size px / tracking em:

| Level | Size | Tracking | Line-height |
|---|---|---|---|
| H1 | 120 | `-0.045` | tight |
| H2 | 72 | `-0.035` | tight |
| H3 | 40 | `-0.025` | — |
| H4 | 28 | `-0.015` | — |
| Body | 22 | normal | `1.45` |
| Mono | 18 | `+0.05` | — |

Display weight = **700**. Більший шрифт — тісніший трекінг (від'ємний). Mono — єдина позитивна роль. Для dense-UI масштабуй пропорційно, зберігай *напрямки* трекінгу.

`.font-display` у globals.css задає `letter-spacing: -0.02em` — за замовчанням. H1/H2 мають overrides до `-0.045`/`-0.035` прямо в компоненті.

**JetBrains Mono = особливо доречний у Coding:** числа ROI, рядки ROI-карток, технічні метрики — використовуй `font-mono` для цифр і формул.

---

## 4. Spacing, radius, elevation

- **Radius:** `--radius 0.75rem` base · `--radius-sm 0.5` · `--radius-md 0.625` · `--radius-lg 1` · `--radius-xl 1.5rem`. Default = `--radius` для cards/buttons.
- **Shadows:** `--shadow-sm 0 1px 2px /0.4` · `--shadow-md 0 4px 12px /0.5` · `--shadow-lg 0 8px 32px /0.6` (all black, deep).
- **Glow (brand signal):** `--shadow-glow 0 0 24px rgba(0,240,255,0.15)` · purple `--shadow-glow-purple 0 0 24px rgba(124,58,237,0.15)`. Glow = cyan by default.
  - ⚠ **Mismatch glow vs brand book:** brand book задає hero glow як `0 0 40px rgba(0,240,255,.4)` — яскравіше за код (`24px / .15`). Код canonical. Якщо потрібен гучніший hero-glow — зміни `globals.css` явно і онови цей файл.
  - ⚠ **Mismatch border vs brand book:** brand book малює border як slate `rgba(226,232,240,0.08)`; код використовує cyan `rgba(0,240,255,0.06)`. Код виграє в репо.

---

## 5. Components & utility patterns (use these classes, don't reinvent)

**Glassmorphism** (in `globals.css`):
- `.glass` — backdrop-blur 20px, cyan fill 0.02
- `.glass-elevated` — blur 24px, cyan fill 0.04 (modals, raised cards)
- `.glass-subtle` — blur 12px, cyan fill 0.01 (light overlays)

**Neon:**
- `.neon-border` / `.neon-border-purple` — glowing hairline border
- `.neon-text` / `.neon-text-purple` — glowing text
- `.glow-primary` / `.glow-purple` — drop glow
- `.neon-card-glow` — card з інтенсифікацією glow на `:hover`

**Backgrounds:**
- `.grid-bg` / `.grid-bg-dense` — faint cyan grid (alpha 0.03 / 0.02). Default ambient backdrop.
- `.bg-dot-grid` — radial dot grid з mask-fade.
- `.aurora` — absolute layer, дві aurora blobs (cyan + purple).
- `.spotlight` — cursor-following radial gradient overlay на картці.

**Interaction:**
- `.hover-lift` — translateY(-2px) + glow on hover. **Default для cards/CTAs.**
- `.transition-smooth` — standard easing 300ms cubic.
- `.skeleton` — shimmer loading state.

**Typography utilities:**
- `.display-title` — font-display 700, -0.035em, white fade-to-muted gradient.
- `.text-gradient` — animated cyan→purple gradient text (8s loop).
- `.text-gradient-static` — static cyan→purple gradient text.
- `.text-gradient-purple` — purple→lavender→pink.
- `.text-balance` — `text-wrap: balance` для headline.

**Special effects:**
- `.shine-cta` — shimmer running light bar на кнопці (shine 3s loop).
- `.border-beam` — rotating conic gradient border (border-beam 8s loop).
- `.marquee-row` — horizontal marquee (40s loop).

---

## 6. Motion

Keyframes вже визначено — перевикористовуй, не авторизуй нові без потреби:

`fade-up` (0.5s, entrance) · `fade-in` (0.4s) · `slide-in-right` (0.3s) · `glow-pulse` (2.5s, cyan CTA breathing) · `glow-pulse-purple` (2.5s) · `pulse-neon` (2s, opacity) · `shimmer` (skeleton) · `scan-line` (3s, linear) · `float-slow` (translateY, для декоративних елементів) · `aurora-slow` (20s) · `aurora-fast` (14s) · `marquee` (40s) · `border-beam` (8s) · `shine` (3s, CTA shimmer) · `gradient-shift` (8s, `text-gradient`).

**Принцип:** motion амбієнтний і субтильний — glow breathing, slow floats. Entrances = `fade-up`. Hover = lift + glow. Нічого стрибучого або ігрового — це calm command-deck, не іграшка.

**`prefers-reduced-motion`:** усі анімації скорочені до `0.01ms` — завжди.

---

## 7. Layout

- Dark canvas `#06080f` скрізь; підіймай контент на `#0c0f1a` glass cards.
- Centered max-width content (~`max-w` 1152px для landing rows).
- Generous negative space; let glow and grid breathe.
- **ROI-блоки above-the-fold:** hero має містити слоган із числами ($3–8K, 3 тижні) і primary CTA.
- **Кейс-карти:** ROI числа через `.font-mono` на `--primary` або `.neon-text`. Текст поверх cyan = `--primary-foreground #06080f`, ніколи білий.
- Sidebar app zones use `--sidebar #050710`.

---

## 8. Accessibility

- Text on dark: primary `#e2e8f0` on `#06080f` — ≥ AA. Muted `#64748b` лише для несуттєвих міток.
- Text **на** primary cyan — темний (`--primary-foreground #06080f`), ніколи білий — cyan надто світлий для білого.
- Min font size **14px** (buttons **16px**). Ніколи 9–13px.
- Focus ring = `--ring #00f0ff` (`:focus-visible` вже в globals.css), завжди видимий.
- Ніяких нативних `confirm()` / `alert()` / `prompt()` — лише styled modals у стилі сайту.

---

## 9. Do NOT

- ❌ Світлі / білі фони. Dark-only продукт.
- ❌ Білий текст на cyan-кнопках (використовуй `#06080f` / `--primary-foreground`).
- ❌ Solid grey borders — лише low-alpha cyan hairlines.
- ❌ Заміняти Onest на Space Grotesk — Space Grotesk latin-only, рендерить кирилицю через Inter (неконтрольований fallback).
- ❌ Нативні `confirm()` / `alert()` / `prompt()` — in-site modals.
- ❌ Нові ad-hoc кольори / анімації, якщо токен або keyframe вже є.
- ❌ Технічний жаргон у UI-копі — проста людська українська.
- ❌ Parchment / banknote-тони — це NLO Finance, не Coding.
- ❌ Писати у Coding-компонентах «ШІ-рішення», «платформа», «екосистема» без конкретики — Coding = людина + код, ROI-перший.
- ❌ Відрізняти Coding від ECO кольором — у них спільна палітра (brand book v1.0). Відрізняй тоном (ROI vs свобода) і контентом (кейси клієнтів vs орбіта продуктів).

---

## Mismatches: код vs brand book v1.0

| # | Тема | Brand book | Код (canonical) | Дія |
|---|---|---|---|---|
| ⚠ 1 | Display-шрифт | Space Grotesk | **Onest** (`--font-onest`) | Onest краще — кирилиця ✓. Не міняти. |
| ⚠ 2 | Hero glow | `0 0 40px rgba(0,240,255,.4)` | `0 0 24px rgba(0,240,255,.15)` | Якщо потрібен гучніший — змінюй `globals.css`. |
| ⚠ 3 | Border color | `rgba(226,232,240,0.08)` slate | `rgba(0,240,255,0.06)` cyan | Cyan виграє в репо. |

---

_Tokens sourced from `src/app/globals.css` + `src/app/[locale]/layout.tsx` (canonical). Brand intent, voice, type scale & the 7-world palette from **NLO Brand System v1.0 — 2026**. Where code and brand book disagree, code wins in-repo — mismatches flagged above. Keep this file in sync when `globals.css` changes._
