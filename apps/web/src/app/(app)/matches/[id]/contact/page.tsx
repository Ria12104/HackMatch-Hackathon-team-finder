'use client';
import { useParams, notFound } from 'next/navigation';
import { ContactReveal } from '@/components/screens/ContactReveal';
import { useAppState } from '@/context/AppContext';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { matches } = useAppState();
  const match = matches.find(m => m.id === id);
  if (!match) notFound();
  return <ContactReveal activeMatch={match} />;
}
