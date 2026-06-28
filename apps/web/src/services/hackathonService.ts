// Hackathon Service — mock stubs. Replace with real API calls when backend is ready.
// See BACKEND.md for integration guide.

import type { Hackathon } from '@/types';
import { mockHackathons } from '@/constants/mockData';

export interface CreateHackathonPayload {
  name: string; description: string; registrationLink: string;
  startDate: string; endDate: string; teamSize: string;
  mode: 'Online' | 'Offline' | 'Hybrid'; tags?: string[];
}

/** TODO: replace — list all hackathons */
export async function getHackathons(): Promise<Hackathon[]> {
  return mockHackathons;
}

/** TODO: replace — fetch a single hackathon by ID */
export async function getHackathonById(id: string): Promise<Hackathon | undefined> {
  return mockHackathons.find(h => h.id === id);
}

/** TODO: replace — create a new hackathon */
export async function createHackathon(payload: CreateHackathonPayload): Promise<Hackathon> {
  return {
    id: `h-${Date.now()}`,
    name: payload.name,
    shortDate: `${payload.startDate} – ${payload.endDate}`,
    mode: payload.mode,
    teamSize: payload.teamSize,
    deadline: payload.startDate,
    description: payload.description,
    rules: [],
    tags: payload.tags ?? [],
    participants: 0,
    prize: 'TBD',
  };
}
