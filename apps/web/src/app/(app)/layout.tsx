'use client';

// =============================================================================
// (app) Layout — Phone-like App Shell
// =============================================================================
// Provides:
//  - Centered phone container (mobile-first, max 430px, 100dvh)
//  - Content area = total height minus BottomNav (calc-based, no overlap)
//  - Shared BottomNav — route-aware via usePathname
// =============================================================================

import { BottomNav } from '@/components/screens/BottomNav';

const NAV_HEIGHT = 72; // keep in sync with BottomNav paddingBottom + paddingTop + icon

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-neutral-100 flex items-center justify-center">
      <div
        className="relative w-full bg-white"
        style={{ maxWidth: 430, height: '100dvh', boxShadow: '0 0 60px rgba(0,0,0,0.15)', overflow: 'hidden' }}
      >
        {/* Content — exactly fills space above BottomNav */}
        <div style={{ height: `calc(100dvh - ${NAV_HEIGHT}px)`, overflow: 'hidden' }}>
          {children}
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
