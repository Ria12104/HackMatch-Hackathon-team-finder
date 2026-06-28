'use client';

// =============================================================================
// Team Confirm Screen
// =============================================================================
// Final step: two matched users officially form a team for a hackathon.
//
// BACKEND INTEGRATION:
//   The "Confirm Team" button should call a team creation endpoint.
//   Suggested endpoint: POST /api/teams
//   Body: { matchId, teamName, hackathonId }
//   Create a teamService.ts in src/services/ when ready.
// =============================================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Users } from 'lucide-react';

import { currentUser } from '@/constants/mockData';
import type { Match } from '@/types';
import { ROSE, DEEP, PEACH, BG, TEXT, SUBT, BORDER } from '@/constants/palette';

export function TeamConfirm({ activeMatch }: { activeMatch: Match }) {
  const router = useRouter();
  const [teamName,  setTeamName]  = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const p = activeMatch?.profile ?? null;

  if (!p) return null;

  // ── Confirmation success state ──
  if (confirmed) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center" style={{ background: BG }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div
            className="w-14 h-14 rounded-full border-2 flex items-center justify-center mx-auto mb-5"
            style={{ borderColor: DEEP }}
          >
            <Check size={24} style={{ color: DEEP }} />
          </div>
          <h2 className="font-serif font-bold text-2xl mb-2" style={{ color: TEXT }}>Team Formed!</h2>
          <p className="text-sm leading-relaxed mb-1.5" style={{ color: SUBT }}>
            <span className="font-serif font-semibold" style={{ color: TEXT }}>
              {teamName || 'Your team'}
            </span>{' '}
            is ready for {activeMatch?.hackathon ?? 'the hackathon'}.
          </p>
          <p className="text-[11px] mb-8" style={{ color: ROSE }}>Good luck building something great.</p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 rounded-full text-white text-sm font-semibold"
            style={{ background: DEEP }}
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Team confirmation form ──
  return (
    <div className="h-full overflow-y-auto" style={{ background: BG }}>
      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-3 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <button
          onClick={() => router.push(`/matches/${activeMatch?.id}/chat`)}
          className="p-1"
          style={{ color: SUBT }}
        >
          <ArrowLeft size={16} />
        </button>
        <p className="font-serif font-semibold text-[15px]" style={{ color: TEXT }}>Confirm Team</p>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">
        {/* Hackathon context */}
        <div className="px-4 py-3 rounded-xl" style={{ background: PEACH }}>
          <p className="text-[9px] uppercase tracking-widest font-semibold mb-1" style={{ color: ROSE }}>
            Hackathon
          </p>
          <p className="font-serif font-semibold text-sm" style={{ color: TEXT }}>
            {activeMatch?.hackathon ?? 'EcoHack 2024'}
          </p>
        </div>

        {/* Team members */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} style={{ color: SUBT }} />
            <p className="font-serif font-semibold text-sm" style={{ color: TEXT }}>Team Members</p>
          </div>
          <div className="flex flex-col gap-2">
            {[currentUser, p].map((member, i) => (
              <div
                key={member.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-white"
                style={{ border: `1px solid ${BORDER}` }}
              >
                <div>
                  <p className="font-serif font-semibold text-sm" style={{ color: TEXT }}>{member.name}</p>
                  <p className="text-xs" style={{ color: SUBT }}>{member.role} · {member.experience}</p>
                </div>
                {i === 0 && (
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ background: PEACH, color: DEEP }}
                  >
                    You
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Team name (optional) */}
        <div>
          <p className="font-serif font-semibold text-sm mb-1.5" style={{ color: TEXT }}>
            Team Name{' '}
            <span className="font-sans text-[11px] font-normal" style={{ color: SUBT }}>(optional)</span>
          </p>
          <input
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            placeholder="e.g. EcoBuilders, Team Green…"
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ background: 'white', border: `1px solid ${BORDER}`, color: TEXT }}
          />
        </div>

        <div className="h-px" style={{ background: BORDER }} />

        <p className="text-xs leading-relaxed" style={{ color: SUBT }}>
          By confirming, both members agree to form a team for this hackathon.
        </p>

        {/* TODO: replace setConfirmed with teamService.createTeam() call */}
        <button
          onClick={() => setConfirmed(true)}
          className="w-full py-3.5 rounded-full text-white text-sm font-semibold"
          style={{ background: DEEP }}
        >
          Confirm Team
        </button>
      </div>
    </div>
  );
}

