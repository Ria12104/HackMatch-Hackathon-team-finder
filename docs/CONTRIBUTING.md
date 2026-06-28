# Contributing to HackMatch

This guide covers the git workflow, database migration rules, and PR process for the team.

---

## Git Branching Strategy

```
main        ← production (deployed to Vercel + live Supabase project)
develop     ← staging (PRs merge here first, reviewed before main)
feat/<name> ← your feature branch (cut from develop)
fix/<name>  ← bug fix branch
```

### Rules
- **Never push directly to `main` or `develop`.**
- All work happens on a `feat/` or `fix/` branch.
- Open a PR to `develop` when your feature is ready.
- `develop` → `main` is merged by the project lead after staging review.

### Workflow

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feat/your-feature-name

# ... do work ...

git add .
git commit -m "feat: short description"
git push origin feat/your-feature-name
# → Open PR to develop on GitHub
```

---

## Supabase Setup (Free Plan — No Branching)

Since we're on the Supabase Free plan, **each developer runs their own personal Supabase project** for local development. This avoids migration conflicts on the shared project.

### First-time Setup

1. **Create a free Supabase project** at [supabase.com](https://supabase.com) (use your own account).

2. **Install the Supabase CLI:**
   ```bash
   # Linux/macOS (npm)
   npm install -g supabase
   # or via Homebrew
   brew install supabase/tap/supabase
   ```

3. **Log in and link your personal project:**
   ```bash
   supabase login
   supabase link --project-ref <your-personal-project-ref>
   ```

4. **Copy `.env.example` to `.env.local`** and fill in your personal project's keys:
   ```bash
   cp .env.example apps/web/.env.local
   # → Edit apps/web/.env.local with YOUR project's URL + anon key
   ```

5. **Apply all existing migrations to your personal DB:**
   ```bash
   supabase db push
   ```
   This replays every migration in `supabase/migrations/` against your project.

### Shared Project (Staging)

The shared project (`iwslmnmmacuudvdbeybo.supabase.co`) is **staging only**.
- Only the project lead pushes migrations to staging.
- Never run `supabase db push` against the shared project ref unless you are P1 or the lead.

---

## Database Migration Rules

> [!IMPORTANT]
> **Person 1 (P1) owns `supabase/migrations/`.** All schema changes must go through P1 or be reviewed by P1 before merging to `develop`.

### Always use the CLI to create migration files

```bash
supabase migration new <descriptive_name>
# Example: supabase migration new add_hackathon_interests_table
```

This generates a file like `supabase/migrations/20260625120000_add_hackathon_interests_table.sql`.

**Never:**
- Manually create or rename migration files
- Edit an existing migration file that has already been applied
- Use `apply_migration` via MCP for iterative schema work (use `execute_sql` instead)

### Iterating on a migration locally

```bash
# 1. Make schema changes directly on your personal DB
#    (requires Supabase CLI v2.79.0+ — use Supabase dashboard SQL editor as fallback)
supabase db query --linked "ALTER TABLE profiles ADD COLUMN new_col text;"

# 2. Iterate until happy, then generate a clean migration
supabase db pull <migration_name>

# 3. Verify
supabase migration list --local
```

### Before opening a PR with migrations

- [ ] Run `supabase db lint` locally — fix all errors
- [ ] Confirm RLS is enabled on every new table
- [ ] Add `SELECT`, `INSERT`, `UPDATE`, `DELETE` policies that match the actual access model
- [ ] Never use `auth.role()` — use `TO authenticated` with a `USING` predicate instead
- [ ] `UPDATE` policies must have both `USING` and `WITH CHECK`
- [ ] Views must use `WITH (security_invoker = true)` (Postgres 15+)
- [ ] `SECURITY DEFINER` functions must NOT be in the `public` schema

---

## PR Checklist

Before opening a PR to `develop`:

- [ ] Branch is cut from latest `develop`
- [ ] `pnpm typecheck` passes locally
- [ ] `pnpm lint` passes locally
- [ ] API contract written/updated in `docs/api-contracts.md` (backend changes)
- [ ] TypeScript types regenerated (`supabase gen types --lang=typescript --linked > packages/shared/src/database.types.ts`)
- [ ] Migration files created with `supabase migration new` (not manually)
- [ ] `supabase db lint` passes (if touching migrations)
- [ ] RLS verified for all new/modified tables
- [ ] No secrets or keys committed

---

## Adding a GitHub Secret for CI

The CI workflow can lint your migrations against the live DB if you add:

**Repo → Settings → Secrets → Actions → New repository secret**

| Name | Value |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | Your personal Supabase access token (from [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)) |

---

## Running Locally

```bash
# Install deps
pnpm install

# Start the Next.js dev server
pnpm dev

# Type check
pnpm typecheck

# Lint
pnpm lint
```

The app will be at `http://localhost:3000`.
