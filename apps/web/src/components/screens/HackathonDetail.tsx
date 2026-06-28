'use client';

// =============================================================================
// Hackathon Detail Screen
// =============================================================================
//
// Detailed view for a single hackathon event.
// =============================================================================

import { useRouter } from 'next/navigation';
import { ArrowLeft, Wifi, MapPin, Calendar, Users, Trophy, Clock, CheckCircle2, ExternalLink } from 'lucide-react';

import { useAppState } from '@/context/AppContext';
import type { Hackathon } from '@/types';
import { ROSE, DEEP, PEACH, BG, TEXT, SUBT, BORDER } from '@/constants/palette';

export function HackathonDetail({ hackathon: h }: { hackathon: Hackathon }) {
  const router = useRouter();
  const { isAuthenticated } = useAppState();
  if (!h) return null;

  const ModeIcon = h.mode === 'Online' ? Wifi : MapPin;

  const handleFindTeam = () =>
    isAuthenticated
      ? router.push(`/hackathons/${h.id}/discover`)
      : router.push('/login');

  return (
    <div className="h-full overflow-y-auto" style={{ background: BG }}>
      {/* ── Sticky header ── */}
      <div
        className="sticky top-0 z-10 flex items-center gap-2 px-3 py-3"
        style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}
      >
        <button onClick={() => router.push('/')} className="p-1" style={{ color: SUBT }}>
          <ArrowLeft size={18} />
        </button>
        <p className="font-serif font-semibold text-[15px] truncate" style={{ color: TEXT }}>{h.name}</p>
      </div>

      <div className="px-5 py-5">
        <h1 className="font-serif font-bold text-2xl leading-tight mb-2" style={{ color: TEXT }}>{h.name}</h1>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          {h.tags.map(t => (
            <span key={t} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
              style={{ background: PEACH, color: DEEP }}>
              {t}
            </span>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { Icon: Calendar, label: h.shortDate },
            { Icon: ModeIcon,  label: h.mode      },
            { Icon: Users,    label: h.teamSize   },
            { Icon: Trophy,   label: h.prize      },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
              style={{ background: 'white', border: `1px solid ${BORDER}` }}>
              <Icon size={14} style={{ color: ROSE }} />
              <span className="text-xs font-medium" style={{ color: TEXT }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Deadline banner */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-5"
          style={{ background: PEACH, border: `1px solid ${ROSE}30` }}
        >
          <Clock size={13} style={{ color: DEEP }} />
          <div>
            <p className="text-[10px] font-semibold" style={{ color: DEEP }}>Registration Deadline</p>
            <p className="font-serif text-sm font-semibold" style={{ color: TEXT }}>{h.deadline}</p>
          </div>
        </div>

        <div className="h-px mb-5" style={{ background: BORDER }} />

        {/* About */}
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: ROSE }}>About</p>
        <p className="text-sm leading-relaxed mb-5" style={{ color: SUBT }}>{h.description}</p>

        <div className="h-px mb-5" style={{ background: BORDER }} />

        {/* Rules */}
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: ROSE }}>Rules</p>
        <div className="flex flex-col gap-2.5 mb-7">
          {h.rules.map((rule, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CheckCircle2 size={14} style={{ color: ROSE, flexShrink: 0, marginTop: 1 }} />
              <p className="text-sm leading-relaxed" style={{ color: SUBT }}>{rule}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleFindTeam}
            className="w-full py-3.5 rounded-full text-white text-sm font-semibold"
            style={{ background: DEEP }}
          >
            {isAuthenticated ? 'Find Teammates' : 'Looking For Team →'}
          </button>
          <button
            className="w-full py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2"
            style={{ background: 'white', border: `1px solid ${BORDER}`, color: SUBT }}
          >
            <ExternalLink size={13} /> Official Registration
          </button>
        </div>
      </div>
    </div>
  );
}
