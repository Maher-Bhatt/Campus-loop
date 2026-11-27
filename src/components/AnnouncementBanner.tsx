import { useState, useEffect, useRef, type ReactNode } from 'react';
import { AlertCircle, AlertTriangle, Info, X, Calendar } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { openTimetable } from './GlobalTimetableModal';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  severity: 'info' | 'warning' | 'critical';
  active: boolean;
  createdAt: string;
}

export const DEFAULT_ANNOUNCEMENT: Announcement = {
  id: 'ann-sem3-endsem-winter-2026',
  title: 'Semester 3 end-sem exams',
  body: '25 Nov – 7 Dec 2026 · Java, COA, DBMS, DSA, CONMP · all papers at 10:10 AM',
  severity: 'info',
  active: true,
  createdAt: '2026-11-15T00:00:00+05:30',
};

export function AnnouncementBanner() {
  const { pathname } = useLocation();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const loadAnnouncement = () => {
    try {
      const raw = localStorage.getItem('itm_announcements');
      let current: Announcement | null = null;
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) {
          const activeOnes = list.filter((a: Announcement) => a.active);
          current = activeOnes[0] || null;
        }
      }
      if (!current) {
        current = DEFAULT_ANNOUNCEMENT;
      }

      if (current) {
        const dismissedRaw = localStorage.getItem('itm_dismissed_announcements');
        const dismissed: string[] = dismissedRaw ? JSON.parse(dismissedRaw) : [];
        if (dismissed.includes(current.id)) {
          setAnnouncement(null);
          return;
        }
      }

      setAnnouncement(current);
    } catch (e) {
      console.warn('Failed to load announcement:', e);
      setAnnouncement(null);
    }
  };

  useEffect(() => {
    loadAnnouncement();

    const handleStorageChange = () => loadAnnouncement();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('itm_announcement_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('itm_announcement_updated', handleStorageChange);
    };
  }, []);

  const handleDismiss = () => {
    if (!announcement) return;
    try {
      const dismissedRaw = localStorage.getItem('itm_dismissed_announcements');
      const dismissed: string[] = dismissedRaw ? JSON.parse(dismissedRaw) : [];
      if (!dismissed.includes(announcement.id)) {
        dismissed.push(announcement.id);
        localStorage.setItem('itm_dismissed_announcements', JSON.stringify(dismissed));
      }
    } catch (e) {
      console.warn('Failed to save dismissed announcement to localStorage:', e);
    }
    setAnnouncement(null);
  };

  const isMaintenanceActive = (() => {
    try {
      const stored = localStorage.getItem('itm_maintenance_mode');
      return stored === 'true';
    } catch {
      return false;
    }
  })();

  // The reader is a focused, full-screen view: keep banners out of it.
  const isReader = /^\/library\/[^/]+\/[^/]+/.test(pathname) || pathname.includes('/topic/');
  if (isReader || isMaintenanceActive || !announcement || !announcement.active) return null;

  return <BannerFrame>{renderBody()}</BannerFrame>;

  function renderBody() {
    return (
    <div className="relative z-40 border-b border-border bg-accent text-foreground px-4 py-1.5 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="font-medium text-[11px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
              {announcement.severity === 'critical' ? 'Alert' : 'Exams'}
            </span>
            <span className="font-medium text-foreground text-xs">{announcement.title}:</span>
            <span className="hidden sm:inline text-muted-foreground text-xs line-clamp-1">
              {announcement.body}
            </span>
            <button
              type="button"
              onClick={() => openTimetable('exams')}
              className="inline-btn inline-flex items-center gap-1 text-primary font-medium text-xs hover:underline underline-offset-4 cursor-pointer"
            >
              <Calendar className="h-3 w-3" />
              <span>View schedule</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1.5 -mr-1 rounded-md hover:bg-card text-muted-foreground hover:text-foreground transition-colors shrink-0 flex items-center justify-center cursor-pointer"
          title="Dismiss announcement"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
    );
  }
}

/** Publishes the banner's height as --banner-h so the full-height app shell can make room for it. */
function BannerFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (!el) return;
    const update = () => root.style.setProperty('--banner-h', `${el.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty('--banner-h', '0px');
    };
  }, []);
  return <div ref={ref}>{children}</div>;
}
