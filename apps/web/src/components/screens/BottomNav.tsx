'use client';

// =============================================================================
// Bottom Navigation Bar
// =============================================================================
//
// Persistent nav shown at the bottom of main screens.
// Auth-gated tabs (Discover, Matches, Profile) are dimmed and disabled
// when the user is not signed in.
// =============================================================================

import { LayoutGrid, Compass, Users, User } from 'lucide-react';
import type { Navigate, Screen } from '@/types';
import { ROSE, DEEP, SUBT, BORDER, PEACH } from '@/constants/palette';

interface BottomNavProps {
  /** The currently active tab — highlights that icon */
  active: 'dashboard' | 'discover' | 'matches' | 'profile';
  navigate: Navigate;
  /** Shows a badge on the Matches tab */
  matchCount?: number;
  /** Locks auth-gated tabs when false */
  isAuthenticated?: boolean;
}

const TABS: { id: Screen; label: string; Icon: typeof LayoutGrid; requiresAuth: boolean }[] = [
  { id: 'dashboard', label: 'Home',     Icon: LayoutGrid, requiresAuth: false },
  { id: 'discover',  label: 'Discover', Icon: Compass,    requiresAuth: true  },
  { id: 'matches',   label: 'Matches',  Icon: Users,      requiresAuth: true  },
  { id: 'profile',   label: 'Profile',  Icon: User,       requiresAuth: true  },
];

export function BottomNav({ active, navigate, matchCount = 0, isAuthenticated = true }: BottomNavProps) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex bg-white z-50"
      style={{ borderTop: `1px solid ${BORDER}`, paddingBottom: 18, paddingTop: 10 }}
    >
      {TABS.map(({ id, label, Icon, requiresAuth }) => {
        const isActive   = active === id;
        const isDisabled = requiresAuth && !isAuthenticated;

        return (
          <button
            key={id}
            onClick={() => !isDisabled && navigate(id)}
            className={`flex-1 flex flex-col items-center gap-1 transition-all ${
              isDisabled ? 'opacity-30 cursor-default' : 'cursor-pointer'
            }`}
          >
            <div
              className="relative flex items-center justify-center w-10 h-7 rounded-full transition-colors"
              style={{ background: isActive ? PEACH : 'transparent' }}
            >
              <Icon size={18} style={{ color: isActive ? DEEP : SUBT }} strokeWidth={isActive ? 2 : 1.7} />

              {/* Match count badge */}
              {id === 'matches' && matchCount > 0 && !isDisabled && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
                  style={{ background: ROSE, fontSize: 8 }}
                >
                  {matchCount}
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
