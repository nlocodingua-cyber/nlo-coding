import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { escapeHtml } from "@/lib/telegram";

// Таблиця leads живе у схемі nlocoding, а без явної схеми клієнт пише в
// public.leads — якої не існує. Тому кожна заявка з форми закінчувалась
// «DB error» і губилась: у таблиці нуль рядків за весь час не тому, що ніхто
// не писав, а тому, що жодна не долетіла. Маршрути бронювання схему задають —
// цей був єдиним без неї.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { db: { schema: "nlocoding" }, auth: { persistSession: false, autoRefreshToken: false } }
);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const OWNER_ID = process.env.TELEGRAM_OWNER_ID!;

// Щойно форма запрацювала, першою в неї зайшла не людина, а сканер форм:
// ім'я «Hdgdkyj», опис із 24 випадкових літер. Два сигнали, яких у людини
// не буває: заповнене приховане поле «website» (боти заповнюють усе підряд)
// і відправка швидше за три секунди після показу форми або взагалі без
// мітки часу — бо бот бере імена полів з HTML, а не з JS форми.
const MIN_FILL_MS = 3000;
const MAX_LEN = { name: 200, email: 320, telegram: 100, description: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sendTelegram(text: string) {
  if (!BOT_TOKEN || !OWNER_ID) return;
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: OWNER_ID, text, parse_mode: "HTML" }),
    });
    // Раніше відповідь не читалась: відхилене повідомлення зникало без сліду.
    if (!res.ok) console.error("[lead] telegram", res.status, await res.text());
  } catch (e) {
    console.error("[lead] telegram", e instanceof Error ? e.message : e);
  }
}

function looksLikeBot(body: Record<string, unknown>): string | null {
  if (typeof body.website === "string" && body.website.trim()) return "honeypot";
  const elapsed = Number(body.elapsed_ms);
  if (!Number.isFinite(elapsed)) return "no-timing";
  if (elapsed < MIN_FILL_MS) return `too-fast:${Math.round(elapsed)}ms`;
  return null;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");

  const name = str("name");
  const email = str("email");
  const telegram = str("telegram");
  const service_type = str("service_type");
  const description = str("description");
  const budget_range = str("budget_range");
  const source_page = str("source_page");
  const utm_source = str("utm_source");
  const utm_medium = str("utm_medium");
  const utm_campaign = str("utm_campaign");
  const ref_code = str("ref_code");

  if (!name || !email || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (
    !EMAIL_RE.test(email) ||
    name.length > MAX_LEN.name ||
    email.length > MAX_LEN.email ||
    telegram.length > MAX_LEN.telegram ||
    description.length > MAX_LEN.description
  ) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  // Боту відповідаємо «успіх», щоб він не шукав обхід, але нічого не
  // зберігаємо й не шлемо. Слід лишається в логах Vercel.
  const bot = looksLikeBot(body);
  if (bot) {
    console.warn("[lead] відкинуто як бота:", bot, email);
    return NextResponse.json({ success: true });
  }

  const payload = {
    name,
    email,
    telegram: telegram || null,
    service_type: service_type || null,
    description,
    budget_range: budget_range || null,
    source_page: source_page || null,
    utm_source: utm_source || null,
    utm_medium: utm_medium || null,
    utm_campaign: utm_campaign || null,
    ref_code: ref_code || null,
  };

  const { error } = await supabase.from("leads").insert(payload);
  if (error) {
    console.error("[lead]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  const tg = telegram ? ` · TG: @${escapeHtml(telegram.replace("@", ""))}` : "";
  const budget = budget_range ? ` · Бюджет: ${escapeHtml(budget_range)}` : "";
  const service = service_type ? ` · Послуга: ${escapeHtml(service_type)}` : "";
  const ref = ref_code ? ` · 🤝 Реф: ${escapeHtml(ref_code)}` : "";
  const msg = [
    `📩 <b>Нова заявка — NLO Coding</b>`,
    ``,
    `<b>${escapeHtml(name)}</b> (${escapeHtml(email)}${tg})`,
    `${service}${budget}${ref}`,
    ``,
    `<i>${escapeHtml(description)}</i>`,
    ``,
    `📍 ${escapeHtml(source_page || "—")}`,
  ].join("\n");

  await sendTelegram(msg);

  return NextResponse.json({ success: true });
}
