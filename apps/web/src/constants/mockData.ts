// =============================================================================
// HackMatch — Mock Data (Frontend-only placeholder)
// =============================================================================
// Change: import path '../types' → '@/types'
//
// This file holds all fake/static data used while the backend isn't ready.
//
// ⚠️  BACKEND INTEGRATION GUIDE:
// When the backend is ready, DELETE this file and update each service in
// src/services/ to make real API calls instead.
//
// Each export below is labelled with which API endpoint will replace it.
// =============================================================================

import type { Hackathon, UserProfile, Match } from '@/types';

// ---------------------------------------------------------------------------
// Hackathons
// Backend: GET /api/hackathons  →  replace mockHackathons in hackathonService.ts
// ---------------------------------------------------------------------------
export const mockHackathons: Hackathon[] = [
  {
    id: '1',
    name: 'EcoHack 2024',
    shortDate: 'Oct 12–13',
    mode: 'Offline',
    teamSize: '2–4',
    deadline: 'Oct 5, 2024',
    description:
      'Build sustainable tech solutions for a greener future. Join top developers and designers to solve climate challenges.',
    rules: [
      'Teams of 2–4',
      'All code written during event',
      'Open to all students',
      'No pre-existing projects',
    ],
    tags: ['GreenTech', 'AI/ML', 'IoT'],
    participants: 42,
    prize: '$30,000',
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Global AI Summit Hack',
    shortDate: 'Nov 3–4',
    mode: 'Online',
    teamSize: '2–4',
    deadline: 'Oct 28, 2024',
    description: 'Build cutting-edge AI tools over 48 hours with top researchers and engineers.',
    rules: ['Teams of 2–4', 'Must use AI/ML', 'Online hub format'],
    tags: ['AI', 'OpenAI'],
    participants: 320,
    prize: '$50,000',
    isFeatured: false,
  },
  {
    id: '3',
    name: 'MedTech Innovate',
    shortDate: 'Dec 7–8',
    mode: 'Offline',
    teamSize: '2–5',
    deadline: 'Nov 30, 2024',
    description: 'Transform healthcare with technology. Build for patients and providers.',
    rules: ['Solo or teams up to 5', 'Healthcare focus required'],
    tags: ['HealthTech', 'IoT'],
    participants: 180,
    prize: '$25,000',
  },
  {
    id: '4',
    name: 'ETH Global Singapore',
    shortDate: 'Jan 15–17',
    mode: 'Offline',
    teamSize: '2–5',
    deadline: 'Jan 8, 2025',
    description: 'The premier Ethereum hackathon in Southeast Asia.',
    rules: ['Must use Ethereum', 'Teams of 2–5', 'Deployed contracts required'],
    tags: ['Web3', 'DeFi'],
    participants: 1500,
    prize: '$100,000',
  },
  {
    id: '5',
    name: 'Health Innovation Challenge',
    shortDate: 'Feb 22–23',
    mode: 'Online',
    teamSize: '3–5',
    deadline: 'Feb 15, 2025',
    description: 'Solve real healthcare challenges alongside medical professionals.',
    rules: ['Healthcare projects only', 'Teams of 3–5'],
    tags: ['HealthTech', 'AI/ML'],
    participants: 600,
    prize: '$25,000',
    isMine: true,
  },
];

// ---------------------------------------------------------------------------
// Discover Profiles (other users available for matching)
// Backend: GET /api/users?hackathon=<id>&limit=20  →  replace in matchService.ts
// ---------------------------------------------------------------------------
export const discoverProfiles: UserProfile[] = [
  {
    id: 'p1',
    name: 'Priya Sharma',
    role: 'Full-Stack Developer',
    skills: ['React', 'Node.js', 'Python', 'GraphQL'],
    techStack: ['TypeScript', 'PostgreSQL', 'Docker'],
    experience: 'Intermediate',
    bio: 'Passionate about building impactful solutions. Looking for a teammate to tackle real-world problems at our next hackathon. I specialize in scalable web apps and love collaborating with designers.',
    github: 'github.com/priyasharma',
    portfolio: 'priya.dev',
    linkedin: 'linkedin.com/in/priyasharma',
    email: 'priya@example.com',
    projects: ['1st Place – EcoHack 2023', 'Finalist – HackMIT 2022', 'Best App – DevFest 2021'],
    compatibility: 94,
  },
  {
    id: 'p2',
    name: 'Marcus Johnson',
    role: 'Senior UX Designer',
    skills: ['Figma', 'User Research', 'Prototyping'],
    techStack: ['React', 'CSS', 'Framer'],
    experience: 'Advanced',
    bio: 'Passionate about accessible design and building intuitive systems. Looking for a frontend dev to partner on a FinTech hackathon project. I specialize in design systems and user-centric research methodologies.',
    github: 'github.com/marcusj',
    portfolio: 'marcus.design',
    linkedin: 'linkedin.com/in/marcusjohnson',
    email: 'marcus@example.com',
    projects: ['1st Place – Global FinTech Jam 2023', 'Finalist – EthGlobal SF 2022', 'Best Design – HackTheNorth 2021'],
    compatibility: 88,
  },
  {
    id: 'p3',
    name: 'Kai Tanaka',
    role: 'ML Engineer',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP'],
    techStack: ['FastAPI', 'MongoDB', 'AWS'],
    experience: 'Advanced',
    bio: 'AI researcher by day, hacker by night. NLP and computer vision specialist looking for product-minded teammates.',
    github: 'github.com/kaitanaka',
    portfolio: 'kaitanaka.ai',
    linkedin: 'linkedin.com/in/kaitanaka',
    email: 'kai@example.com',
    projects: ['1st Place – AI for Good 2023', 'Finalist – NeurIPS Hackathon 2022'],
    compatibility: 91,
  },
  {
    id: 'p4',
    name: 'Sofia Rodriguez',
    role: 'Product Manager',
    skills: ['Product Strategy', 'User Research', 'Analytics'],
    techStack: ['Figma', 'SQL', 'Mixpanel'],
    experience: 'Intermediate',
    bio: 'Bridging user needs and technical solutions. Former startup founder turned PM, looking for technical co-builders.',
    github: 'github.com/sofiar',
    portfolio: 'sofiar.com',
    linkedin: 'linkedin.com/in/sofiarodriguez',
    email: 'sofia@example.com',
    projects: ['Winner – ProductHack 2023', 'Finalist – LaunchX 2022'],
    compatibility: 85,
  },
  {
    id: 'p5',
    name: 'Arjun Patel',
    role: 'Backend Developer',
    skills: ['Go', 'Rust', 'Kubernetes', 'Microservices'],
    techStack: ['PostgreSQL', 'Redis', 'Kubernetes'],
    experience: 'Advanced',
    bio: 'Systems programmer obsessed with performance and reliability. Built infra at scale for fintech startups.',
    github: 'github.com/arjunp',
    portfolio: 'arjunpatel.dev',
    linkedin: 'linkedin.com/in/arjunpatel',
    email: 'arjun@example.com',
    projects: ['1st Place – FinHack 2023', 'Best Backend – DevSummit 2022'],
    compatibility: 87,
  },
  {
    id: 'p6',
    name: 'Emma Williams',
    role: 'Full-Stack Developer',
    skills: ['Vue.js', 'Django', 'PostgreSQL', 'AWS'],
    techStack: ['Vue.js', 'Python', 'Docker'],
    experience: 'Intermediate',
    bio: 'Building for accessibility and inclusion. Love creating products that make a real difference.',
    github: 'github.com/emmaw',
    portfolio: 'emma.codes',
    linkedin: 'linkedin.com/in/emmawilliams',
    email: 'emma@example.com',
    projects: ['Best Impact – AccessHack 2023', 'Finalist – Google Solution 2022'],
    compatibility: 82,
  },
];

// ---------------------------------------------------------------------------
// Current User (logged-in user's own profile)
// Backend: GET /api/me  →  replace in userService.ts
// ---------------------------------------------------------------------------
export const currentUser: UserProfile = {
  id: 'me',
  name: 'Alex Chen',
  role: 'Full-Stack Developer',
  skills: ['React', 'TypeScript', 'Python', 'Node.js'],
  techStack: ['FastAPI', 'PostgreSQL'],
  experience: 'Intermediate',
  bio: 'CS student at Stanford. 3× hackathon participant. Ready to build.',
  github: 'github.com/alexchen',
  portfolio: 'alexchen.dev',
  linkedin: 'linkedin.com/in/alexchen',
  email: 'alex.chen@stanford.edu',
  projects: ['1st Place – TreeHacks 2023', 'Finalist – HackMIT 2022', 'Best Design – CalHacks 2021'],
  compatibility: 100,
};

// ---------------------------------------------------------------------------
// Initial Matches (pre-seeded for demo)
// Backend: GET /api/matches  →  replace in matchService.ts
// ---------------------------------------------------------------------------
export const initMatches: Match[] = [
  {
    id: 'm1',
    profile: discoverProfiles[0], // Priya Sharma
    hackathon: 'EcoHack 2024',
    matchDate: 'Today, 2:30 PM',
  },
  {
    id: 'm2',
    profile: discoverProfiles[2], // Kai Tanaka
    hackathon: 'Health Innovation Challenge',
    matchDate: 'Yesterday',
  },
];
