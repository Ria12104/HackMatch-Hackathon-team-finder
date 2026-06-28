# PairUp V1 Architecture

## Chosen Stack

- Next.js PWA in `apps/web`
- Supabase for Postgres, storage, realtime, and admin auth
- 2Factor for user phone OTP
- Plain CSS with design tokens from `DESIGN.md`
- Mock data until Supabase schema and seed scripts are added

## Profile Tiers

Tier 1 is required before teammate discovery:

- Name
- Year
- Branch
- Primary role
- Skills
- Looking-for roles
- Availability

Tier 2 can be completed over time:

- Photo
- GitHub
- LinkedIn
- Projects
- Hackathon history
- Short bio

## Public Before Login

Hackathon feed and detail pages are public. Interest registration, swipe discovery, matching, and chat require login.
