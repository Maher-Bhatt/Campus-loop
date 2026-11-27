import { useState, useEffect, lazy, Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PortalSidebar } from "./PortalSidebar";
import { PortalTopNav } from "./PortalTopNav";
import { toast } from "sonner";
import { useFocusMode } from "@/contexts/FocusModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { isPublicPath, setRobots, titleForPath } from "@/lib/pageMeta";

// Loaded on first use: both pull in the full subject data set.
const SearchDialog = lazy(() => import("@/components/SearchDialog").then((m) => ({ default: m.SearchDialog })));
const HelpPanel = lazy(() => import("@/components/HelpPanel").then((m) => ({ default: m.HelpPanel })));

export function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { focusMode, toggleFocusMode, setFocusMode } = useFocusMode();
  const { user, profile } = useAuth();

  // Close mobile sidebar on route change; keep the tab title meaningful
  useEffect(() => {
    setSidebarOpen(false);
    if (!isPublicPath(location.pathname)) {
      // public pages (library) set their own title, description and canonical
      document.title = titleForPath(location.pathname);
      setRobots("noindex, nofollow");
    }
  }, [location.pathname]);

  // Global keyboard shortcuts: Cmd+K (search), 'F' (Fullscreen Focus Mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if ((e.key === "f" || e.key === "F") && !e.ctrlKey && !e.metaKey && !isInput) {
        e.preventDefault();
        toggleFocusMode();
        toast(!focusMode ? "Sidebar hidden. Press F to show it again." : "Sidebar shown");
      } else if (e.key === "Escape" && focusMode) {
        setFocusMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusMode, toggleFocusMode, setFocusMode]);

  const handleToggleFocusMode = () => {
    toggleFocusMode();
    toast(!focusMode ? "Sidebar hidden. Press F to show it again." : "Sidebar shown");
  };


  return (
    <div className="h-[calc(100dvh-var(--banner-h,0px))] w-full overflow-hidden bg-background text-foreground flex antialiased">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background">Skip to content</a>
      {/* 1. Persistent Left Dark Sidebar */}
      <PortalSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={focusMode}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Sticky Fixed Top Navbar */}
        <PortalTopNav
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onOpenSearch={() => setSearchOpen(true)}
          isFocusMode={focusMode}
          onToggleFocusMode={handleToggleFocusMode}
          onOpenHelp={() => setIsChatOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto overflow-x-hidden pb-16 md:pb-6 relative focus:outline-none">
          <Outlet />
        </main>
      </div>

      {/* 3. Universal Search Dialog */}
      {searchOpen && (
        <Suspense fallback={null}>
          <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </Suspense>
      )}

      {/* 4. Help panel, opened from the account menu */}
      {isChatOpen && (
        <div className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] md:bottom-6 right-4 sm:right-6 z-40">
          <Suspense fallback={null}>
            <HelpPanel onClose={() => setIsChatOpen(false)} />
          </Suspense>
        </div>
      )}
    </div>
  );
}