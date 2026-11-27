import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Library,
  Home,
  Users,
  BookOpen,
  Code2,
  Calculator,
  CalendarDays,
  ListChecks,
  Target,
  FileText,
  Bookmark,
  Shield,
  ChevronDown,
  LogOut,
  MessageSquare,
  BarChart3,
  X,
  type LucideIcon,
} from 'lucide-react';
import { CampusLoopLogo } from './CampusLoopLogo';
import { CampusAvatar } from './CampusAvatar';
import { CampusCountBadge } from './CampusCountBadge';
import { useAuth } from '@/contexts/AuthContext';
import { UniversityDropdown } from './UniversityDropdown';
import { PRACTICE_PATHS } from '@/lib/navigation';
import { resolveAvatarUrl } from '@/components/UserAvatar';

export interface CampusSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  unreadMessagesCount?: number;
}

interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  /** Other path prefixes that should highlight this item */
  match?: string[];
  badge?: number;
}


const PRIMARY: NavItem[] = [
  { name: 'Home', path: '/dashboard', icon: Home },
  { name: 'Library', path: '/library', icon: Library },
  { name: 'Subjects', path: '/subjects', icon: BookOpen, match: ['/subject/'] },
  { name: 'Practice', path: '/practice', icon: ListChecks, match: PRACTICE_PATHS },
  { name: 'Exam plan', path: '/exam-plan', icon: Target, match: ['/today'] },
  { name: 'Coding lab', path: '/coding-lab', icon: Code2 },
  { name: 'Campus', path: '/community', icon: Users, match: ['/social', '/explore'] },
];

const isActive = (pathname: string, item: NavItem) => {
  if (item.path === '/dashboard') return pathname === '/dashboard';
  return [item.path, ...(item.match ?? [])].some((p) => pathname === p || pathname.startsWith(p.endsWith('/') ? p : `${p}/`));
};

function NavRow({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-3 h-9 px-2.5 rounded-md text-sm transition-colors ${
 active
 ? 'bg-secondary text-foreground font-medium'
 : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
 }`}
    >
      <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-primary' : ''}`} strokeWidth={1.8} />
      <span className="truncate flex-1">{item.name}</span>
      {item.badge ? <CampusCountBadge count={item.badge} /> : null}
    </Link>
  );
}

export const CampusSidebar: React.FC<CampusSidebarProps> = ({ isOpen = false, onClose, unreadMessagesCount = 0 }) => {
  const { pathname } = useLocation();
  const { user, profile, role, signOut } = useAuth();
  const isAdmin = role === 'admin' || user?.email?.toLowerCase() === 'maherbhatt01@gmail.com';

  const more: NavItem[] = [
    { name: 'Study planner', path: '/study-planner', icon: CalendarDays },
    { name: 'Attendance & SGPA', path: '/calculator', icon: Calculator, match: ['/gpa-calculator'] },
    { name: 'Study materials', path: '/materials', icon: FileText },
    { name: 'Progress', path: '/analytics', icon: BarChart3 },
    { name: 'Messages', path: '/inbox', icon: MessageSquare, match: ['/messages'], badge: unreadMessagesCount || undefined },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
    ...(isAdmin ? [{ name: 'Admin', path: '/admin', icon: Shield }] : []),
  ];

  const moreHasActive = more.some((m) => isActive(pathname, m));
  const [moreOpen, setMoreOpen] = useState(moreHasActive);
  useEffect(() => {
    if (moreHasActive) setMoreOpen(true);
  }, [moreHasActive]);

  const content = (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border select-none">
      <div className="h-14 px-4 flex items-center justify-between shrink-0">
        <Link to="/dashboard" onClick={onClose} aria-label="CampusLoop home">
          <CampusLoopLogo size="sm" />
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:bg-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 pt-2 pb-4">
        <div className="space-y-0.5">
          {PRIMARY.map((item) => (
            <NavRow key={item.path} item={item} active={isActive(pathname, item)} onClick={onClose} />
          ))}
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
            className="w-full flex items-center justify-between h-8 px-2.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <span>More</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? '' : '-rotate-90'}`} />
          </button>
          {moreOpen && (
            <div className="mt-0.5 space-y-0.5">
              {more.map((item) => (
                <NavRow key={item.path} item={item} active={isActive(pathname, item)} onClick={onClose} />
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="p-3 border-t border-sidebar-border shrink-0 space-y-2">
        <UniversityDropdown variant="compact" className="w-full" />
        {user ? (
          <div className="flex items-center gap-1">
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-2.5 min-w-0 flex-1 p-1.5 rounded-md hover:bg-secondary transition-colors"
            >
              <CampusAvatar src={resolveAvatarUrl(profile, user)} name={profile?.display_name || user.email || 'Student'} size={32} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{profile?.display_name || 'Student'}</p>
                <p className="text-xs text-muted-foreground truncate">{profile?.branch || 'View profile'}</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              title="Sign out"
              aria-label="Sign out"
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            onClick={onClose}
            className="flex items-center justify-center h-9 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex flex-col w-60 shrink-0 h-full z-30">{content}</aside>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={onClose} />
          <div className="relative w-72 max-w-[85vw] h-full shadow-xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
