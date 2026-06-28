'use client';

// =============================================================================
// Add Hackathon Screen
// =============================================================================
//
// Form for authenticated users to publish a new hackathon.
//
// BACKEND INTEGRATION:
//   The handlePublish function calls hackathonService.createHackathon()
//   which is currently a mock stub. When the backend is ready:
//     1. Open src/services/hackathonService.ts
//     2. Replace the createHackathon() body with a POST /api/hackathons call
//     3. The UI here does NOT need to change.
// =============================================================================

import { useState } from 'react';
import { ArrowLeft, Calendar, Globe, Link, AlignLeft } from 'lucide-react';

import type { ScreenProps } from '@/types';
import { ROSE, DEEP, PEACH, BG, TEXT, SUBT, BORDER } from '@/constants/palette';
import { createHackathon } from '@/services/hackathonService';

type Mode = 'Online' | 'Offline' | 'Hybrid';
const MODES: Mode[] = ['Online', 'Offline', 'Hybrid'];
const TEAM_SIZES = ['1', '1-2', '2-4', '2-5', '3-6'];

export function AddHackathon({ navigate }: ScreenProps) {
  const [name,        setName]        = useState('');
  const [description, setDescription] = useState('');
  const [regLink,     setRegLink]     = useState('');
  const [startDate,   setStartDate]   = useState('');
  const [endDate,     setEndDate]     = useState('');
  const [teamSize,    setTeamSize]    = useState('2-4');
  const [mode,        setMode]        = useState<Mode>('Online');
  const [loading,     setLoading]     = useState(false);

  const canPublish = name.trim().length > 0;

  const inputStyle = { background: 'white', border: `1px solid ${BORDER}`, color: TEXT };

  const handlePublish = async () => {
    if (!canPublish) return;
    setLoading(true);
    try {
      // createHackathon is a stub — replace body in hackathonService.ts
      await createHackathon({ name, description, registrationLink: regLink, startDate, endDate, teamSize, mode });
      navigate('dashboard');
    } catch {
      // TODO: show error toast when backend returns an error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: BG }}>
      {/* ── Header ── */}
      <div
        className="sticky top-0 z-10 flex items-center gap-2 px-3 py-3"
        style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}
      >
        <button onClick={() => navigate('dashboard')} className="p-1" style={{ color: SUBT }}>
          <ArrowLeft size={16} />
        </button>
        <p className="font-serif font-semibold text-[15px]" style={{ color: TEXT }}>Add Hackathon</p>
      </div>

      <div className="px-5 py-5 flex flex-col gap-4">

        {/* Name */}
        <div className="relative">
          <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBT }} />
          <input
            className="w-full px-3 py-2.5 pl-9 rounded-xl text-sm outline-none transition-all"
            style={inputStyle}
            placeholder="Hackathon name *"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="relative">
          <AlignLeft size={13} className="absolute left-3 top-3" style={{ color: SUBT }} />
          <textarea
            rows={3}
            placeholder="Description"
            className="w-full px-3 py-2.5 pl-9 rounded-xl text-sm outline-none resize-none leading-relaxed"
            style={inputStyle}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        {/* Registration link */}
        <div className="relative">
          <Link size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBT }} />
          <input
            className="w-full px-3 py-2.5 pl-9 rounded-xl text-sm outline-none"
            style={inputStyle}
            placeholder="Registration link"
            value={regLink}
            onChange={e => setRegLink(e.target.value)}
          />
        </div>

        {/* Dates */}
        <div className="flex gap-2">
          {(['Start date', 'End date'] as const).map(label => (
            <div key={label} className="relative flex-1">
              <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SUBT }} />
              <input
                type="date"
                className="w-full px-3 py-2.5 pl-9 rounded-xl text-sm outline-none"
                style={inputStyle}
                value={label === 'Start date' ? startDate : endDate}
                onChange={e => label === 'Start date' ? setStartDate(e.target.value) : setEndDate(e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Team size */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: SUBT }}>Team size</p>
          <div className="flex gap-1.5">
            {TEAM_SIZES.map(s => (
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

        {/* Mode */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: SUBT }}>Mode</p>
          <div className="flex gap-2">
            {MODES.map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2.5 rounded-xl text-[11px] font-medium border transition-all"
                style={mode === m
                  ? { background: PEACH, borderColor: ROSE, color: DEEP }
                  : { background: 'white', borderColor: BORDER, color: SUBT }
                }
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px" style={{ background: BORDER }} />

        <button
          disabled={!canPublish || loading}
          onClick={handlePublish}
          className="w-full py-3.5 rounded-full text-sm font-semibold text-white transition-opacity"
          style={{
            background: canPublish ? DEEP : '#D4B5B5',
            cursor:     canPublish ? 'pointer' : 'not-allowed',
            opacity:    loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Publishing…' : 'Publish Hackathon'}
        </button>

        <div className="h-4" />
      </div>
    </div>
  );
}
