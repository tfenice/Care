-- ─────────────────────────────────────────────────────────────────────────────
-- Care — Private Beta Hardening  (idempotent — safe to re-run)
-- ─────────────────────────────────────────────────────────────────────────────
--
-- A. weekly_reflections: SELECT only
--    weekly_reflections are server-generated cache rows, not user-authored data.
--    Removing owner INSERT/UPDATE ensures only trusted server logic (future
--    SECURITY DEFINER function or service-role client) can write them.
--
-- B. profiles: remove broad UPDATE policy
--    The original "owner update" policy allowed any authenticated user to SET
--    current_streak, longest_streak, and last_checkin_date directly via the
--    Supabase client SDK — bypassing application logic.
--    No current app feature requires a client-side profile UPDATE, so removing
--    the policy has zero user-facing impact in the private beta.
--    When streak tracking and profile editing are implemented, add back:
--      - A SECURITY DEFINER function for system fields (streak, last_checkin_date)
--      - A narrowed UPDATE policy restricted to user-editable fields only
--        (display_name, locale, timezone)
--    See RLS-01 in docs/KNOWN_TECH_DEBT.md.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── A. weekly_reflections ─────────────────────────────────────────────────────

DROP POLICY IF EXISTS "weekly_reflections: owner insert" ON public.weekly_reflections;
DROP POLICY IF EXISTS "weekly_reflections: owner update" ON public.weekly_reflections;

-- Recreate SELECT idempotently (unchanged, just defensive)
DROP POLICY IF EXISTS "weekly_reflections: owner select" ON public.weekly_reflections;
CREATE POLICY "weekly_reflections: owner select"
  ON public.weekly_reflections FOR SELECT
  USING (auth.uid() = user_id);

-- ── B. profiles ───────────────────────────────────────────────────────────────

-- Remove the broad update policy that exposes system fields to client writes.
-- SELECT and INSERT policies (migrations 001 + 002) remain unchanged.
DROP POLICY IF EXISTS "profiles: owner update" ON public.profiles;
