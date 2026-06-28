'use client';

// =============================================================================
// Contact Reveal Screen
// =============================================================================
// =============================================================================

import { ArrowLeft, Mail, Github, Linkedin, Globe, Lock, Copy, Check } from 'lucide-react';
import { useState } from 'react';

import type { ScreenProps } from '@/types';
import { ROSE, DEEP, PEACH, BG, TEXT, SUBT, BORDER } from '@/constants/palette';

export function ContactReveal({ navigate, activeMatch }: ScreenProps) {
  const p = activeMatch?.profile;
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!p) return null;

  const contacts = [
    { key: 'email',     Icon: Mail,     label: 'Email',     value: p.email,     color: DEEP      },
    { key: 'github',    Icon: Github,   label: 'GitHub',    value: p.github,    color: TEXT      },
    { key: 'linkedin',  Icon: Linkedin, label: 'LinkedIn',  value: p.linkedin,  color: '#0A66C2' },
    { key: 'portfolio', Icon: Globe,    label: 'Portfolio', value: p.portfolio, color: ROSE      },
  ];

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: BG }}>
      {/* ── Header ── */}
      <div
        className="sticky top-0 z-10 flex items-center gap-2 px-3 py-3"
        style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}
      >
        <button onClick={() => navigate('matches')} className="p-1" style={{ color: SUBT }}>
          <ArrowLeft size={16} />
        </button>
        <p className="font-serif font-semibold text-[15px]" style={{ color: TEXT }}>Contact Details</p>
      </div>

      <div className="px-5 py-5">
        {/* Profile summary */}
        <div className="pb-5 mb-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <h3 className="font-serif font-bold text-xl mb-0.5" style={{ color: TEXT }}>{p.name}</h3>
          <p className="text-xs mb-3" style={{ color: SUBT }}>{p.role} · {p.experience}</p>
          <div className="flex flex-wrap gap-1.5">
            {p.skills.slice(0, 4).map(s => (
              <span key={s} className="px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                style={{ background: PEACH, color: DEEP }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Privacy note */}
        <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl mb-5" style={{ background: PEACH }}>
          <Lock size={13} style={{ color: DEEP, marginTop: 1, flexShrink: 0 }} />
          <p className="text-xs leading-relaxed" style={{ color: DEEP }}>
            Contact info is only visible after a mutual match.
          </p>
        </div>

        {/* Contact rows */}
        <div className="flex flex-col">
          {contacts.map(({ key, Icon, label, value, color }, i) => (
            <div
              key={key}
              className={`flex items-center gap-3 py-3.5 ${i < contacts.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: BORDER }}
            >
              <Icon size={15} style={{ color, flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: ROSE }}>
                  {label}
                </p>
                <p className="text-sm font-medium truncate" style={{ color }}>{value}</p>
              </div>
              <button
                onClick={() => handleCopy(key, value)}
                className="transition-colors"
                style={{ color: copiedKey === key ? DEEP : BORDER }}
                title={`Copy ${label}`}
              >
                {copiedKey === key ? <Check size={13} /> : <Copy size={13} />}
              </button>
            </div>
          ))}
        </div>

        {/* Match context */}
        <div className="mt-5 px-4 py-3.5 rounded-xl" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
          <p className="text-xs leading-relaxed" style={{ color: SUBT }}>
            Matched on{' '}
            <span className="font-serif font-semibold" style={{ color: TEXT }}>{activeMatch?.hackathon}</span>
            <br />
            <span className="text-[10px]" style={{ color: ROSE }}>{activeMatch?.matchDate}</span>
          </p>
        </div>

        <button
          onClick={() => navigate('chat', { matchProfile: p })}
          className="w-full mt-5 py-3.5 rounded-full text-white text-sm font-semibold"
          style={{ background: DEEP }}
        >
          Start Chatting
        </button>
      </div>
    </div>
  );
}
