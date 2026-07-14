# PairUp

PairUp is a mobile-first PWA for MUJ students to find hackathon teammates before deadline panic sets in.

Original design reference: [Figma Link](https://www.figma.com/design/IbiUZ5Xoo76NAbDbGbOw2f/HackMatch)

## V1 Direction

- Platform: mobile-first web/PWA first, native app later if needed.
- Auth: Google OAuth through Supabase.
- Data: Supabase Postgres for auth/profile flows, with local seed data for hackathon listings until event ingestion is connected.
- Audience: MUJ students only for V1.
- Core loop: public hackathon feed -> login -> profile setup -> teammate discovery -> match/chat.

## Project Structure

- `apps/web/`: Next.js App Router frontend.
- `packages/shared/`: Shared TypeScript types and design tokens.
- `supabase/`: Database config, migrations, and Edge Functions placeholder.
- `docs/`: Product, architecture, design, and contributor setup docs.

## Getting Started

```bash
pnpm install
cp .env.example apps/web/.env.local
pnpm dev
```

The app currently uses local mock hackathon data plus Supabase auth/profile flows. See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for database setup and migration workflow.
