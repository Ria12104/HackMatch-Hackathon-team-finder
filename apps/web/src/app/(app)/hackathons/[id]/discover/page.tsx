import { notFound } from 'next/navigation';
import { TeammateDiscovery } from '@/components/screens/TeammateDiscovery';
import { mockHackathons } from '@/constants/mockData';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hackathon = mockHackathons.find(h => h.id === id);
  if (!hackathon) notFound();
  return <TeammateDiscovery hackathon={hackathon} />;
}
