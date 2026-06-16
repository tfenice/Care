-- ─────────────────────────────────────────────────────────────────────────────
-- Care — Add profiles INSERT policy
--
-- Root cause: profiles table had SELECT and UPDATE policies but no INSERT policy.
-- The on_auth_user_created trigger (SECURITY DEFINER) bypasses RLS for new users,
-- but any user who authenticated before the trigger existed has no profile row.
-- The upsert in submitCheckin was blocked by RLS with error 42501.
-- ─────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "profiles: owner insert" ON public.profiles;
CREATE POLICY "profiles: owner insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
