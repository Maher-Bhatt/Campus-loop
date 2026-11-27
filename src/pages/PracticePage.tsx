import { Link } from "react-router-dom";
import { ChevronRight, FileQuestion, FileText, Timer, ListChecks, Zap, Sigma, type LucideIcon } from "lucide-react";

interface Tool {
  to: string;
  title: string;
  body: string;
  icon: LucideIcon;
}

const BEFORE_EXAM: Tool[] = [
  { to: "/imp-questions", title: "Important questions", body: "Questions that come up most often, unit by unit, with answers.", icon: FileQuestion },
  { to: "/papers", title: "Past papers", body: "Previous university papers, with solutions where we have them.", icon: FileText },
  { to: "/mock-exam", title: "Mock exam", body: "A timed paper in the real exam format. You get a score and a review.", icon: Timer },
];

const DAILY: Tool[] = [
  { to: "/quiz", title: "Quizzes", body: "Short multiple-choice sets for one subject or unit.", icon: ListChecks },
  { to: "/rapid-revision", title: "Rapid revision", body: "One-line summaries of every topic for the night before.", icon: Zap },
  { to: "/formulas", title: "Formula sheet", body: "Every formula and definition from your subjects on one page.", icon: Sigma },
];

function ToolList({ title, tools }: { title: string; tools: Tool[] }) {
  return (
    <section className="mt-8">
      <h2 className="section-title">{title}</h2>
      <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
        {tools.map(({ to, title, body, icon: Icon }) => (
          <li key={to}>
            <Link to={to} className="group flex items-center gap-4 px-4 py-4 hover:bg-secondary/50 transition-colors first:rounded-t-xl last:rounded-b-xl">
              <span className="icon-tile shrink-0">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-foreground">{title}</span>
                <span className="block text-sm text-muted-foreground">{body}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** One place for every way to test yourself, instead of six separate menu items. */
export default function PracticePage() {
  return (
    <div className="page">
      <h1 className="page-title">Practice</h1>
      <p className="page-subtitle">Test yourself on what you've read. Start with important questions if exams are close.</p>
      <ToolList title="Before the exam" tools={BEFORE_EXAM} />
      <ToolList title="Any day" tools={DAILY} />
    </div>
  );
}
