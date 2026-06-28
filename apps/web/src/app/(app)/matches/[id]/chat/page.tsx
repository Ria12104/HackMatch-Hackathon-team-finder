'use client';
import { useParams, notFound } from 'next/navigation';
import { ChatScreen } from '@/components/screens/ChatScreen';
import { useAppState } from '@/context/AppContext';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { matches } = useAppState();
  const match = matches.find(m => m.id === id);
  if (!match) notFound();
  return <ChatScreen activeMatch={match} />;
}
