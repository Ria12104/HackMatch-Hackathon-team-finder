'use client';

// =============================================================================
// Profile Builder — Onboarding Screen
// =============================================================================
// Quick-setup form shown after signup to collect the user's role and skills.
//
// BACKEND INTEGRATION:
//   On submit, call userService.updateMyProfile({ name, role, skills })
//   to persist the profile. See src/services/userService.ts.
// =============================================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';

import { ROSE, DEEP, PEACH, BG, TEXT, SUBT, BORDER } from '@/constants/palette';
import { mockHackathons } from '@/constants/mockData';

const featuredId = mockHackathons.find(h => h.isFeatured)?.id ?? mockHackathons[0]?.id ?? '1';

// Add new roles and skills here to extend the onboarding options
const ROLES  = ['Developer', 'Designer', 'Product Manager', 'Data Scientist', 'Other'];
const SKILLS = [
  'React', 'Vue.js', 'Node.js', 'Python', 'TypeScript', 'Go', 'Rust',
  'GraphQL', 'Docker', 'AWS', 'Machine Learning', 'UI/UX', 'Figma',
  'PostgreSQL', 'MongoDB', 'Swift',
];

export function ProfileBuilder() {
  const router = useRouter();
  const [name,   setName]   = useState('');
  const [role,   setRole]   = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  const toggleSkill = (s: string) =>
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const isValid   = name.trim().length > 1 && !!role && skills.length >= 1;
  const progress  = [name.trim().length > 1, !!role, skills.length > 0].filter(Boolean).length;

  const handleStart = () => {
    // TODO: call userService.updateMyProfile({ name, role, skills }) here
    router.push(`/hackathons/${featuredId}/discover`);
  };

  return (
    <div className="h-full flex flex-col" style={{ background: BG }}>

      {/* ── Header ── */}
      <div
        className="flex items-center gap-2 px-4 pt-3 pb-3 shrink-0"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <button onClick={() => router.push('/login')} className="p-1" style={{ color: SUBT }}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <p className="font-serif font-semibold text-[15px]" style={{ color: TEXT }}>Quick Setup</p>
          <p className="text-[10px]" style={{ color: SUBT }}>Takes less than a minute</p>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="h-1 shrink-0" style={{ background: '#F0D8D2' }}>
        <div
          className="h-full rounded-r-full transition-all duration-300"
          style={{ width: `${(progress / 3) * 100}%`, background: DEEP }}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">

        {/* Hackathon context banner removed — use URL to pass context */}

        {/* Name */}
        <div>
          <p className="font-serif font-semibold text-sm mb-2" style={{ color: TEXT }}>Your name</p>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full name"
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ background: 'white', border: `1px solid ${BORDER}`, color: TEXT }}
          />
        </div>

        {/* Role */}
        <div>
          <p className="font-serif font-semibold text-sm mb-3" style={{ color: TEXT }}>I am a —</p>
          <div className="flex flex-col gap-2">
            {ROLES.map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm text-left border transition-all"
                style={role === r
                  ? { background: PEACH, borderColor: ROSE, color: DEEP }
                  : { background: 'white', borderColor: BORDER, color: TEXT }
                }
              >
                {r}
                {role === r && <Check size={13} style={{ color: DEEP }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <p className="font-serif font-semibold text-sm mb-1" style={{ color: TEXT }}>Key skills</p>
          <p className="text-[10px] mb-3" style={{ color: SUBT }}>Pick at least one</p>
          <div className="flex flex-wrap gap-1.5">
            {SKILLS.map(s => (
              <button
                key={s}
                onClick={() => toggleSkill(s)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all"
                style={skills.includes(s)
                  ? { background: PEACH, borderColor: ROSE, color: DEEP }
                  : { background: 'white', borderColor: BORDER, color: SUBT }
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="mt-auto pt-2 flex flex-col gap-2">
          <button
            disabled={!isValid}
            onClick={handleStart}
            className="w-full py-3.5 rounded-full text-sm font-semibold text-white transition-opacity"
            style={{
              background: isValid ? DEEP : '#D4B5B5',
              cursor:     isValid ? 'pointer' : 'not-allowed',
            }}
          >
            Start Swiping
          </button>
          <p className="text-[10px] text-center" style={{ color: SUBT }}>
            You can complete your profile later
          </p>
        </div>
      </div>
    </div>
  );
}

