import type { Candidate, Hackathon } from "@pairup/shared";

export const hackathons: Hackathon[] = [
  {
    id: "hack-code-carnival",
    slug: "code-carnival",
    name: "Code Carnival 2026",
    organizer: "MUJ ACM Student Chapter",
    description:
      "A 24-hour campus hackathon for product builders, designers, and ML tinkerers. Teams can build for campus life, fintech, education, or open innovation.",
    startDate: "2026-07-18",
    endDate: "2026-07-19",
    registrationDeadline: "2026-07-14",
    locationType: "in_person",
    venue: "TMA Pai Auditorium",
    city: "Jaipur",
    teamSizeMin: 2,
    teamSizeMax: 4,
    sourceUrl: "https://example.com/code-carnival",
    status: "verified",
    lookingCount: 48,
    teamsFormingCount: 13,
    rolesWanted: [
      { role: "Frontend", count: 16 },
      { role: "Backend", count: 14 },
      { role: "Design", count: 11 },
      { role: "ML", count: 7 }
    ]
  },
  {
    id: "hack-build-for-bharat",
    slug: "build-for-bharat",
    name: "Build for Bharat Sprint",
    organizer: "MUJ E-Cell",
    description:
      "A weekend build sprint around student utilities, local commerce, and AI workflows for Indian campuses.",
    startDate: "2026-08-02",
    endDate: "2026-08-03",
    registrationDeadline: "2026-07-28",
    locationType: "hybrid",
    venue: "AB1 Innovation Lab",
    city: "Jaipur",
    teamSizeMin: 3,
    teamSizeMax: 5,
    sourceUrl: "https://example.com/build-for-bharat",
    status: "verified",
    lookingCount: 31,
    teamsFormingCount: 8,
    rolesWanted: [
      { role: "Product", count: 9 },
      { role: "Backend", count: 8 },
      { role: "Mobile", count: 8 },
      { role: "Design", count: 6 }
    ]
  },
  {
    id: "hack-ai-night",
    slug: "ai-night",
    name: "AI Night Hack",
    organizer: "Data Science Club MUJ",
    description:
      "An online-first hack night for teams experimenting with LLMs, agents, retrieval, and practical student tools.",
    startDate: "2026-08-21",
    endDate: "2026-08-22",
    registrationDeadline: "2026-08-18",
    locationType: "online",
    teamSizeMin: 2,
    teamSizeMax: 4,
    sourceUrl: "https://example.com/ai-night",
    status: "pending",
    lookingCount: 24,
    teamsFormingCount: 6,
    rolesWanted: [
      { role: "ML", count: 10 },
      { role: "Frontend", count: 6 },
      { role: "Backend", count: 5 },
      { role: "Research", count: 3 }
    ]
  }
];

export const candidates: Candidate[] = [
  {
    id: "candidate-rhea",
    name: "Rhea Sharma",
    year: "2nd year",
    branch: "CSE",
    primaryRole: "Frontend",
    lookingForRoles: ["Backend", "ML"],
    skills: ["React", "TypeScript", "Figma", "Supabase"],
    availability: "Evenings + full hackathon weekend",
    profileStrength: "strong",
    featuredProject: "Campus event finder with QR check-ins",
    hackathonSummary: "2 hackathons, 1 finalist finish"
  },
  {
    id: "candidate-amaan",
    name: "Amaan Khan",
    year: "3rd year",
    branch: "IT",
    primaryRole: "Backend",
    lookingForRoles: ["Frontend", "Design"],
    skills: ["Node.js", "Postgres", "Fastify", "Docker"],
    availability: "Remote prep, in-person build day",
    profileStrength: "ready",
    featuredProject: "Lost-and-found API for hostel blocks",
    hackathonSummary: "4 hackathons, backend-heavy builds"
  },
  {
    id: "candidate-meera",
    name: "Meera Iyer",
    year: "1st year",
    branch: "CCE",
    primaryRole: "Designer",
    lookingForRoles: ["Frontend", "Product"],
    skills: ["Figma", "UX research", "Pitch decks", "React basics"],
    availability: "Flexible after classes",
    profileStrength: "starter",
    featuredProject: "Food ordering redesign for campus cafes",
    hackathonSummary: "First-time participant"
  }
];

export function getHackathon(slug: string) {
  return hackathons.find((hackathon) => hackathon.slug === slug);
}
