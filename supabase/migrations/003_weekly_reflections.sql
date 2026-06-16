-- Weekly Reflections
-- Generated deterministically from checkins + journals + reading_history.
-- One row per user per week_start (Monday). UPSERT-safe.

CREATE TABLE IF NOT EXISTS public.weekly_reflections (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start        DATE        NOT NULL,
  week_end          DATE        NOT NULL,
  checkin_count     INTEGER     NOT NULL DEFAULT 0,
  dominant_mood     TEXT,
  mood_theme        TEXT,
  top_card_category TEXT,
  journal_count     INTEGER     NOT NULL DEFAULT 0,
  reflection_text   TEXT        NOT NULL,
  generated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, week_start)
);

ALTER TABLE public.weekly_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "weekly_reflections: owner select" ON public.weekly_reflections;
CREATE POLICY "weekly_reflections: owner select"
  ON public.weekly_reflections FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "weekly_reflections: owner insert" ON public.weekly_reflections;
CREATE POLICY "weekly_reflections: owner insert"
  ON public.weekly_reflections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "weekly_reflections: owner update" ON public.weekly_reflections;
CREATE POLICY "weekly_reflections: owner update"
  ON public.weekly_reflections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_weekly_reflections_user_week
  ON public.weekly_reflections (user_id, week_start DESC);
