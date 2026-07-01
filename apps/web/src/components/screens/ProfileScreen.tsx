'use client';

// =============================================================================
// Profile Screen
// =============================================================================
// Displays the current user's profile, settings, and links.
//
// BACKEND INTEGRATION:
//   Currently reads from the static `currentUser` mock object.
//   When backend is ready:
//     1. Call userService.getMyProfile() on mount to load real data
//     2. The Edit button should call userService.updateMyProfile()
//        with the changed fields
//   See src/services/userService.ts → GET /api/me, PATCH /api/me
// =============================================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Globe, Linkedin, ToggleLeft, ToggleRight, LogOut, Edit3 } from 'lucide-react';

import { useAppState } from '@/context/AppContext';
import { currentUser } from '@/constants/mockData';
import { ROSE, DEEP, PEACH, BG, TEXT, SUBT, BORDER } from '@/constants/palette';

// ---------------------------------------------------------------------------
// Section row — label + content block
// ---------------------------------------------------------------------------
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
      <p className="text-[9px] uppercase tracking-widest font-semibold mb-3" style={{ color: ROSE }}>
        {label}
      </p>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Profile Screen
// ---------------------------------------------------------------------------
export function ProfileScreen() {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated, matches } = useAppState();
  // TODO: replace with userService.getMyProfile() when backend is ready
  const u = currentUser;

  const [discovery, setDiscovery] = useState(true);
  const [notifs,    setNotifs]    = useState(true);
  const [teamSize,  setTeamSize]  = useState('4');

  const SETTINGS = [
    { label: 'Discovery Mode', sub: 'Show me to potential teammates', on: discovery, toggle: () => setDiscovery(d => !d) },
    { label: 'Notifications',  sub: 'Match alerts and messages',       on: notifs,   toggle: () => setNotifs(n => !n)    },
  ];

  const LINKS = [
    { Icon: Github,   val: u.github,    color: TEXT      },
    { Icon: Linkedin, val: u.linkedin,  color: '#0A66C2' },
    { Icon: Globe,    val: u.portfolio, color: ROSE      },
  ];

  const STATS = [
    { value: matches.length,  label: 'Matches'    },
    { value: 5,               label: 'Hackathons' },
    { value: u.projects.length, label: 'Projects' },
  ];

  return (
    <div className="h-full flex flex-col relative" style={{ background: BG }}>
      <div className="flex-1 overflow-y-auto pb-[72px]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <h2 className="font-serif font-bold text-xl" style={{ color: TEXT }}>Profile</h2>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{ borderColor: BORDER, color: SUBT, background: 'white' }}
          >
            <Edit3 size={12} /> Edit
          </button>
        </div>

        {/* ── Identity card ── */}
        <div className="px-5 py-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
              style={{ background: PEACH, border: `3px solid ${ROSE}` }}
            >
              <span className="font-serif font-bold text-lg" style={{ color: DEEP }}>
                {u.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl" style={{ color: TEXT }}>{u.name}</h3>
              <p className="text-xs" style={{ color: ROSE }}>{u.role} · {u.experience}</p>
            </div>
          </div>

          <p className="font-serif text-sm leading-relaxed italic mb-4" style={{ color: SUBT }}>{u.bio}</p>

          {/* Stats row */}
          <div className="flex gap-5">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="font-bold text-xl" style={{ color: DEEP }}>{value}</p>
                <p className="text-[10px]" style={{ color: SUBT }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Skills & Stack ── */}
        <Row label="Skills & Stack">
          <div className="flex flex-wrap gap-1.5">
            {u.skills.map(s => (
              <span key={s} className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                style={{ background: PEACH, color: DEEP }}>{s}</span>
            ))}
            {u.techStack.map(s => (
              <span key={s} className="px-2.5 py-1 rounded-full text-[11px] border"
                style={{ borderColor: BORDER, color: TEXT, background: 'white' }}>{s}</span>
            ))}
          </div>
        </Row>

        {/* ── Hackathon history ── */}
        <Row label="Hackathon History">
          {u.projects.map(proj => (
            <p key={proj} className="font-serif text-sm mb-2" style={{ color: TEXT }}>· {proj}</p>
          ))}
        </Row>

        {/* ── Links ── */}
        <Row label="Links">
          {LINKS.map(({ Icon, val, color }) => (
            <div key={val} className="flex items-center gap-2 mb-2.5">
              <Icon size={13} style={{ color }} />
              <span className="text-xs" style={{ color }}>{val}</span>
            </div>
          ))}
        </Row>

        {/* ── Settings ── */}
        <Row label="Settings">
          {SETTINGS.map(({ label, sub, on, toggle }) => (
            <div key={label} className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium" style={{ color: TEXT }}>{label}</p>
                <p className="text-[10px]" style={{ color: SUBT }}>{sub}</p>
              </div>
              <button onClick={toggle} style={{ color: on ? DEEP : BORDER }}>
                {on ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>
          ))}

          {/* Team size picker */}
          <div>
            <p className="text-xs mb-2" style={{ color: SUBT }}>Team size limit</p>
            <div className="flex gap-1.5">
              {['2', '3', '4', '5', '6'].map(s => (
                <button
                  key={s}
                  onClick={() => setTeamSize(s)}
                  className="flex-1 py-2 rounded-xl text-[11px] font-medium border transition-all"
                  style={teamSize === s
                    ? { background: PEACH, borderColor: ROSE, color: DEEP }
                    : { background: 'white', borderColor: BORDER, color: SUBT }
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Row>

        {/* ── Sign out ── */}
        <div className="px-5 py-4">
          <button
            onClick={() => { setIsAuthenticated(false); router.push('/'); }}
            className="w-full py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 border"
            style={{ borderColor: BORDER, color: ROSE, background: 'white' }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

    </div>
  );
}

