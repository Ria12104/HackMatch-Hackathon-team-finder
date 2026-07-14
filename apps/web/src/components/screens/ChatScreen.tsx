'use client';

// =============================================================================
// Chat Screen
// =============================================================================
// =============================================================================

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Send, CheckCheck } from 'lucide-react';

import type { Match, Message } from '@/types';
import { ROSE, DEEP, PEACH, BG, TEXT, SUBT, BORDER } from '@/constants/palette';
import { sendMessage, getMockAutoReply } from '@/services/chatService';

export function ChatScreen({ activeMatch }: { activeMatch: Match }) {
  const router = useRouter();
  const [msgs,  setMsgs]  = useState<Message[]>([
    { id: '1', text: 'Hey! Really excited to potentially work together.', fromMe: false, time: '2:30 PM' },
    { id: '2', text: 'Same here! Your projects look great — especially the FinTech one.', fromMe: true, time: '2:32 PM' },
    { id: '3', text: 'Thanks! For EcoHack I was thinking a sustainability dashboard. Thoughts?', fromMe: false, time: '2:35 PM' },
    { id: '4', text: 'Love it. My backend + your design skills = great combo.', fromMe: true, time: '2:37 PM' },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const p = activeMatch?.profile ?? null;

  // Auto-scroll to latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = async () => {
    if (!input.trim()) return;

    const matchId = activeMatch?.id ?? 'unknown';

    // Optimistically add message to UI
    const sent = await sendMessage(matchId, input.trim());
    setMsgs(prev => [...prev, sent]);
    setInput('');

    // Mock auto-reply — DELETE once WebSocket / push is implemented
    setTimeout(() => {
      setMsgs(prev => [...prev, getMockAutoReply()]);
    }, 900);
  };

  if (!p) return null;

  return (
    <div className="h-full flex flex-col" style={{ background: BG }}>

      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-3 py-3 shrink-0 bg-white" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <button onClick={() => router.push('/matches')} className="p-1" style={{ color: SUBT }}>
          <ArrowLeft size={17} />
        </button>
        <div className="flex-1">
          <p className="font-serif font-semibold text-sm" style={{ color: TEXT }}>{p.name}</p>
          <p className="text-[10px]" style={{ color: ROSE }}>{p.role} · Online</p>
        </div>
        <button
          onClick={() => router.push(`/matches/${activeMatch?.id}/team`)}
          className="px-3 py-1.5 rounded-full text-[11px] font-semibold border-2"
          style={{ borderColor: DEEP, color: DEEP, background: 'transparent' }}
        >
          Confirm Team
        </button>
      </div>

      {/* ── Match context banner ── */}
      <div className="px-4 py-2 shrink-0" style={{ background: PEACH, borderBottom: `1px solid ${ROSE}30` }}>
        <p className="text-[11px]" style={{ color: DEEP }}>
          Matched for <span className="font-serif font-semibold">{activeMatch?.hackathon ?? 'EcoHack 2024'}</span>
          <span style={{ color: ROSE }}> · Team forming</span>
        </p>
      </div>

      {/* ── Message list ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {msgs.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16 }}
            className={`flex mb-3 ${msg.fromMe ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-[72%]">
              <div
                className="px-3.5 py-2.5 text-sm leading-relaxed"
                style={{
                  background:   msg.fromMe ? DEEP : 'white',
                  color:        msg.fromMe ? 'white' : TEXT,
                  border:       msg.fromMe ? 'none' : `1px solid ${BORDER}`,
                  borderRadius: msg.fromMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                }}
              >
                {msg.text}
              </div>
              <div className={`flex items-center gap-1 mt-1 ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                <span className="text-[9px]" style={{ color: SUBT }}>{msg.time}</span>
                {msg.fromMe && <CheckCheck size={10} style={{ color: ROSE }} />}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={endRef} />
      </div>

      {/* ── Input bar ── */}
      <div className="flex items-center gap-2 px-3 py-3 shrink-0 bg-white" style={{ borderTop: `1px solid ${BORDER}` }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Message…"
          className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none"
          style={{ background: BG, border: `1px solid ${BORDER}`, color: TEXT }}
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-opacity"
          style={{
            background: input.trim() ? DEEP : '#D4B5B5',
            cursor:     input.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          <Send size={15} color="white" />
        </button>
      </div>
    </div>
  );
}
