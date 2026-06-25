# HackMate PRD - Consolidated V1

**Status:** Draft for build planning  
**Market:** Manipal University Jaipur students  
**Platform:** Mobile-first web app or Android app  
**Core promise:** Find your hackathon team before the deadline panic.

---

## 1. Product Thesis

MUJ students currently form hackathon teams through WhatsApp groups, friends, and last-minute luck. This creates three problems:

| Problem | User Pain |
|---|---|
| Discovery | Students do not know who else is interested in a hackathon. |
| Assessment | Students cannot quickly judge whether someone is a good teammate. |
| Follow-through | Matches often fail because nobody starts the conversation or confirms the team. |

HackMate solves this by making hackathon team formation visible, structured, and fast.

V1 should answer one question:

> Can MUJ students form better hackathon teams through HackMate than through WhatsApp?

If a feature does not help a student discover a hackathon, find a teammate, start a conversation, confirm a team, or bring more relevant students into the loop, it is not needed in V1.

---

## 2. Target Audience

### Primary Audience

MUJ students who already join hackathons or are one step away from joining.

These users have the strongest pain, understand the value quickly, and are likely to spread the product inside clubs, branches, batches, and friend groups.

### Core Personas

| Persona | Need |
|---|---|
| Experienced builder | Wants serious teammates and fewer flaky matches. |
| First-time participant | Wants a low-pressure way to find people and join a team. |
| Designer/product teammate | Wants to be discovered by technical teams that undervalue non-code skills. |

---

## 3. Positioning

### Public Positioning

Use outcome-first language:

> Find your hackathon team before the deadline panic.

Supporting lines:

- Build your team before everyone else starts asking.
- Find teammates who actually want to build.
- Your next hackathon team starts here.

### Product Identity

HackMate should make users feel:

- "People like us form teams early."
- "People like us show our work."
- "People like us build seriously."

Avoid leading with "Hinge for hackathon teams" in public marketing. It is useful internally, but public copy should sound credible, practical, and campus-native.

---

## 4. V1 Scope

### In Scope

- Hackathon discovery feed.
- Hackathon detail pages with share links and QR codes.
- User signup/login.
- Progressive profile creation.
- "Looking for team" interest registration per hackathon.
- Teammate discovery cards for each hackathon.
- Like/pass matching.
- Basic 1:1 chat after mutual match.
- Structured first-message prompts.
- Team confirmation status.
- Invite/referral links for hackathons.
- Push/email/in-app notifications for important events.
- Admin panel for hackathon moderation and basic user safety.
- Core analytics events.

### Out Of Scope For V1

- Percentile-based leveling.
- Complex AI resume extraction.
- Premium boosts.
- Swipe undo.
- Group team chat.
- Full organizer dashboard.
- Verified hackathon results.
- GitHub API scoring.
- Public searchable profiles.
- Media sharing in chat.
- Desktop feature parity if mobile-first web is chosen.

---

## 5. Success Metrics

### North Star

Confirmed teams formed per active hackathon.

### 90-Day Targets

| Metric | Target |
|---|---:|
| Registered users | 500 |
| Users with minimum viable profile | 70% |
| Active hackathons listed | 10-20 |
| Users who mark interest in at least one hackathon | 250 |
| Mutual matches | 300 |
| Matches with at least one message | 60% |
| Confirmed teams | 50 |
| D7 retention | 25% |

### Funnel Metrics

- Hackathon page view to signup.
- Signup to minimum profile complete.
- Minimum profile complete to first hackathon interest.
- Interest to first candidate viewed.
- Candidate viewed to first like.
- Like to mutual match.
- Match to first message.
- Match to team confirmed.

---

## 6. Core Product Loop

1. Student opens a hackathon page.
2. Student marks "I am looking for a team."
3. Student creates a minimum profile.
4. Student reviews teammate candidates.
5. Student likes relevant candidates.
6. Mutual like unlocks chat.
7. Chat prompts help both users start quickly.
8. Users confirm whether they are teaming.
9. Confirmed team and profile progress create status.
10. Users invite more people or return for the next hackathon.

---

## 7. UX Requirements

### 7.1 First-Time User Flow

Do not force full onboarding before showing value.

Recommended flow:

1. User lands on Home or a shared hackathon page.
2. User can browse hackathons without login.
3. User taps "I am looking for a team" or "View teammates."
4. App asks user to sign up/login.
5. App collects minimum viable profile.
6. User enters teammate discovery for that hackathon.

### 7.2 Minimum Viable Profile

Required before first teammate discovery:

| Field | Required |
|---|---|
| Name | Yes |
| Year | Yes |
| Branch | Yes |
| Primary role | Yes |
| 3-5 skills | Yes |
| Looking-for roles | Yes |
| Availability | Yes |

Recommended after first intent:

- Profile photo.
- GitHub.
- LinkedIn.
- Projects.
- Hackathon history.
- Short bio.

### 7.3 Profile Strength

Use profile strength instead of competitive levels in V1.

States:

- Starter
- Ready
- Strong
- Verified later

Profile strength should reward:

- Skills added.
- Projects added.
- GitHub/LinkedIn added.
- Hackathon history added.
- Profile photo added.
- Team confirmed after a hackathon.

Do not use dynamic percentile levels in V1. They are too easy to game early and can feel unfair with a small user base.

---

## 8. Screens

### 8.1 Home - Hackathon Feed

Must include:

- Search.
- Filters: All, Online, In-person, This Week, This Month.
- Hackathon cards.
- CTA to submit a hackathon.

Hackathon card fields:

- Name.
- Organizer.
- Date.
- Location.
- Registration status.
- Number of students looking, when useful.
- Verification status.

### 8.2 Hackathon Detail Page

This is the main growth surface.

Must include:

- Hackathon name, organizer, date, location.
- Official registration link.
- Description.
- Team size, if known.
- "I am looking for a team" CTA.
- "I already have a team" CTA.
- "Invite someone" CTA.
- Share link.
- QR code.
- People looking by role.
- Teams forming count, if available.

### 8.3 Profile Setup

Must be short and progressive.

Step 1: Minimum profile.

- Name.
- Year.
- Branch.
- Primary role.
- Skills.
- Looking-for roles.
- Availability.

Step 2: Optional credibility.

- Profile photo.
- GitHub.
- LinkedIn.
- Projects.
- Hackathon history.

Users can skip optional credibility, but the UI should show how it improves discovery.

### 8.4 Teammate Discovery

For a selected hackathon, show candidates who are also looking for teammates.

Candidate card should include:

- Name.
- Year and branch.
- Primary role.
- Looking-for roles.
- Top skills.
- Profile strength.
- Projects count or featured project.
- Hackathon experience summary.
- Availability.

Actions:

- Pass.
- Like.
- View full profile.

Like intent options:

- Strong fit.
- Need this role.
- Similar idea.
- Want to discuss.

### 8.5 Match Modal

Triggered on mutual like.

Must include:

- Both names/photos.
- Hackathon name.
- CTA: Send message.
- CTA: Keep browsing.

### 8.6 Chat

Basic 1:1 chat per match per hackathon.

Must include:

- Text messages.
- Timestamps.
- Structured quick prompts.
- View profile.
- Report user.
- Block user.
- Mark match status.

Suggested quick prompts:

- "Hey, are you still looking for a team for [hackathon]?"
- "What idea are you thinking of building?"
- "I can handle [role]. What are you looking for?"
- "Want to do a 10 min call today?"

### 8.7 Team Confirmation

After matching, users can mark the relationship:

- Discussing.
- Teamed.
- Not a fit.

If both users mark "Teamed", create or update a confirmed team record.

Optional team checklist:

- Idea decided.
- Roles assigned.
- Registered on official site.
- Submission link added.

### 8.8 Admin Panel

Admin V1 only needs:

- Pending hackathon submissions.
- Approve/reject hackathons.
- Rejection reason.
- User search.
- Suspend/unsuspend user.
- Review reports.
- Audit trail for moderation actions.

---

## 9. Growth And Retention

### 9.1 Built-In Growth

Every hackathon page must be shareable.

Required share surfaces:

- Hackathon share link.
- Hackathon QR code.
- "I am looking for a teammate for [hackathon]" share card.
- "We formed a team for [hackathon]" share card.
- Invite links with source tracking.

Campus posters and club posts should deep link to a specific hackathon, not a generic app download page.

### 9.2 Referral Rewards

Referral rewards should increase useful liquidity, not spam.

Examples:

- Invite one friend to a hackathon: bonus right likes.
- Invite three verified MUJ students: temporary community badge.
- Organizer QR link: tracks how many students joined from that source.

### 9.3 Retention Mechanics

Use real urgency and real social proof.

Allowed mechanics:

- Registration deadline reminders.
- "3 days left to find teammates."
- "Someone with [role] liked your profile for [hackathon]."
- "You have new candidates for [hackathon]."
- "Your team is 2/4. Invite a designer before Friday."
- Bonus likes for completing profile.
- Bonus likes for confirming a team.
- Post-hackathon prompt to add project/result.

Do not use:

- Fake users.
- Fake likes.
- Fake activity counts.
- Hidden contact reveal.
- Blocking account deletion or logout.
- Notifications with no real user value.

---

## 10. Trust, Privacy, And Safety

Trust is required because team formation depends on real student identity and comfort.

### Contact Reveal

Default to in-app chat after match.

Users choose what else to reveal:

- LinkedIn.
- GitHub.
- Email.
- Phone.

Phone number should not be revealed by default.

### Safety Requirements

Must support:

- Block user.
- Report profile.
- Report message.
- Report fake hackathon.
- Report spam.
- Admin report review queue.
- Account deletion.
- Notification controls.

### Abuse Guardrails

- Rate-limit OTP requests.
- Rate-limit hackathon submissions.
- Detect duplicate hackathons.
- Prevent duplicate swipes.
- Do not show suspended users in discovery.
- Archive chat if either user blocks or backs out.

---

## 11. Notifications

Send only high-value notifications.

Required V1 notifications:

| Trigger | Example |
|---|---|
| New match | "You matched with [Name] for [Hackathon]." |
| New message | "[Name] sent you a message." |
| Hackathon deadline | "[Hackathon] registration closes in 2 days." |
| New relevant candidates | "New [role] candidates joined [Hackathon]." |
| Hackathon approved/rejected | "Your submitted hackathon was approved." |
| Team nudge | "Your team is not confirmed yet." |

User must be able to disable non-critical notifications.

---

## 12. Matching Logic

### Candidate Eligibility

For hackathon H and user U, show candidate C if:

- C is interested in H.
- C is not U.
- C is not suspended.
- U has not passed C for H.
- U has not already liked C for H.
- U has not blocked C, and C has not blocked U.

### Ranking

Prioritize:

1. Complementary roles.
2. Looking-for role overlap.
3. Shared availability.
4. Profile strength.
5. Recent activity.

### Match Creation

A match is created when both users like each other for the same hackathon.

Matches are:

- Per hackathon.
- Bilateral.
- Persistent until blocked, backed out, or deleted.

---

## 13. Credits

Keep credits simple in V1.

- Likes cost 1 credit.
- Passes are free.
- Users get a daily credit allowance.
- Users can earn bonus credits through profile completion, useful invites, and team confirmation.
- Credits reset daily based on server time.
- Credit spending must be idempotent to avoid double charges.

Avoid complex per-hackathon credit scaling in V1.

---

## 14. Data Model

### User

```
id
phone_or_email
name
year
branch
photo_url nullable
bio nullable
github_url nullable
linkedin_url nullable
email nullable
phone_visible boolean
email_visible boolean
profile_strength
is_suspended
created_at
updated_at
```

### UserProfile

```
user_id
primary_role
looking_for_roles[]
skills[]
availability
projects[]
hackathon_history[]
```

### Hackathon

```
id
name
organizer
description
start_date
end_date
registration_deadline nullable
location_type
venue nullable
city nullable
team_size_min nullable
team_size_max nullable
source_url
status: pending|verified|rejected|past|cancelled
submitted_by nullable
rejection_reason nullable
created_at
updated_at
```

### HackathonInterest

```
id
user_id
hackathon_id
status: looking|has_team|not_interested
created_at
updated_at
unique(user_id, hackathon_id)
```

### Swipe

```
id
swiper_id
swiped_id
hackathon_id
direction: pass|like
intent nullable
idempotency_key
created_at
unique(swiper_id, swiped_id, hackathon_id)
```

### Match

```
id
user1_id
user2_id
hackathon_id
status: active|backed_out|blocked
user1_team_status nullable
user2_team_status nullable
created_at
updated_at
unique(user1_id, user2_id, hackathon_id)
```

### Team

```
id
hackathon_id
name nullable
status: forming|confirmed|submitted|archived
created_by
created_at
updated_at
```

### TeamMember

```
id
team_id
user_id
role nullable
status: invited|accepted|left|removed
created_at
updated_at
```

### Message

```
id
match_id
sender_id
content
created_at
```

### Invite

```
id
inviter_id
hackathon_id nullable
code
channel
accepted_by nullable
created_at
accepted_at nullable
```

### Report

```
id
reporter_id
reported_user_id nullable
hackathon_id nullable
message_id nullable
reason
details nullable
status: open|reviewing|resolved|dismissed
created_at
resolved_at nullable
```

### CreditLog

```
id
user_id
hackathon_id nullable
action
credits_before
credits_after
idempotency_key
created_at
```

---

## 15. Technical Requirements

### Suggested Stack

Keep the stack boring and fast to ship:

- Frontend: React Native with Expo, or mobile-first Next.js.
- Backend: Node.js, Fastify, TypeScript.
- Database: PostgreSQL.
- ORM: Prisma.
- Realtime chat: Supabase Realtime or Socket.io.
- Storage: Supabase Storage or equivalent.
- Auth: phone OTP or college email login.
- Admin: simple Next.js admin panel.

### Non-Functional Requirements

- Hackathon feed loads in under 2 seconds on normal 4G.
- Candidate deck loads in under 2 seconds.
- Chat message delivery target under 1 second.
- All write actions are idempotent where retries are likely.
- All private endpoints require authentication.
- User-generated URLs are validated and reviewed before being shown broadly.
- Contact info is private unless user explicitly reveals it.

---

## 16. Edge Cases

### Identity

- Duplicate accounts.
- OTP abuse.
- User changes phone/email.
- Suspended user attempts re-entry.
- Non-MUJ user signs up.

### Hackathons

- Duplicate submissions.
- Bad date ranges.
- Registration deadline already passed.
- Hackathon cancelled.
- Source URL changes or becomes malicious.
- Admin approves wrong event by mistake.

### Matching

- Both users like each other at the same time.
- User likes someone, then deletes account.
- User is already in a confirmed team but continues matching.
- User blocks someone after matching.
- User changes roles after swiping.

### Credits

- Swipe request retries.
- Double-tap like.
- Server/client clock mismatch.
- Credits reset during active session.

### Chat And Safety

- Harassment.
- Spam.
- User reports after chat is archived.
- Push notification privacy on lock screen.
- User sends personal contact info in chat.

---

## 17. Launch Plan

### Pre-Launch

- Seed 5-10 real hackathons.
- Recruit a seed group from active tech clubs.
- Create QR links for the top 1-2 upcoming hackathons.
- Prepare share cards for WhatsApp and Instagram.
- Ask club leads to submit hackathons through HackMate.

### Launch

- Launch around one or two concrete hackathons.
- Promote specific hackathon pages, not the generic app.
- Track QR source performance.
- Manually review all hackathon submissions.
- Personally monitor reports and failed matches.

### Post-Launch

- Interview users who formed teams.
- Interview users who matched but did not chat.
- Identify missing roles per hackathon.
- Improve profile prompts and candidate ranking.
- Add only the next feature that improves team formation.

---

## 18. V2 Candidates

Only consider these after V1 proves team formation:

- Group team chat.
- Organizer dashboard.
- Verified hackathon result badges.
- GitHub integration.
- Resume parsing.
- Percentile levels.
- Premium credits or boosts.
- Swipe undo.
- College expansion.
- Campus ambassador dashboard.

---

## 19. Open Decisions

| Decision | Recommendation |
|---|---|
| Mobile app vs mobile-first web | Start with mobile-first web if speed matters; Android app if campus distribution depends on Play Store credibility. |
| Phone OTP vs college email | Use one. College email improves trust; phone OTP improves speed. |
| Swipe vs browse list | Keep card-based discovery, but add intent labels so it feels serious. |
| Contact reveal | Default to in-app chat; let users opt into revealing LinkedIn, GitHub, email, or phone. |
| Credits | Keep simple daily likes in V1. |

