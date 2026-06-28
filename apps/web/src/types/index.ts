// =============================================================================
// HackMatch — Shared TypeScript Types
// =============================================================================
// All shared interfaces and type aliases live here.
// Import from this file in every component: import type { ... } from '@/types';
//
// When adding a new data model for the backend, add its interface here first,
// then create its service file in src/services/.
// =============================================================================


/**
 * A hackathon event.
 *
 * Backend note: This will be fetched from GET /api/hackathons
 * See src/services/hackathonService.ts
 */
export interface Hackathon {
  id: string;
  name: string;
  shortDate: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  teamSize: string;
  deadline: string;
  description: string;
  rules: string[];
  tags: string[];
  participants: number;
  prize: string;
  isFeatured?: boolean;
  isMine?: boolean;
}

/**
 * A user profile — both for the current user and for discovery cards.
 *
 * Backend note: Current user from GET /api/me
 * Discover profiles from GET /api/users?hackathon=<id>
 * See src/services/userService.ts
 */
export interface UserProfile {
  id: string;
  name: string;
  role: string;
  skills: string[];
  techStack: string[];
  experience: string;
  bio: string;
  github: string;
  portfolio: string;
  linkedin: string;
  email: string;
  projects: string[];   // Hackathon history entries, e.g. "1st Place – EcoHack 2023"
  compatibility: number; // 0–100, computed by the backend matching algorithm
}

/**
 * A confirmed mutual match between the current user and another profile.
 *
 * Backend note: Fetched from GET /api/matches
 * Created via POST /api/matches when both users swipe right
 * See src/services/matchService.ts
 */
export interface Match {
  id: string;
  profile: UserProfile;
  hackathon: string; // hackathon name string (denormalized for display)
  matchDate: string; // human-readable, e.g. "Today, 2:30 PM"
}

/**
 * A single chat message.
 *
 * Backend note: Fetched from GET /api/chats/:matchId/messages
 * Sent via POST /api/chats/:matchId/messages
 * See src/services/chatService.ts
 */
export interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
}

