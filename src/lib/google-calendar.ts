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

function getLisbonOffset(date: Date): number {
  const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const lisbon = new Date(date.toLocaleString("en-US", { timeZone: TZ }));
  return Math.round((lisbon.getTime() - utc.getTime()) / 3600000);
}

function lisbonHourToUTC(dateStr: string, hour: number, minute = 0): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const probe = new Date(Date.UTC(y, m - 1, d, hour, minute, 0));
  const offset = getLisbonOffset(probe);
  return new Date(probe.getTime() - offset * 3600000);
}

export async function getAvailableSlots(
  dateStr: string,
  durationMinutes: number
): Promise<string[]> {
  const dayStart = lisbonHourToUTC(dateStr, WORKING_START_HOUR);
  const dayEnd = lisbonHourToUTC(dateStr, WORKING_END_HOUR);

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
      const label = cursor.toLocaleTimeString("uk-UA", {
        timeZone: TZ,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      slots.push(label);
    }

    cursor.setTime(cursor.getTime() + SLOT_STEP_MINUTES * 60000);
  }

  return slots;
}

export async function createBooking({
  name,
  email,
  note,
  dateStr,
  timeStr,
  durationMinutes,
  meetingTypeId,
}: {
  name: string;
  email: string;
  note: string;
  dateStr: string;
  timeStr: string;
  durationMinutes: number;
  meetingTypeId: string;
}): Promise<{ meetLink: string }> {
  const [h, m] = timeStr.split(":").map(Number);
  const start = lisbonHourToUTC(dateStr, h, m);
  const end = new Date(start.getTime() + durationMinutes * 60000);

  const { data } = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    conferenceDataVersion: 1,
    sendUpdates: "all",
    requestBody: {
      summary: `NLO Coding — ${name}`,
      description: note || `Тип: ${meetingTypeId}`,
      start: { dateTime: start.toISOString(), timeZone: TZ },
      end: { dateTime: end.toISOString(), timeZone: TZ },
      attendees: [{ email }],
      conferenceData: {
        createRequest: {
          requestId: `nlocoding-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    },
  });

  return { meetLink: data.hangoutLink ?? "" };
}
