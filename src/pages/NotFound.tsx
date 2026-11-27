import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { setPageMeta, setRobots } from "@/lib/pageMeta";

const LINKS = [
  { to: "/library", label: "Library", note: "All Semester 3 notes and study guides" },
  { to: "/papers", label: "Past papers", note: "Previous-year question papers with solutions" },
  { to: "/exam-plan", label: "Exam plan", note: "A day-by-day revision plan" },
  { to: "/contact", label: "Contact", note: "Tell us about a broken link" },
];

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    setPageMeta({
      title: "Page not found | CampusLoop",
      description: "This page doesn't exist. Try the Semester 3 library, past papers or the exam plan.",
      path: location.pathname,
    });
    setRobots("noindex, nofollow");
  }, [location.pathname]);

  return (
    <PublicLayout>
      <section className="mx-auto w-full max-w-xl px-5 py-16">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">We couldn't find that page</h1>
        <p className="mt-2 text-muted-foreground">
          <code className="break-all">{location.pathname}</code> doesn't exist or has moved. These might help:
        </p>
        <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="block px-4 py-3 hover:bg-secondary/50">
                <span className="block font-medium text-foreground">{l.label}</span>
                <span className="block text-sm text-muted-foreground">{l.note}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/" className="mt-6 inline-block text-sm font-medium text-primary hover:underline underline-offset-4">
          Back to the home page
        </Link>
      </section>
    </PublicLayout>
  );
}
