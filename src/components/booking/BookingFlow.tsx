"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle, ChevronLeft, ChevronRight, Clock, Calendar, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MEETING_TYPES, type MeetingType } from "@/lib/meeting-config";

type Step = "service" | "datetime" | "contact" | "done";

const WEEKDAY_NAMES_UK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
const MONTH_NAMES_UK = [
  "Січень","Лютий","Березень","Квітень","Травень","Червень",
  "Липень","Серпень","Вересень","Жовтень","Листопад","Грудень",
];

function toISODate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Convert to Mon-first (0=Mon…6=Sun)
  const startPad = (firstDay + 6) % 7;
  return { startPad, daysInMonth };
}

function isWeekend(year: number, month: number, day: number) {
  const d = new Date(year, month, day).getDay();
  return d === 0 || d === 6;
}

function isPast(year: number, month: number, day: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(year, month, day) < today;
}

export function BookingFlow() {
  const t = useTranslations("booking");
  const [step, setStep] = useState<Step>("service");
  const [selectedType, setSelectedType] = useState<MeetingType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [meetLink, setMeetLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const fetchSlots = useCallback(
    async (date: string, typeId: string) => {
      setLoadingSlots(true);
      setSlots([]);
      setSelectedSlot(null);
      try {
        const res = await fetch(`/api/booking/slots?date=${date}&type=${typeId}`);
        const data = await res.json();
        setSlots(data.slots ?? []);
      } catch {
        toast.error(t("errors.slots"));
      } finally {
        setLoadingSlots(false);
      }
    },
    [t]
  );

  useEffect(() => {
    if (selectedDate && selectedType) {
      fetchSlots(selectedDate, selectedType.id);
    }
  }, [selectedDate, selectedType, fetchSlots]);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  function selectDay(day: number) {
    const dateStr = toISODate(viewYear, viewMonth, day);
    setSelectedDate(dateStr);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedType || !selectedDate || !selectedSlot) return;

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const note = String(form.get("note") || "").trim();

    if (!name || !email) {
      toast.error(t("errors.fields"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, note,
          date: selectedDate,
          time: selectedSlot,
          type: selectedType.id,
        }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setMeetLink(data.meetLink ?? "");
      setStep("done");
    } catch {
      toast.error(t("errors.create"));
    } finally {
      setSubmitting(false);
    }
  }

  const { startPad, daysInMonth } = buildCalendarDays(viewYear, viewMonth);
  const isPrevMonthDisabled =
    viewYear < now.getFullYear() ||
    (viewYear === now.getFullYear() && viewMonth <= now.getMonth());

  const formattedDate = selectedDate
    ? new Date(selectedDate + "T12:00:00Z").toLocaleDateString("uk-UA", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  // ─── Step 1: Service ─────────────────────────────────────────────────────────
  if (step === "service") {
    return (
      <div className="space-y-6">
        <StepHeader step={1} total={3} title={t("steps.service")} />
        <div className="grid sm:grid-cols-3 gap-4">
          {MEETING_TYPES.map((mt) => (
            <button
              key={mt.id}
              onClick={() => { setSelectedType(mt); setStep("datetime"); }}
              className="group text-left p-5 rounded-xl border border-[--border] bg-[--card] hover:border-cyan-400/40 hover:bg-cyan-400/[0.03] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            >
              <div className="text-xs font-mono uppercase tracking-widest text-[--foreground-muted] mb-2">
                {t(`types.${mt.id}.eyebrow`)}
              </div>
              <div className="font-semibold text-base text-[--foreground] mb-3 group-hover:text-cyan-300 transition-colors">
                {t(`types.${mt.id}.name`)}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[--foreground-muted]">
                <Clock className="size-3.5 shrink-0" />
                {mt.duration} {t("minutes")}
              </div>
              <p className="mt-3 text-xs text-[--foreground-muted] leading-relaxed">
                {t(`types.${mt.id}.desc`)}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Step 2: Date + Slot ─────────────────────────────────────────────────────
  if (step === "datetime") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setStep("service"); setSelectedDate(null); setSelectedSlot(null); }}
            className="p-1.5 rounded-lg hover:bg-white/5 text-[--foreground-muted] hover:text-[--foreground] transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <StepHeader step={2} total={3} title={t("steps.datetime")} noMargin />
        </div>

        {selectedType && (
          <div className="flex items-center gap-2 text-sm text-[--foreground-muted]">
            <Clock className="size-3.5" />
            <span className="text-cyan-400 font-medium">{t(`types.${selectedType.id}.name`)}</span>
            <span>·</span>
            <span>{selectedType.duration} {t("minutes")}</span>
          </div>
        )}

        <div className="grid md:grid-cols-[1fr_1fr] gap-6 items-start">
          {/* Calendar */}
          <div className="rounded-xl border border-[--border] bg-[--card] p-5">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                disabled={isPrevMonthDisabled}
                className="p-1 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="size-4 text-[--foreground-muted]" />
              </button>
              <span className="text-sm font-medium">
                {MONTH_NAMES_UK[viewMonth]} {viewYear}
              </span>
              <button onClick={nextMonth} className="p-1 rounded hover:bg-white/5 transition-colors">
                <ChevronRight className="size-4 text-[--foreground-muted]" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {WEEKDAY_NAMES_UK.map((d) => (
                <div key={d} className="text-center text-[10px] font-mono uppercase tracking-widest text-[--foreground-muted] py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
              {Array.from({ length: startPad }, (_, i) => (
                <div key={`pad-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = toISODate(viewYear, viewMonth, day);
                const disabled = isWeekend(viewYear, viewMonth, day) || isPast(viewYear, viewMonth, day);
                const isSelected = dateStr === selectedDate;

                return (
                  <button
                    key={day}
                    disabled={disabled}
                    onClick={() => selectDay(day)}
                    className={[
                      "h-8 w-full rounded-lg text-sm transition-all duration-150",
                      disabled
                        ? "text-[--foreground-muted] opacity-30 cursor-not-allowed"
                        : isSelected
                        ? "bg-cyan-400 text-[#06080f] font-semibold"
                        : "hover:bg-cyan-400/10 hover:text-cyan-300 text-[--foreground]",
                    ].join(" ")}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots */}
          <div className="rounded-xl border border-[--border] bg-[--card] p-5 min-h-[200px]">
            {!selectedDate ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[160px] text-[--foreground-muted] text-sm">
                <Calendar className="size-8 mb-2 opacity-40" />
                {t("selectDate")}
              </div>
            ) : loadingSlots ? (
              <div className="flex items-center justify-center min-h-[160px]">
                <Loader2 className="size-5 animate-spin text-cyan-400" />
              </div>
            ) : slots.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[160px] text-[--foreground-muted] text-sm">
                {t("noSlots")}
              </div>
            ) : (
              <>
                <div className="text-xs font-mono uppercase tracking-widest text-[--foreground-muted] mb-3">
                  {formattedDate}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={[
                        "py-2 px-3 rounded-lg text-sm font-mono transition-all duration-150",
                        selectedSlot === slot
                          ? "bg-cyan-400 text-[#06080f] font-semibold"
                          : "border border-[--border] hover:border-cyan-400/40 hover:text-cyan-300",
                      ].join(" ")}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            disabled={!selectedDate || !selectedSlot}
            onClick={() => setStep("contact")}
            className="animate-glow-pulse"
          >
            {t("next")}
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ─── Step 3: Contact Form ────────────────────────────────────────────────────
  if (step === "contact") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep("datetime")}
            className="p-1.5 rounded-lg hover:bg-white/5 text-[--foreground-muted] hover:text-[--foreground] transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <StepHeader step={3} total={3} title={t("steps.contact")} noMargin />
        </div>

        {/* Summary */}
        <div className="flex flex-wrap gap-3 text-sm">
          <SummaryChip icon={<Clock className="size-3.5" />}>
            {selectedType && t(`types.${selectedType.id}.name`)} · {selectedType?.duration} {t("minutes")}
          </SummaryChip>
          <SummaryChip icon={<Calendar className="size-3.5" />}>
            {formattedDate}, {selectedSlot}
          </SummaryChip>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <BookingField label={t("form.name")}>
              <input
                name="name"
                required
                placeholder={t("form.namePlaceholder")}
                className="booking-input"
              />
            </BookingField>
            <BookingField label={t("form.email")}>
              <input
                name="email"
                type="email"
                required
                placeholder={t("form.emailPlaceholder")}
                className="booking-input"
              />
            </BookingField>
          </div>
          <BookingField label={t("form.note")}>
            <textarea
              name="note"
              rows={4}
              placeholder={t("form.notePlaceholder")}
              className="booking-input resize-y"
            />
          </BookingField>

          <Button type="submit" size="lg" disabled={submitting} className="w-full animate-glow-pulse">
            {submitting ? (
              <><Loader2 className="size-4 animate-spin" />{t("form.submitting")}</>
            ) : (
              t("form.submit")
            )}
          </Button>
        </form>

        <style jsx>{`
          .booking-input {
            width: 100%;
            padding: 0.625rem 0.875rem;
            font-size: 0.875rem;
            border-radius: 0.5rem;
            background: rgba(0, 240, 255, 0.02);
            border: 1px solid var(--border);
            color: var(--foreground);
            transition: all 150ms ease;
            outline: none;
            font-family: inherit;
          }
          .booking-input:focus {
            border-color: rgba(0, 240, 255, 0.4);
            background: rgba(0, 240, 255, 0.04);
            box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.08);
          }
          .booking-input::placeholder { color: var(--foreground-muted); }
        `}</style>
      </div>
    );
  }

  // ─── Step 4: Done ────────────────────────────────────────────────────────────
  return (
    <div className="text-center space-y-6 py-8">
      <CheckCircle className="size-14 text-cyan-400 mx-auto" />
      <div>
        <h2 className="text-2xl font-semibold mb-2">{t("done.title")}</h2>
        <p className="text-[--foreground-muted] text-sm max-w-sm mx-auto">{t("done.subtitle")}</p>
      </div>
      {meetLink && (
        <a
          href={meetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10 transition-colors text-sm"
        >
          <Video className="size-4" />
          {t("done.meetLink")}
        </a>
      )}
      <div className="text-xs text-[--foreground-muted]">{t("done.email")}</div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StepHeader({
  step, total, title, noMargin,
}: {
  step: number; total: number; title: string; noMargin?: boolean;
}) {
  return (
    <div className={noMargin ? "" : "mb-2"}>
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-400/60 mb-1">
        {step} / {total}
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}

function SummaryChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[--border] bg-[--card] text-[--foreground-muted] text-xs">
      {icon}
      {children}
    </span>
  );
}

function BookingField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-mono uppercase tracking-widest text-[--foreground-muted] mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  );
}
