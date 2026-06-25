# HackMate — Team Division (4 People)

## Overview

This document divides the entire HackMate V1 build across 4 developers. Each person owns a vertical slice with clear boundaries, dependencies, and handoff points. Every person has both backend and frontend responsibilities so that no one is a pure UI integrator.

---

## Person 1: Auth, Profile & Resume AI
**Focus:** Authentication, user profiles, resume extraction, and core infrastructure

### Backend Responsibilities

#### Database Schema & Migrations
- All 8 tables from implementation plan
- Triggers (`set_updated_at`, `handle_new_user`)
- RLS policies on every table
- Indexes (including partial indexes for swipes, GIN for FTS)
- Soft delete support (`deleted_at` columns)
- Check constraints (`daily_credits >= 0 AND daily_credits <= 20`)
- `slug` generation for hackathons
- `read_at` instead of `is_read` on messages
- `idempotency_key` on swipes table

#### Authentication
- Google OAuth setup (Supabase + Google Cloud Console)
- `app/auth/callback/route.ts` in Next.js
- Profile auto-creation trigger (`handle_new_user`)
- Admin role via `app_metadata`
- Session management (JWT refresh, 30-day inactivity timeout)
- Auth middleware for protected routes

#### Profile System
- Profile CRUD endpoints (or direct Supabase queries with RLS)
- Profile score calculation function
- Profile completeness tracking
- Phone number storage (encrypted via `pgp_sym_encrypt` + Vault)
- `reveal-contact` Edge Function (decrypt phone only if match exists)
- Profile update validation (year, branch, roles, skills)

#### Resume AI Extraction
- `extract-resume` Edge Function:
  - Accept PDF upload → store in Supabase Storage
  - Extract text via pdf-parse
  - Call OpenAI/Claude with structured prompt
  - Return structured JSON to frontend
  - Handle errors: password-protected PDFs, scanned images, malformed AI responses
- Resume storage bucket + RLS policies

#### Core Infrastructure
- Environment variables setup (`.env.local` template)
- TypeScript types generation (`npx supabase gen types`)
- Supabase client configuration (server + browser)
- Rate limiting table and logic
- Audit log table
- Connection pooling (PgBouncer)
- Database backup strategy
- Error tracking setup (Sentry)
- **Storage buckets + policies** (avatars, resumes)

#### Admin Foundation
- Admin role RLS policies
- User suspension/unsuspension
- Admin audit trail

### Frontend Responsibilities

#### Auth UI
- Google sign-in button component
- Auth callback page (`app/auth/callback/route.ts` — already listed in backend)
- Auth state management (loading, error, redirect)

#### Profile Setup Wizard
- Step 1: Personal info (name, email, year, branch, photo)
- Step 2: Social links (LinkedIn, GitHub, portfolio)
- Step 3: Skills & experience (manual + resume upload UI)
- Step 4: Preferences (primary role, looking-for roles, availability)
- Step 5: Review & submit
- Profile completeness meter
- "Skip for now" options on optional fields
- Progress saving (can leave and return)

#### Resume Upload & AI Extraction UI
- File picker (PDF only, max 10MB)
- Upload progress with skeleton animation
- AI extraction progress indicator
- Review & edit screen (pre-filled fields from AI)
- Manual fallback form
- Error states (wrong format, too large, extraction failed)
- Tech stack tag input with proficiency picker
- Project cards (add/edit/delete)
- Achievement list
- Hackathon history entries

#### Profile Display & Settings
- My Profile screen (Tab 3)
- Profile photo with edit overlay
- Level badge (prominent, with percentile)
- Progress bar to next level
- Stats row (hackathons, teams built, credits)
- Tech stack display (chips with proficiency)
- Projects (expandable cards)
- Achievements (bulleted list)
- Hackathon history (with result badges)
- Preferences display
- "Share My Card" button
- Edit Profile flow (pre-filled, same as setup)
- **Settings screen** (logout, delete account, privacy toggles, notification preferences)

### Tables Owned
- `profiles`
- `credit_log`
- `audit_log`
- `rate_limits`

### Edge Functions Owned
- `reveal-contact`
- `extract-resume`

### Deliverables
- [ ] Full database schema with migrations
- [ ] Google OAuth working end-to-end
- [ ] Profile CRUD with encrypted phone storage
- [ ] Resume AI extraction pipeline
- [ ] Profile score calculation
- [ ] Admin role and audit trail
- [ ] TypeScript types generated
- [ ] Environment variables documented
- [ ] Complete profile setup wizard UI
- [ ] Resume upload + AI review UI
- [ ] Profile display + edit UI
- [ ] Settings screen
- [ ] Auth UI components

### Dependencies
- None (this is the foundation)

### Handoffs To
- Person 2: Auth context for swipe/chat functions, profile data for candidate cards
- Person 3: Profile data for hackathon interest registration
- Person 4: User data for admin panel, profile data for share cards

---

## Person 2: Matching, Credits & Social
**Focus:** Swipe system, matching logic, credits, streaks, invites, teams, and reporting infrastructure

### Backend Responsibilities

#### Swipe System
- `swipe` Edge Function (atomic swipe + lazy credit reset + match check)
- Swipe deck generation (`get_swipe_deck` RPC function)
- Candidate eligibility logic (complementary roles, level matching, exclusions)
- Swipe credit cost calculation (1 credit for <5 matches, 3 credits for 5+)
- Idempotency handling (prevent double-spend on retry)
- Concurrent request handling (`SELECT ... FOR UPDATE` locks)
- Left swipe (free, unlimited)
- Right swipe (costs credits, triggers match check)

#### Credit System
- Daily credit allowance (20 per user)
- Lazy credit reset logic (check `credits_last_reset` on each swipe)
- Credit deduction on right swipe
- Credit visibility (remaining count, low-credit warnings)
- Credit log auditing
- Streak-based bonus credits (every 7 days = +3 credits)
- Streak saver (spend 5 credits to preserve streak)
- Invite reward credits (+5 for inviter, +3 for invitee)

#### Matching Logic
- Match creation (mutual right-swipe detection)
- Match status management (active, backed_out, blocked)
- Per-hackathon match tracking
- Match count denormalization on `hackathon_interests`
- Back-out flow (archive chat, reduce match count, no credit refund)
- Block user flow
- Match modal trigger (confetti, notification)

#### Streak System
- Daily streak tracking (`streak_count`, `last_active_date`)
- Streak update on first app open each day
- Streak broken notification
- Streak saver logic
- 7-day streak bonus

#### Invite System
- Invite code generation
- Deep link handling
- Invite tracking (`invites` table)
- Double-sided reward distribution
- Fraud prevention (max 10 friends, one-time per friend)
- Invite-to-signup conversion tracking

#### Team System
- Team creation endpoint (when both users confirm "teamed")
- Team status management (forming, confirmed, submitted, archived)
- Team member management (invite, accept, leave, remove)
- Team checklist (idea decided, roles assigned, registered, submitted)

#### Safety & Reporting
- Report user Edge Function
- Block user Edge Function
- Report message Edge Function
- Admin report review queue endpoints

#### Push Notifications (Server-Side)
- FCM/APNs trigger setup
- Notification payload construction
- Notification triggers: new match, new message, streak reminder, team nudge

### Frontend Responsibilities

#### Swipe UI
- Card stack with 2-3 visible cards
- Swipe gestures (Reanimated 2 + Gesture Handler)
- Left swipe animation (red overlay, X icon)
- Right swipe animation (green overlay, heart icon)
- Haptic feedback on swipe
- Spring physics on card movement
- Tap to expand profile
- Credit indicator (remaining count, low-credit warning)
- Empty deck state ("Check back tomorrow")
- "Out of credits" modal with countdown
- First-swipe tutorial (pre-seeded demo profiles)
- Like intent options (Strong fit, Need this role, Similar idea, Want to discuss)

#### Match UI
- Match modal (confetti animation, haptic pulse)
- Match list (organized by hackathon)
- Back-out confirmation flow (trigger only — modal owned by P4)


#### Team UI
- Team confirmation flow (discussing / teamed / not a fit)
- Team checklist UI
- Team member list

#### Streak & Credit UI
- Streak display on home screen (fire emoji + count)
- Streak saver prompt
- Daily credit countdown
- Credit history view

#### Invite UI
- Invite-a-friend flow (native share sheet)
- "You were invited by [name]" banner during onboarding
- Invite reward notification

### Tables Owned
- `swipes`
- `matches`
- `invites`
- `teams`
- `team_members`
- `reports`

### Edge Functions Owned
- `swipe`
- `back-out`
- `invite-reward`
- `report-user`
- `block-user`
- `create-team`

### RPC Functions Owned
- `get_swipe_deck`
- `recalculate_user_level` (shared with Person 1)

### Deliverables
- [ ] Swipe Edge Function with atomic credit handling
- [ ] Swipe deck generation with smart sorting
- [ ] Match creation and management
- [ ] Credit system with lazy resets
- [ ] Streak tracking and rewards
- [ ] Invite system with double-sided rewards
- [ ] Team creation and management
- [ ] Report/block backend Edge Functions
- [ ] Push notification triggers (server-side)
- [ ] Swipe card UI with animations
- [ ] Match modal with confetti
- [ ] Team confirmation UI
- [ ] Streak + credit UI components
- [ ] Invite flow UI

### Dependencies
- Person 1: Database schema, auth, profiles, credit_log table
- Person 3: Hackathon data for swipe deck filtering

### Handoffs To
- Person 3: Match data for hackathon interest counts
- Person 4: Match/message data for admin moderation, notification preferences UI

---

## Person 3: Hackathons, Discovery & Growth
**Focus:** Hackathon discovery, submission, verification, interest registration, search, share cards, QR codes, and deep links

### Backend Responsibilities

#### Hackathon CRUD
- Hackathon creation (user-submitted + admin pre-seeded)
- Hackathon editing (admin only after approval)
- Hackathon status management (pending, verified, rejected, past, cancelled)
- Automatic status transitions (past when end_date passes)
- Duplicate detection (name + dates + source_url)
- Slug generation for clean URLs
- Full-text search (GIN index + `textSearch`)
- Filtering (online/offline, date range, verification status)
- Sorting (upcoming first, then by date)

#### Hackathon Verification
- Auto-flag logic on submission:
  - URL accessibility check (HTTP 200)
  - Trusted domain check (devfolio.co, unstop.com, devpost.com, hackerearth.com, .edu.in, .ac.in, .gov.in)
  - Keyword match in URL ("hackathon", "hacks", "hack", "code", "build")
- Flag outcomes: likely_legit, needs_review, likely_spam
- Auto-flag Edge Function (runs on submission)
- Manual review queue for admin
- Approval/rejection workflow
- Rejection reason storage
- Notification to submitter on approval/rejection

#### Interest Registration
- Register interest in a hackathon
- Un-register interest
- Interest count denormalization
- Role-based interest tracking
- Interest status (looking, has_team, not_interested)

#### Hackathon Lifecycle
- Handle cancelled hackathons
- Handle past hackathons (read-only, no new interest)
- Handle registration deadline passed
- Handle source URL changes (admin update)
- Handle duplicate submissions
- Handle malicious URL detection

#### Share & Growth Surfaces
- Hackathon share cards (image generation — server-side)
- QR code generation for each hackathon (server-side)
- Deep link handling for hackathon pages (server-side routing)
- "I am looking for a teammate for [hackathon]" share card generation
- "We formed a team for [hackathon]" share card generation
- Source tracking for QR codes and invite links

#### Notification Preferences (Backend)
- Notification preferences CRUD (table + endpoints)
- User notification settings (matches, messages, deadlines, credits, marketing)
- Quiet hours support

### Frontend Responsibilities

#### Hackathon Discovery Feed
- Home screen hackathon list
- Hackathon cards with all required fields (name, organizer, dates, location, prize, interested count, verification badge)
- Live activity ticker ("X people are building teams right now")
- Search with typo tolerance (pg_trigram)
- Filter chips (All, Online, In-Person, This Week, This Month)
- Pagination/infinite scroll
- Empty states

#### Hackathon Detail Page
- Full hackathon information display
- "I am looking for a team" CTA
- "I already have a team" CTA
- "Invite someone" CTA
- Share link generation
- QR code display
- People looking by role breakdown
- Teams forming count
- Registration deadline countdown
- Official registration link (opens in-app browser)

#### Hackathon Submission UI
- Add Hackathon form
- Pending submission screen
- Submission success/error states

#### Interest Registration UI
- Register/unregister interest buttons
- Interest status display
- Role breakdown visualization

#### Share & Growth UI
- Hackathon share card display + share trigger
- QR code display on hackathon pages
- Deep link handling (client-side)
- "I am looking for a teammate" share card UI
- "We formed a team" share card UI

#### Notification Preferences UI
- Notification preferences screen
- Toggle switches for each notification type
- Quiet hours time picker

### Tables Owned
- `hackathons`
- `hackathon_interests`
- `notification_preferences`

### Edge Functions Owned
- `hackathon-autoflag`
- `hackathon-submit`
- `generate-qr`
- `generate-share-card`

### RPC Functions Owned
- `get_hackathon_feed`
- `search_hackathons`

### Deliverables
- [ ] Hackathon CRUD with all status transitions
- [ ] Auto-flag verification system
- [ ] Hackathon discovery feed with search and filters
- [ ] Hackathon detail page with all CTAs
- [ ] Interest registration and role breakdown
- [ ] QR code generation for each hackathon
- [ ] Share card generation
- [ ] Deep link handling
- [ ] Duplicate detection
- [ ] Past/cancelled hackathon handling
- [ ] Notification preferences CRUD
- [ ] Hackathon feed UI
- [ ] Hackathon detail page UI
- [ ] Add hackathon form UI
- [ ] Interest registration UI
- [ ] Share card + QR code UI
- [ ] Notification preferences UI

### Dependencies
- Person 1: Database schema, auth, profiles
- Person 2: Match data for interest counts

### Handoffs To
- Person 2: Hackathon data for swipe deck filtering
- Person 4: Hackathon review queue for admin panel

---

## Person 4: Admin, Chat, Onboarding & UX Polish
**Focus:** Admin panel, real-time chat, onboarding flow, splash screen, push notification client setup, shared UI components, accessibility, and overall UX polish

### Backend Responsibilities

#### Admin Panel Backend
- Admin dashboard queries (total users, hackathons, matches)
- Hackathon review queue endpoints (list, approve, reject)
- User search endpoint
- User profile view endpoint
- Suspend/unsuspend user endpoint
- Report review queue endpoints
- Audit trail viewer queries

#### Onboarding & App Config
- App configuration endpoint (feature flags, dynamic content)
- Onboarding content endpoint (carousel slides, dynamic user count)
- Splash screen configuration

#### Push Notification Client Setup
- Expo Notifications / FCM + APNs client registration
- Device token storage endpoint
- Notification channel configuration

#### Chat & Real-time
- `messages` table — RLS policies and ownership
- Supabase Realtime channel setup (subscribe per match+hackathon room)
- Presence detection (online/offline status per channel)
- Connection handling (reconnect logic, offline message queue)
- Message delivery guarantees (optimistic + server confirm)
- Read receipts (`read_at` timestamp update on message open)
- Chat archiving on back-out (coordinate with P2's `back-out` Edge Function)

### Frontend Responsibilities

#### Onboarding Flow
- Splash screen (1.5s, branded)
- Onboarding carousel (3 slides, skippable)
- Phone number entry (if needed as backup to Google OAuth)
- First-swipe tutorial (pre-seeded demo profiles)

#### Admin Panel (Web)
- Dashboard (total users, hackathons, matches)
- Hackathon review queue
- Hackathon review detail (with auto-flag result)
- Approve/reject workflow
- Rejection reason input
- User search
- User profile view
- Suspend/unsuspend user
- Report review queue
- Audit trail viewer
- Admin authentication (separate from user auth)

#### Push Notifications (Client)
- Push notification setup (Expo Notifications / FCM + APNs)
- Notification handling (foreground, background, killed)
- Deep link handling from notifications
- Notification permission request flow

#### UX Polish (Shared Component Library)
- Loading states (skeleton screens)
- Empty states (with helpful CTAs)
- Error states (with retry actions)
- Network error handling (toast with retry)
- Time-based welcome messages
- Level-up celebration animation
- Profile completion confetti
- Accessibility (44x44pt touch targets, screen reader labels, WCAG AA contrast)
- Responsive design (mobile-first)
- Dark mode support (optional for V1)

#### Growth Features
- Profile share card display (consuming Person 3's generated images)
- Social proof elements (dynamic user counts)
- "Who's looking for someone like you?" teaser
- Daily credit countdown display

#### Home Screen Integration
- Home screen layout (consuming Person 3's hackathon feed)
- Bottom navigation
- Live activity ticker integration

#### Chat UI
- Chat screen with message bubbles (sent/received styling)
- Contact info bar (LinkedIn, GitHub, phone reveal, email)
- Read receipts (single tick → double tick on `read_at`)
- Structured quick prompts (pre-defined openers)
- Online status indicator
- Typing indicator (optional for V1)
- Back-out confirmation modal
- Block user flow (UI — calls P2's `block-user` Edge Function)
- Report user flow (UI — calls P2's `report-user` Edge Function)

### Tables Owned
- `messages`

### Edge Functions Owned
- `admin-dashboard`
- `admin-review-queue`
- `admin-user-management`
- `register-device-token`

### Deliverables
- [ ] Admin panel (all pages)
- [ ] Admin dashboard queries
- [ ] Splash screen + onboarding carousel
- [ ] Push notification client integration
- [ ] Supabase Realtime chat channel setup + presence
- [ ] Chat UI (message bubbles, read receipts, quick prompts)
- [ ] Back-out + block + report modals (UI)
- [ ] Shared component library (loading, empty, error states)
- [ ] Accessibility compliance
- [ ] Responsive design
- [ ] Home screen layout + bottom navigation
- [ ] First-swipe tutorial
- [ ] All loading, empty, and error states
- [ ] Network error handling
- [ ] Level-up + profile completion animations
- [ ] Dark mode support (if time permits)

### Dependencies
- Person 1: Auth flow, profile endpoints, phone reveal
- Person 2: Swipe endpoints, match data, credits, back-out/block/report Edge Functions
- Person 3: Hackathon data, search, filters, interest registration, share cards

### Handoffs To
- None (this is the user-facing integration layer)

---

## Cross-Team Dependencies Map

```
Person 1 (Auth, Profile & Resume AI)
  ├──> Person 2 (Matching, Credits & Social) — needs: auth, profiles, credit_log
  ├──> Person 3 (Hackathons & Discovery)     — needs: auth, profiles
  └──> Person 4 (Admin, Chat & Onboarding)   — needs: auth, profile CRUD, phone reveal

Person 2 (Matching, Credits & Social)
  ├──> Person 3 — provides: match counts for interest tracking
  └──> Person 4 — provides: match_id/match data, back-out/block/report Edge Functions

Person 3 (Hackathons, Discovery & Growth)
  ├──> Person 2 — provides: hackathon data for swipe deck
  └──> Person 4 — provides: hackathon CRUD, search, filters, share cards

Person 4 (Admin, Chat, Onboarding & UX Polish)
  └──> Owns real-time chat (messages table + Realtime); provides shared UI components to all
```

---

## Workload Balance

| Person | Backend Tasks | Frontend Tasks | Total |
|---|---|---|---|
| P1 | 15 | 5  | 20 |
| P2 | 14 | 7  | 21 |
| P3 | 14 | 9  | 23 |
| P4 | 10 | 15 | 25 |

Chat/social moved from P2 to P4 to reduce P2's load. P2 now owns the match lifecycle (swipe → credit → match → streak → invite → team → report). P4 now owns real-time chat backend + full chat UI in addition to admin, onboarding, and UX polish.

---

## Weekly Milestones

### Week 1-2: Foundation
- **Person 1:** Database schema, migrations, RLS, Google OAuth, profile CRUD, resume extraction Edge Function
- **Person 2:** Swipe Edge Function (basic), credit system, match creation
- **Person 3:** Hackathon CRUD, auto-flag logic, basic feed
- **Person 4:** Splash screen, onboarding carousel, admin panel skeleton, shared component library setup

### Week 3-4: Core Loop
- **Person 1:** Phone encryption, reveal-contact, admin roles, rate limiting, profile setup UI
- **Person 2:** Swipe deck generation, streak system, swipe UI
- **Person 3:** Verification workflow, search/filters, interest registration, hackathon feed UI
- **Person 4:** Supabase Realtime channel setup, chat backend (RLS + presence), admin panel pages, push notification client setup

### Week 5-6: Polish & Admin
- **Person 1:** Audit log, backup strategy, performance optimization, resume upload UI
- **Person 2:** Invite system, back-out flow, push notification triggers, team UI
- **Person 3:** QR codes, share cards, deep links, lifecycle handling, notification preferences
- **Person 4:** Chat UI (full screen), back-out/block/report modals, admin panel completion, accessibility audit, animations

### Week 7-8: Testing & Launch
- **Person 1:** Security audit, load testing, documentation
- **Person 2:** Edge case handling, concurrent swipe testing
- **Person 3:** Content seeding, duplicate detection testing
- **Person 4:** Accessibility audit, responsive testing, bug fixes, final polish

---

## Communication Protocol

### Daily
- 15-min async standup in shared channel
- Blockers flagged immediately with @mentions

### Per Feature
- API contract defined before implementation (shared doc)
- Person building backend writes the contract
- Person building frontend reviews and approves
- Example contract format:
  ```typescript
  // POST /functions/v1/swipe
  // Request:
  {
    swiped_id: string;      // UUID of the user being swiped
    hackathon_id: string;   // UUID of the hackathon
    direction: 'left' | 'right';
    intent?: 'strong_fit' | 'need_role' | 'similar_idea' | 'want_discuss';
    idempotency_key: string; // UUID, client-generated
  }
  // Response (200):
  {
    match_created: boolean;
    match_id?: string;
    credits_remaining: number;
    credits_reset_at: string; // ISO 8601
  }
  // Errors:
  // 400: INSUFFICIENT_CREDITS, ALREADY_SWIPED, INVALID_HACKATHON
  // 401: UNAUTHORIZED
  // 409: IDEMPOTENCY_CONFLICT
  ```

### Handoff Checklist
- [ ] API endpoint deployed and tested
- [ ] TypeScript types updated
- [ ] Error responses documented
- [ ] Sample request/response in shared doc
- [ ] RLS policies verified
- [ ] Edge case handling documented

---

## Shared Resources

### Repository Structure
```
/
├── apps/
│   └── web/                      # Next.js app (@pairup/web)
│       └── src/app/
│           ├── auth/              # Person 1
│           ├── hackathons/        # Person 3
│           ├── profile/           # Person 1
│           ├── swipe/             # Person 2
│           ├── chat/              # Person 4
│           ├── admin/             # Person 4
│           ├── onboarding/        # Person 4
│           └── components/        # Person 4 (shared UI library)
├── packages/
│   └── shared/                   # Shared types, utils (@pairup/shared)
├── supabase/
│   ├── config.toml               # Supabase CLI project config
│   ├── migrations/               # DB migrations — Person 1 owns, all PRs here
│   └── functions/                # Edge Functions
│       ├── swipe/                # Person 2
│       ├── reveal-contact/       # Person 1
│       ├── extract-resume/       # Person 1
│       ├── back-out/             # Person 2
│       ├── invite-reward/        # Person 2
│       ├── report-user/          # Person 2
│       ├── block-user/           # Person 2
│       ├── create-team/          # Person 2
│       ├── hackathon-autoflag/   # Person 3
│       ├── hackathon-submit/     # Person 3
│       ├── generate-qr/          # Person 3
│       ├── generate-share-card/  # Person 3
│       ├── admin-dashboard/      # Person 4
│       ├── admin-review-queue/   # Person 4
│       ├── admin-user-management/ # Person 4
│       └── register-device-token/ # Person 4
├── .github/
│   └── workflows/
│       └── ci.yml                # Type-check + lint on every PR
└── docs/
    ├── api-contracts.md          # All API contracts
    ├── architecture.md           # System architecture
    ├── CONTRIBUTING.md           # Branch + migration workflow
    ├── DESIGN.md                 # Design system
    ├── schema.md                 # Database schema docs
    └── team_division.md          # This file
```

### Environment Variables (shared `.env.example`)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI Extraction (Person 1)
OPENAI_API_KEY=

# Phone Encryption (Person 1)
PHONE_ENCRYPTION_KEY=

# Push Notifications (Person 4)
EXPO_PUSH_TOKEN=
FCM_SERVER_KEY=

# Sentry (Person 1)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

---

## Risk Mitigation

| Risk | Owner | Mitigation |
|---|---|---|
| Person 1 blocked on Vault setup | Person 1 | Fallback: store phone hashed, reveal via Edge Function with service role |
| Person 2 concurrent swipe race conditions | Person 2 | Use `SELECT ... FOR UPDATE`, test with artillery.io |
| Person 3 auto-flag false positives | Person 3 | Default to "needs_review", human always approves |
| Person 4 resume extraction timeout | Person 1 | 15s timeout, show manual fallback immediately (Person 1 owns backend, Person 4 owns UI) |
| Integration delays between teams | All | API contracts defined before implementation, mock servers for frontend |
| Supabase free tier limits | Person 1 | Monitor usage, have Railway backup plan for Edge Functions |
| P4 chat + admin crunch in Week 5-6 | Person 4 | Realtime channel setup must be done by end of Week 4; chat UI in Week 5 only if backend is stable |

---

## Success Criteria Per Person

### Person 1
- [ ] All 8 tables created with RLS
- [ ] Google OAuth works end-to-end
- [ ] Phone encryption/decryption works
- [ ] Resume AI extraction returns valid JSON in <15s
- [ ] Profile score calculates correctly
- [ ] Admin can suspend users
- [ ] Zero critical security vulnerabilities
- [ ] Profile setup wizard completes in <3 minutes

### Person 2
- [ ] Swipe completes in <500ms
- [ ] Credits never go negative
- [ ] No duplicate matches created
- [ ] Chat messages deliver in <1s
- [ ] Streak updates correctly across midnight IST
- [ ] Invite rewards awarded exactly once
- [ ] Team creation works end-to-end
- [ ] Report/block functions work correctly

### Person 3
- [ ] Hackathon submission works end-to-end
- [ ] Auto-flag correctly identifies trusted domains
- [ ] Search returns relevant results in <1s
- [ ] QR codes scan correctly
- [ ] Interest counts stay accurate
- [ ] Past hackathons auto-archive
- [ ] Share cards generate correctly
- [ ] Notification preferences save and apply correctly

### Person 4
- [ ] Onboarding completes in <3 minutes
- [ ] Admin panel loads in <2s
- [ ] All screens work on iOS + Android + Web
- [ ] Lighthouse score >90
- [ ] WCAG AA compliant
- [ ] Push notifications deliver reliably
- [ ] Shared component library used by all team members
- [ ] Zero unhandled loading/empty/error states

---

*End of Team Division Document*
