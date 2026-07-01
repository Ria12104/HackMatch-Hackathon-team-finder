// Match Service — mock stubs. Replace with real API calls when backend is ready.
// See BACKEND.md for integration guide.

import type { UserProfile, Match } from '@/types';
import { discoverProfiles, initMatches } from '@/constants/mockData';

/** TODO: replace — fetch profiles to swipe on (optionally filtered by hackathon) */
export async function getDiscoverProfiles(_hackathonId?: string): Promise<UserProfile[]> {
  return discoverProfiles;
}

/** TODO: replace — record a swipe and return whether it's a mutual match */
export async function swipeOnProfile(
  _targetUserId: string,
  action: 'like' | 'pass',
  _hackathonId?: string
): Promise<{ matched: boolean; matchId?: string }> {
  if (action === 'pass') return { matched: false };
  const matched = Math.random() < 0.52;
  return { matched, matchId: matched ? `m-${Date.now()}` : undefined };
}

/** TODO: replace — fetch all matches for the current user */
export async function getMatches(): Promise<Match[]> {
  return initMatches;
}

/** TODO: replace — remove a match */
export async function unmatch(_matchId: string): Promise<void> {}
