-- PairUp P1 foundation schema.
-- Creates the initial Supabase Postgres contract for auth, profiles,
-- hackathon discovery, matching, chat, credits, admin audit, and safety.

begin;

create extension if not exists pgcrypto with schema extensions;
create extension if not exists citext with schema extensions;

create schema if not exists private;

create type public.profile_strength as enum ('starter', 'ready', 'strong');
create type public.user_year as enum ('1st', '2nd', '3rd', '4th', 'alumni');
create type public.location_type as enum ('online', 'in_person', 'hybrid');
create type public.hackathon_status as enum ('pending', 'verified', 'rejected', 'past', 'cancelled');
create type public.hackathon_interest_status as enum ('looking', 'has_team', 'not_interested');
create type public.swipe_direction as enum ('pass', 'like');
create type public.swipe_intent as enum ('strong_fit', 'need_this_role', 'similar_idea', 'want_to_discuss');
create type public.match_status as enum ('active', 'backed_out', 'blocked');
create type public.match_team_status as enum ('discussing', 'teamed', 'not_a_fit');
create type public.team_status as enum ('forming', 'confirmed', 'submitted', 'archived');
create type public.team_membership_status as enum ('invited', 'accepted', 'left', 'removed');
create type public.invite_channel as enum ('whatsapp', 'instagram', 'qr', 'link', 'other');
create type public.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
create type public.credit_action as enum (
  'swipe_like',
  'daily_reset',
  'invite_bonus',
  'profile_completion_bonus',
  'team_confirmation_bonus',
  'manual_adjustment'
);
create type public.audit_action as enum (
  'hackathon_approved',
  'hackathon_rejected',
  'hackathon_updated',
  'user_suspended',
  'user_unsuspended',
  'report_reviewed',
  'credits_adjusted',
  'admin_note'
);
create type public.rate_limit_action as enum (
  'auth_otp',
  'hackathon_submission',
  'swipe',
  'message',
  'invite',
  'report'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  email extensions.citext,
  phone text,
  year public.user_year,
  branch text,
  primary_role text,
  skills text[] not null default '{}',
  looking_for_roles text[] not null default '{}',
  availability text,
  avatar_url text,
  github_url text,
  linkedin_url text,
  portfolio_url text,
  bio text,
  featured_project text,
  hackathon_summary text,
  projects jsonb not null default '[]'::jsonb,
  hackathon_history jsonb not null default '[]'::jsonb,
  achievements jsonb not null default '[]'::jsonb,
  profile_strength public.profile_strength not null default 'starter',
  profile_score integer not null default 0,
  daily_credits integer not null default 20,
  credits_last_reset timestamptz not null default now(),
  streak_count integer not null default 0,
  last_active_date date,
  phone_visible boolean not null default false,
  email_visible boolean not null default false,
  notification_matches_enabled boolean not null default true,
  notification_messages_enabled boolean not null default true,
  notification_deadlines_enabled boolean not null default true,
  notification_credit_reset_enabled boolean not null default false,
  notification_marketing_enabled boolean not null default false,
  quiet_hours_start time,
  quiet_hours_end time,
  is_suspended boolean not null default false,
  suspended_at timestamptz,
  suspended_reason text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (char_length(display_name) between 1 and 80),
  constraint profiles_branch_length check (branch is null or char_length(branch) between 2 and 80),
  constraint profiles_primary_role_length check (primary_role is null or char_length(primary_role) between 2 and 80),
  constraint profiles_availability_length check (availability is null or char_length(availability) <= 160),
  constraint profiles_bio_length check (bio is null or char_length(bio) <= 500),
  constraint profiles_daily_credits_range check (daily_credits between 0 and 20),
  constraint profiles_profile_score_nonnegative check (profile_score >= 0),
  constraint profiles_streak_count_nonnegative check (streak_count >= 0),
  constraint profiles_projects_array check (jsonb_typeof(projects) = 'array'),
  constraint profiles_hackathon_history_array check (jsonb_typeof(hackathon_history) = 'array'),
  constraint profiles_achievements_array check (jsonb_typeof(achievements) = 'array')
);

create table public.hackathons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  organizer text not null,
  description text not null,
  start_date date not null,
  end_date date not null,
  registration_deadline date,
  location_type public.location_type not null,
  venue text,
  city text,
  team_size_min integer,
  team_size_max integer,
  source_url text not null,
  status public.hackathon_status not null default 'pending',
  submitted_by uuid references public.profiles(id) on delete set null,
  rejection_reason text,
  looking_count integer not null default 0,
  teams_forming_count integer not null default 0,
  roles_wanted jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hackathons_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint hackathons_name_length check (char_length(name) between 2 and 120),
  constraint hackathons_organizer_length check (char_length(organizer) between 2 and 120),
  constraint hackathons_description_length check (char_length(description) between 20 and 5000),
  constraint hackathons_date_order check (end_date >= start_date),
  constraint hackathons_registration_before_end check (registration_deadline is null or registration_deadline <= end_date),
  constraint hackathons_team_size_positive check (team_size_min is null or team_size_min > 0),
  constraint hackathons_team_size_order check (team_size_max is null or team_size_min is null or team_size_max >= team_size_min),
  constraint hackathons_counts_nonnegative check (looking_count >= 0 and teams_forming_count >= 0),
  constraint hackathons_roles_wanted_array check (jsonb_typeof(roles_wanted) = 'array'),
  constraint hackathons_metadata_object check (jsonb_typeof(metadata) = 'object')
);

create table public.hackathon_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  hackathon_id uuid not null references public.hackathons(id) on delete cascade,
  status public.hackathon_interest_status not null default 'looking',
  match_count integer not null default 0,
  note text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hackathon_interests_unique_user_hackathon unique (user_id, hackathon_id),
  constraint hackathon_interests_match_count_nonnegative check (match_count >= 0),
  constraint hackathon_interests_note_length check (note is null or char_length(note) <= 500)
);

create table public.swipes (
  id uuid primary key default gen_random_uuid(),
  swiper_id uuid not null references public.profiles(id) on delete cascade,
  swiped_id uuid not null references public.profiles(id) on delete cascade,
  hackathon_id uuid not null references public.hackathons(id) on delete cascade,
  direction public.swipe_direction not null,
  intent public.swipe_intent,
  idempotency_key text,
  created_at timestamptz not null default now(),
  constraint swipes_no_self_swipe check (swiper_id <> swiped_id),
  constraint swipes_unique_pair_per_hackathon unique (swiper_id, swiped_id, hackathon_id),
  constraint swipes_idempotency_key_length check (idempotency_key is null or char_length(idempotency_key) between 8 and 160)
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid not null references public.profiles(id) on delete cascade,
  user2_id uuid not null references public.profiles(id) on delete cascade,
  hackathon_id uuid not null references public.hackathons(id) on delete cascade,
  status public.match_status not null default 'active',
  user1_team_status public.match_team_status,
  user2_team_status public.match_team_status,
  backed_out_by uuid references public.profiles(id) on delete set null,
  blocked_by uuid references public.profiles(id) on delete set null,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint matches_ordered_users check (user1_id < user2_id),
  constraint matches_unique_users_per_hackathon unique (user1_id, user2_id, hackathon_id),
  constraint matches_backed_out_actor check (backed_out_by is null or backed_out_by in (user1_id, user2_id)),
  constraint matches_blocked_actor check (blocked_by is null or blocked_by in (user1_id, user2_id))
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid not null references public.hackathons(id) on delete cascade,
  name text,
  status public.team_status not null default 'forming',
  created_by uuid not null references public.profiles(id) on delete cascade,
  idea_decided boolean not null default false,
  roles_assigned boolean not null default false,
  registered_on_official_site boolean not null default false,
  submission_url text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint teams_name_length check (name is null or char_length(name) between 2 and 120),
  constraint teams_submission_url_length check (submission_url is null or char_length(submission_url) <= 500)
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text,
  status public.team_membership_status not null default 'invited',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint team_members_unique_user_per_team unique (team_id, user_id),
  constraint team_members_role_length check (role is null or char_length(role) <= 80)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  read_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  constraint messages_content_length check (char_length(content) between 1 and 1000)
);

create table public.invites (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid not null references public.profiles(id) on delete cascade,
  hackathon_id uuid references public.hackathons(id) on delete cascade,
  code text not null unique,
  channel public.invite_channel not null default 'link',
  accepted_by uuid references public.profiles(id) on delete set null,
  accepted_at timestamptz,
  bonus_awarded boolean not null default false,
  created_at timestamptz not null default now(),
  constraint invites_code_format check (code ~ '^[A-Za-z0-9_-]{6,40}$'),
  constraint invites_not_self_accept check (accepted_by is null or accepted_by <> inviter_id),
  constraint invites_acceptance_pair check ((accepted_by is null and accepted_at is null) or (accepted_by is not null and accepted_at is not null))
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete set null,
  hackathon_id uuid references public.hackathons(id) on delete set null,
  message_id uuid references public.messages(id) on delete set null,
  reason text not null,
  details text,
  status public.report_status not null default 'open',
  resolved_by uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reports_reason_length check (char_length(reason) between 2 and 120),
  constraint reports_details_length check (details is null or char_length(details) <= 2000),
  constraint reports_target_present check (reported_user_id is not null or hackathon_id is not null or message_id is not null),
  constraint reports_resolution_pair check ((resolved_by is null and resolved_at is null) or (resolved_by is not null and resolved_at is not null))
);

create table public.credit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  hackathon_id uuid references public.hackathons(id) on delete set null,
  action public.credit_action not null,
  amount integer not null,
  credits_before integer not null,
  credits_after integer not null,
  idempotency_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint credit_log_credits_before_range check (credits_before between 0 and 20),
  constraint credit_log_credits_after_range check (credits_after between 0 and 20),
  constraint credit_log_amount_nonzero check (amount <> 0),
  constraint credit_log_idempotency_key_length check (idempotency_key is null or char_length(idempotency_key) between 8 and 160),
  constraint credit_log_metadata_object check (jsonb_typeof(metadata) = 'object')
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action public.audit_action not null,
  target_table text,
  target_id uuid,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint audit_log_target_table_length check (target_table is null or char_length(target_table) between 2 and 80),
  constraint audit_log_reason_length check (reason is null or char_length(reason) <= 1000),
  constraint audit_log_metadata_object check (jsonb_typeof(metadata) = 'object')
);

create table public.rate_limits (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete cascade,
  ip_address inet,
  action public.rate_limit_action not null,
  window_start timestamptz not null,
  request_count integer not null default 1,
  blocked_until timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rate_limits_actor_or_ip check (actor_id is not null or ip_address is not null),
  constraint rate_limits_request_count_positive check (request_count > 0),
  constraint rate_limits_metadata_object check (jsonb_typeof(metadata) = 'object')
);

create unique index swipes_idempotency_key_unique
  on public.swipes (swiper_id, idempotency_key)
  where idempotency_key is not null;

create unique index credit_log_idempotency_key_unique
  on public.credit_log (user_id, idempotency_key)
  where idempotency_key is not null;

create unique index rate_limits_actor_action_window_unique
  on public.rate_limits (actor_id, action, window_start)
  where actor_id is not null;

create unique index rate_limits_ip_action_window_unique
  on public.rate_limits (ip_address, action, window_start)
  where ip_address is not null;

create index profiles_email_idx on public.profiles (email);
create index profiles_primary_role_idx on public.profiles (primary_role) where deleted_at is null and is_suspended = false;
create index profiles_skills_gin_idx on public.profiles using gin (skills);
create index profiles_looking_for_roles_gin_idx on public.profiles using gin (looking_for_roles);

create index hackathons_status_start_date_idx on public.hackathons (status, start_date) where deleted_at is null;
create index hackathons_submitted_by_idx on public.hackathons (submitted_by) where submitted_by is not null;
create index hackathons_roles_wanted_gin_idx on public.hackathons using gin (roles_wanted);

create index hackathon_interests_user_id_idx on public.hackathon_interests (user_id);
create index hackathon_interests_hackathon_status_idx on public.hackathon_interests (hackathon_id, status) where deleted_at is null;

create index swipes_swiper_hackathon_idx on public.swipes (swiper_id, hackathon_id);
create index swipes_swiped_hackathon_like_idx on public.swipes (swiped_id, hackathon_id) where direction = 'like';

create index matches_user1_status_idx on public.matches (user1_id, status);
create index matches_user2_status_idx on public.matches (user2_id, status);
create index matches_hackathon_status_idx on public.matches (hackathon_id, status);

create index teams_hackathon_status_idx on public.teams (hackathon_id, status) where deleted_at is null;
create index teams_created_by_idx on public.teams (created_by);
create index team_members_user_id_idx on public.team_members (user_id);
create index team_members_team_status_idx on public.team_members (team_id, status);

create index messages_match_created_at_idx on public.messages (match_id, created_at desc) where deleted_at is null;
create index messages_sender_id_idx on public.messages (sender_id);

create index invites_inviter_id_idx on public.invites (inviter_id);
create index invites_hackathon_id_idx on public.invites (hackathon_id) where hackathon_id is not null;
create index invites_accepted_by_idx on public.invites (accepted_by) where accepted_by is not null;

create index reports_reporter_id_idx on public.reports (reporter_id);
create index reports_status_created_at_idx on public.reports (status, created_at desc);
create index reports_reported_user_id_idx on public.reports (reported_user_id) where reported_user_id is not null;
create index reports_hackathon_id_idx on public.reports (hackathon_id) where hackathon_id is not null;
create index reports_message_id_idx on public.reports (message_id) where message_id is not null;

create index credit_log_user_created_at_idx on public.credit_log (user_id, created_at desc);
create index credit_log_hackathon_id_idx on public.credit_log (hackathon_id) where hackathon_id is not null;

create index audit_log_actor_created_at_idx on public.audit_log (actor_id, created_at desc) where actor_id is not null;
create index audit_log_target_idx on public.audit_log (target_table, target_id) where target_table is not null and target_id is not null;

create index rate_limits_actor_action_idx on public.rate_limits (actor_id, action, window_start desc) where actor_id is not null;
create index rate_limits_ip_action_idx on public.rate_limits (ip_address, action, window_start desc) where ip_address is not null;
create index rate_limits_blocked_until_idx on public.rate_limits (blocked_until) where blocked_until is not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger hackathons_set_updated_at
  before update on public.hackathons
  for each row execute function public.set_updated_at();

create trigger hackathon_interests_set_updated_at
  before update on public.hackathon_interests
  for each row execute function public.set_updated_at();

create trigger matches_set_updated_at
  before update on public.matches
  for each row execute function public.set_updated_at();

create trigger teams_set_updated_at
  before update on public.teams
  for each row execute function public.set_updated_at();

create trigger team_members_set_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

create trigger reports_set_updated_at
  before update on public.reports
  for each row execute function public.set_updated_at();

create trigger rate_limits_set_updated_at
  before update on public.rate_limits
  for each row execute function public.set_updated_at();

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

create or replace function private.is_team_member(team_id uuid, user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.team_members tm
    where tm.team_id = is_team_member.team_id
      and tm.user_id = is_team_member.user_id
      and tm.status in ('invited', 'accepted')
  );
$$;

create or replace function private.is_team_creator(team_id uuid, user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.teams t
    where t.id = is_team_creator.team_id
      and t.created_by = is_team_creator.user_id
  );
$$;

revoke all on function private.is_admin() from public, anon, authenticated;
revoke all on function private.is_team_member(uuid, uuid) from public, anon, authenticated;
revoke all on function private.is_team_creator(uuid, uuid) from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated, service_role;
grant execute on function private.is_team_member(uuid, uuid) to authenticated, service_role;
grant execute on function private.is_team_creator(uuid, uuid) to authenticated, service_role;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (id, display_name, email, avatar_url)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1), 'PairUp user'),
    new.email::extensions.citext,
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
        updated_at = now();

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to service_role;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.hackathons enable row level security;
alter table public.hackathon_interests enable row level security;
alter table public.swipes enable row level security;
alter table public.matches enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.messages enable row level security;
alter table public.invites enable row level security;
alter table public.reports enable row level security;
alter table public.credit_log enable row level security;
alter table public.audit_log enable row level security;
alter table public.rate_limits enable row level security;

revoke all on schema public from public;
grant usage on schema public to anon, authenticated, service_role;
grant usage on schema private to service_role;

grant select on table public.hackathons to anon, authenticated;
grant select on table public.profiles to authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update on table public.hackathons to authenticated;
grant select, insert, update on table public.hackathon_interests to authenticated;
grant select, insert on table public.swipes to authenticated;
grant select, update on table public.matches to authenticated;
grant select, insert, update on table public.teams to authenticated;
grant select, insert, update on table public.team_members to authenticated;
grant select, insert, update on table public.messages to authenticated;
grant select, insert, update on table public.invites to authenticated;
grant select, insert on table public.reports to authenticated;
grant select on table public.credit_log to authenticated;

grant select, insert, update, delete on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;

grant execute on function public.set_updated_at() to service_role;

create policy "Public can view listed hackathons"
  on public.hackathons for select
  to anon, authenticated
  using (deleted_at is null and status in ('verified', 'pending', 'past'));

create policy "Authenticated users can submit hackathons"
  on public.hackathons for insert
  to authenticated
  with check ((select auth.uid()) = submitted_by);

create policy "Submitters can update pending hackathons"
  on public.hackathons for update
  to authenticated
  using ((select auth.uid()) = submitted_by and status = 'pending' and deleted_at is null)
  with check ((select auth.uid()) = submitted_by and status = 'pending');

create policy "Admins can manage hackathons"
  on public.hackathons for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Users can view active unsuspended profiles"
  on public.profiles for select
  to authenticated
  using (deleted_at is null and (is_suspended = false or id = (select auth.uid()) or (select private.is_admin())));

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id and deleted_at is null)
  with check ((select auth.uid()) = id);

create policy "Admins can manage profiles"
  on public.profiles for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Users can view own interests"
  on public.hackathon_interests for select
  to authenticated
  using ((select auth.uid()) = user_id or (select private.is_admin()));

create policy "Users can view looking interest for shared hackathons"
  on public.hackathon_interests for select
  to authenticated
  using (
    status = 'looking'
    and deleted_at is null
    and exists (
      select 1
      from public.hackathon_interests own_interest
      where own_interest.hackathon_id = hackathon_interests.hackathon_id
        and own_interest.user_id = (select auth.uid())
        and own_interest.status = 'looking'
        and own_interest.deleted_at is null
    )
  );

create policy "Users can upsert own interests"
  on public.hackathon_interests for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own interests"
  on public.hackathon_interests for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can view own swipes"
  on public.swipes for select
  to authenticated
  using ((select auth.uid()) = swiper_id or (select auth.uid()) = swiped_id or (select private.is_admin()));

create policy "Users can create own swipes"
  on public.swipes for insert
  to authenticated
  with check (
    (select auth.uid()) = swiper_id
    and swiper_id <> swiped_id
    and exists (
      select 1
      from public.hackathon_interests own_interest
      where own_interest.user_id = swiper_id
        and own_interest.hackathon_id = swipes.hackathon_id
        and own_interest.status = 'looking'
        and own_interest.deleted_at is null
    )
    and exists (
      select 1
      from public.hackathon_interests candidate_interest
      join public.profiles candidate on candidate.id = candidate_interest.user_id
      where candidate_interest.user_id = swiped_id
        and candidate_interest.hackathon_id = swipes.hackathon_id
        and candidate_interest.status = 'looking'
        and candidate_interest.deleted_at is null
        and candidate.deleted_at is null
        and candidate.is_suspended = false
    )
  );

create policy "Users can view own matches"
  on public.matches for select
  to authenticated
  using ((select auth.uid()) in (user1_id, user2_id) or (select private.is_admin()));

create policy "Users can update own match status"
  on public.matches for update
  to authenticated
  using ((select auth.uid()) in (user1_id, user2_id))
  with check ((select auth.uid()) in (user1_id, user2_id));

create policy "Admins can manage matches"
  on public.matches for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Team members can view teams"
  on public.teams for select
  to authenticated
  using (
    created_by = (select auth.uid())
    or (select private.is_admin())
    or (select private.is_team_member(teams.id, (select auth.uid())))
  );

create policy "Users can create teams for joined hackathons"
  on public.teams for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and exists (
      select 1
      from public.hackathon_interests hi
      where hi.user_id = (select auth.uid())
        and hi.hackathon_id = teams.hackathon_id
        and hi.status in ('looking', 'has_team')
        and hi.deleted_at is null
    )
  );

create policy "Team creators can update teams"
  on public.teams for update
  to authenticated
  using (created_by = (select auth.uid()) or (select private.is_admin()))
  with check (created_by = (select auth.uid()) or (select private.is_admin()));

create policy "Users can view memberships for their teams"
  on public.team_members for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or (select private.is_admin())
    or (select private.is_team_member(team_members.team_id, (select auth.uid())))
  );

create policy "Team creators can invite members"
  on public.team_members for insert
  to authenticated
  with check (
    (select private.is_admin())
    or (select private.is_team_creator(team_members.team_id, (select auth.uid())))
  );

create policy "Members can update own membership"
  on public.team_members for update
  to authenticated
  using (
    user_id = (select auth.uid())
    or (select private.is_admin())
    or (select private.is_team_creator(team_members.team_id, (select auth.uid())))
  )
  with check (
    user_id = (select auth.uid())
    or (select private.is_admin())
    or (select private.is_team_creator(team_members.team_id, (select auth.uid())))
  );

create policy "Users can view messages in own matches"
  on public.messages for select
  to authenticated
  using (
    deleted_at is null
    and (
      (select private.is_admin())
      or exists (
        select 1
        from public.matches m
        where m.id = messages.match_id
          and (select auth.uid()) in (m.user1_id, m.user2_id)
      )
    )
  );

create policy "Users can send messages in active matches"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = (select auth.uid())
    and exists (
      select 1
      from public.matches m
      where m.id = messages.match_id
        and m.status = 'active'
        and (select auth.uid()) in (m.user1_id, m.user2_id)
    )
  );

create policy "Users can mark own match messages read"
  on public.messages for update
  to authenticated
  using (
    exists (
      select 1
      from public.matches m
      where m.id = messages.match_id
        and (select auth.uid()) in (m.user1_id, m.user2_id)
    )
  )
  with check (
    exists (
      select 1
      from public.matches m
      where m.id = messages.match_id
        and (select auth.uid()) in (m.user1_id, m.user2_id)
    )
  );

create policy "Users can view own invites"
  on public.invites for select
  to authenticated
  using (inviter_id = (select auth.uid()) or accepted_by = (select auth.uid()) or (select private.is_admin()));

create policy "Users can create own invites"
  on public.invites for insert
  to authenticated
  with check (inviter_id = (select auth.uid()));

create policy "Users can accept available invites"
  on public.invites for update
  to authenticated
  using (accepted_by is null or accepted_by = (select auth.uid()) or inviter_id = (select auth.uid()))
  with check (accepted_by = (select auth.uid()) or inviter_id = (select auth.uid()));

create policy "Users can view reports they filed"
  on public.reports for select
  to authenticated
  using (reporter_id = (select auth.uid()) or (select private.is_admin()));

create policy "Users can file reports"
  on public.reports for insert
  to authenticated
  with check (reporter_id = (select auth.uid()));

create policy "Admins can update reports"
  on public.reports for update
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "Users can view own credit log"
  on public.credit_log for select
  to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

create policy "Admins can insert credit log"
  on public.credit_log for insert
  to authenticated
  with check ((select private.is_admin()));

create policy "Admins can view audit log"
  on public.audit_log for select
  to authenticated
  using ((select private.is_admin()));

create policy "Admins can insert audit log"
  on public.audit_log for insert
  to authenticated
  with check ((select private.is_admin()));

create policy "Users can view own rate limits"
  on public.rate_limits for select
  to authenticated
  using (actor_id = (select auth.uid()) or (select private.is_admin()));

create policy "Admins can manage rate limits"
  on public.rate_limits for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

insert into public.hackathons (
  slug,
  name,
  organizer,
  description,
  start_date,
  end_date,
  registration_deadline,
  location_type,
  venue,
  city,
  team_size_min,
  team_size_max,
  source_url,
  status,
  looking_count,
  teams_forming_count,
  roles_wanted
) values
  (
    'code-carnival',
    'Code Carnival 2026',
    'MUJ ACM Student Chapter',
    'A 24-hour campus hackathon for product builders, designers, and ML tinkerers. Teams can build for campus life, fintech, education, or open innovation.',
    date '2026-07-18',
    date '2026-07-19',
    date '2026-07-14',
    'in_person',
    'TMA Pai Auditorium',
    'Jaipur',
    2,
    4,
    'https://example.com/code-carnival',
    'verified',
    48,
    13,
    '[{"role":"Frontend","count":16},{"role":"Backend","count":14},{"role":"Design","count":11},{"role":"ML","count":7}]'::jsonb
  ),
  (
    'build-for-bharat',
    'Build for Bharat Sprint',
    'MUJ E-Cell',
    'A weekend build sprint around student utilities, local commerce, and AI workflows for Indian campuses.',
    date '2026-08-02',
    date '2026-08-03',
    date '2026-07-28',
    'hybrid',
    'AB1 Innovation Lab',
    'Jaipur',
    3,
    5,
    'https://example.com/build-for-bharat',
    'verified',
    31,
    8,
    '[{"role":"Product","count":9},{"role":"Backend","count":8},{"role":"Mobile","count":8},{"role":"Design","count":6}]'::jsonb
  ),
  (
    'ai-night',
    'AI Night Hack',
    'Data Science Club MUJ',
    'An online-first hack night for teams experimenting with LLMs, agents, retrieval, and practical student tools.',
    date '2026-08-21',
    date '2026-08-22',
    date '2026-08-18',
    'online',
    null,
    null,
    2,
    4,
    'https://example.com/ai-night',
    'pending',
    24,
    6,
    '[{"role":"ML","count":10},{"role":"Frontend","count":6},{"role":"Backend","count":5},{"role":"Research","count":3}]'::jsonb
  )
on conflict (slug) do update
  set name = excluded.name,
      organizer = excluded.organizer,
      description = excluded.description,
      start_date = excluded.start_date,
      end_date = excluded.end_date,
      registration_deadline = excluded.registration_deadline,
      location_type = excluded.location_type,
      venue = excluded.venue,
      city = excluded.city,
      team_size_min = excluded.team_size_min,
      team_size_max = excluded.team_size_max,
      source_url = excluded.source_url,
      status = excluded.status,
      looking_count = excluded.looking_count,
      teams_forming_count = excluded.teams_forming_count,
      roles_wanted = excluded.roles_wanted,
      updated_at = now();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('resumes', 'resumes', false, 10485760, array['application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "Users can upload own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and owner = (select auth.uid())
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can update own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and owner = (select auth.uid())
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'avatars'
    and owner = (select auth.uid())
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can delete own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and owner = (select auth.uid())
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can read own resumes"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'resumes'
    and owner = (select auth.uid())
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can upload own resumes"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'resumes'
    and owner = (select auth.uid())
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can update own resumes"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'resumes'
    and owner = (select auth.uid())
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'resumes'
    and owner = (select auth.uid())
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can delete own resumes"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'resumes'
    and owner = (select auth.uid())
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

commit;
