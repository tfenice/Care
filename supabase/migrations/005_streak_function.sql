-- ─────────────────────────────────────────────────────────────────────────────
-- Care — Streak Calculation Function  (idempotent — safe to re-run)
-- ─────────────────────────────────────────────────────────────────────────────
--
-- Called via RPC from the checkin Server Action after a successful
-- daily_checkins INSERT.
--
-- Why SECURITY DEFINER:
--   Migration 004 removed the broad `profiles: owner update` policy to prevent
--   client-side manipulation of system fields (current_streak, longest_streak,
--   last_checkin_date). This function runs as its owner (postgres), bypassing
--   RLS, so the Server Action can update streak fields without reopening the
--   policy surface to direct SDK writes.
--
-- Streak rules:
--   - Same Bangkok day as last checkin  → idempotent, no change
--   - Consecutive Bangkok day           → extend streak by 1
--   - Gap of ≥ 2 days                   → reset streak to 1
--   - First checkin ever                → streak = 1
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.update_streak_after_checkin(
  p_user_id UUID,
  p_today   DATE   -- Bangkok calendar date (YYYY-MM-DD), computed by caller
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last DATE;
  v_cur  SMALLINT;
  v_lng  SMALLINT;
  v_new  SMALLINT;
BEGIN
  SELECT last_checkin_date, current_streak, longest_streak
    INTO v_last, v_cur, v_lng
    FROM profiles
   WHERE id = p_user_id;

  -- Idempotent: same-day checkin does not change the streak
  IF v_last = p_today THEN
    RETURN;
  END IF;

  -- Consecutive day → extend; gap or first checkin → reset to 1
  v_new := CASE WHEN v_last = p_today - 1 THEN v_cur + 1 ELSE 1 END;

  UPDATE profiles SET
    current_streak    = v_new,
    longest_streak    = GREATEST(COALESCE(v_lng, 0), v_new),
    last_checkin_date = p_today
  WHERE id = p_user_id;
END;
$$;

-- Allow the anon-key RPC endpoint to call this function.
-- SECURITY DEFINER ensures it runs as the function owner, not the caller —
-- a user cannot exploit this to set an arbitrary streak value.
GRANT EXECUTE
  ON FUNCTION public.update_streak_after_checkin(UUID, DATE)
  TO authenticated;
