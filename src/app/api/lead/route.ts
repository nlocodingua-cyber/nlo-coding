import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const OWNER_ID = process.env.TELEGRAM_OWNER_ID!;

async function sendTelegram(text: string) {
  if (!BOT_TOKEN || !OWNER_ID) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: OWNER_ID, text, parse_mode: "HTML" }),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, telegram, service_type, description, budget_range, source_page, utm_source, utm_medium, utm_campaign } = body;

  if (!name || !email || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const payload = { name, email, telegram: telegram || null, service_type: service_type || null, description, budget_range: budget_range || null, source_page, utm_source, utm_medium, utm_campaign };

  // Save to Supabase
  const { error } = await supabase.from("leads").insert(payload);
  if (error) {
    console.error("[lead]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  // Telegram notification
  const tg = telegram ? ` · TG: @${telegram.replace("@", "")}` : "";
  const budget = budget_range ? ` · Бюджет: ${budget_range}` : "";
  const service = service_type ? ` · Послуга: ${service_type}` : "";
  const msg = [
    `📩 <b>Нова заявка — NLO Coding</b>`,
    ``,
    `<b>${name}</b> (${email}${tg})`,
    `${service}${budget}`,
    ``,
    `<i>${description}</i>`,
    ``,
    `📍 ${source_page ?? "—"}`,
  ].join("\n");

  await sendTelegram(msg);

  return NextResponse.json({ success: true });
}
