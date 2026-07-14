-- Drop the existing SELECT policy on public.profiles
drop policy if exists "Users can view active unsuspended profiles" on public.profiles;

-- Re-create the SELECT policy to allow users to view their own profile even if it is soft-deleted or suspended
create policy "Users can view active unsuspended profiles"
  on public.profiles for select
  to authenticated
  using (
    (deleted_at is null and is_suspended = false)
    or id = (select auth.uid())
    or (select private.is_admin())
  );
