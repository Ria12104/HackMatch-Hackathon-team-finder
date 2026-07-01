'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, Compass, Users, User } from 'lucide-react';
import { useAppState } from '@/context/AppContext';
import { mockHackathons } from '@/constants/mockData';
import { ROSE, DEEP, SUBT, BORDER, PEACH } from '@/constants/palette';

// Discover goes directly to the featured hackathon's swipe screen.
// If auth is required and user isn't authed, redirect to login.
const featuredId = mockHackathons.find(h => h.isFeatured)?.id ?? mockHackathons[0]?.id ?? '1';

const TABS = [
  { path: '/',                                  activePath: '/',           label: 'Home',     Icon: LayoutGrid, requiresAuth: false },
  { path: `/hackathons/${featuredId}/discover`, activePath: '/hackathons', label: 'Discover', Icon: Compass,    requiresAuth: true  },
  { path: '/matches',                           activePath: '/matches',    label: 'Matches',  Icon: Users,      requiresAuth: true  },
  { path: '/profile',                           activePath: '/profile',    label: 'Profile',  Icon: User,       requiresAuth: true  },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, matches } = useAppState();

  const handleTab = (path: string, requiresAuth: boolean) => {
    if (requiresAuth && !isAuthenticated) return; // disabled — no redirect
    router.push(path);
  };

  return (
    <div
      className="flex bg-white"
      style={{ borderTop: `1px solid ${BORDER}`, paddingBottom: 18, paddingTop: 10 }}
    >
      {TABS.map(({ path, activePath, label, Icon, requiresAuth }) => {
        const isActive =
          activePath === '/'
            ? pathname === '/'
            : pathname.startsWith(activePath);

        return (
          <button
            key={path}
            onClick={() => handleTab(path, requiresAuth)}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <div
              className="relative flex items-center justify-center w-10 h-7 rounded-full transition-colors"
              style={{ background: isActive ? PEACH : 'transparent' }}
            >
              <Icon size={18} style={{ color: isActive ? DEEP : SUBT }} strokeWidth={isActive ? 2 : 1.7} />

              {activePath === '/matches' && matches.length > 0 && isAuthenticated && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
                  style={{ background: ROSE, fontSize: 8 }}
                >
                  {matches.length}
                </span>
              )}
            </div>
            <span className="text-[9px] font-medium" style={{ color: isActive ? DEEP : SUBT }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
