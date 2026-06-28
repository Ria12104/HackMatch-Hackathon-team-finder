'use client';

// =============================================================================
// HackMatch — Root Application Component
// =============================================================================
// Holds top-level shared state (auth, selected hackathon, matches), the
// navigate() function used by every screen, and the phone-frame shell.
//
// To add a new screen:
//   1. Add its name to the Screen type in src/types/index.ts
//   2. Create its component in src/components/screens/
//   3. Import it here and add a case to renderScreen()
// =============================================================================


import { useState } from 'react';

// Types
import type { Screen, Navigate, ScreenProps, Match, Hackathon, UserProfile } from '@/types';

// Screen components
import { SplashScreen }       from '@/components/screens/SplashScreen';
import { AuthScreen }         from '@/components/screens/AuthScreen';
import { ProfileBuilder }     from '@/components/screens/ProfileBuilder';
import { HackathonDashboard } from '@/components/screens/HackathonDashboard';
import { AddHackathon }       from '@/components/screens/AddHackathon';
import { HackathonDetail }    from '@/components/screens/HackathonDetail';
import { TeammateDiscovery }  from '@/components/screens/TeammateDiscovery';
import { MatchSuccess }       from '@/components/screens/MatchSuccess';
import { MatchesList }        from '@/components/screens/MatchesList';
import { ContactReveal }      from '@/components/screens/ContactReveal';
import { ChatScreen }         from '@/components/screens/ChatScreen';
import { ProfileScreen }      from '@/components/screens/ProfileScreen';
import { TeamConfirm }        from '@/components/screens/TeamConfirm';

// Initial data
import { initMatches } from '@/constants/mockData';

// ---------------------------------------------------------------------------
// App Component
// ---------------------------------------------------------------------------

export default function HackMatchApp() {
  // Shared state — will move to Context / React Query once backend is live
  const [screen, setScreen]                       = useState<Screen>('dashboard');
  const [isAuthenticated, setIsAuthenticated]     = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [matchProfile, setMatchProfile]           = useState<UserProfile | null>(null);
  const [activeMatch, setActiveMatch]             = useState<Match | null>(null);
  const [matches, setMatches]                     = useState<Match[]>(initMatches);

  // ---------------------------------------------------------------------------
  // Navigate — the single function used by every screen to change views.
  // Optionally pass a payload to set context for the destination screen.
  // ---------------------------------------------------------------------------
  const navigate: Navigate = (s, opts) => {
    if (opts?.hackathon    !== undefined) setSelectedHackathon(opts.hackathon);
    if (opts?.matchProfile !== undefined) setMatchProfile(opts.matchProfile);
    if (opts?.activeMatch  !== undefined) setActiveMatch(opts.activeMatch);
    setScreen(s);
  };

  // Bundle all props in one object so every screen gets the same shape
  const screenProps: ScreenProps = {
    navigate,
    isAuthenticated,
    setIsAuthenticated,
    selectedHackathon,
    matchProfile,
    activeMatch,
    matches,
    setMatches,
  };

  // ---------------------------------------------------------------------------
  // Screen renderer — add new screens here
  // ---------------------------------------------------------------------------
  const renderScreen = () => {
    switch (screen) {
      case 'splash':           return <SplashScreen       {...screenProps} />;
      case 'auth':             return <AuthScreen          {...screenProps} />;
      case 'profile-builder':  return <ProfileBuilder      {...screenProps} />;
      case 'dashboard':        return <HackathonDashboard  {...screenProps} />;
      case 'add-hackathon':    return <AddHackathon        {...screenProps} />;
      case 'hackathon-detail': return <HackathonDetail     {...screenProps} />;
      case 'discover':         return <TeammateDiscovery   {...screenProps} />;
      case 'match-success':    return <MatchSuccess        {...screenProps} />;
      case 'matches':          return <MatchesList         {...screenProps} />;
      case 'contact-reveal':   return <ContactReveal       {...screenProps} />;
      case 'chat':             return <ChatScreen          {...screenProps} />;
      case 'profile':          return <ProfileScreen       {...screenProps} />;
      case 'team-confirm':     return <TeamConfirm         {...screenProps} />;
      default:                 return <HackathonDashboard  {...screenProps} />;
    }
  };

  // ---------------------------------------------------------------------------
  // Shell — the phone frame wrapper. The screens render inside the inner div.
  // ---------------------------------------------------------------------------
  return (
    <div className="size-full flex items-center justify-center bg-[#EAD9D4] font-sans">
      <div
        className="relative overflow-hidden flex flex-col bg-[#F9EDEA]"
        style={{
          width: 'min(390px, 100vw)',
          height: 'min(844px, 100svh)',
          borderRadius: 44,
          boxShadow: '0 24px 64px rgba(45,27,30,0.18), 0 0 0 1px rgba(195,140,145,0.15)',
        }}
      >
        {/* ── Fake status bar (purely cosmetic) ── */}
        <div className="flex items-center justify-between px-7 pt-3.5 pb-1 shrink-0">
          <span className="text-xs font-semibold text-[#2D1B1E]">9:41</span>
          <div className="flex items-center gap-1.5">
            {/* Signal bars */}
            <div className="flex items-end gap-0.5">
              {[3, 5, 7, 9].map((h, i) => (
                <div
                  key={i}
                  style={{ width: 2.5, height: h }}
                  className={`rounded-sm ${i < 3 ? 'bg-[#2D1B1E]' : 'bg-[#2D1B1E]/30'}`}
                />
              ))}
            </div>
            {/* Wi-Fi icon */}
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <circle cx="7" cy="9.2" r=".8" fill="#2D1B1E" />
              <path d="M4.2 6.8C5 6 6 5.6 7 5.6s2 .4 2.8 1.2" stroke="#2D1B1E" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M1.4 4C3 2.5 4.9 1.7 7 1.7s4 .8 5.6 2.3" stroke="#2D1B1E" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {/* Battery */}
            <div className="flex items-center border border-[#9B7A7A] rounded-sm p-px" style={{ width: 22, height: 11 }}>
              <div className="h-full bg-[#2D1B1E] rounded-[1px]" style={{ width: '80%' }} />
            </div>
          </div>
        </div>

        {/* ── Screen content area ── */}
        <div className="flex-1 overflow-hidden relative">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
}
