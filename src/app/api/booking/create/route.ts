import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/google-calendar";
import { MEETING_TYPES } from "@/lib/meeting-config";

const OWNER_EMAIL = process.env.GOOGLE_CALENDAR_ID!;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "info@dronewar.win";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OWNER_TG = process.env.TELEGRAM_OWNER_ID;

async function sendTelegram(text: string) {
  if (!BOT_TOKEN || !OWNER_TG) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: OWNER_TG, text, parse_mode: "HTML" }),
  }).catch(() => {});
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
  } catch (e) {
    console.warn("[booking/email]", e instanceof Error ? e.message : e);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, note, date, time, type } = body;

  if (!name || !email || !date || !time || !type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const meetingType = MEETING_TYPES.find((t) => t.id === type);
  if (!meetingType) {
    return NextResponse.json({ error: "Unknown meeting type" }, { status: 400 });
  }

  try {
    const { meetLink } = await createBooking({
      name,
      email,
      note: note ?? "",
      dateStr: date,
      timeStr: time,
      durationMinutes: meetingType.duration,
      meetingTypeId: type,
    });

    const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("uk-UA", {
      day: "numeric", month: "long", year: "numeric",
    });

    // Telegram to owner (fire-and-forget)
    sendTelegram([
      `📅 <b>Нове бронювання — NLO Coding</b>`,
      ``,
      `<b>${name}</b> (${email})`,
      `Тип: ${type} · ${meetingType.duration} хв`,
      `📆 ${dateLabel}, ${time} (Lisbon)`,
      note ? `\n💬 ${note}` : "",
      meetLink ? `\n🔗 <a href="${meetLink}">Google Meet</a>` : "",
    ].filter(Boolean).join("\n"));

    // Email to client (non-blocking)
    sendEmail(email, `Підтвердження зустрічі — NLO Coding`, `
      <p>Привіт, ${name}!</p>
      <p>Твою зустріч заброньовано:</p>
      <ul>
        <li><b>Дата:</b> ${dateLabel}</li>
        <li><b>Час:</b> ${time} (Лісабон)</li>
        <li><b>Тривалість:</b> ${meetingType.duration} хв</li>
        ${meetLink ? `<li><b>Google Meet:</b> <a href="${meetLink}">${meetLink}</a></li>` : ""}
      </ul>
      <p>Питання? Пиши на <a href="mailto:${OWNER_EMAIL}">${OWNER_EMAIL}</a></p>
    `);

    return NextResponse.json({ success: true, meetLink });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[booking/create]", msg);
    return NextResponse.json({ error: "Booking failed", detail: msg }, { status: 500 });
  }
}
