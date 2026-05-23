import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/google-calendar";
import { MEETING_TYPES } from "@/lib/meeting-config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const OWNER_EMAIL = process.env.GOOGLE_CALENDAR_ID!;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@nlocoding.com";

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

    // Format date for emails
    const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Client confirmation
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Підтвердження зустрічі — NLO Coding`,
      html: `
        <p>Привіт, ${name}!</p>
        <p>Твою зустріч заброньовано:</p>
        <ul>
          <li><strong>Дата:</strong> ${dateLabel}</li>
          <li><strong>Час:</strong> ${time} (Лісабон / Europe/Lisbon)</li>
          <li><strong>Тривалість:</strong> ${meetingType.duration} хв</li>
          ${meetLink ? `<li><strong>Google Meet:</strong> <a href="${meetLink}">${meetLink}</a></li>` : ""}
        </ul>
        <p>Якщо щось зміниться — пиши на <a href="mailto:${OWNER_EMAIL}">${OWNER_EMAIL}</a></p>
      `.trim(),
    });

    // Owner notification
    await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject: `Нове бронювання: ${name} — ${time} ${dateLabel}`,
      html: `
        <p><strong>${name}</strong> (${email}) забронював зустріч:</p>
        <ul>
          <li><strong>Тип:</strong> ${type}</li>
          <li><strong>Дата:</strong> ${dateLabel}</li>
          <li><strong>Час:</strong> ${time}</li>
          <li><strong>Нотатка:</strong> ${note || "—"}</li>
          ${meetLink ? `<li><strong>Meet:</strong> <a href="${meetLink}">${meetLink}</a></li>` : ""}
        </ul>
      `.trim(),
    });

    return NextResponse.json({ success: true, meetLink });
  } catch (err) {
    console.error("[booking/create]", err);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
