import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { CalendarPlus, Check, Copy, FileText, Printer, X } from "lucide-react";
import { toast } from "sonner";
import { EXAM_SCHEDULE, EXAM_SCHEDULE_TITLE, examStart, type ExamSlot } from "@/data/examSchedule";

const DAY_MS = 86_400_000;

function istDay(d: Date) {
  // Calendar day in India, as a sortable number
  return Number(d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }).replaceAll("-", ""));
}

function daysBetween(a: Date, b: Date) {
  const ad = new Date(a.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }));
  const bd = new Date(b.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }));
  return Math.round((bd.getTime() - ad.getTime()) / DAY_MS);
}

const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", ...o });
const timeLabel = (e: ExamSlot) => fmt(examStart(e), { hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase();

function status(e: ExamSlot, now: Date): { label: string; tone: "done" | "today" | "next" | "later" } {
  const start = examStart(e);
  if (istDay(start) === istDay(now)) return now.getTime() > start.getTime() + 3 * 3600_000 ? { label: "Done", tone: "done" } : { label: "Today", tone: "today" };
  if (start < now) return { label: "Done", tone: "done" };
  const d = daysBetween(now, start);
  return { label: d === 1 ? "Tomorrow" : `In ${d} days`, tone: "later" };
}

function icsFile() {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const utc = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const events = EXAM_SCHEDULE.map((e) => {
    const start = examStart(e);
    const end = new Date(start.getTime() + 3 * 3600_000);
    return [
      "BEGIN:VEVENT",
      `UID:${e.code}-${e.date}@campusloop`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${utc(start)}`,
      `DTEND:${utc(end)}`,
      `SUMMARY:${e.short} end-sem exam (${e.code})`,
      `DESCRIPTION:${e.course}. Theory paper\\, starts ${timeLabel(e)}. Check your block and room on the university portal.`,
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      `DESCRIPTION:${e.short} exam tomorrow`,
      "END:VALARM",
      "END:VEVENT",
    ].join("\r\n");
  });
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//CampusLoop//Exam schedule//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"].join("\r\n");
}

export function ExamScheduleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const now = useMemo(() => new Date(), [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const next = EXAM_SCHEDULE.find((e) => status(e, now).tone !== "done");
  const first = examStart(EXAM_SCHEDULE[0]);
  const last = examStart(EXAM_SCHEDULE[EXAM_SCHEDULE.length - 1]);
  const range = `${fmt(first, { day: "numeric", month: "short" })} – ${fmt(last, { day: "numeric", month: "short", year: "numeric" })}`;
  const daysToNext = next ? daysBetween(now, examStart(next)) : 0;

  const copy = () => {
    const lines = [
      `Semester 3 end-sem exams (${EXAM_SCHEDULE_TITLE})`,
      ...EXAM_SCHEDULE.map((e) => `${fmt(examStart(e), { weekday: "short", day: "2-digit", month: "short" })} · ${timeLabel(e)} · ${e.code} ${e.course}`),
      "Block and room: see the university portal.",
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(
      () => toast.success("Exam schedule copied"),
      () => toast.error("Couldn't copy. Select the table and copy it instead.")
    );
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([icsFile()], { type: "text/calendar;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "sem3-exams-winter-2026.ics" });
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Calendar file downloaded. Open it to add all five exams, with a reminder the day before.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 backdrop-blur-sm sm:items-center sm:p-6 print:static print:bg-transparent" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exam-schedule-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-border bg-card text-foreground shadow-xl sm:rounded-2xl print:max-h-none print:shadow-none"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-7">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Exam schedule · {range}</p>
            <h2 id="exam-schedule-title" className="mt-1.5 text-2xl font-medium leading-tight sm:text-[28px]">
              Semester 3 end-semester exams
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{EXAM_SCHEDULE_TITLE} · all theory papers start at 10:10 AM</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close exam schedule"
            className="-mr-2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground print:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="overflow-y-auto">
          {/* Next exam */}
          {next ? (
            <div className="mx-5 mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-secondary/60 px-4 py-3.5 sm:mx-7">
              <p className="text-sm">
                <span className="text-muted-foreground">Next up: </span>
                <span className="font-medium">{next.course}</span>
                <span className="text-muted-foreground"> · {fmt(examStart(next), { weekday: "long", day: "numeric", month: "long" })}</span>
              </p>
              <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                {daysToNext <= 0 ? "Today" : daysToNext === 1 ? "Tomorrow" : `${daysToNext} days left`}
              </span>
            </div>
          ) : (
            <p className="mx-5 mt-5 rounded-xl bg-secondary/60 px-4 py-3.5 text-sm sm:mx-7">All Semester 3 exams are over. Well done.</p>
          )}

          {/* Schedule */}
          <ol className="mt-3 px-5 sm:px-7">
            {EXAM_SCHEDULE.map((e, i) => {
              const start = examStart(e);
              const st = status(e, now);
              const isNext = next?.code === e.code;
              const gap = i > 0 ? daysBetween(examStart(EXAM_SCHEDULE[i - 1]), start) - 1 : null;
              return (
                <li key={e.code} className={i > 0 ? "border-t border-border" : ""}>
                  {gap !== null && gap > 0 && (
                    <p className="pt-2 pl-[4.75rem] text-[11px] uppercase tracking-wider text-muted-foreground">
                      {gap} {gap === 1 ? "day" : "days"} to prepare
                    </p>
                  )}
                  <div className={`flex gap-4 ${gap ? "pb-4 pt-2" : "py-4"} ${st.tone === "done" ? "opacity-55" : ""}`}>
                    <div
                      className={`flex h-16 w-[3.75rem] shrink-0 flex-col items-center justify-center rounded-xl border ${
                        isNext ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                      }`}
                    >
                      <span className="text-[11px] font-medium uppercase tracking-wider opacity-80">{fmt(start, { month: "short" })}</span>
                      <span className="text-2xl font-medium leading-none">{fmt(start, { day: "numeric" })}</span>
                      <span className="mt-0.5 text-[11px] opacity-80">{fmt(start, { weekday: "short" })}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                        <h3 className="text-[16px] font-medium leading-snug">{e.course}</h3>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ${
                            st.tone === "today" ? "bg-primary text-primary-foreground" : st.tone === "done" ? "bg-secondary text-muted-foreground" : "bg-secondary text-foreground"
                          }`}
                        >
                          {st.tone === "done" && <Check className="h-3 w-3" />}
                          {st.label}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {e.code} · {e.type} · {timeLabel(e)} · Block and room: {e.room ? `${e.block ?? ""} ${e.room}`.trim() : "not yet published"}
                      </p>
                      {st.tone !== "done" && (
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm print:hidden">
                          <Link to={`/papers?subject=${e.subject}`} onClick={onClose} className="text-foreground underline decoration-border underline-offset-4 hover:decoration-primary">
                            Past papers
                          </Link>
                          <Link to={`/library/${e.subject}/exam-guide`} onClick={onClose} className="text-foreground underline decoration-border underline-offset-4 hover:decoration-primary">
                            Exam guide
                          </Link>
                          {e.subject === "conmp" && (
                            <Link to="/library/conmp/formula-sheet" onClick={onClose} className="text-foreground underline decoration-border underline-offset-4 hover:decoration-primary">
                              Formula sheet
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <p className="mx-5 mb-5 mt-1 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground sm:mx-7">
            <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Source: the university exam portal. Block and room numbers appear there closer to the exams; always confirm the final timetable with your department.
          </p>
        </div>

        {/* Actions */}
        <footer className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-3.5 sm:px-7 print:hidden">
          <button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground">
            <CalendarPlus className="h-4 w-4" /> Add to calendar
          </button>
          <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-primary/50">
            <Copy className="h-4 w-4" /> Copy
          </button>
          <button type="button" onClick={() => window.print()} className="hidden items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-primary/50 sm:inline-flex">
            <Printer className="h-4 w-4" /> Print
          </button>
          <Link to="/exam-plan" onClick={onClose} className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Revision plan →
          </Link>
        </footer>
      </div>
    </div>
  );
}
