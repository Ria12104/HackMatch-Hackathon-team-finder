// User Service — mock stubs. Replace with real API calls when backend is ready.
// See BACKEND.md for integration guide.

import type { UserProfile } from '@/types';
import { currentUser } from '@/constants/mockData';

export interface UpdateProfilePayload {
  name?: string; role?: string; bio?: string; skills?: string[];
  techStack?: string[]; experience?: string; github?: string;
  portfolio?: string; linkedin?: string;
}

/** TODO: replace — fetch current user's profile */
export async function getMyProfile(): Promise<UserProfile> {
  return currentUser;
}

/** TODO: replace — update current user's profile */
export async function updateMyProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  return { ...currentUser, ...payload };
}

/** TODO: replace — fetch another user's public profile by ID */
export async function getUserById(_id: string): Promise<UserProfile | null> {
  return null;
}
