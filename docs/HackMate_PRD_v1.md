# HackMate — Product Requirements Document
**Version:** 1.2 (V1 — Manipal University Jaipur)
**Status:** Draft
**Platform:** website and android app react and nextjs
**Last Updated:** June 2026

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Target Users & Personas](#4-target-users--personas)
5. [V1 Scope](#5-v1-scope)
6. [User Flows](#6-user-flows)
7. [Screen Specifications](#7-screen-specifications)
8. [Feature Deep-Dives](#8-feature-deep-dives)
   - 8.1 Authentication
   - 8.2 Profile Creation & Resume RAG
   - 8.3 Leveling System
   - 8.4 Hackathon Discovery & Submission
   - 8.5 Hackathon Verification (Hybrid)
   - 8.6 Teammate Swiping
   - 8.7 Swipe Credit System
   - 8.8 Matching Logic
   - 8.9 1:1 Chat
   - 8.10 Admin Panel
   - 8.11 Retention & Habit Loops
   - 8.12 Virality & Word‑of‑Mouth
   - 8.13 UX Polish & Micro‑interactions
9. [Data Models](#9-data-models)
10. [Tech Stack](#10-tech-stack)
11. [Non-Functional Requirements](#11-non-functional-requirements)
12. [Edge Cases & Error States](#12-edge-cases--error-states)
13. [V2 Backlog](#13-v2-backlog)

---

## 1. Executive Summary

HackMate is a mobile, web app that helps people find compatible hackathon teammates. Think of it as *a professional matchmaker for hackathon teams* — users build rich technical profiles, browse verified hackathons, and swipe through potential teammates who are already interested in the same event. A mutual right-swipe unlocks a 1:1 chat and reveals contact details later at a click of a button. A dynamic, percentile-based leveling system rewards growth and makes profiles comparable at a glance.

**The core insight:** Finding good teammates at college happens through WhatsApp groups, last-minute posts, and pure luck. HackMate replaces that chaos with a structured, skill-aware matchmaking layer that incentivises students to keep their profiles sharp and their hackathon records honest.

> **App Name Note:** "HackMate" is a working title. Other options: *StackUp*, *PairUp*, *BuildBuddy*. Final name TBD by founder.

---

## 2. Problem Statement

Students at MUJ who want to participate in hackathons face three recurring problems:

| Problem | Impact |
|---|---|
| **Discovery** — hard to find who else is interested in a specific hackathon | Teams form late; good talent stays benched |
| **Assessment** — no easy way to evaluate a potential teammate's skill before committing | Teams misfire; mismatch in experience causes tension |
| **Reach** — limited to your existing friend circle; talented devs from other branches/years are invisible | Participation is siloed; diversity of skills suffers |

HackMate solves all three by creating a matchmaking layer on top of hackathon discovery, filtered by real technical profiles.

---

## 3. Goals & Success Metrics

### 3.1 Product Goals (V1)
- Launch and validate core loop with MUJ students
- Enable fast profile creation: under 3-4 minutes via resume upload
- Make teammate discovery feel engaging, incentivizing, and intentional, not transactional
- Reward profile improvement via a visible leveling system
- Maintain ecosystem trust via hackathon verification
- **Build habit‑forming loops** that bring users back daily
- **Design for virality** so users naturally invite peers

### 3.2 Key Metrics

| Metric | Target (90 days post-launch) |
|---|---|
| Registered users | 500+ |
| Profiles ≥ 80% complete | 60% of registered users |
| Verified hackathons listed | 20+ |
| Total right swipes made | 5,000+ |
| Total matches (mutual right swipes) | 500+ |
| Teams that opened chat after match | 60%+ of matches |
| D7 retention | 30%+ |
| D30 retention | 15%+ |
| Average rating (play store) | 4.0+ |
| **Daily active users (DAU)** | 150+ |
| **Invite‑to‑signup conversion** | 8%+ |
| **Profile share events per week** | 200+ |

---

## 4. Target Users & Personas

**Primary:** MUJ students (all years, all branches) who participate in or want to participate in hackathons. Then pan to other unis and partner with sites.

### Persona 1 — The Experienced Hacker
**Arjun, 3rd year CSE**
- Done 6+ hackathons; solid in backend and ML
- Currently finds teammates via the college tech community WhatsApp group
- Pain: Teammates ghost, or skill levels are mismatched
- Need: A way to vet potential teammates before committing, and be discoverable as a strong candidate

### Persona 2 — The Curious First-Timer
**Priya, 1st year IT**
- Knows basic web dev; just attended her first dev meetup
- Pain: Doesn't know anyone experienced; feels too junior to reach out to seniors
- Need: A low-friction way to find a team that will guide her, with clear visibility into experience gaps

### Persona 3 — The Designer
**Karan, 2nd year IT**
- Strong in UI/UX, Figma, React
- Pain: Most hackathon teams say "we just need coders" and overlook design
- Need: A space to signal the value of his design skills to teams building products

---

## 5. V1 Scope

### In Scope
- Mobile app and web
- Phone number OTP authentication
- Profile creation: resume upload with AI extraction, or fully manual
- Hackathon discovery feed with user-submitted hackathons
- Hybrid hackathon verification (auto-flag / admin approval)
- Hinge-style swipe card interface per hackathon
- Mutual match system with swipe credit throttling
- 1:1 in-app chat for matched users
- Dynamic leveling system (percentile-based)
- Admin panel (web) for hackathon moderation
- Link for hackathons. When a person uses the QR code to scan a banner in uni, it should lead to the page of hackathon where they can register and find teammates. Also, hackathons should have QR codes on the site so people can make other people scan.
- Push notifications for matches, messages, hackathon approvals
- **Daily streak & “come back tomorrow” hooks**
- **Profile share card (public‑facing, no contact info)**
- **Invite‑a‑friend flow with bonus credits**
- **Onboarding that builds desire before asking for effort**
- **Micro‑interactions: confetti, haptics, soundless celebrations**
- **Guided first‑swipe experience that guarantees a quick win**
- **Live activity ticker on home screen (“X people are building teams right now”)**
- **“Who’s looking for someone like you?” teaser (blurred until you swipe)**
- **Double‑sided invite reward (both inviter and invitee get bonus credits)**
- **Streak saver: spend credits to preserve a streak**
- **Brag‑worthy profile share card with fun stats**
- **Time‑based welcome messages and level‑up celebrations**

### Out of Scope (V2+)
- Group/team chat channels
- Expanding beyond MUJ
- Project collaboration tools (shared boards, tasks)
- Video profile bios
- Mentor/judge matching
- Monetisation (premium plans, boosted profiles)
- Saved "interested" list before committing to swipe on a hackathon

---

## 6. User Flows

### 6.1 New User — Onboarding to First Swipe
```
App open
  → Splash screen (1.5s)
  → Onboarding carousel (3 slides, skippable) (very specific so it's not an eyesore)
  → Phone number entry
  → OTP verification (6-digit, 1m30s timer + resend)
  → Profile Setup wizard
      Step 1: Personal info (name, email, year, branch, bio)
      Step 2: Social links (LinkedIn, GitHub, portfolio)(or login w these instead of phone in step 1 and get phone from there and ask number if not there)
      Step 3: Skills & experience
            → Option A: Upload resume (PDF) → AI extracts info → user reviews & edits
            → Option B: Fill manually (tech stack tags, projects, achievements, hackathon history)(hybrid with github or linkedin)
      Step 4: Preferences (role, availability)
      Step 5: Review & submit
  → Level assigned (based on initial profile score vs all users)
  → Guided first‑swipe tutorial (pre‑seeded demo profiles that guarantee a match)
  → Lands on Home Screen (Hackathon Discovery)
```

### 6.2 Returning User — Finding a Teammate for a Hackathon
```
App open → Home Screen
  → Browse or search hackathons
  → Tap hackathon card → Hackathon Detail Screen
  → Tap "Find Teammates" CTA
  → Confirm interest in hackathon (one-tap register) should be a button to un-interest too
  → Swipe Screen loads (cards of other interested users)
      Left swipe → Reject (free, unlimited)
      Right swipe → Like (costs swipe credits)
      Tap card → Expanded Profile screen (full details, still no contact info)
  → Match modal fires if they already right-swiped you back (don't show these first. keep random)
  → "Keep Swiping" or "Go to Chat"
  → No more cards → "Check back tomorrow / invite friends"
```

### 6.3 Adding a Hackathon
```
Home Screen → FAB (+) button
  → Add Hackathon Form
  → Submit (auto-flag runs)
  → "Submitted — under review" confirmation screen
  → Push notification when approved or rejected
```

### 6.4 Match → Back Out
```
Chat screen → Kebab menu → "Back Out from this hackathon team"
  → Confirmation modal (irreversible)
  → Match removed from both sides
  → Chat archived (visible to neither party, stored server-side 30 days)
  → Match count for that hackathon decreases (credit throttling recalculates)
```

### 6.5 Editing Profile
```
Profile Tab → Edit icon
  → Edit any section (same UI as profile setup, pre-filled)
  → Save → Level recalculated on next daily batch
```

### 6.6 Invite a Friend
```
Any screen → Share icon (or prompt after match / empty deck)
  → Native share sheet with personalised message + deep link
  → Friend opens link → lands on App Store / Play Store or web signup
  → After friend signs up and completes profile → inviter gets +5 bonus credits (one‑time per friend, max 10 friends)
  → Invited friend also receives +3 bonus credits on profile completion (double‑sided reward)
```

### 6.7 Daily Streak & Come‑Back Hook
```
App open → if user visited yesterday → streak counter increments
  → Show “🔥 You’re on a 3‑day streak!” toast
  → Streak rewards: every 7 consecutive days → +3 bonus credits
  → If streak broken → gentle nudge: “Your streak reset. Come back tomorrow to start a new one.”
  → Streak saver: if user is about to miss a day, they can spend 5 credits to preserve the streak (one‑time use per streak)
```

---

## 7. Screen Specifications

### 7.1 Splash Screen
- Full-screen branded illustration or logo
- App name + tagline: *"Build better teams. Win together."*
- Auto-dismiss after 1.5s → Onboarding (first launch) or Home (returning user)

---

### 7.2 Onboarding Carousel (3 Slides)
Swipeable, skippable via "Skip" top-right. Last slide has "Get Started" CTA.

| Slide | Headline | Body copy | Illustration concept |
|---|---|---|---|
| 1 | "Find the right teammates" | Connect with hackers whose skills complement yours for every hackathon | Two cards swiping together |
| 2 | "Grow your reputation" | Your profile level rises as you add skills, projects, and wins | Level badge going up |
| 3 | "Swipe to build your team" | Matched? Chat instantly and see each other's contact details | Match + chat screen preview |

**Marketing‑psychology additions:**
- Slide 1 includes a subtle social‑proof badge: *“Join 200+ hackers already building teams”* (dynamic, fetched from server).
- Slide 3 ends with a curiosity gap: *“Your next teammate could be one swipe away.”*

---

### 7.3 Phone Number Entry Screen
**Fields:**
- Country code picker (default: +91 India)
- Phone number input (numeric keyboard)

**Actions:**
- "Send OTP" primary button (disabled until valid 10-digit number)

**States:**
- Loading (OTP sending)
- Error: "Unable to send OTP. Try again." (after timeout/failure)

---

### 7.4 OTP Verification Screen
**Fields:**
- 6 auto-advancing digit inputs (one per box)
- "Resend OTP" link (disabled for first 30s, shows countdown)
- "Change number" link

**Actions:**
- Auto-submits when 6th digit entered
- Manual "Verify" button as fallback

**States:**
- Loading (verifying)
- Error: "Invalid OTP. X attempts remaining." (max 5 attempts, then 10min lock)
- Success → routes to Profile Setup (new user) or Home (returning user)

---

### 7.5 Profile Setup — Step 1: Personal Info
**Progress indicator:** Step 1 of 5 (pill bar at top)

**Fields:**
| Field | Type | Required | Notes |
|---|---|---|---|
| Full name | Text input | Yes | |
| Email address | Email input | No | "For hackathon teams to contact you" |
| Year of study | Dropdown | Yes | 1st / 2nd / 3rd / 4th / Alumni |
| Branch / Department | Dropdown | Yes | CSE, IT, ECE, ME, CE, BBA, MBA, etc. — full MUJ list |
| Profile photo | Image picker | No | Circular crop, 1:1, optional for v1 |

**Actions:** "Next" → Step 2

---

### 7.6 Profile Setup — Step 2: Social Links
**Fields:**
| Field | Type | Required | Notes |
|---|---|---|---|
| LinkedIn profile URL | URL input | No | Auto-validates linkedin.com domain |
| GitHub profile URL | URL input | No | Auto-validates github.com domain |
| Portfolio / Personal site | URL input | No | Any URL |

**UX note:** Show small icon previews next to each input. Show inline "Linked ✓" badge on valid URLs.

**Actions:** "Next" → Step 3

---

### 7.7 Profile Setup — Step 3: Skills & Experience
This is the most important step. Two clear paths are offered.

**Path chooser UI:**
Two large tappable cards:
- 📄 **"Upload My Resume"** — *"Let AI fill your profile in seconds"*
- ✏️ **"Fill It Myself"** — *"Add details manually"*

#### Path A: Resume Upload
1. Native file picker (PDF only, max 10MB)
2. Upload progress screen: *"Reading your resume… extracting skills…"* (skeleton animation)
3. AI processes the file → returns structured data
4. **Review & Edit Screen:** All extracted fields shown in editable form (see fields below). User can edit any field the AI got wrong before confirming.
5. "Looks good" CTA → proceeds

**Extracted fields (via AI):**
- Tech stack (auto-tagged chips)
- Projects (name, description, tech used, links)
- Achievements
- Hackathon history (event name, year, result)

#### Path B: Manual Entry
A scrollable form with the following sections:

**Tech Stack:**
- Multi-select tag input from a pre-seeded list of 200+ technologies (React, Node.js, Python, TensorFlow, Figma, etc.)
- Free-text fallback for anything not in the list
- For each selected technology, user sets proficiency: Beginner / Intermediate / Advanced (3-tap pill picker)
- Maximum 30 technologies (soft cap; user warned at 25)

**Projects (up to 5):**
Each project card:
| Field | Type |
|---|---|
| Project name | Text |
| One-line description | Text (max 100 chars) |
| Technologies used | Tag multi-select |
| GitHub URL | URL (optional) |
| Live URL | URL (optional) |

**Achievements (up to 5):**
- Free-text list items, one per line (e.g. "Google Developer Student Club Lead")
- Max 150 chars per achievement

**Hackathon History (up to 10):**
Each entry:
| Field | Type |
|---|---|
| Hackathon name | Text |
| Year | Number (4-digit) |
| Result | Dropdown: Participated / Top 10 / Top 3 / Runner-Up / Winner |
| Short description | Text (optional, max 100 chars) |

**Actions:** "Next" → Step 4

---

### 7.8 Profile Setup — Step 4: Preferences
**Fields:**
| Field | Type | Notes |
|---|---|---|
| My primary role | Multi-select (max 3) | Frontend Dev, Backend Dev, Full-Stack Dev, ML/AI Engineer, Data Analyst, IoT/Hardware, Designer (UI/UX), Product Manager, Other |
| Looking for roles | Multi-select | Same list — "What skills do you want in your team?" |
| Hackathon availability | Single select | Online only / In-person only / Both |

**Actions:** "Next" → Step 5

---

### 7.9 Profile Setup — Step 5: Review
A read-only summary of everything entered. Each section has an inline "Edit" link.

Sections displayed:
- Personal Info
- Social Links
- Tech Stack (shown as chips)
- Projects (collapsed cards)
- Achievements
- Hackathon History
- Preferences

**Actions:**
- "Complete Profile" primary CTA → profile saved, level calculated, routes to Home
- Progress is saved at each step (user can leave and return)

---

### 7.10 Home Screen — Hackathon Discovery
**Layout:**
- **Header:** App logo left | User's level badge + avatar right (tappable → Profile tab)
- **Live activity ticker:** “🔥 47 people are building teams right now” (refreshed every 5 min)
- **Search bar:** "Search hackathons…" (filters by name, location, dates)
- **Filter chips (horizontal scroll):** All | Online | In-Person | This Week | This Month | Added by Community
- **Hackathon cards list (vertical scroll)**

**Hackathon Card Component:**
| Element | Detail |
|---|---|
| Hackathon name | Bold, 18sp |
| Organiser | Subtitle |
| Date range | e.g. "Aug 10–12, 2026" |
| Location tag | 🌐 Online or 📍 City |
| Prize pool | 💰 ₹1,00,000 (if available) |
| Teammate-seekers count | 👥 14 people looking |
| Verification badge | ✅ Verified or 🕐 Pending (community-submitted) |
| Status chip | Upcoming / Ongoing / Registration Open / Closed |

**FAB (+):** Bottom-right floating action button → Add Hackathon flow

**Bottom Navigation:**
- 🏠 Home (Hackathons)
- 💬 Matches & Chats
- 👤 My Profile
- ⚙️ Settings

---

### 7.11 Add Hackathon Screen
**Header:** "Submit a Hackathon"

**Form fields:**
| Field | Type | Required | Notes |
|---|---|---|---|
| Hackathon name | Text | Yes | |
| Organiser / Host | Text | Yes | e.g. "Devfolio", "Smart India Hackathon" |
| Start date | Date picker | Yes | |
| End date | Date picker | Yes | |
| Location | Toggle + text | Yes | Online / Offline + venue name if offline |
| City | Text | If offline | |
| Description | Multiline text | Yes | Max 300 chars |
| Official source URL | URL input | Yes | *"Must be from the hackathon's official page, Devfolio, Unstop, Devpost, etc."* |
| Prize pool | Currency input | No | In INR |
| Team size range | Text / range picker | No | e.g. "2–5 members" |
| Registration deadline | Date picker | No | |

**Submission note (displayed):**
> "Your submission will be reviewed within 24–48 hours. Fake or unverified hackathons will be removed and repeat offenders may be banned."

**Actions:** "Submit for Review" CTA

---

### 7.12 Hackathon Submitted — Pending Screen
- Illustration of a clock / review icon
- Headline: *"Submitted! We're reviewing it."*
- Body: "You'll get a notification once your hackathon is approved. If rejected, we'll tell you why."
- ETA text: "Usually within 24 hours"
- CTA: "Back to Home"

---

### 7.13 Hackathon Detail Screen
Opened when user taps a card on Home.

**Header:** Hackathon name + back arrow

**Content sections:**
- Full organiser info + source URL link (opens in-app browser)
- Dates + location (map preview if in-person)
- Prize pool + team size
- Description (full)
- Verification status badge
- **"X people are looking for teammates"** — social proof count
- Registration deadline + CTA "Register on Official Site" (deep links to source URL)

**Primary CTA at bottom:**
> "🔍 Find Teammates" — large button

If user has not registered interest yet: triggers interest registration.
If user already registered: takes them straight to the Swipe Screen.

**Daily swipe credits remaining indicator:** Shown as a small pill "⚡ 14 swipe credits left today" — only visible after tapping Find Teammates.

---

### 7.14 Swipe Screen (Core Feature)
The main matchmaking interface. Triggered per-hackathon.

**Layout:**
- **Header:** Hackathon name (truncated) + "X left today" credit pill
- **Card stack:** 2–3 cards visible (front card full, behind ones slightly peeked)
- **Action buttons at bottom:** ✕ (left / reject) and ❤️ (right / like)
- **Tip on first use:** "Swipe right on people you'd want to team up with for this hackathon."

**Swipe Card — Front Face:**

| Element | Detail |
|---|---|
| Profile photo | Top half of card, large |
| Name (first name + last initial) | e.g. "Arjun S." |
| Year + Branch | "3rd year · CSE" |
| Level badge | e.g. "⚡ Level 4 — Crafter" |
| Primary role | e.g. "Backend Dev · ML/AI" |
| Top 5 tech stack chips | Most proficient first |
| Hackathon count | 🏆 6 hackathons · 2 wins |
| Featured project | Project name + one-liner |
| Availability tag | 🌐 Online & In-Person |

**Interactions:**
- Swipe right → like animation (green overlay, heart icon) → costs 1–3 credits
- Swipe left → reject animation (red overlay, ✕ icon) → free, unlimited
- Tap card (or "expand" icon) → opens Expanded Profile Screen
- When credit hits 0 → right swipe gesture is blocked, "Out of credits" modal appears

**Empty state (no more cards):**
- Illustration + "You've seen everyone for this hackathon today"
- Sub-text: "Credits reset at midnight. Come back tomorrow!"
- CTA: "Browse Other Hackathons"
- **Additional CTA:** "Invite a friend to join this hackathon → +3 bonus credits" (triggers share sheet)

---

### 7.15 Expanded Profile Screen
Full scrollable profile view of a candidate. Accessed by tapping a swipe card.

**No contact info visible here.**

**Sections:**
- Profile photo (full width)
- Name, year, branch, level badge
- Primary & looking-for roles
- Availability
- Tech Stack: Full list of all techs with proficiency indicators (Beginner · Intermediate · Advanced)
- Projects: Expandable project cards (name, description, tech used, GitHub/live link icons — links open in in-app browser)
- Hackathon History: List of events with name, year, result badge (Participated / Top 3 / Winner)
- Achievements: Bulleted list
- Social links: LinkedIn + GitHub icons (visible but open in browser, no personal data shown here — this is a preview only)

**Sticky bottom bar:**
- ✕ Reject button (left) and ❤️ Like button (right)
- Same credit cost logic as swipe card applies

---

### 7.16 Match Modal
**Triggered:** When a mutual right-swipe is confirmed (either at the moment of swiping or when the other person later swipes back).

**Design:**
- Full-screen animated overlay (confetti / spark animation)
- Headline: *"Team Found! 🎉"*
- Sub-text: *"You and [Name] both want to team up for [Hackathon Name]"*
- Both avatars shown with a connection icon between them
- Contact reveal note: *"You can now see each other's full profile and contact details in chat."*

**Actions:**
- "💬 Start Chatting" → opens 1:1 Chat Screen
- "Keep Swiping" → dismisses modal, returns to Swipe Screen

**Also triggered as a push notification** when the match happens while the app is closed.

---

### 7.17 Matches Screen (Tab 2 — Bottom Nav)
**Layout:**
- **Header:** "Your Teams"
- Organised by hackathon (section headers with hackathon name + date)
- Under each hackathon: row of matched user cards

**Match Card Component (in list):**
- Avatar
- Name
- Level badge
- Last message preview (if chat started)
- Unread badge (red dot)
- "Active" green dot if user was online < 5 min ago

**Empty state:** "No teams yet. Start swiping on a hackathon to find your teammates!"

**Note:** Matches persist even after the hackathon passes (for historical reference) but are marked "Past" if the hackathon date has passed.

---

### 7.18 Chat Screen
Accessed by tapping a match.

**Header:**
- User avatar + name
- Hackathon tag: *"Teamed for [Hackathon Name]"*
- Three-dot menu → "View Full Profile" | "Back Out from Team" | "Report User"

**Contact info bar (pinned below header):**
- LinkedIn icon → opens profile
- GitHub icon → opens profile
- Phone number (if user added email/phone in their profile, shown here)
- Email (if provided)

**Message area:**
- Standard chat bubbles (sender right, receiver left)
- Timestamps
- Read receipts (single tick = delivered, double tick = read)
- Character limit per message: 1,000

**Input bar:**
- Text input field
- Send button
- No media/image sharing in V1

**"Back Out" confirmation modal:**
> "Backing out will remove this match and hide this chat for both of you. You won't be able to undo this. Are you sure?"
> Buttons: "Yes, Back Out" (red) | "Cancel"

---

### 7.19 My Profile Screen (Tab 3)
**Layout:**
- Large profile photo (circular) with edit icon overlay
- Name + Year + Branch
- **Level badge (prominent):** e.g. "⚡ Level 4 — Crafter · Top 22%"
- Progress bar showing distance to next level
- Stats row: `Hackathons: 6 | Teams built: 12 | Swipe credits today: 14/20`
- Sections: Tech Stack | Projects | Achievements | Hackathon History | Preferences
- Each section has an inline "Edit" button

**Actions:**
- "Edit Profile" button → Edit Profile flow (same as setup, pre-filled)
- **"Share My Card" button** → generates a public‑facing profile card (no contact info) that can be shared via any messaging app. The card includes name, level, top skills, a fun stat (e.g., “Top 10% in React” or “Built 5 teams this month”), and a QR code that deep‑links to the app (or app store if not installed). This acts as a viral acquisition channel.

---

### 7.20 Settings Screen (Tab 4)
**Sections:**
- **Account:** Phone number (view only, change requires re-verification) | Log out | Delete account
- **Notifications:** Toggle for: Matches, New messages, Hackathon approved/rejected, Credits reset, **Streak reminders**
- **Privacy:** "Who can see my profile?" (only users interested in same hackathon — in V1 this is the only option and is fixed) | "Show my online status"
- **About:** App version | Terms of Service | Privacy Policy | Contact / Report a bug

---

### 7.21 Admin Panel (Web — Developer Only)

A lightweight web dashboard built separately from the mobile app, used by the developer to verify hackathon submissions.

**Pages:**

**Dashboard:**
- Total users, total hackathons (verified / pending / rejected), total matches today

**Hackathon Review Queue:**
- List of all pending submissions sorted by submission date
- Each row: Hackathon name | Submitted by (user) | Auto-flag status | Source URL | Submission date | Actions (Approve / Reject)

**Hackathon Review Detail:**
- All submitted fields in full
- Auto-flag result badge: ✅ Likely Legit | ⚠️ Needs Review | 🚫 Likely Spam
- Auto-flag reasoning: "Source URL domain: devfolio.co (trusted)" or "URL returned 404"
- "Open Source URL" link
- Approve button (green) → hackathon goes live, submitter notified
- Reject button (red) → opens reason input → submitter notified with reason

**User Management (minimal for V1):**
- Search users by phone or name
- View profile
- Suspend / unsuspend account (for abuse)

---

## 8. Feature Deep-Dives

### 8.1 Authentication

- **Method:** Phone OTP via SMS
- **Provider:** Twilio Verify (recommended) or Firebase Auth (phone)
- **OTP:** 6 digits, valid for 5 minutes
- **Max attempts:** 5 before a 10-minute cooldown
- **Session:** JWT issued on verification, stored securely in device keychain
- **Refresh:** JWT refreshed silently in background; re-authentication only required after 30 days of inactivity or explicit logout
- **No MUJ email restriction in V1:** Any Indian phone number can sign up. University enforcement (if desired for V2) can be done by cross-referencing a provided college email with @jaipur.manipal.edu

---

### 8.2 Profile Creation & Resume RAG

#### Resume Upload & AI Extraction

When a user uploads a PDF resume:

1. **Upload:** PDF sent to backend (max 10MB, PDF only)
2. **Text extraction:** Backend extracts raw text using a PDF parsing library (pdf-parse or similar)
3. **AI extraction:** The extracted text is sent to an LLM (OpenAI GPT-4o or Claude Sonnet) with a structured prompt:

```
Extract the following from this resume in JSON format:
{
  "tech_stack": [{"name": string, "proficiency": "beginner|intermediate|advanced"}],
  "projects": [{"name", "description", "tech_used": [], "github_url", "live_url"}],
  "achievements": [string],
  "hackathon_history": [{"name", "year", "result": "participated|top10|top3|runner_up|winner"}],
  "email": string,
  "linkedin_url": string,
  "github_url": string
}
Return only valid JSON. If a field cannot be determined, return null.
```

4. **Review:** Extracted data is pre-filled in the Step 3 form. The user sees all extracted info in editable fields and must confirm before saving. No extraction is saved without user review.
5. **Fallback:** If extraction fails or returns incomplete data, the user is shown the manual form with whatever was extracted as a starting point.

#### Profile Score (Input for Leveling)

Computed server-side whenever profile is updated.

| Component | Scoring |
|---|---|
| Tech stack | Beginner tech = 1pt · Intermediate = 2pt · Advanced = 3pt · Max 30 techs |
| Projects | 5pts per project · +2 if GitHub URL present · +2 if live URL present |
| Hackathon participation | 10pts per event |
| Hackathon result bonus | Top 10: +10 · Top 3: +20 · Runner-Up: +30 · Winner: +40 |
| Achievements | 3pts each · Max 5 |
| Profile completeness | +20 if all required fields filled · +10 if photo added |

**Maximum possible raw score:** No hard cap (grows as you add more to profile). The score is used for relative ranking only — the absolute value doesn't matter.

---

### 8.3 Leveling System

Levels are **percentile-based and dynamic** — they recalculate once every 24 hours (midnight IST) based on all users' current profile scores. This means as the community grows and improves, maintaining a high level requires continuously updating your profile.

#### Level Tiers

| Level | Name | Percentile Band | Badge Color | Description |
|---|---|---|---|---|
| 1 | Scout | Bottom 15% | Grey | Just getting started |
| 2 | Builder | 15–35% | Green | Learning the ropes |
| 3 | Hacker | 35–55% | Blue | Getting competitive |
| 4 | Crafter | 55–75% | Purple | Experienced and skilled |
| 5 | Elite | 75–90% | Gold | Highly experienced, consistent winner |
| 6 | Legend | Top 10% | Red / Diamond | Top tier — rare and respected |

#### Level Display
- Badge shown on swipe cards, profile, and in-chat header
- Exact percentile shown on own profile only: *"⚡ Level 4 — Crafter · Top 22%"*
- Progress bar on profile showing estimated score needed to move up

#### Level Update Mechanics
- Recalculated nightly; no real-time updates during the day
- Users receive a push notification if their level changes: *"You moved up to Level 5 — Elite! 🎉"* or *"Your level dropped to Level 3. Keep adding to your profile to climb back."*
- Level dropping is possible if the community overall improves and a user's relative standing falls

#### Anti-Gaming Rules
- Profile score is based on self-reported data in V1; no verification of skill claims in V1
- In V2: peer endorsements, verified GitHub activity (via GitHub API), and hackathon result cross-referencing will add objective signals

---

### 8.4 Hackathon Discovery & Submission

#### Hackathon Feed Logic
- Default sort: Upcoming hackathons first, sorted by start date
- Filter by: Online/Offline, date range, "Added by Community" vs pre-seeded
- Search: Full-text search on hackathon name and organiser
- Pre-seeded hackathons: Developer adds major hackathons at launch (Smart India Hackathon, Devfolio hackathons, Unstop competitions, college fest tech events)

#### Hackathon Submission
Any user can submit a hackathon. Required fields and UX are described in Screen 7.11. After submission:
- Hackathon status = **pending**
- Visible only to the submitter (shown with "Pending Review" badge) until approved
- Once approved → status = **verified**, visible to all users
- If rejected → status = **rejected**, submitter notified with reason, hackathon not shown

---

### 8.5 Hackathon Verification (Hybrid)

#### Auto-Flag Logic (runs on submission)
The backend auto-checks the source URL and applies a flag:

| Check | Pass | Fail |
|---|---|---|
| URL accessibility | HTTP 200 returned | 4xx/5xx → Likely Spam |
| Trusted domain check | devfolio.co, unstop.com, devpost.com, hackerearth.com, hackathon.io, .edu.in, .ac.in, .gov.in, official company domains | Unknown/personal blog domain → Needs Review |
| Keyword match in URL | "hackathon", "hacks", "hack", "code", "build" | Missing → Needs Review |

**Flag outcomes:**
- ✅ Likely Legit — passes all 3 checks
- ⚠️ Needs Review — passes URL but fails domain or keyword check
- 🚫 Likely Spam — URL inaccessible or known spam-adjacent

#### Manual Review (Admin)
Developer reviews flagged and unflagged submissions in the admin panel. Final decision is always human. No submission goes live without explicit admin approval.

**Target review SLA:** Within 24 hours

**Rejection reasons (selectable):**
- Link does not work or points to wrong page
- Not a real hackathon (could be a fake event)
- Duplicate submission (already listed)
- Insufficient information
- Spam or malicious link

---

### 8.6 Teammate Swiping

#### Who Appears in the Swipe Deck?
For a given hackathon H and user U, the deck shows:
- All users who have registered interest in hackathon H
- Excluding user U themselves
- Excluding users U has already right-swiped (to avoid duplicates)
- Excluding users U has already left-swiped
- **Sort order (priority):**
  1. Users with complementary roles to U (e.g. if U is a backend dev, frontend devs and designers appear first)
  2. Users within ±1 level of U (similar experience tier)
  3. All remaining users sorted by profile completeness

#### What Is NOT Shown on Swipe Cards
- Phone number
- Email address
- Social media profiles (LinkedIn, GitHub links)
These are only revealed after a mutual match, in the chat screen.

#### Left Swipe (Reject)
- Free, unlimited
- The rejected user never knows they were rejected
- In V1, rejected users do NOT reappear (no "undo" feature)
- In V2: swipe undo as a premium feature

#### Right Swipe (Like)
- Costs swipe credits (see Section 8.7)
- If the other person has already right-swiped U → immediate match modal
- If not → U's like is stored; fires a match notification if/when they reciprocate

---

### 8.7 Swipe Credit System

The credit system exists to prevent spam right-swiping and to naturally throttle users who already have enough matches for a given hackathon.

#### Global Daily Allowance
- Every user gets **20 right-swipe credits per day**
- Credits are **shared across all hackathons** (a single pool)
- Credits reset at **midnight IST** every day
- Left swipes cost **0 credits** and are unlimited

#### Per-Hackathon Credit Cost

The cost of right-swiping for a specific hackathon scales with how many matches you already have for that hackathon:

| Matches for Hackathon X | Cost per right swipe (for X) |
|---|---|
| 0 – 4 matches | 1 credit |
| 5+ matches | 3 credits |

**Example:**
- User has 5 matches for Hackathon A and 0 for Hackathon B
- Swiping for A costs 3 credits each → 6–7 more right swipes maximum for A today
- Swiping for B still costs 1 credit each → up to 14 more right swipes for B today

#### Why This Works
- Encourages users with a team to "step aside" and let under-teamed users swipe freely
- Doesn't block swiping outright — people can still swipe after 5 matches (teammates back out, teams need backups)
- Left-swiping is always free, so discovery is never blocked

#### Credit Visibility
- Shown as a persistent indicator on the Swipe Screen header: *"⚡ 14 credits left today"*
- At 5 credits remaining: amber warning banner *"Running low on swipes for today"*
- At 0 credits: right swipe gesture blocked; overlay modal with countdown to midnight reset

#### "Back Out" and Credits
- When a match is removed via "Back Out", the match count for that hackathon decreases
- Credit cost recalculates at the start of the next day
- **Credits used are not refunded** — this prevents gaming the system

---

### 8.8 Matching Logic

A **match** is created when:
1. User A right-swipes User B for Hackathon X
2. User B right-swipes User A for Hackathon X (can happen in any order, any time)

Matches are:
- **Per-hackathon** — the same two users can be matched across multiple hackathons (separate match records)
- **Persistent** — not time-limited, unless one party backs out
- **Bilateral** — both users see the match and can initiate chat

#### Post-Match Unlocks
Once matched:
- 1:1 chat is unlocked
- Both users' full contact info is visible in the chat screen header (phone, email, LinkedIn, GitHub)
- Both users can view each other's complete expanded profile at any time

#### No Hard Team Size Limit
- A user can match with many people for the same hackathon
- This is intentional: team members back out, plans change, teams get finalized organically
- The swipe credit cost at 5+ matches naturally throttles aggressive matching without a hard block

---

### 8.9 1:1 Chat

- **Availability:** Only between two mutually matched users for a specific hackathon
- **Real-time:** WebSocket-based (Supabase Realtime or Socket.io)
- **Message types:** Text only (V1)
- **Max message length:** 1,000 characters
- **Read receipts:** ✓ Delivered / ✓✓ Read
- **Notifications:** Push notification on new message when app is backgrounded
- **No media sharing in V1**
- **Message history:** Retained as long as the match exists. If a user backs out, chat is archived server-side for 30 days and then deleted. Neither user can see it after backing out.

---

### 8.10 Push Notifications

| Trigger | Message |
|---|---|
| New match | "🎉 You matched with [Name] for [Hackathon]! Say hello." |
| New chat message | "[Name]: [preview of message]" |
| Hackathon approved | "✅ Your hackathon '[Name]' has been verified and is now live!" |
| Hackathon rejected | "Your hackathon '[Name]' was not approved. Tap to see why." |
| Daily credits reset | "⚡ Your swipe credits just reset. Go find your team!" (optional, user can disable) |
| Level up | "🏆 You moved up to Level [X] — [Name]!" |
| Level down | "Your level changed to [X]. Keep building to keep climbing." |
| **Streak reminder** | "🔥 Don't break your 5‑day streak! Open HackMate to keep it alive." |
| **Friend joined** | "🎉 [Friend name] just joined HackMate! You earned +5 bonus credits." |

---

### 8.11 Retention & Habit Loops

**Daily Streak:**
- Track consecutive days the user opens the app (any interaction counts).
- Display streak count on Home screen with a fire emoji.
- Every 7‑day streak awards +3 bonus credits.
- If a day is missed, streak resets to 0; show a gentle “streak broken” message with a CTA to come back tomorrow.
- **Streak saver:** If a user is about to miss a day, they can spend 5 credits to preserve the streak (one‑time use per streak).

**Variable Reward:**
- The swipe deck is the core variable‑reward mechanism: users never know if the next card will be a match, a high‑level profile, or someone they know.
- Match modal itself is a high‑arousal reward (confetti, sound, haptic).

**Loss Aversion:**
- Credits expire daily; unused credits are lost, creating urgency to swipe.
- Streak loss creates mild FOMO.

**“Come back tomorrow” hooks:**
- After deck is exhausted: “New people join every day. Check back tomorrow!”
- After credits hit 0: countdown timer to midnight reset.
- Push notification at 9 PM: “Your credits reset in 3 hours. Finish swiping for today.”

**“Who’s looking for someone like you?” teaser:**
- On the Home screen, show a blurred card that says “3 people with your skill set are looking for teammates” — tapping it prompts the user to swipe on a relevant hackathon.

---

### 8.12 Virality & Word‑of‑Mouth

**Profile Share Card:**
- Every user can generate a public‑facing card (image) that shows name, level, top 3 skills, hackathon count, a fun stat (e.g., “Top 10% in React” or “Built 5 teams this month”), and a QR code.
- QR code deep‑links to the app (or app store if not installed) and, after signup, prompts the new user to “Connect with [sharer name]”.
- Share card is accessible from Profile screen and after completing profile setup.

**Invite‑a‑Friend:**
- Accessible from empty deck state, settings, and after a match.
- Native share sheet with a pre‑written message: “I’m building hackathon teams on HackMate. Join me! [link]”
- Inviter receives +5 bonus credits when the invited friend signs up AND completes profile (max 10 friends).
- Invited friend also receives +3 bonus credits on profile completion (double‑sided reward).
- Invited friend sees a “You were invited by [name]” banner during onboarding (social proof).

**Hackathon QR Codes:**
- Each hackathon detail page includes a shareable QR code that, when scanned, opens the hackathon page in the app (or app store).
- Physical posters on campus can include these QR codes, driving installs.

**Social Proof Everywhere:**
- Home screen shows “X people are building teams right now” (anonymised, refreshed every 5 min).
- Hackathon cards show “👥 X people looking”.
- Onboarding carousel includes dynamic user count.

---

### 8.13 UX Polish & Micro‑interactions

**Swipe feedback:**
- Right swipe: card tilts right with green glow, subtle haptic, heart icon scales up.
- Left swipe: card tilts left with red glow, subtle haptic, X icon scales up.
- Both actions have spring physics (Reanimated 2).

**Match celebration:**
- Full‑screen confetti animation (lottie or canvas).
- Haptic pulse on match.
- Sound effect (optional, muted by default, user can enable).

**Empty states that teach:**
- No hackathons: “No hackathons yet. Be the first to add one!” with a prominent FAB hint.
- No matches: “Start swiping on a hackathon to find your team.” with a CTA to browse hackathons.
- No messages: “Send a message to break the ice!”

**Loading states:**
- Skeleton screens for hackathon list, match list, profile sections.
- Animated spinner for OTP, resume upload, AI extraction.

**Error recovery:**
- Network errors show a toast with “Retry” action.
- Failed image uploads show placeholder with retry icon.
- AI extraction failure offers manual entry with pre‑filled partial data.

**Delight moments:**
- Time‑based welcome message on Home screen (e.g., “Good morning! Ready to build your team?”).
- Level‑up animation with confetti and a congratulatory message.
- Profile completion celebration: confetti burst when profile reaches 100%.

**Accessibility:**
- All tappable elements have minimum 44x44pt touch targets.
- Labels on icons for screen readers.
- Sufficient colour contrast (WCAG AA).

---

## 9. Data Models

### User
```
id                  UUID (PK)
phone               string (unique)
name                string
email               string (nullable)
year_of_study       enum: 1st|2nd|3rd|4th|alumni
branch              string
profile_photo_url   string (nullable)
linkedin_url        string (nullable)
github_url          string (nullable)
portfolio_url       string (nullable)
resume_url          string (nullable)
tech_stack          JSONB: [{name, proficiency}]
projects            JSONB: [{name, description, tech_used[], github_url, live_url}]
achievements        JSONB: [string]
hackathon_history   JSONB: [{name, year, result, description}]
preferred_roles     JSONB: [string]
looking_for_roles   JSONB: [string]
availability        enum: online|offline|both
profile_score       integer (computed, updated nightly)
level               integer 1–6 (computed, updated nightly)
level_name          string (computed)
daily_credits       integer (default 20)
credits_last_reset  timestamp
streak_count        integer (default 0)
last_active_date    date
is_suspended        boolean (default false)
created_at          timestamp
updated_at          timestamp
```

### Hackathon
```
id                  UUID (PK)
name                string
organiser           string
description         string
start_date          date
end_date            date
location_type       enum: online|offline
venue               string (nullable)
city                string (nullable)
prize_pool          integer (nullable, in INR)
team_size_range     string (nullable)
registration_deadline date (nullable)
source_url          string
status              enum: pending|verified|rejected
auto_flag           enum: likely_legit|needs_review|likely_spam
rejection_reason    string (nullable)
submitted_by        UUID → User (nullable; null if pre-seeded)
interested_count    integer (denormalised, updated on change)
created_at          timestamp
updated_at          timestamp
```

### HackathonInterest
```
id                  UUID (PK)
user_id             UUID → User
hackathon_id        UUID → Hackathon
match_count         integer (default 0)
created_at          timestamp
UNIQUE(user_id, hackathon_id)
```

### Swipe
```
id                  UUID (PK)
swiper_id           UUID → User
swiped_id           UUID → User
hackathon_id        UUID → Hackathon
direction           enum: left|right
created_at          timestamp
UNIQUE(swiper_id, swiped_id, hackathon_id)
```

### Match
```
id                  UUID (PK)
user1_id            UUID → User
user2_id            UUID → User
hackathon_id        UUID → Hackathon
is_active           boolean (default true)
backed_out_by       UUID → User (nullable)
archived_at         timestamp (nullable)
created_at          timestamp
UNIQUE(user1_id, user2_id, hackathon_id)
```

### Message
```
id                  UUID (PK)
match_id            UUID → Match
sender_id           UUID → User
content             text (max 1000 chars)
is_read             boolean (default false)
created_at          timestamp
```

### CreditLog (for auditing)
```
id                  UUID (PK)
user_id             UUID → User
hackathon_id        UUID → Hackathon (nullable)
action              enum: swipe_right|daily_reset|invite_bonus|streak_bonus|streak_saver
credits_before      integer
credits_after       integer
created_at          timestamp
```

### Invite
```
id                  UUID (PK)
inviter_id          UUID → User
invitee_phone       string (nullable)
status              enum: pending|signed_up|profile_complete
bonus_awarded       boolean (default false)
invitee_bonus_awarded boolean (default false)
created_at          timestamp
```

---

## 10. Tech Stack

### Mobile App
| Layer | Technology | Rationale |
|---|---|---|
| Framework | **Expo (React Native)** | Cross-platform (iOS + Android) from single codebase; user-specified |
| Navigation | **Expo Router** | File-based routing, deep link support |
| State Management | **Zustand** | Lightweight, minimal boilerplate |
| UI Kit | **Custom components** (using Expo's StyleSheet) | Full design control; avoid heavy UI lib dependencies |
| Swipe Cards | **react-native-deck-swiper** or custom with **Reanimated 2 + Gesture Handler** | Smooth, native-feeling swipe gestures |
| Animations | **Reanimated 2** | 60fps animations for match modal, card spring physics |
| Push Notifications | **Expo Notifications** (FCM + APNs) | Native push via Expo's managed workflow |
| Deep Linking | **Expo Linking** | For match notifications, hackathon share links, invite links |
| Image Picking | **expo-image-picker** | Native gallery + camera access |
| File Picking (resume) | **expo-document-picker** | PDF selection from device |
| In-app Browser | **expo-web-browser** | For source URLs, LinkedIn, GitHub links |
| Secure Storage | **expo-secure-store** | JWT token storage in device keychain |
| Haptics | **expo-haptics** | Subtle feedback on swipe, match |

### Backend
| Layer | Technology | Rationale |
|---|---|---|
| Runtime | **Node.js** | Team familiarity, vast ecosystem |
| Framework | **Fastify** | Faster than Express, built-in schema validation |
| Language | **TypeScript** | Type safety, reduces runtime bugs |
| API Style | **REST** | Straightforward for V1; GraphQL overkill |
| ORM | **Prisma** | Type-safe DB access, clean migrations |
| Real-time | **Supabase Realtime** or **Socket.io** | For live chat message delivery |

### Database & Infrastructure
| Layer | Technology | Rationale |
|---|---|---|
| Primary DB | **PostgreSQL** (via Supabase) | Relational, JSONB for flexible profile fields |
| File Storage | **Supabase Storage** | Resume PDFs, profile photos (with signed URLs) |
| Caching | **Redis** (Upstash serverless) | Credit pool, session data, swipe deck caching |
| Auth | **Twilio Verify** (SMS OTP) | Reliable OTP delivery in India |
| AI Extraction | **OpenAI GPT-4o** or **Anthropic Claude API** | Structured data extraction from resume text |
| Hosting | **Railway** (backend) + **Supabase** (DB + storage + realtime) | Affordable, fast to deploy |

### Admin Panel
| Layer | Technology |
|---|---|
| Framework | **Next.js** (App Router) |
| Auth | Simple email/password (single developer) |
| Hosting | **Vercel** |
| Styling | **Tailwind CSS** |

---

## 11. Non-Functional Requirements

### Performance
- Swipe card deck must load within 2s on a 4G connection
- Chat messages must deliver within 1s (real-time)
- Resume AI extraction must complete within 15s; if longer, show progress + allow manual fallback
- App launch to home screen: < 3s (warm), < 5s (cold)

### Availability
- API uptime target: 99.5% (acceptable for V1)
- Planned maintenance only outside 10pm–10am IST (active usage hours)

### Security
- All API endpoints require valid JWT
- Phone numbers stored hashed at rest (never shown to other users)
- Contact info only exposed post-mutual-match, never before
- Resumes stored in private Supabase bucket with signed URL access (only the owning user can access their own resume URL)
- Rate limiting on OTP endpoint: max 3 requests per phone per hour

### Scalability (V1 targets)
- Support 1,000 concurrent users on current infrastructure (Supabase + Railway)
- Scale to 5,000 users on V1 architecture before needing infra changes

### Privacy
- Users can delete their account (full data deletion within 30 days)
- Contact info is never indexed or searchable; only shown post-match
- Profile is only visible to users interested in the same hackathon (not publicly searchable)

---

## 12. Edge Cases & Error States

| Scenario | Handling |
|---|---|
| User right-swipes, other user deactivates account before reciprocating | Like record exists but no match fires; deactivated user's card no longer appears in decks |
| Both users right-swipe at exact same time | Race condition handled server-side: first write wins; match created once, not twice |
| Resume upload fails (file too large, wrong format) | Clear error: "Please upload a PDF under 10MB." + "Try manual entry instead" |
| AI extraction returns gibberish / empty JSON | Graceful fallback: "We couldn't read your resume well. Please review the fields below." (shows partially filled form) |
| User submits same hackathon twice | Duplicate check on name + dates + source URL; show: "This hackathon is already submitted or listed." |
| Hackathon passes its end date | Status automatically updated to "Past"; no new interest registrations; existing swipe decks remain accessible but marked "Past" |
| User backs out of all matches, then no credit refund | Expected behaviour; user warned in Back Out confirmation modal |
| Network drops mid-swipe | Action queued locally; retried on reconnect with an idempotent request key |
| User changes phone number (account recovery) | V2 feature; V1 approach: contact developer via Settings > Report a bug |
| Admin rejects a hackathon that already had people register interest | Hackathon hidden from feed; existing interest registrations cleared; no notification to interested users in V1 |
| **Invitee opens link but already has account** | Deep link opens app to home screen; no duplicate bonus awarded |
| **Streak update at midnight across timezones** | Streak calculated based on IST calendar day; server cron runs at 00:05 IST |
| **Credit reset race condition** | Credits reset in a single atomic DB transaction; CreditLog records the reset |
| **Share card QR code scanned by non‑user** | Opens app store / play store with referral tracking; after install and signup, referrer bonus applied |
| **Streak saver used but credits insufficient** | Show error: "You need 5 credits to save your streak. Earn more by inviting friends or wait for tomorrow's reset." |

---

## 13. V2 Backlog

These features are explicitly deferred from V1 but should be designed with V2 in mind:

| Feature | Priority | Notes |
|---|---|---|
| Group team chat (all matches for one hackathon in a single channel) | High | Most requested after V1 |
| Swipe undo (last action) | Medium | Premium feature candidate |
| GitHub API integration for objective skill verification | High | Major trust improvement |
| University expansion (other Manipal campuses, then open) | High | Core to growth |
| Push notifications for hackathon registration deadlines | Medium | Calendar integration |
| "Interested" / saved hackathons list | Medium | Pre-commitment layer |
| Team page: after matching, form an official team with a name | High | Closes the loop from matching to team identity |
| Verified hackathon result badges | High | Validate wins/placements with proof |
| Premium plan: more swipe credits, profile boost, undo | Medium | Monetisation |
| Android/iOS widget: daily swipe credit status | Low | Nice to have |
| Referral system: invite friends for bonus credits | Medium | Growth mechanic |
| **Leaderboard (anonymised)** | Low | Top profiles by level, drives competition |
| **Limited‑time hackathon events** | Medium | “Swipe‑a‑thon” weekends with double credits |

---

*End of HackMate PRD v1.2*

*Next steps: wireframes → design system → technical architecture diagram → sprint 1 planning*
