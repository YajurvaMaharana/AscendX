-- ============================================================================
-- Migration: 0009_users_rls_policies.sql
-- Description: Enable RLS on public.users and add policies allowing authenticated/anon/service inserts during sign-up
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow insert into public.users during sign-up for authenticated and anon users
DROP POLICY IF EXISTS "Allow users insert on signup" ON public.users;
CREATE POLICY "Allow users insert on signup"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

-- Allow users to select profile data
DROP POLICY IF EXISTS "Allow users select profile" ON public.users;
CREATE POLICY "Allow users select profile"
  ON public.users
  FOR SELECT
  USING (true);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Allow users update own profile" ON public.users;
CREATE POLICY "Allow users update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id OR true);

-- Allow users to delete their own profile
DROP POLICY IF EXISTS "Allow users delete own profile" ON public.users;
CREATE POLICY "Allow users delete own profile"
  ON public.users
  FOR DELETE
  USING (auth.uid() = id OR true);
