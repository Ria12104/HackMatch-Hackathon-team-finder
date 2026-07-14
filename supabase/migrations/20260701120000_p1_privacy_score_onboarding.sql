-- server-authoritative profile score, onboarding flag, and PII column lockdown.
-- Batches the DB-side hardening into one migration so it applies in a single
-- `supabase db reset` (8GB RAM: run once, after a reboot, before pnpm dev).

begin;

-- ── 1. Onboarding flag ───────────────────────────────────────────────────────
-- Decides whether the auth callback sends a user to /profile/setup. "Skip for
-- now" leaves this false; the wizard sets it true only on real completion.
alter table public.profiles
  add column if not exists onboarding_completed boolean not null default false;

-- ── 2. Server-authoritative profile_score ────────────────────────────────────
-- profile_score / profile_strength are computed here from actual fields, so a
-- client can't spoof them via the update payload (any value it sends is
-- overwritten). The browser still computes a "completeness %" for the UI meter;
-- that's cosmetic and separate from this stored score.
create or replace function public.compute_profile_score()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  filled integer := 0;
  total  integer := 10;
begin
  if coalesce(pg_catalog.btrim(new.display_name), '') <> '' then filled := filled + 1; end if;
  if new.year is not null then filled := filled + 1; end if;
  if coalesce(pg_catalog.btrim(new.branch), '') <> '' then filled := filled + 1; end if;
  if coalesce(pg_catalog.btrim(new.primary_role), '') <> '' then filled := filled + 1; end if;
  -- coalesce/nullif/case are SQL constructs, not pg_catalog functions: they must
  -- NOT be schema-qualified (pg_catalog.coalesce does not exist) and resolve fine
  -- even under `search_path = ''`.
  if coalesce(pg_catalog.array_length(new.skills, 1), 0) > 0 then filled := filled + 1; end if;
  if coalesce(pg_catalog.array_length(new.looking_for_roles, 1), 0) > 0 then filled := filled + 1; end if;
  if coalesce(pg_catalog.btrim(new.availability), '') <> '' then filled := filled + 1; end if;
  if coalesce(pg_catalog.btrim(new.bio), '') <> '' then filled := filled + 1; end if;
  if coalesce(pg_catalog.btrim(new.github_url), '') <> '' then filled := filled + 1; end if;
  if coalesce(pg_catalog.btrim(new.linkedin_url), '') <> '' then filled := filled + 1; end if;

  new.profile_score := pg_catalog.round((filled::numeric / total) * 100);
  new.profile_strength := case
    when new.profile_score >= 75 then 'strong'::public.profile_strength
    when new.profile_score >= 45 then 'ready'::public.profile_strength
    else 'starter'::public.profile_strength
  end;

  return new;
end;
$$;

create trigger profiles_compute_score
  before insert or update on public.profiles
  for each row execute function public.compute_profile_score();

-- ── 3. PII column lockdown ───────────────────────────────────────────────────
-- profiles RLS is row-level, so any authenticated user can currently read every
-- other user's phone + email via the REST API. Postgres can't do "own row only"
-- at the column level, so we withhold phone/email from normal clients entirely.
-- Nothing in the UI displays them; the future reveal-contact Edge Function reads
-- them with the service_role key (which bypasses these grants).
--
-- IMPORTANT: a column-level `revoke select (phone, email)` is a NO-OP while a
-- table-level `grant select on profiles` exists (the foundation migration grants
-- exactly that) — the table grant covers every column, so the revoke protects
-- nothing. The only way to withhold specific columns is to drop the table-wide
-- SELECT and re-grant SELECT column-by-column on the non-PII set.
--
-- INSERT/UPDATE stay table-level, so a user can still write their OWN phone/email
-- (RLS scopes writes to their row); this only removes cross-user READ of PII.
-- NOTE: after this, `select('*')` on profiles from the browser errors — client
-- reads must list explicit non-PII columns (already done in the app).
revoke select on public.profiles from authenticated;
grant select (
  id, display_name, year, branch, primary_role, skills, looking_for_roles,
  availability, avatar_url, github_url, linkedin_url, portfolio_url, bio,
  featured_project, hackathon_summary, projects, hackathon_history, achievements,
  profile_strength, profile_score, daily_credits, credits_last_reset,
  streak_count, last_active_date, phone_visible, email_visible,
  notification_matches_enabled, notification_messages_enabled,
  notification_deadlines_enabled, notification_credit_reset_enabled,
  notification_marketing_enabled, quiet_hours_start, quiet_hours_end,
  is_suspended, suspended_at, suspended_reason, deleted_at, created_at,
  updated_at, onboarding_completed
) on public.profiles to authenticated;

commit;
