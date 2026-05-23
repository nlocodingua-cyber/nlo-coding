import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/google-calendar";
import { MEETING_TYPES } from "@/lib/meeting-config";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const date = searchParams.get("date"); // "2026-05-22"
  const typeId = searchParams.get("type");

  if (!date || !typeId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const meetingType = MEETING_TYPES.find((t) => t.id === typeId);
  if (!meetingType) {
    return NextResponse.json({ error: "Unknown meeting type" }, { status: 400 });
  }

  // Block past dates
  const today = new Date().toISOString().slice(0, 10);
  if (date < today) {
    return NextResponse.json({ slots: [] });
  }

  // Block weekends
  const day = new Date(date + "T12:00:00Z").getUTCDay();
  if (day === 0 || day === 6) {
    return NextResponse.json({ slots: [] });
  }

  try {
    const slots = await getAvailableSlots(date, meetingType.duration);
    return NextResponse.json({ slots });
  } catch (err) {
    console.error("[booking/slots]", err);
    return NextResponse.json({ error: "Calendar error" }, { status: 500 });
  }
}
