# PairUp Product Overview

PairUp is a mobile-first PWA for MUJ students to find hackathon teammates before registration deadlines.

## Current V1 Scope

- Public hackathon feed and detail pages backed by local seed data.
- Google OAuth through Supabase.
- Authenticated profile setup, profile editing, soft delete, and onboarding redirects.
- Teammate discovery UI for a selected hackathon, ready for the swipe/match backend.
- Placeholder routes for matches, privacy, and terms so navigation does not 404.

## Near-Term Backend Work

- Replace local hackathon seed data with Supabase reads once the event ingestion workflow is ready.
- Wire discovery swipes, credits, and match creation to the backend.
- Add a public profile view or RPC for candidate reads so phone/email remain private by construction.
- Add audit-log writes and rate-limit enforcement for sensitive actions.

## Privacy Rules

- Do not expose service-role keys or secrets to browser code.
- Other-user profile reads must exclude phone, email, and private settings.
- Use `safeRelativePath` for user-controlled redirects.
- Keep `.env.local`, Supabase `.temp`, build output, and local agent/tooling files out of Git.
