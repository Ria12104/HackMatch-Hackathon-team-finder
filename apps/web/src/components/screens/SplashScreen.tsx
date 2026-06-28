'use client';

// =============================================================================
// Splash Screen
// =============================================================================
//
// The entry screen shown on first load.
// Currently bypassed (app starts on 'dashboard') — to enable it, change
// the initial useState value in HackMatchApp.tsx from 'dashboard' to 'splash'.
// =============================================================================

import type { ScreenProps } from '@/types';
import { ROSE, DEEP, BG, SUBT } from '@/constants/palette';

export function SplashScreen({ navigate }: ScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-8" style={{ background: BG }}>
      <h1 className="font-serif font-bold text-4xl tracking-tight mb-2" style={{ color: ROSE }}>
        HackMatch
      </h1>
      <p className="text-sm text-center leading-relaxed mb-10" style={{ color: SUBT }}>
        Find your perfect hackathon team through swipe-based matching.
      </p>

      <div className="w-full flex flex-col gap-3">
        <button
          onClick={() => navigate('dashboard')}
          className="w-full py-3.5 rounded-full text-white text-sm font-semibold"
          style={{ background: DEEP }}
        >
          Browse Hackathons
        </button>
        <button
          onClick={() => navigate('auth')}
          className="w-full py-3.5 rounded-full text-sm font-semibold border-2"
          style={{ borderColor: ROSE, color: ROSE, background: 'transparent' }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
