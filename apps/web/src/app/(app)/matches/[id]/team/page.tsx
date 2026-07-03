'use client';
import { useParams, notFound } from 'next/navigation';
import { TeamConfirm } from '@/components/screens/TeamConfirm';
import { useAppState } from '@/context/AppContext';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { matches } = useAppState();
  const match = matches.find(m => m.id === id);
  if (!match) notFound();
  return <TeamConfirm activeMatch={match} />;
}
