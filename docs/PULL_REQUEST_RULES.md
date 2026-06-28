# Pull Request Rules — HackMatch Team

This document defines who reviews what, what every PR must satisfy before it is opened, and the step-by-step guide for P2, P3, and P4 to get their personal Supabase database running.

> [!IMPORTANT]
> These rules apply to **every PR** opened against `develop`. No exceptions.
> `develop` → `main` is merged only by **P1** after staging review.

---

## Reviewer Assignments

| PR touches… | Required reviewer |
|---|---|
| `supabase/migrations/` — any `.sql` file | **P1** (mandatory) |
| `supabase/functions/` — Edge Functions | **P1** (mandatory) |
| `packages/shared/src/database.types.ts` — generated types | **P1** (mandatory) |
| `apps/web/src/app/` — Next.js pages / routes / components | **P3** (mandatory) |
| `apps/web/src/app/components/` — shared UI library | **P3**  |
| `docs/` — any documentation update | Self-merge OK after 1 day with no objections |
| `.github/workflows/` — CI config | **P1** (mandatory) |

> **Rule:** A PR may not be merged unless the required reviewer has approved it.

---

## What Every PR Must Do Before Opening

Work through this checklist *before* you click "Create Pull Request". CI will catch some of these automatically, but it's faster to fix them locally.

### Universal (all PRs)

- [ ] Branch was cut from the **latest `develop`** (`git pull origin develop` before branching)
- [ ] `pnpm install` runs without errors
- [ ] `pnpm typecheck` passes — zero TypeScript errors
- [ ] `pnpm lint` passes — zero ESLint errors
- [ ] No `.env.local`, no secrets, no keys anywhere in the diff (`git diff --stat`)
- [ ] PR title follows Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- [ ] PR description explains *why* the change exists, not just *what* changed

### Backend PRs (migrations, Edge Functions, RLS)

- [ ] Migration file was created with `supabase migration new <name>` — **never** named by hand
- [ ] Migration filename matches `YYYYMMDDHHMMSS_description.sql` (CI validates this)
- [ ] `supabase db lint` passes locally — fix every error before opening the PR
- [ ] Every new table has RLS **enabled** (`ALTER TABLE … ENABLE ROW LEVEL SECURITY`)
- [ ] Every new table has explicit `SELECT`, `INSERT`, `UPDATE`, `DELETE` policies
- [ ] `UPDATE` policies have **both** `USING` and `WITH CHECK` clauses
- [ ] Views are created with `WITH (security_invoker = true)`
- [ ] `SECURITY DEFINER` functions are **not** in the `public` schema — use `extensions` or a private schema
- [ ] TypeScript types regenerated and committed:
  ```bash
  npx supabase gen types typescript --linked > packages/shared/src/database.types.ts
  ```
- [ ] API contract written or updated in `docs/api-contracts.md`

### Frontend PRs (Next.js pages, components, styles)

- [ ] No inline styles — use CSS modules or the design tokens in `docs/DESIGN.md`
- [ ] All interactive elements have a unique, descriptive `id` attribute (for browser tests)
- [ ] Touch targets are at least 44 × 44 px (accessibility rule from P4's brief)
- [ ] Loading, empty, and error states exist for every data-fetching component
- [ ] No hardcoded mock data left in the PR — use the real Supabase query or a `TODO` comment with a ticket reference
- [ ] Screenshots or a short Loom of the UI change are attached to the PR description

---

## Tests

> [!NOTE]
> No test infrastructure exists yet. The **first person to add business logic** (P1 for auth/profile, P2 for swipe/credits) should set up Vitest first. Setup instructions are below.

### What we use

| Layer | Tool | When |
|---|---|---|
| Unit — pure functions, utils, credit calc | **Vitest** + `@testing-library/react` | Required for any non-trivial logic |
| Component — UI behaviour, form validation | **Vitest** + `@testing-library/react` | Required for shared components |
| Edge Functions — Deno runtime | **Deno's built-in test runner** (`Deno.test`) | Required when P2/P3 write Edge Functions |
| E2E — full browser flows | **Playwright** | Optional for V1 — add if time permits |

### What needs a test (required)

Write at least one test for:
- Any **pure utility function** (credit calc, slug generation, score formula, date helpers)
- Any **shared component** in `apps/web/src/app/components/` that has conditional rendering logic
- Any **RPC or Edge Function** business logic that can be unit-tested without a live DB

### What does NOT need a test (skip these)

- Page files that are mostly layout (`page.tsx` wrappers, pure presentational components)
- Supabase client boilerplate — that's tested upstream
- One-off scripts or seed files

### Setting up Vitest (do this once — whoever is first)

```bash
# From the repo root
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event jsdom --filter @pairup/web
```

Add to `apps/web/package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

Create `apps/web/vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

Once done, also add to the **root** `package.json` scripts:
```json
"test": "pnpm --filter @pairup/web test"
```

### Where test files live

```
apps/web/src/
  app/
    components/
      CreditDisplay/
        CreditDisplay.tsx
        CreditDisplay.test.tsx   ← co-located with the component
  lib/
    credits.ts
    credits.test.ts              ← co-located with the util
```

### PR checklist item for tests

Add this to your pre-PR check if your branch adds logic:

- [ ] New business logic or shared components have at least one Vitest test
- [ ] `pnpm test` passes with no failures

### Edge Function tests (Deno)

Each Edge Function folder can have a `*.test.ts` alongside it:

```
supabase/functions/swipe/
  index.ts
  index.test.ts    ← uses Deno.test(), no extra setup needed
```

Run with:
```bash
deno test supabase/functions/swipe/index.test.ts
```

---

## Common Mistakes to Avoid

### Git

| ❌ Don't | ✅ Do instead |
|---|---|
| Push directly to `main` or `develop` | Open a PR from your `feat/` branch |
| Merge without a required reviewer's approval | Wait for the review or escalate in the group chat |
| Commit `pnpm-lock.yaml` with random changes from a different Node version | Always use Node 20 (`.nvmrc` is set) — run `nvm use` before installing |
| Force-push a branch that someone else is reviewing | Communicate in the PR first |
| Rebase on `main` instead of `develop` | `git rebase origin/develop` |

### Database / Migrations

| ❌ Don't | ✅ Do instead |
|---|---|
| Edit an already-applied migration file | Create a **new** migration for the fix |
| Rename migration files manually | Let `supabase migration new` generate the timestamp |
| Skip RLS on a new table because "it's internal" | Enable RLS on **every** table; deny by default |
| Use `auth.role()` in policies | Use `TO authenticated` with a `USING` predicate |
| Run `supabase db push` against the shared project ref | Only P1 does that. Use your personal project ref |
| Leave `SECURITY DEFINER` in the `public` schema | Move to a named schema (e.g., `private`) |
| Call `apply_migration` via MCP for iterative schema work | Use `execute_sql` to iterate, then generate a clean migration at the end |

### Frontend / TypeScript

| ❌ Don't | ✅ Do instead |
|---|---|
| Import directly from `@supabase/supabase-js` in a Server Component | Use the server client from `packages/shared` |
| Call `supabase.auth.getSession()` server-side | Use `supabase.auth.getUser()` — sessions are not trusted server-side |
| Leave `any` types or `@ts-ignore` | Fix the type or ask P1 to update `database.types.ts` |
| Hardcode Supabase URL or anon key in source files | Read from `process.env.NEXT_PUBLIC_SUPABASE_URL` |
| Ship a new shared component without a loading + error state | Every component that fetches data must handle all three states |

---

## Database Setup Guide for P2, P3, and P4

Since we are on the Supabase **Free plan**, there is no branching. Each developer runs their own **personal Supabase project** for development. Follow these steps exactly once.

### Step 1 — Create your personal Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in (use your own account, not the team's).
2. Click **New Project**.
3. Give it a name like `hackmatch-p2-dev` (replace `p2` with your number).
4. Choose any region close to you.
5. Set a strong database password and **save it** somewhere — you will not need it often but it is hard to recover.
6. Wait ~2 minutes for provisioning. You will land on the project dashboard.

### Step 2 — Collect your credentials

From the Supabase dashboard, go to **Project Settings → API**:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | "Project URL" field |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | "anon / public" key |
| `SUPABASE_SERVICE_ROLE_KEY` | "service_role" key (keep this private) |

Also go to **Project Settings → General** and copy your **Project Reference ID** (looks like `abcdefghijklmnop`).

### Step 3 — Install the Supabase CLI

```bash
# Using npm (recommended for this project)
npm install -g supabase

# Verify
supabase --version   # should print 1.x or 2.x
```

### Step 4 — Log in and link your project

```bash
# Opens browser to authenticate
supabase login

# Link the CLI to YOUR personal project
supabase link --project-ref <your-personal-project-ref>
# Enter your database password when prompted
```

> You only need to do this once per machine. The link is stored in `supabase/.temp/`.

### Step 5 — Set up your local environment file

```bash
# From the repo root
cp .env.example apps/web/.env.local
```

Open `apps/web/.env.local` and fill in **your own** project credentials (from Step 2):

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Leave these blank for now (P1 will share values when needed):
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
OPENAI_API_KEY=
PHONE_ENCRYPTION_KEY=
EXPO_PUSH_TOKEN=
FCM_SERVER_KEY=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

> [!CAUTION]
> **Never commit `.env.local`.** It is already in `.gitignore`. Double-check before every `git add .`.

### Step 6 — Apply all existing migrations to your personal DB

```bash
supabase db push
```

This replays every file in `supabase/migrations/` against your personal project in order. You should see each migration applied with a ✅. If one fails, copy the error and ping P1 immediately.

### Step 7 — Regenerate TypeScript types (do this every time you pull from develop)

```bash
npx supabase gen types typescript --linked > packages/shared/src/database.types.ts
```

This writes the live schema from your personal DB into the shared types file. Do not commit this file unless you have also submitted a migration PR that P1 has merged — otherwise your local types will be ahead of the shared schema.

### Step 8 — Start the dev server

```bash
# Install dependencies (if you haven't already)
pnpm install

# Start the Next.js dev server
pnpm dev
```

The app runs at `http://localhost:3000`.

---

## Day-to-Day Development Workflow (P2, P3, P4)

Follow this loop every time you start a new feature.

```
1. Pull latest develop
   git checkout develop
   git pull origin develop

2. Cut a feature branch
   git checkout -b feat/your-feature-name

3. If P1 has merged new migrations since your last pull:
   supabase db push          ← applies new migrations to YOUR personal DB
   npx supabase gen types typescript --linked > packages/shared/src/database.types.ts

4. Build your feature on your personal DB
   - Iterate on schema changes with supabase db execute (NOT apply_migration)
   - Iterate on Edge Functions with supabase functions serve

5. When schema changes are final, generate a clean migration
   supabase migration new <descriptive_name>
   # Then write your SQL into the generated file

6. Test locally
   pnpm typecheck
   pnpm lint
   supabase db lint   ← if you have migration changes

7. Open a PR to develop
   - Fill the PR template
   - Attach screenshots (frontend) or note the tested endpoints (backend)
   - Tag the required reviewer (P1 for backend, P3 for frontend)

8. Address review comments, then merge after approval
```

### When P1 Pushes a Migration

P1 (and only P1) runs `supabase db push` against the **shared staging project** after a migration PR is merged to `develop`. As soon as that happens:

1. `git pull origin develop` on your local machine.
2. `supabase db push` to replay the new migration against your **personal** project.
3. `npx supabase gen types typescript --linked > packages/shared/src/database.types.ts` to update your local types.
4. Continue your work — your personal DB is now in sync with staging.

> [!NOTE]
> If you are working on a migration of your own and P1 merges a conflicting one, talk to P1 before running `supabase db push`. Apply theirs first, then re-apply yours on top.

---

## Quick Reference

| Action | Command |
|---|---|
| Create a migration | `supabase migration new <name>` |
| Apply migrations to personal DB | `supabase db push` |
| Lint SQL migrations | `supabase db lint` |
| Regenerate TS types | `npx supabase gen types typescript --linked > packages/shared/src/database.types.ts` |
| Run dev server | `pnpm dev` |
| Type check | `pnpm typecheck` |
| Lint | `pnpm lint` |
| Run a single Edge Function locally | `supabase functions serve <function-name> --env-file apps/web/.env.local` |

---

*For the branching strategy and migration creation workflow, see [CONTRIBUTING.md](./CONTRIBUTING.md).*
*For the full team workload breakdown, see [team_division.md](./team_division.md).*
