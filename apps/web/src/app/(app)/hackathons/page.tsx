'use client';

// =============================================================================
// /hackathons — Discover landing page
// =============================================================================
// Shows a list of hackathons to pick one for teammate discovery.
// Auth-gated: unauthenticated users see a sign-in prompt.
// =============================================================================

import { useRouter } from 'next/navigation';
import { Compass } from 'lucide-react';

import { useAppState } from '@/context/AppContext';
import { mockHackathons } from '@/constants/mockData';
import { BG, TEXT, SUBT, DEEP, ROSE, PEACH, BORDER } from '@/constants/palette';

export default function Page() {
  const router = useRouter();
  const { isAuthenticated } = useAppState();

  if (!isAuthenticated) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center" style={{ background: BG }}>
        <Compass size={32} style={{ color: ROSE, marginBottom: 12 }} />
        <h2 className="font-serif font-bold text-xl mb-2" style={{ color: TEXT }}>Discover Teammates</h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: SUBT }}>
          Sign in to start matching with teammates for upcoming hackathons.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="px-8 py-3 rounded-full text-white text-sm font-semibold"
          style={{ background: DEEP }}
        >
          Get Started
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto" style={{ background: BG }}>
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2 mb-0.5">
          <Compass size={18} style={{ color: ROSE }} />
          <h2 className="font-serif font-bold text-xl" style={{ color: TEXT }}>Discover</h2>
        </div>
        <p className="text-xs" style={{ color: SUBT }}>Pick a hackathon to find teammates</p>
      </div>

      <div className="px-5 py-4 flex flex-col gap-3">
        {mockHackathons.map(h => (
          <button
            key={h.id}
            onClick={() => router.push(`/hackathons/${h.id}/discover`)}
            className="text-left px-4 py-3.5 rounded-2xl bg-white border w-full transition-shadow hover:shadow-sm"
            style={{ borderColor: BORDER }}
          >
            <p className="font-serif font-semibold text-sm mb-0.5" style={{ color: TEXT }}>{h.name}</p>
            <p className="text-xs mb-2" style={{ color: SUBT }}>{h.shortDate} · {h.mode} · {h.teamSize}</p>
            <div className="flex flex-wrap gap-1.5">
              {h.tags.slice(0, 3).map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: PEACH, color: DEEP }}>
                  {t}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: DEEP, color: 'white' }}>
                Find teammates →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
