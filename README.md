# PairUp

PairUp is a mobile-first PWA for MUJ students to find hackathon teammates before deadline panic sets in.

## V1 Direction

- Platform: mobile-first web/PWA first, native app later if needed.
- Auth: phone OTP through 2Factor, backed by Supabase user/session state.
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

The first scaffold runs on mock data. Supabase and 2Factor wiring comes next.

## Sharing Figma

Best options:

1. Send a Figma view link with access set to "Anyone with the link can view" and tell me the exact page/frame names for mobile home, hackathon detail, profile setup, and swipe deck.
2. Export key frames as PNG files into `design/figma/` if the MCP connector is not available in this session.
3. If you have a Figma MCP connector installed later, trigger it in chat and share the file/frame URL.
