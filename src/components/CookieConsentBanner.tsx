import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Check, X, Cookie } from "lucide-react";

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("campusloop_cookie_consent");
      if (!consent) {
        // Small delay to prevent layout pop on immediate paint
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case localStorage is blocked
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem("campusloop_cookie_consent", "accepted");
    } catch {}
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem("campusloop_cookie_consent", "essential");
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and Storage Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 "
    >
      <div className="rounded-lg border border-border bg-card p-4 shadow-xl space-y-3">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Cookie className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>Your Privacy & Storage Choices</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-success/20 text-success font-semibold">DPDP 2023</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use strictly necessary browser storage to remember your reading progress, theme, and authentication session. We do <strong>not</strong> use advertising cookies or tracking pixels.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/60">
          <Link
            to="/cookies"
            onClick={() => setIsVisible(false)}
            className="text-[11px] font-semibold text-primary hover:underline underline-offset-4"
          >
            Review Cookie Policy
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleEssentialOnly}
              className="h-8 px-3 rounded-md text-xs font-medium text-foreground border border-input bg-card hover:bg-secondary transition-colors cursor-pointer"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="h-8 px-3 rounded-md text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
