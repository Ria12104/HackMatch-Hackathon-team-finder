-- Updated profile score formula + UPDATE column-level hardening.
--
-- Changes:
--   1. compute_profile_score now includes `phone` as a scored field and treats
--      github_url OR linkedin_url as a single combined social check (not two).
--      New 10-field formula:
--        display_name, year, branch, primary_role, skills, looking_for_roles,
--        availability, bio, phone, (github_url OR linkedin_url).
--
--   2. REVOKE UPDATE (profile_score, profile_strength) from authenticated.
--      The trigger already overwrites any client-sent values, but this makes it
--      a hard DB-level guarantee: the authenticated role cannot include those
--      columns in an UPDATE payload at all.
--      Pattern mirrors the SELECT column-revoke in the privacy migration —
--      revoke table-level UPDATE, then re-grant column-by-column excluding the
--      two computed columns.

begin;

-- ── 1. Updated compute_profile_score ─────────────────────────────────────────
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
  if new.year is not null                                       then filled := filled + 1; end if;
  if coalesce(pg_catalog.btrim(new.branch),       '') <> ''    then filled := filled + 1; end if;
  if coalesce(pg_catalog.btrim(new.primary_role), '') <> ''    then filled := filled + 1; end if;
  if coalesce(pg_catalog.array_length(new.skills,            1), 0) > 0 then filled := filled + 1; end if;
  if coalesce(pg_catalog.array_length(new.looking_for_roles, 1), 0) > 0 then filled := filled + 1; end if;
  if coalesce(pg_catalog.btrim(new.availability), '') <> ''    then filled := filled + 1; end if;
  if coalesce(pg_catalog.btrim(new.bio),          '') <> ''    then filled := filled + 1; end if;
  -- phone: new scored field (replaces standalone linkedin_url check)
  if coalesce(pg_catalog.btrim(new.phone),        '') <> ''    then filled := filled + 1; end if;
  -- social links: 1 point if EITHER github OR linkedin is present
  if coalesce(pg_catalog.btrim(new.github_url),   '') <> ''
     or coalesce(pg_catalog.btrim(new.linkedin_url), '') <> '' then filled := filled + 1; end if;

  new.profile_score := pg_catalog.round((filled::numeric / total) * 100);
  new.profile_strength := case
    when new.profile_score >= 75 then 'strong'::public.profile_strength
    when new.profile_score >= 45 then 'ready'::public.profile_strength
    else                              'starter'::public.profile_strength
  end;

  return new;
end;
$$;
-- The trigger `profiles_compute_score` was created in the previous migration.
-- CREATE OR REPLACE on the function body is sufficient — no drop/recreate needed.

-- ── 2. Column-level UPDATE hardening ─────────────────────────────────────────
-- Revoke table-level UPDATE (which covers every column), then re-grant
-- column-by-column on everything except profile_score and profile_strength.
-- INSERT stays table-level (the handle_new_user trigger owns that path).
revoke update on public.profiles from authenticated;

grant update (
  display_name, email, phone,
  year, branch, primary_role, skills, looking_for_roles,
  availability, avatar_url, github_url, linkedin_url, portfolio_url,
  bio, featured_project, hackathon_summary,
  projects, hackathon_history, achievements,
  daily_credits, credits_last_reset, streak_count, last_active_date,
  phone_visible, email_visible,
  notification_matches_enabled, notification_messages_enabled,
  notification_deadlines_enabled, notification_credit_reset_enabled,
  notification_marketing_enabled, quiet_hours_start, quiet_hours_end,
  is_suspended, suspended_at, suspended_reason,
  deleted_at, onboarding_completed
) on public.profiles to authenticated;

commit;
