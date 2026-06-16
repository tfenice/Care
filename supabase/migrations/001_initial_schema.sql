-- ─────────────────────────────────────────────────────────────────────────────
-- Care — Initial Schema
-- Run via: supabase db push  (or paste into Supabase SQL editor)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Helpers ───────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ── profiles ─────────────────────────────────────────────────────────────────
-- One row per auth.users entry. Created automatically via trigger on sign-up.
-- Streak fields are updated server-side on each check-in submission.

CREATE TABLE public.profiles (
  id                UUID     PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name      TEXT,
  locale            TEXT     NOT NULL DEFAULT 'th',
  timezone          TEXT     NOT NULL DEFAULT 'Asia/Bangkok',
  current_streak    SMALLINT NOT NULL DEFAULT 0,
  longest_streak    SMALLINT NOT NULL DEFAULT 0,
  last_checkin_date DATE,
  onboarded_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── card_categories ───────────────────────────────────────────────────────────
-- Four categories map to the product philosophy: Acceptance, Presence, Hope, Growth.
-- sort_order enables curated deck ordering for future experiences.

CREATE TABLE public.card_categories (
  id         UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       TEXT     NOT NULL UNIQUE,
  name_th    TEXT     NOT NULL,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  is_active  BOOLEAN  NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER card_categories_updated_at
  BEFORE UPDATE ON public.card_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── ritual_cards ──────────────────────────────────────────────────────────────
-- Thai-first reflection cards. sort_order enables curated deck ordering.
-- i18n: if English content is needed in the future, add a ritual_cards_translations
-- join table rather than adding columns here.

CREATE TABLE public.ritual_cards (
  id                   UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id          UUID     NOT NULL REFERENCES public.card_categories(id) ON DELETE RESTRICT,
  title_th             TEXT     NOT NULL,
  body_th              TEXT     NOT NULL,
  reflection_prompt_th TEXT,
  image_url            TEXT,
  tags                 TEXT[]   NOT NULL DEFAULT '{}',
  sort_order           SMALLINT NOT NULL DEFAULT 0,
  is_active            BOOLEAN  NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER ritual_cards_updated_at
  BEFORE UPDATE ON public.ritual_cards
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── daily_checkins ────────────────────────────────────────────────────────────
-- Records a user's mood at a point in time. Immutable after insert.
-- Multiple check-ins per day are allowed.

CREATE TABLE public.daily_checkins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mood_key      TEXT NOT NULL,   -- 'สบายดี' | 'พอไหว' | 'เหนื่อย' | 'สับสน'
  note          TEXT,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── journal_entries ───────────────────────────────────────────────────────────
-- Free-form reflections. Soft-deleted (deleted_at) to preserve emotional history.
-- Privacy is enforced at the RLS layer; no application-level flag needed.

CREATE TABLE public.journal_entries (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  checkin_id UUID REFERENCES public.daily_checkins(id) ON DELETE SET NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── reading_history ───────────────────────────────────────────────────────────
-- Tracks which cards a user has seen. Used to avoid showing the same card twice.
-- Retention: capped at 60 days per user — see trigger below.
--
-- Card pool exhaustion strategy (when a user has seen all active cards):
--   Primary:  SELECT cards NOT IN recent reading_history ORDER BY RANDOM() LIMIT 1
--   Fallback: If primary returns no rows, SELECT the card with the oldest read_at
--             for this user — the card "seen longest ago" is the most refreshed.
--   This avoids a hard wall and keeps the experience continuous without resetting.

CREATE TABLE public.reading_history (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_id    UUID NOT NULL REFERENCES public.ritual_cards(id) ON DELETE CASCADE,
  checkin_id UUID REFERENCES public.daily_checkins(id) ON DELETE SET NULL,
  read_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enforce 60-day retention per user at insert time.
-- The idx_reading_user_time index makes the cleanup DELETE O(log n).
CREATE OR REPLACE FUNCTION public.enforce_reading_history_retention()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM public.reading_history
  WHERE user_id = NEW.user_id
    AND read_at < NOW() - INTERVAL '60 days';
  RETURN NEW;
END;
$$;

CREATE TRIGGER reading_history_retention
  AFTER INSERT ON public.reading_history
  FOR EACH ROW EXECUTE FUNCTION public.enforce_reading_history_retention();

-- ── user_memories ─────────────────────────────────────────────────────────────
-- AI-generated summaries and insights, written by the server using the service role.
-- Users cannot INSERT or UPDATE their own memories — only the AI backend can.
-- When an AI session starts, load recent memories as compact context instead of
-- re-reading all raw journal and check-in rows.
--
-- pgvector: if semantic search is needed in the future, add:
--   ALTER TABLE public.user_memories ADD COLUMN embedding vector(1536);
-- The schema is compatible with this addition without a breaking migration.

CREATE TABLE public.user_memories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('checkin', 'journal', 'synthesis')),
  source_ids  UUID[] NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX idx_checkins_user_time    ON public.daily_checkins (user_id, checked_in_at DESC);
CREATE INDEX idx_reading_user_time     ON public.reading_history (user_id, read_at DESC);
CREATE INDEX idx_reading_card          ON public.reading_history (card_id);
CREATE INDEX idx_journal_user_active   ON public.journal_entries (user_id, created_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_cards_tags_gin        ON public.ritual_cards USING GIN (tags);
CREATE INDEX idx_cards_category_active ON public.ritual_cards (category_id) WHERE is_active = TRUE;
CREATE INDEX idx_memories_user_time    ON public.user_memories (user_id, created_at DESC);

-- ── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ritual_cards    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_memories   ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles: owner select"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: owner update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- card_categories
CREATE POLICY "card_categories: public select"
  ON public.card_categories FOR SELECT
  USING (is_active = TRUE);

-- ritual_cards
CREATE POLICY "ritual_cards: public select"
  ON public.ritual_cards FOR SELECT
  USING (is_active = TRUE);

-- daily_checkins
CREATE POLICY "daily_checkins: owner select"
  ON public.daily_checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "daily_checkins: owner insert"
  ON public.daily_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- journal_entries
CREATE POLICY "journal_entries: owner select"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "journal_entries: owner insert"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "journal_entries: owner update"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = user_id);

-- reading_history
CREATE POLICY "reading_history: owner select"
  ON public.reading_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "reading_history: owner insert"
  ON public.reading_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- user_memories: users can read their own memories; only service role can write
CREATE POLICY "user_memories: owner select"
  ON public.user_memories FOR SELECT
  USING (auth.uid() = user_id);
