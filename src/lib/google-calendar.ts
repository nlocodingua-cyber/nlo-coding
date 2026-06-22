import { google } from "googleapis";
import { WORKING_START_HOUR, WORKING_END_HOUR, SLOT_STEP_MINUTES } from "./meeting-config";

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const calendar = google.calendar({ version: "v3", auth });
const CALENDAR_ID = "primary";
const TZ = "Europe/Lisbon";
const ZOOM_URL = (process.env.ZOOM_MEETING_URL ?? "https://us04web.zoom.us/j/9864070768?pwd=NldWVm1aRlRTUWQyRCtTbzkxVTFpdz09").trim();

// Returns Lisbon offset in minutes (e.g. 60 for UTC+1, 0 for UTC+0)
function getLisbonOffsetMin(date: Date): number {
  // "sv" locale gives "YYYY-MM-DD HH:MM:SS" — safe to parse as UTC fake
  const lisbonStr = new Intl.DateTimeFormat("sv", {
    timeZone: TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).format(date).replace(" ", "T");
  return (new Date(lisbonStr + "Z").getTime() - date.getTime()) / 60000;
}

// "2026-05-26", 10, 0 → UTC Date for 10:00 Lisbon
function lisbonToUTC(dateStr: string, hour: number, minute = 0): Date {
  // Start with naive UTC probe
  const probe = new Date(`${dateStr}T${pad(hour)}:${pad(minute)}:00Z`);
  const offsetMin = getLisbonOffsetMin(probe);
  return new Date(probe.getTime() - offsetMin * 60000);
}

function pad(n: number) { return String(n).padStart(2, "0"); }

export async function getAvailableSlots(
  dateStr: string,
  durationMinutes: number
): Promise<string[]> {
  const dayStart = lisbonToUTC(dateStr, WORKING_START_HOUR);
  const dayEnd   = lisbonToUTC(dateStr, WORKING_END_HOUR);

  const { data } = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      timeZone: TZ,
      items: [{ id: CALENDAR_ID }],
    },
  });

  const calData = Object.values(data.calendars ?? {})[0];
  const busy = (calData?.busy ?? []).map((b) => ({
    start: new Date(b.start!),
    end: new Date(b.end!),
  }));

  const now = new Date();
  const slots: string[] = [];
  const cursor = new Date(dayStart);

  while (cursor < dayEnd) {
    const slotEnd = new Date(cursor.getTime() + durationMinutes * 60000);
    if (slotEnd > dayEnd) break;

    const overlaps = busy.some((b) => cursor < b.end && slotEnd > b.start);
    if (!overlaps && cursor > now) {
      // Format in Lisbon time — slot label client will send back
      const offsetMin = getLisbonOffsetMin(cursor);
      const lisbonMs = cursor.getTime() + offsetMin * 60000;
      const lisbonDate = new Date(lisbonMs);
      const label = `${pad(lisbonDate.getUTCHours())}:${pad(lisbonDate.getUTCMinutes())}`;
      slots.push(label);
    }

    cursor.setTime(cursor.getTime() + SLOT_STEP_MINUTES * 60000);
  }

  return slots;
}

export async function createBooking({
  name, email, note, dateStr, timeStr, durationMinutes, meetingTypeId,
}: {
  name: string; email: string; note: string;
  dateStr: string; timeStr: string;
  durationMinutes: number; meetingTypeId: string;
}): Promise<{ meetLink: string; eventId: string | null; startISO: string; endISO: string }> {
  // Naive datetime + timeZone → Google interprets as Lisbon time. No manual conversion needed.
  const startDT = `${dateStr}T${timeStr}:00`;
  const [h, m] = timeStr.split(":").map(Number);
  const endH = h + Math.floor((m + durationMinutes) / 60);
  const endM = (m + durationMinutes) % 60;
  const endDT = `${dateStr}T${pad(endH)}:${pad(endM)}:00`;

  // Absolute UTC instants for the bookings ledger (sync-back compares against these).
  const startUTC = lisbonToUTC(dateStr, h, m);
  const endUTC = new Date(startUTC.getTime() + durationMinutes * 60000);

  const zoomLine = `Zoom: ${ZOOM_URL}`;
  const description = [note, zoomLine].filter(Boolean).join("\n\n");

  const { data } = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    sendUpdates: "all",
    requestBody: {
      summary: `NLO Coding — ${name}`,
      description,
      start: { dateTime: startDT, timeZone: TZ },
      end:   { dateTime: endDT,   timeZone: TZ },
      attendees: [{ email }],
    },
  });

  return {
    meetLink: ZOOM_URL,
    eventId: data.id ?? null,
    startISO: startUTC.toISOString(),
    endISO: endUTC.toISOString(),
  };
}

/**
 * Read a single event for sync-back. Returns null when the event is gone
 * (404/410) — i.e. the owner deleted it in Google. `status === "cancelled"`
 * also signals a cancellation.
 */
export async function getEvent(
  eventId: string
): Promise<{ status: string; startISO: string | null; endISO: string | null } | null> {
  try {
    const { data } = await calendar.events.get({ calendarId: CALENDAR_ID, eventId });
    return {
      status: data.status ?? "confirmed",
      startISO: data.start?.dateTime ?? data.start?.date ?? null,
      endISO: data.end?.dateTime ?? data.end?.date ?? null,
    };
  } catch (e: unknown) {
    const code =
      (e as { code?: number })?.code ??
      (e as { response?: { status?: number } })?.response?.status;
    if (code === 404 || code === 410) return null;
    throw e;
  }
}
