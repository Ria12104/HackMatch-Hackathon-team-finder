# HackMate PRD v1 Review Addendum

**Reviewer lens:** UX, marketing, retention, growth, trust, and engineering edge cases  
**Source reviewed:** `HackMate_PRD_v1.md`  
**Recommendation:** Keep the original PRD as a feature inventory, but use this addendum to shape the next iteration.

---

## 1. High-Level Take

The product idea is genuinely promising because it sits on a painful, repeated, socially visible problem: students want hackathon teammates, but the current solution is messy WhatsApp groups, social courage, and luck.

The strongest product loop is:

1. Student finds a hackathon.
2. Student declares interest.
3. Student sees people who are also interested.
4. Student matches with credible teammates.
5. Team forms.
6. Team outcome improves the user's profile.
7. Profile status makes them more attractive for the next hackathon.

The current PRD has the right ingredients, but it needs sharper prioritization. It currently tries to be discovery, Tinder/Hinge, LinkedIn, resume parser, chat app, hackathon directory, leveling game, admin tool, and referral surface all in V1. That is a lot.

The V1 should prove one thing:

> "Can MUJ students reliably form better hackathon teams through HackMate than through WhatsApp?"

Everything else should serve that.

---

## 2. Positioning and Marketing Strategy

### 2.1 Current Positioning

The PRD says "Hinge for hackathon teams." This is useful internally, but it may not be the best public-facing positioning. Dating-app comparisons can make the product sound unserious or socially awkward in a college context.

### 2.2 Recommended Public Positioning

Use outcome-first language:

> "Find your hackathon team before the deadline panic."

Alternative taglines:

- "Build your team before everyone else starts asking."
- "Find teammates who actually want to build."
- "The fastest way to form a serious hackathon team."
- "Your next hackathon team starts here."

### 2.3 Seth Godin Style Marketing Principles To Apply

From the spirit of *This Is Marketing*, the product should not try to appeal to all students at first. Start with the smallest viable audience.

Recommended first audience:

> MUJ students who already participate in hackathons or are one step away from participating.

These are the people with enough pain to care, enough social density to spread it, and enough recurring usage to validate the core loop.

Product identity:

> "People like us form teams early, show our work, and build seriously."

This matters because the app is not only a tool. It is a status signal. A good HackMate profile should say: "I am serious enough to be worth teaming with."

### 2.4 Marketing Must Be Designed Into The Product

Add these PRD requirements:

- Every hackathon detail page has a shareable link and QR code.
- Every user's "looking for teammates" state has a share card.
- Every match can trigger a "We matched for X" share card, without exposing private contact info.
- Every submitted hackathon has a "bring your friends here" QR link.
- Campus posters should not say "Download HackMate." They should say "Find teammates for [specific hackathon]" and deep link to that hackathon page.

Better campus activation:

- Put QR codes on department notice boards for specific hackathons.
- Ask clubs to submit their hackathons through HackMate.
- Let organizers use the "X students looking for teammates" count as social proof.
- Seed the first 5 to 10 hackathons manually so the app never feels empty.

---

## 3. V1 Scope Changes

### 3.1 Reduce V1 Scope

Recommended V1:

- Android app or mobile-first web app, not full mobile plus desktop parity.
- Phone OTP or college email auth, not both.
- Manual profile creation plus optional resume extraction if time allows.
- Hackathon feed.
- Interest registration.
- Swipe or browse teammate cards.
- Match creation.
- Basic chat or structured intro messages.
- Admin hackathon moderation.
- QR/deep links for hackathons.
- Basic notifications.

Move to V1.5 or V2:

- Percentile-based dynamic levels.
- Full resume AI extraction.
- Complex credit scaling.
- Read receipts.
- Exact online status.
- Profile boosts or premium mechanics.
- Full group/team chat.

### 3.2 The Biggest V1 Risk

The app can fail if users install it, see too few people, and leave.

Mitigation:

- Launch around one or two concrete upcoming hackathons, not as a general platform.
- Preload hackathons and recruit a visible seed group before launch.
- Let students join a waitlist or "looking for team" list even before full swiping is available.
- Show real counts only when they are strong. If counts are low, use copy like "Be one of the first looking."

---

## 4. UX Improvements

### 4.1 Replace Long Onboarding With Immediate Value

The current onboarding asks for a complete profile before the user sees value. This is risky.

Recommended flow:

1. Open app.
2. See current hackathons immediately.
3. Tap one hackathon.
4. See "X people looking for teammates."
5. Sign in only when trying to join or view candidates.
6. Upgrade profile completeness only when needed or give free swipes for it. 

This reduces the psychological cost of trying the product.

### 4.2 Use Progressive Profile Creation

Instead of asking for everything upfront, collect the minimum needed to start:

Required for first swipe:

- Name
- Year
- Branch
- Primary role
- 3 to 5 skills
- Looking-for roles

Recommended after first intent:

- Projects
- GitHub
- LinkedIn
- Hackathon history
- Profile photo

This creates an investment loop: the user improves their profile because they now see why it matters.

### 4.3 Make The Hackathon Page The Core Landing Surface

The hackathon detail page should be the most shareable and useful page in the product.

Add:

- "I am looking for a team" CTA.
- "I already have a team" CTA.
- "Invite someone to this hackathon" action.
- "People looking by role" breakdown.
- "Teams forming now" count if available.
- QR code for the page.

Example role breakdown:

| Role | Looking |
|---|---:|
| Frontend | 8 |
| Backend | 6 |
| ML/AI | 4 |
| UI/UX | 3 |
| Product | 2 |

### 4.4 Improve Matching UX

Swiping can stay because it is fast and familiar, but the app should make right swipes feel intentional rather than random.

Add lightweight intent signals:

- "Strong fit"
- "Need this role"
- "Similar idea"
- "Want to discuss"

If retaining swipe, add a short reason prompt after right swipe:

- "Need your skill"
- "Similar idea"
- "Strong profile"
- "Want to learn with you"

This gives the eventual chat a warmer start.

### 4.5 Add Structured First Message Prompts

After match, most students may not know what to say. Add quick starts:

- "Hey, are you still looking for a team for [hackathon]?"
- "What idea are you thinking of building?"
- "I can handle [role]. What are you looking for?"
- "Want to do a 10 min call today?"

This improves chat activation and team formation.

---

## 5. Retention and Habit Loops

### 5.1 Retention Problem In Current PRD

The original PRD notes the problem correctly: if contact details are revealed immediately after match, users may leave the app.

The solution is not to trap users. The solution is to make the app useful after contact exchange.

### 5.2 Add Post-Match Utility

Add a lightweight "team formation" layer:

- Match status: "discussing", "teamed", or "not a fit".
- Mutual team confirmation: both users agree they are on the same team.
- Team size tracker for each hackathon.
- Team checklist:
  - Idea decided
  - Roles assigned
  - Registration completed
  - Submission link added


### 5.3 Add Event-Based Retention

Hackathons create natural retention triggers:

- Registration deadline reminders.
- "3 days left to find teammates."
- "Your match has not replied. Send a quick nudge?"
- "Teams are forming fast for [hackathon]."
- "Add your project after the hackathon to improve your profile."

### 5.4 Add Profile Investment

Users return when their profile has compounding value.

Add:

- Profile completeness meter.
- "Your profile appears higher when you add projects."
- "Add hackathon result" after an event.
- Verified participation badges.
- Personal stats: matches, teams formed, hackathons joined, wins.

### 5.5 Aggressive Retention Without Trust Damage

The app should be habit-forming and high-converting. It can use urgency, social proof, variable rewards, streak-like progress, and notification loops. The line to avoid is deception: fake activity, hidden costs, involuntary contact exposure, or making users feel trapped.

Good habit loop:

- Trigger: upcoming hackathon or match activity.
- Action: review candidates or reply to match.
- Reward: credible teammate or social proof.
- Investment: update profile, confirm team, add project result.

Aggressive mechanics worth adding:

- Deadline urgency: "Registration closes in 2 days. 18 students are still looking."
- Reciprocal curiosity: "Someone with ML/AI experience liked your profile for [hackathon]."
- Limited daily action: right-swipe credits create pacing and return visits.
- Progress pressure: "Add one project to appear in more serious builders' decks."
- Team momentum: "Your team is 2/4. Invite a designer before Friday."
- Social proof: "Most active teams for this hackathon have replied within 4 hours."
- Re-entry nudges: "You have 3 new candidates since your last visit."
- Completion rewards: bonus credits for completing profile, confirming team, or adding a post-hackathon result.

Do not add:

- Fake scarcity.
- Fake users, fake likes, or fake activity counts.
- Hidden contact reveal.
- Infinite swipe loops with no meaningful end.
- Shame-based level drops.
- Notifications that create anxiety without value.
- Blocking account deletion, logout, or notification controls.

---

## 6. Growth and Word-of-Mouth

### 6.1 Referral Mechanics

Add referrals, but tie them to value:

- Invite 1 friend to a hackathon: +3 swipe credits.
- Invite 3 verified MUJ students: profile gets "community builder" badge for 7 days.
- Organizer invite link: shows how many students joined from that QR.

Do not let referrals overpower quality. A referral should help discovery, not turn the app into a spam machine.

### 6.2 Shareable Artifacts

Build share cards:

- "I am looking for a frontend teammate for [hackathon]."
- "3 MUJ students are looking for a designer for [hackathon]."
- "We formed a team for [hackathon] on HackMate."
- "My HackMate profile: Backend, ML, 2 hackathons."

These should be image cards for WhatsApp, Instagram stories, and LinkedIn.

### 6.3 Campus Ambassador Loop

For colleges, distribution matters more than generic ads.

Add:

- Club admin role in V2.
- Organizer dashboard in V2.
- Campus ambassador invite codes.
- Leaderboard for clubs by teams formed, not just signups.

Metric to care about:

> Teams formed per hackathon, not raw downloads.

---

## 7. Trust, Safety, and Social Risk

### 7.1 Contact Reveal Needs More Control

Current PRD reveals phone/email after match. This is risky.

Recommended:

- Do not reveal phone by default.
- Let users choose what is revealed after match:
  - In-app chat only
  - LinkedIn
  - GitHub
  - Email
  - Phone
- Default to in-app chat, LinkedIn/GitHub optional.

This is especially important for privacy, safety, and comfort across genders.

### 7.2 Reporting and Blocking

Add explicit requirements:

- Block user.
- Report profile.
- Report message.
- Report fake skill claims.
- Report spam hackathon.
- Admin review queue for reports.

### 7.3 Team Commitment Safety

Students worry about ghosting. Add lightweight accountability:

- "Response rate" or "usually replies" after enough usage.
- "Backed out recently" internal risk signal, not public in V1.
- Soft warnings for repeated backing out.
- Report ghosting only after match and chat history.

Be careful with public shame. Keep most trust signals private or aggregate until the system is mature.

---

## 8. Leveling System Rework

### 8.1 Problem With Percentile Levels

Percentile levels are elegant, but they can feel unfair:

- A user's level can drop even if they did nothing wrong.
- Early users get weird rankings because the population is small.
- Self-reported data is easy to game.
- "Top X%" can create status anxiety.

### 8.2 Recommended V1 Alternative

Use profile strength instead of competitive levels in V1:

- Starter
- Ready
- Strong
- Verified

Base it on completeness and proof:

- Skills added
- Projects added
- GitHub linked
- Hackathon history added
- Profile photo added
- Teammate feedback in V2

Use percentile levels later when there is enough data.

### 8.3 If Keeping Levels In V1

Add guardrails:

- Do not send level-down push notifications.
- Recalculate weekly, not daily.
- Hide exact percentile until the user base is large.
- Cap contribution from raw number of technologies.
- Give more weight to projects and verified outcomes than skill tags.

---

## 9. Metrics To Add

The current metrics are good but too top-level. Add funnel metrics.

### Acquisition

- Hackathon page views from QR links.
- Visitor to signup conversion.
- Invite link conversion.
- Source by club, QR, WhatsApp, Instagram, organizer.

### Activation

- Signup to profile minimum complete.
- Profile minimum complete to first hackathon interest.
- Interest to first candidate viewed.
- Candidate viewed to first right swipe.
- First right swipe to first match.

### Team Formation

- Match to first message.
- Match to team confirmed.
- Team confirmed to hackathon registration complete.
- Hackathon registration complete to project submitted.

### Retention

- D1, D7, D30 retention.
- Return rate after new hackathon notification.
- Return rate after match.
- Return rate after deadline reminder.
- Number of hackathons joined per active user.

### Quality

- Match acceptance quality survey.
- Report rate.
- Block rate.
- Ghosting rate.
- Percentage of matches with two-way conversation.

### North Star Metric

Recommended:

> Confirmed teams formed per active hackathon.

Secondary:

> Students who found at least one serious teammate.

---

## 10. Technical and Product Edge Cases To Add

### Authentication and Identity

- Duplicate accounts with multiple phone numbers.
- Phone number recycled by telecom provider.
- OTP abuse or SMS cost attack.
- User loses phone number.
- User wants to change college/year/branch.
- Non-MUJ student signs up in V1.
- Suspended user tries to rejoin.

### Privacy

- User screenshots profiles and shares externally.
- User wants to hide profile from a specific person.
- User wants to appear for one hackathon but not another.
- User deletes account while matched.
- User deletes account while reported.
- User removes LinkedIn/GitHub after matching.

### Matching

- Two users match after one user is already in a confirmed team.
- Hackathon team size is full but users keep matching.
- User accidentally swipes left and wants undo.
- User left-swipes everyone and then the deck is empty.
- User changes role preferences after swiping.
- User backs out after exchanging contact info.

### Hackathons

- Registration deadline is before the listed start date.
- End date is before start date.
- Online hackathon has no source URL.
- Duplicate hackathons with slightly different names.
- Organizer changes date after approval.
- Hackathon gets cancelled.
- Source URL later becomes malicious or expires.
- User submits a private/internal hackathon.

### Chat

- Harassment or spam messages.
- User sends personal data in chat.
- User reports a user after chat is archived.
- Push notification leaks message preview on lock screen.
- Message delivery succeeds but client shows failed.
- User is offline for days and receives many messages.

### Credits

- Credits reset across time zones.
- User changes device time.
- Credit spend request retried and double-charged.
- Race condition when user swipes quickly.
- User gets match after credits are exhausted.

### AI Resume Extraction

- Resume contains prompt injection text.
- Resume has false claims.
- Resume includes sensitive personal data.
- PDF is scanned image, not selectable text.
- PDF is password protected.
- AI extracts wrong links or wrong college.
- AI returns malformed JSON.

### Admin

- Admin approves malicious link by mistake.
- Admin account compromised.
- Review SLA missed.
- Bulk spam submissions.
- User appeals rejection.
- Audit trail needed for moderation decisions.

---

## 11. Data Model Additions

Add or consider these entities:

### Team

Tracks when matches become an actual team.

```
id
hackathon_id
name
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
role
status: invited|accepted|left|removed
created_at
updated_at
```

### Invite

```
id
inviter_id
hackathon_id nullable
invite_code
channel: whatsapp|instagram|qr|link|other
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
details
status: open|reviewing|resolved|dismissed
created_at
resolved_at nullable
```

### HackathonUpdate

```
id
hackathon_id
field_changed
old_value
new_value
source
created_at
```

### NotificationPreference

```
user_id
matches_enabled
messages_enabled
deadline_reminders_enabled
credit_reset_enabled
marketing_enabled
quiet_hours_start
quiet_hours_end
```

---

## 12. Suggested PRD Restructure

The current PRD should be split into:

1. Product Strategy
2. V1 Requirements
3. UX Flows
4. Growth and Marketing
5. Trust and Safety
6. Technical Architecture
7. Analytics and Metrics
8. V2 Backlog

Keep founder notes, questions, and alternatives in a separate "Decision Log" instead of mixing them into requirements.

Example decision log entry:

```
Decision: Should contact info reveal immediately after match?
Current recommendation: No. Default to in-app chat and user-controlled contact reveal.
Reason: Improves privacy, safety, and retention without trapping users.
Owner: Founder
Status: Proposed
```

---

## 13. Recommended Next PRD Changes

Highest priority edits:

1. Replace "Hinge for hackathon teams" public positioning with outcome-first positioning.
2. Narrow V1 to proving team formation at MUJ.
3. Make hackathon detail pages and QR links first-class growth surfaces.
4. Replace full upfront onboarding with progressive profile setup.
5. Add team confirmation as the retention loop after match.
6. Make contact reveal user-controlled.
7. Move dynamic percentile levels to V1.5 unless there is enough data.
8. Add acquisition, activation, team formation, and quality metrics.
9. Add report/block/moderation requirements.
10. Add edge cases for identity, abuse, credits, AI extraction, and hackathon lifecycle.

---

## 14. Revised V1 Product Promise

Use this as the spine of the next PRD:

> HackMate helps MUJ students form credible hackathon teams before the deadline panic. Students discover upcoming hackathons, signal interest, find complementary teammates, start a structured conversation, and confirm teams inside the app.

This is narrower than the current PRD, but much stronger.

