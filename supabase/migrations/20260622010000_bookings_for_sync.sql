-- Bookings ledger so Google Calendar changes (cancel / reschedule) can be
-- synced back to the client. Written on /api/booking/create, reconciled by
-- /api/booking/sync (Vercel cron). Server-only access (service role); no public RLS.
CREATE TABLE IF NOT EXISTS nlocoding.bookings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  google_event_id  text UNIQUE,
  name             text,
  email            text,
  meeting_type     text,
  starts_at        timestamptz NOT NULL,
  ends_at          timestamptz,
  status           text NOT NULL DEFAULT 'confirmed', -- confirmed | cancelled | rescheduled
  meet_link        text,
  note             text,
  last_synced_at   timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bookings_status_starts_idx
  ON nlocoding.bookings(status, starts_at);

ALTER TABLE nlocoding.bookings ENABLE ROW LEVEL SECURITY;
-- No policies: only the service-role key (server) touches this table.
