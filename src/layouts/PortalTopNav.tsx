import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  Clock,
  LogIn,
  PanelLeftOpen,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGamification } from "@/hooks/useGamification";
import { usePomodoro } from "@/contexts/PomodoroContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CampusAvatar } from "@/components/campusloop/CampusAvatar";
import { CampusLoopLogo } from "@/components/campusloop/CampusLoopLogo";
import { resolveAvatarUrl } from "@/components/UserAvatar";
import { openTimetable } from "@/components/GlobalTimetableModal";
import { buildNotifications, markNotificationsRead, NOTIFICATIONS_EVENT, type AppNotification } from "@/lib/notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PortalTopNavProps {
  onToggleSidebar?: () => void;
  onOpenSearch?: () => void;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
  onOpenHelp?: () => void;
}

export function PortalTopNav({
  onToggleSidebar,
  onOpenSearch,
  isFocusMode = false,
  onToggleFocusMode,
  onOpenHelp,
}: PortalTopNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, role, signOut } = useAuth();
  const { state: game } = useGamification();
  const { timeLeft, isRunning, setIsModalOpen } = usePomodoro();

  const [notifications, setNotifications] = useState<AppNotification[]>(() => buildNotifications());

  useEffect(() => {
    const refresh = () => setNotifications(buildNotifications());
    window.addEventListener(NOTIFICATIONS_EVENT, refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener(NOTIFICATIONS_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  useEffect(() => {
    setNotifications(buildNotifications());
  }, [location.pathname]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => markNotificationsRead(notifications.map((n) => n.id));

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const isAdmin = role === "admin" || user?.email?.toLowerCase() === "maherbhatt01@gmail.com";
  const iconBtn = "relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer";

  return (
    <header className="shrink-0 z-30 bg-background border-b border-border px-3 sm:px-6 flex items-center gap-3 pt-[env(safe-area-inset-top,0px)] h-[calc(3.5rem+env(safe-area-inset-top,0px))] w-full">
      <button onClick={onToggleSidebar} className={`md:hidden ${iconBtn}`} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>

      <Link
        to="/dashboard"
        className={`items-center shrink-0 ${isFocusMode ? "flex" : "flex md:hidden"}`}
        aria-label="CampusLoop home"
      >
        <CampusLoopLogo size="sm" />
      </Link>

      {isFocusMode && onToggleFocusMode && (
        <button onClick={onToggleFocusMode} className={`hidden md:inline-flex ${iconBtn}`} title="Show sidebar (F)" aria-label="Show sidebar">
          <PanelLeftOpen className="h-[18px] w-[18px]" />
        </button>
      )}

      <button
        onClick={onOpenSearch}
        className="ml-auto md:ml-0 flex items-center gap-2 h-9 w-9 md:w-full md:max-w-sm justify-center md:justify-start md:px-3 rounded-md md:border md:border-border md:bg-card text-muted-foreground hover:text-foreground md:hover:border-foreground/25 text-sm transition-colors cursor-pointer"
        aria-label="Search"
        title="Search (Ctrl + K)"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden md:inline">Search notes, topics, questions</span>
        <kbd className="hidden lg:inline-flex ml-auto">Ctrl K</kbd>
      </button>

      <div className="flex items-center gap-1 md:ml-auto">
        {isRunning && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md bg-accent text-accent-foreground text-xs font-medium tabular-nums cursor-pointer"
            title="Focus timer"
          >
            <Clock className="h-3.5 w-3.5" />
            {minutes}:{seconds}
          </button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={iconBtn} aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}>
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 rounded-lg">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
              <span className="text-sm font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs font-medium text-primary hover:underline cursor-pointer">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {notifications.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">You're all caught up.</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    role={notif.href ? "link" : undefined}
                    tabIndex={notif.href ? 0 : undefined}
                    onClick={() => {
                      markNotificationsRead([notif.id]);
                      if (notif.href) navigate(notif.href);
                    }}
                    className={`px-3 py-2.5 hover:bg-secondary transition-colors ${notif.href ? "cursor-pointer" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${notif.read ? "bg-transparent" : "bg-primary"}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{notif.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        {!user ? (
          <Link to="/auth" className="ml-1 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90">
            <LogIn className="h-4 w-4" />
            Sign in
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 rounded-full cursor-pointer focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account menu">
                <CampusAvatar
                  src={resolveAvatarUrl(profile, user)}
                  name={profile?.display_name || user?.email || "Student"}
                  size={32}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-lg">
              <div className="px-2 py-2">
                <p className="text-sm font-medium truncate">{profile?.display_name || user?.email?.split("@")[0] || "Student"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {game.streakDays}-day streak · {game.xp} XP
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/bookmarks")}>Bookmarks</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsModalOpen(true)}>Focus timer</DropdownMenuItem>
              <DropdownMenuItem onClick={() => openTimetable("exams")}>Exam timetable</DropdownMenuItem>
              {onToggleFocusMode && (
                <DropdownMenuItem onClick={onToggleFocusMode} className="hidden md:flex">
                  {isFocusMode ? "Show sidebar" : "Hide sidebar"}
                  <span className="ml-auto text-xs text-muted-foreground">F</span>
                </DropdownMenuItem>
              )}
              {onOpenHelp && <DropdownMenuItem onClick={onOpenHelp}>Help and support</DropdownMenuItem>}
              {isAdmin && <DropdownMenuItem onClick={() => navigate("/admin")}>Admin</DropdownMenuItem>}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
