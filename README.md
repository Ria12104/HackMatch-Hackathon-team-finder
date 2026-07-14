# PairUp

PairUp is a mobile-first PWA for MUJ students to find hackathon teammates before deadline panic sets in.

## V1 Direction

- Platform: mobile-first web/PWA first, native app later if needed.
- Auth: Google OAuth through Supabase (admin allowlist for admin accounts).
- Data: Supabase Postgres with seeded hackathons for the first test build.
- Audience: MUJ students only for V1.
- Core loop: public hackathon feed -> login to register interest -> profile tier 1 -> swipe-style teammate discovery -> match/chat.
- Admin: Supabase Google auth with an email allowlist.

## Project Layout

```txt
apps/
  web/        PairUp PWA
packages/
  shared/     shared domain types and design tokens
```

## Getting Started

```bash
pnpm install
cp .env.example apps/web/.env.local
pnpm dev
```

The app currently uses local mock hackathon data plus Supabase auth/profile flows. See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for database setup and migration workflow.
