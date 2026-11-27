import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, ChevronRight, FileQuestion, FileText, MessageCircleQuestion, Timer } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGamification } from "@/hooks/useGamification";
import { LIBRARY } from "@/data/libraryIndex";
import { SUBJECT_ICONS } from "@/components/LibraryHighlights";
import { AiDoubtSolverModal } from "@/components/AiDoubtSolverModal";
import { openTimetable } from "@/components/GlobalTimetableModal";
import { EXAM_SCHEDULE, examStart } from "@/data/examSchedule";
import { docKey, getAllProgress, getLastRead } from "@/lib/readingProgress";

const IST: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };

function greeting() {
  const h = Number(new Date().toLocaleString("en-IN", { ...IST, hour: "numeric", hour12: false }));
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { state: game, weeklyGoalDays, weeklyStudyDaysCount } = useGamification();
  const [doubtOpen, setDoubtOpen] = useState(false);

  const firstName = (profile?.display_name || user?.email?.split("@")[0] || "").split(" ")[0];
  const progress = useMemo(() => getAllProgress(), []);
  const last = useMemo(() => {
    const l = getLastRead();
    if (!l) return null;
    const s = LIBRARY.find((x) => x.slug === l.subject);
    const d = s?.docs.find((x) => x.slug === l.doc);
    return s && d ? { s, d, pct: progress[docKey(s.slug, d.slug)]?.pct ?? 0 } : null;
  }, [progress]);

  const now = Date.now();
  const nextExam = EXAM_SCHEDULE.find((e) => examStart(e).getTime() + 3 * 3600_000 > now);
  const examsLeft = EXAM_SCHEDULE.filter((e) => examStart(e).getTime() + 3 * 3600_000 > now).length;

  const quick = [
    { label: "Important questions", to: "/imp-questions", icon: FileQuestion },
    { label: "Past papers", to: "/papers", icon: FileText },
    { label: "Mock exam", to: "/mock-exam", icon: Timer },
    { label: "Ask a doubt", onClick: () => setDoubtOpen(true), icon: MessageCircleQuestion },
  ];

  return (
    <div className="page space-y-8">
      {/* Greeting and the one thing that matters this week */}
      <header>
        <h1 className="page-title">
          {greeting()}{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="page-subtitle">
          {nextExam ? (
            <>
              Next exam: <span className="font-medium text-foreground">{nextExam.course}</span> on{" "}
              {examStart(nextExam).toLocaleDateString("en-IN", { ...IST, weekday: "long", day: "numeric", month: "long" })}, 10:10 AM.{" "}
              <button type="button" onClick={() => openTimetable("exams")} className="inline-btn font-medium text-primary hover:underline underline-offset-4 cursor-pointer">
                Timetable
              </button>
            </>
          ) : (
            "All Semester 3 exams are over. Well done."
          )}
        </p>
      </header>

      {profile && !profile.onboarding_completed && !profile.semester && (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-foreground">
            <span className="font-medium">Finish setting up your profile</span>
            <span className="text-muted-foreground"> so we can show your branch, section and timetable.</span>
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-foreground px-3.5 text-sm font-medium text-background hover:bg-foreground/90 cursor-pointer"
          >
            Finish setup <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Continue reading */}
      <section>
        {last ? (
          <Link
            to={`/library/${last.s.slug}/${last.d.slug}`}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 sm:p-5 hover:border-foreground/25 transition-colors"
          >
            <span className="icon-tile shrink-0">
              <BookOpen className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-muted-foreground">Continue reading · {last.s.short}</span>
              <span className="block truncate font-medium text-foreground">{last.d.title}</span>
              <span className="mt-2 flex items-center gap-3">
                <span className="h-1.5 flex-1 max-w-xs overflow-hidden rounded-full bg-secondary">
                  <span className="block h-full rounded-full bg-primary" style={{ width: `${Math.round(last.pct * 100)}%` }} />
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">{Math.round(last.pct * 100)}%</span>
              </span>
            </span>
            <span className="hidden sm:inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground group-hover:bg-primary/90">
              Resume
            </span>
          </Link>
        ) : (
          <Link
            to="/library"
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 sm:p-5 hover:border-foreground/25 transition-colors"
          >
            <span className="icon-tile shrink-0">
              <BookOpen className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-foreground">Start with a study guide</span>
              <span className="block text-sm text-muted-foreground">Each subject has one complete guide that covers every unit.</span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          </Link>
        )}
      </section>

      {/* Practice shortcuts */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="section-title">Practice</h2>
          <Link to="/practice" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            All practice
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {quick.map(({ label, to, onClick, icon: Icon }) => {
            const cls =
              "flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-3 text-sm font-medium text-foreground hover:border-foreground/25 transition-colors text-left cursor-pointer";
            const inner = (
              <>
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.8} />
                <span className="leading-tight">{label}</span>
              </>
            );
            return to ? (
              <Link key={label} to={to} className={cls}>
                {inner}
              </Link>
            ) : (
              <button key={label} type="button" onClick={onClick} className={cls}>
                {inner}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Subjects with real reading progress */}
        <section className="min-w-0">
          <div className="flex items-baseline justify-between">
            <h2 className="section-title">Your subjects</h2>
            <Link to="/subjects" className="text-sm font-medium text-primary hover:underline underline-offset-4">
              Topic notes
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
            {LIBRARY.map((s) => {
              const Icon = SUBJECT_ICONS[s.slug] ?? BookOpen;
              const read = s.docs.filter((d) => progress[docKey(s.slug, d.slug)]?.done).length;
              const pct = s.docs.length ? read / s.docs.length : 0;
              return (
                <li key={s.slug}>
                  <Link to={`/library/${s.slug}`} className="group flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors">
                    <Icon className="h-[18px] w-[18px] shrink-0 text-muted-foreground" strokeWidth={1.8} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">{s.name}</span>
                      <span className="mt-1.5 flex items-center gap-2">
                        <span className="h-1 flex-1 max-w-[10rem] overflow-hidden rounded-full bg-secondary">
                          <span className="block h-full bg-primary" style={{ width: `${Math.round(pct * 100)}%` }} />
                        </span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {read}/{s.docs.length} read
                        </span>
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="space-y-8">
          {/* Exams */}
          <section>
            <div className="flex items-baseline justify-between">
              <h2 className="section-title">End-sem exams</h2>
              <span className="text-sm text-muted-foreground">{examsLeft ? `${examsLeft} left` : "Done"}</span>
            </div>
            <ol className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
              {EXAM_SCHEDULE.map((e) => {
                const d = examStart(e);
                const past = d.getTime() + 3 * 3600_000 < now;
                const isNext = nextExam?.code === e.code;
                return (
                  <li key={e.code} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${past ? "text-muted-foreground" : "text-foreground"}`}>
                    <span className="w-16 shrink-0 tabular-nums text-muted-foreground">
                      {d.toLocaleDateString("en-IN", { ...IST, day: "numeric", month: "short" })}
                    </span>
                    <span className={`min-w-0 flex-1 truncate ${past ? "line-through" : ""} ${isNext ? "font-medium" : ""}`}>{e.short}</span>
                    {isNext && <span className="rounded bg-accent px-1.5 py-0.5 text-xs font-medium text-accent-foreground">Next</span>}
                  </li>
                );
              })}
            </ol>
          </section>

          {/* This week */}
          <section>
            <h2 className="section-title">This week</h2>
            <dl className="mt-3 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-card text-center">
              <div className="px-2 py-3">
                <dt className="text-xs text-muted-foreground">Streak</dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums">{game.streakDays}d</dd>
              </div>
              <div className="px-2 py-3">
                <dt className="text-xs text-muted-foreground">Study days</dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums">
                  {weeklyStudyDaysCount}/{weeklyGoalDays}
                </dd>
              </div>
              <div className="px-2 py-3">
                <dt className="text-xs text-muted-foreground">XP</dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums">{game.xp}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      <AiDoubtSolverModal isOpen={doubtOpen} onClose={() => setDoubtOpen(false)} />
    </div>
  );
}
