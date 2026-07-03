'use client';

// =============================================================================
// Matches List Screen
// =============================================================================
// =============================================================================

import { useRouter } from 'next/navigation';
import { MessageCircle, Eye, Heart } from 'lucide-react';

import { useAppState } from '@/context/AppContext';
import type { Match } from '@/types';
import { ROSE, DEEP, PEACH, BG, TEXT, SUBT, BORDER } from '@/constants/palette';

// ---------------------------------------------------------------------------
// Single match row
// ---------------------------------------------------------------------------
function MatchRow({ m, onChat, onContact }: { m: Match; onChat: () => void; onContact: () => void }) {
  const p = m.profile;
  const initials = p.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="flex items-center gap-3 py-3.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
      {/* Avatar */}
      <div
        className="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center"
        style={{ background: PEACH, border: `2px solid ${ROSE}` }}
      >
        <span className="font-serif font-bold text-xs" style={{ color: DEEP }}>{initials}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-serif font-semibold text-sm truncate" style={{ color: TEXT }}>{p.name}</p>
        <p className="text-[11px]" style={{ color: SUBT }}>{p.role}</p>
        <p className="text-[10px] mt-0.5" style={{ color: ROSE }}>{m.hackathon} · {m.matchDate}</p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={onChat}
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: DEEP }}
          title="Open chat"
        >
          <MessageCircle size={14} color="white" />
        </button>
        <button
          onClick={onContact}
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'white', border: `1px solid ${BORDER}` }}
          title="View contact info"
        >
          <Eye size={14} style={{ color: SUBT }} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Matches List Screen
// ---------------------------------------------------------------------------
export function MatchesList() {
  const router = useRouter();
  const { isAuthenticated, matches } = useAppState();
  return (
    <div className="h-full flex flex-col relative" style={{ background: BG }}>
      <div className="flex-1 overflow-y-auto pb-[72px]">

        {/* ── Header ── */}
        <div className="px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <h2 className="font-serif font-bold text-xl" style={{ color: TEXT }}>Matches</h2>
          <p className="text-xs mt-0.5" style={{ color: SUBT }}>
            {matches.length} mutual {matches.length === 1 ? 'connection' : 'connections'}
          </p>
        </div>

        {/* ── Empty state ── */}
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 px-8">
            <Heart size={28} style={{ color: BORDER }} />
            <h3 className="font-serif font-bold text-lg" style={{ color: TEXT }}>No matches yet</h3>
            <p className="text-xs text-center leading-relaxed" style={{ color: SUBT }}>
              Start swiping to find teammates.
            </p>
            <button
              onClick={() => router.push('/hackathons')}
              className="mt-2 px-6 py-2.5 rounded-full text-white text-sm font-semibold"
              style={{ background: DEEP }}
            >
              Find Teammates
            </button>
          </div>
        ) : (
          <div className="px-5">
            {matches.map(m => (
              <MatchRow
                key={m.id}
                m={m}
                onChat={()    => router.push(`/matches/${m.id}/chat`)}
                onContact={() => router.push(`/matches/${m.id}/contact`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pass 0 for badge — already on the Matches screen so badge not needed */}
    </div>
  );
}
