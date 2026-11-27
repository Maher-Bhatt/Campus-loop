import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, ChevronRight, Search } from "lucide-react";
import { LIBRARY } from "@/data/libraryIndex";
import { SUBJECT_ICONS } from "@/components/LibraryHighlights";
import { DEFAULT_TITLE, setPageMeta } from "@/lib/pageMeta";
import { daysUntilFinals, FINALS_START, minutesFor } from "@/lib/readingProgress";

const DOCS = LIBRARY.flatMap((s) => s.docs.map((d) => ({ s, d })));
const DOC_COUNT = DOCS.length;
const READING_HOURS = Math.round(DOCS.reduce((n, { d }) => n + (d.scanned ? 0 : d.words), 0) / 200 / 60);
const SCANNED_PAGES = DOCS.reduce((n, { d }) => n + (d.scanned ? d.pages ?? 0 : 0), 0);

const FAQ = [
  {
    q: "What is CampusLoop?",
    a: "A free study site for B.Tech students. Study guides, lecture notes, slides and handwritten pages for your semester are turned into clean text you can read on a phone or laptop, and your place is saved.",
  },
  {
    q: "Do I need an account?",
    a: "No. The Library is free to read without signing in. A free account adds important questions, mock exams, quizzes, the coding lab, the campus feed and progress that syncs across devices.",
  },
  {
    q: "Who makes it?",
    a: "Students at ITM (SLS) Baroda University. Course material belongs to its original authors; the study guides are written to explain each unit from scratch.",
  },
  {
    q: "Which subjects are covered?",
    a: `Semester 3 B.Tech: ${LIBRARY.map((s) => s.name).join(", ")}. More semesters are being added.`,
  },
];

const ACCOUNT_FEATURES = [
  { t: "Important questions and past papers", d: "The questions that keep coming back, sorted by unit, with answers." },
  { t: "Mock exams and quizzes", d: "Timed papers in the university format. See which units you're weak in." },
  { t: "Coding lab", d: "Run your C, Java, Python and SQL practicals in the browser, with expected output and viva questions." },
];

function ExamNotice() {
  const days = daysUntilFinals();
  if (days > 0) {
    return (
      <p className="text-sm text-foreground">
        <span className="font-medium">End-sem exams start {FINALS_START.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}</span>
        <span className="text-muted-foreground"> · {days} {days === 1 ? "day" : "days"} left. </span>
        <Link to="/exam-plan" className="font-medium text-primary hover:underline underline-offset-4">Make a revision plan</Link>
      </p>
    );
  }
  return null;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const examNotice = ExamNotice();

  useEffect(() => {
    setPageMeta({
      title: DEFAULT_TITLE,
      description: `Free Semester 3 B.Tech notes for ${LIBRARY.map((s) => s.short).join(", ")}: study guides, lecture notes, slides and handwritten pages. Important questions, past papers, mock exams and a coding lab with a free account.`,
      path: "/",
    });
  }, []);

  const results = useMemo(() => {
    const terms = q.trim().toLowerCase().split(/\s+/).filter((t) => t.length > 1);
    if (!terms.length) return [];
    return DOCS.filter(({ s, d }) => {
      const hay = `${d.title} ${d.kind} ${s.short} ${s.name} ${d.summary}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    }).slice(0, 6);
  }, [q]);

  return (
    <>
      {/* Hero: what it is, and the one thing to do first */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-12 sm:px-8 sm:pt-16">
          <div className="max-w-2xl">
            <h1 className="text-[2rem] font-semibold leading-tight tracking-tight text-foreground sm:text-[2.75rem]">
              Semester 3 notes and exam practice, free for B.Tech students
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Every study guide, lecture note and handwritten page for DSA, DBMS, COA, Numerical Methods and Java. Read on your phone or laptop. No sign-up needed.
            </p>

            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                if (results[0]) navigate(`/library/${results[0].s.slug}/${results[0].d.slug}`);
                else navigate("/library");
              }}
              className="relative mt-7"
            >
              <label className="flex h-12 items-center gap-3 rounded-lg border border-input bg-background pl-4 pr-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <Search className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search a topic, e.g. normalization, recursion"
                  aria-label="Search the library"
                  className="h-full w-full bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button type="submit" className="h-9 shrink-0 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer">
                  Search
                </button>
              </label>
              {results.length > 0 && (
                <ul className="absolute inset-x-0 top-full z-20 mt-1.5 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg">
                  {results.map(({ s, d }) => (
                    <li key={`${s.slug}/${d.slug}`}>
                      <Link to={`/library/${s.slug}/${d.slug}`} className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-secondary">
                        <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 flex-1 truncate text-sm text-foreground">{d.title}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">{s.short} · {d.kind}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </form>

            <p className="mt-4 text-sm text-muted-foreground">
              {DOC_COUNT} documents · {READING_HOURS} hours of reading · {SCANNED_PAGES} handwritten pages ·{" "}
              <Link to="/library" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
                Browse the library
              </Link>
            </p>

            {examNotice && <div className="mt-6 border-l-2 border-primary pl-3">{examNotice}</div>}
          </div>
        </div>
      </section>

      {/* Subjects: the real content, one click from the home page */}
      <section className="mx-auto max-w-6xl px-5 pt-12 sm:px-8">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold text-foreground">Start with a subject</h2>
          <Link to="/library" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            All documents
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
          {LIBRARY.map((s) => {
            const Icon = SUBJECT_ICONS[s.slug] ?? BookOpen;
            const mins = s.docs.reduce((n, d) => n + (d.scanned ? 0 : minutesFor(d.words)), 0);
            const guide = s.docs.find((d) => d.featured) ?? s.docs[0];
            return (
              <li key={s.slug} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4">
                <Link to={`/library/${s.slug}`} className="group flex min-w-0 flex-1 items-center gap-4">
                  <span className="icon-tile shrink-0">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-foreground group-hover:text-primary">{s.name}</span>
                    <span className="block text-sm text-muted-foreground">
                      {s.short}{s.code ? ` · ${s.code}` : ""} · {s.docs.length} documents · about {Math.max(1, Math.round(mins / 60))} h of reading
                    </span>
                  </span>
                </Link>
                {guide && (
                  <Link
                    to={`/library/${s.slug}/${guide.slug}`}
                    className="inline-flex shrink-0 items-center gap-1 self-start rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary sm:self-auto"
                  >
                    Read the study guide <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Free account */}
      <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Practise with a free account</h2>
            <p className="mt-2 text-muted-foreground">Reading is always free and open. Sign in with Google to test yourself and keep your progress on every device.</p>
            <Link to="/auth" className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background hover:bg-foreground/90">
              Create a free account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <dl className="divide-y divide-border border-y border-border">
            {ACCOUNT_FEATURES.map((f) => (
              <div key={f.t} className="py-4">
                <dt className="font-medium text-foreground">{f.t}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{f.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
        <h2 className="text-xl font-semibold text-foreground">Questions</h2>
        <div className="mt-4 max-w-3xl divide-y divide-border border-y border-border">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground">
                {f.q}
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <script
          type="application/ld+json"
          // FAQ rich results for search engines
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            }),
          }}
        />
      </section>
    </>
  );
}
