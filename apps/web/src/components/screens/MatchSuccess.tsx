'use client';

// =============================================================================
// Match Success Screen
// =============================================================================
// =============================================================================

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

import type { ScreenProps } from '@/types';
import { ROSE, DEEP, PEACH, CASHMERE, BG, TEXT, SUBT, BORDER } from '@/constants/palette';

export function MatchSuccess({ navigate, matchProfile }: ScreenProps) {
  const p = matchProfile;

  useEffect(() => {
    const t = setTimeout(() => {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.4 }, colors: [ROSE, DEEP, PEACH, CASHMERE] });
      confetti({ particleCount: 30, angle: 60,  spread: 45, origin: { x: 0, y: 0.5 }, colors: [ROSE, PEACH] });
      confetti({ particleCount: 30, angle: 120, spread: 45, origin: { x: 1, y: 0.5 }, colors: [DEEP, CASHMERE] });
    }, 100);
    return () => clearTimeout(t);
  }, []);

  if (!p) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center px-6" style={{ background: BG }}>
      {/* ── Headline ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-7"
      >
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: ROSE }}>
          It&apos;s a Match
        </p>
        <h1 className="font-serif font-bold text-3xl mb-3 leading-tight" style={{ color: TEXT }}>
          You and {p.name}
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: SUBT }}>
          Both of you liked each other.<br />Start a conversation and build your team.
        </p>
      </motion.div>

      {/* ── Match card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
        className="w-full rounded-3xl mb-7 overflow-hidden bg-white"
        style={{ border: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div>
            <p className="font-serif font-semibold text-sm" style={{ color: TEXT }}>You</p>
            <p className="text-[11px]" style={{ color: SUBT }}>Full-Stack Developer</p>
          </div>
          <span className="text-xl">🤝</span>
          <div className="text-right">
            <p className="font-serif font-semibold text-sm" style={{ color: TEXT }}>{p.name}</p>
            <p className="text-[11px]" style={{ color: SUBT }}>{p.role}</p>
          </div>
        </div>
        <div className="px-4 py-3 flex flex-wrap gap-1.5">
          {p.skills.slice(0, 4).map(s => (
            <span key={s} className="px-2.5 py-0.5 rounded-full text-[10px] font-medium"
              style={{ background: PEACH, color: DEEP }}>
              {s}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── CTAs ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full flex flex-col gap-2.5"
      >
        <button
          onClick={() => navigate('chat', { matchProfile: p })}
          className="w-full py-3.5 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2"
          style={{ background: DEEP }}
        >
          <MessageCircle size={15} /> Start Chat
        </button>
        <button
          onClick={() => navigate('discover')}
          className="w-full py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2"
          style={{ background: 'white', border: `1px solid ${BORDER}`, color: SUBT }}
        >
          Keep Swiping <ArrowRight size={13} />
        </button>
      </motion.div>
    </div>
  );
}
