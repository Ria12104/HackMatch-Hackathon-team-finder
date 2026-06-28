export type LocationType = "online" | "in_person" | "hybrid";

export type HackathonStatus = "pending" | "verified" | "rejected" | "past" | "cancelled";

export type ProfileStrength = "starter" | "ready" | "strong";

export type Hackathon = {
  id: string;
  slug: string;
  name: string;
  organizer: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  locationType: LocationType;
  venue?: string;
  city?: string;
  teamSizeMin?: number;
  teamSizeMax?: number;
  sourceUrl: string;
  status: HackathonStatus;
  lookingCount: number;
  teamsFormingCount: number;
  rolesWanted: Array<{ role: string; count: number }>;
};

export type Candidate = {
  id: string;
  name: string;
  year: string;
  branch: string;
  primaryRole: string;
  lookingForRoles: string[];
  skills: string[];
  availability: string;
  profileStrength: ProfileStrength;
  featuredProject: string;
  hackathonSummary: string;
};
