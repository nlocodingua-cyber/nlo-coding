// GET /api/booking/sync  — cron-driven Google → DB reconciliation.
//
// Polls Google for each recent confirmed booking and syncs changes BACK:
//   • event deleted / cancelled in Google → mark cancelled, email the client +
//     ping the owner. (Unambiguous, safe to notify the client.)
//   • event start moved → update the row + ping the owner ONLY. We deliberately
//     do NOT email the client on reschedule yet — a time-compare false positive
//     must never blast clients. Owner reviews, then re-confirms manually.
//
// Protected by CRON_SECRET (Vercel Cron sends it as a Bearer token).

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getEvent } from "@/lib/google-calendar";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { db: { schema: "nlocoding" }, auth: { persistSession: false, autoRefreshToken: false } }
);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "info@dronewar.win";
const OWNER_EMAIL = process.env.GOOGLE_CALENDAR_ID ?? "";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OWNER_TG = process.env.TELEGRAM_OWNER_ID;

async function tg(text: string) {
  if (!BOT_TOKEN || !OWNER_TG) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: OWNER_TG, text, parse_mode: "HTML" }),
  }).catch(() => {});
}

async function email(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !to) return;
  try {
    const { Resend } = await import("resend");
    await new Resend(apiKey).emails.send({ from: FROM_EMAIL, to, subject, html });
  } catch (e) {
    console.warn("[booking/sync] email", e instanceof Error ? e.message : e);
  }
}

function fmt(iso: string): string {
  return new Date(iso).toLocaleString("uk-UA", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Europe/Lisbon",
  });
}

interface BookingRow {
  id: string;
  google_event_id: string;
  name: string | null;
  email: string | null;
  starts_at: string;
  ends_at: string | null;
}

export async function GET(request: NextRequest) {
  // Auth: Vercel Cron passes Authorization: Bearer <CRON_SECRET>.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Recent + upcoming confirmed bookings (skip ancient history).
  const cutoff = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { data, error } = await db
    .from("bookings")
    .select("id, google_event_id, name, email, starts_at, ends_at")
    .eq("status", "confirmed")
    .not("google_event_id", "is", null)
    .gte("starts_at", cutoff);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as BookingRow[];
  let cancelled = 0;
  let rescheduled = 0;
  let checked = 0;

  for (const b of rows) {
    checked++;
    let ev: Awaited<ReturnType<typeof getEvent>>;
    try {
      ev = await getEvent(b.google_event_id);
    } catch (e) {
      console.error("[booking/sync] getEvent", b.google_event_id, e);
      continue; // transient → leave row as-is, retry next run
    }

    // ── Cancelled (gone or status cancelled) ──
    if (!ev || ev.status === "cancelled") {
      await db
        .from("bookings")
        .update({ status: "cancelled", last_synced_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("id", b.id);
      cancelled++;
      await email(
        b.email ?? "",
        "Зустріч скасовано — NLO Coding",
        `<p>Привіт${b.name ? `, ${b.name}` : ""}!</p>
         <p>На жаль, зустріч <b>${fmt(b.starts_at)}</b> (Лісабон) скасовано.</p>
         <p>Щоб обрати інший час — заброньуй наново на сайті${OWNER_EMAIL ? ` або напиши на <a href="mailto:${OWNER_EMAIL}">${OWNER_EMAIL}</a>` : ""}.</p>`
      );
      await tg(`❌ <b>Бронювання скасовано</b>\n${b.name ?? "—"} (${b.email ?? "—"})\n📆 ${fmt(b.starts_at)}`);
      continue;
    }

    // ── Rescheduled (start moved >2 min) ──
    if (ev.startISO) {
      const moved = Math.abs(new Date(ev.startISO).getTime() - new Date(b.starts_at).getTime()) > 120000;
      if (moved) {
        await db
          .from("bookings")
          .update({
            starts_at: ev.startISO,
            ends_at: ev.endISO ?? b.ends_at,
            status: "rescheduled",
            last_synced_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", b.id);
        rescheduled++;
        // Owner-only ping — no client email on reschedule (avoids false-positive blasts).
        await tg(
          `🔁 <b>Бронювання перенесено в Google</b>\n${b.name ?? "—"} (${b.email ?? "—"})\n${fmt(b.starts_at)} → <b>${fmt(ev.startISO)}</b>\nПеревір і за потреби напиши клієнту.`
        );
        continue;
      }
    }

    // ── Unchanged — just stamp the sync time ──
    await db.from("bookings").update({ last_synced_at: new Date().toISOString() }).eq("id", b.id);
  }

  return NextResponse.json({ ok: true, checked, cancelled, rescheduled });
}
