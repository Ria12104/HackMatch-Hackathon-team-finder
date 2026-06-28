// Chat Service — mock stubs. Replace with real API / WebSocket when backend is ready.
// See BACKEND.md for integration guide.

import type { Message } from '@/types';

const SEED_MESSAGES: Message[] = [
  { id: '1', text: 'Hey! Really excited to potentially work together.', fromMe: false, time: '2:30 PM' },
  { id: '2', text: 'Same here! Your projects look great.', fromMe: true, time: '2:32 PM' },
  { id: '3', text: 'For EcoHack I was thinking a sustainability dashboard. Thoughts?', fromMe: false, time: '2:35 PM' },
  { id: '4', text: 'Love it. My backend + your design skills = great combo.', fromMe: true, time: '2:37 PM' },
];

const AUTO_REPLIES = [
  "Totally agree. Want to hop on a call?",
  "That could work really well.",
  "I was thinking the same!",
  "Should we confirm the team?",
];

/** TODO: replace — fetch message history for a match */
export async function getMessages(_matchId: string): Promise<Message[]> {
  return SEED_MESSAGES;
}

/** TODO: replace — send a message (and persist it) */
export async function sendMessage(_matchId: string, text: string): Promise<Message> {
  const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return { id: crypto.randomUUID(), text, fromMe: true, time: now };
}

/** Mock auto-reply — delete this once real-time messages are working */
export function getMockAutoReply(): Message {
  const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return {
    id: crypto.randomUUID(),
    text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
    fromMe: false,
    time: now,
  };
}
