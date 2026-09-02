-- ─── Drop existing tables (order matters for FK deps) ────────────────────────
DROP TABLE IF EXISTS bookmarks             CASCADE;
DROP TABLE IF EXISTS purchases             CASCADE;
DROP TABLE IF EXISTS certificates          CASCADE;
DROP TABLE IF EXISTS checkpoint_submissions CASCADE;
DROP TABLE IF EXISTS quiz_attempts         CASCADE;
DROP TABLE IF EXISTS quiz_questions        CASCADE;
DROP TABLE IF EXISTS progress              CASCADE;
DROP TABLE IF EXISTS lesson_progress       CASCADE;
DROP TABLE IF EXISTS lessons               CASCADE;
DROP TABLE IF EXISTS modules               CASCADE;
DROP TABLE IF EXISTS enrollments           CASCADE;
DROP TABLE IF EXISTS courses               CASCADE;
DROP TABLE IF EXISTS users                 CASCADE;

-- ─── Enable pgcrypto for gen_random_uuid() ───────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── users ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'student'
                            CHECK (role IN ('student', 'staff', 'admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── modules ──────────────────────────────────────────────────────────────────
CREATE TABLE modules (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT    NOT NULL UNIQUE,
  title          TEXT    NOT NULL,
  description    TEXT,
  order_index    INTEGER NOT NULL,
  is_staff_only  BOOLEAN NOT NULL DEFAULT FALSE,
  hard_gate      BOOLEAN NOT NULL DEFAULT FALSE,
  pass_threshold INTEGER NOT NULL DEFAULT 80
);

-- ─── lessons ──────────────────────────────────────────────────────────────────
CREATE TABLE lessons (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   UUID    NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  slug        TEXT,
  title       TEXT    NOT NULL,
  content_mdx TEXT,
  order_index INTEGER NOT NULL
);

CREATE INDEX idx_lessons_module_id ON lessons(module_id);

-- ─── progress ─────────────────────────────────────────────────────────────────
CREATE TABLE progress (
  user_id      UUID        NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  lesson_id    UUID        NOT NULL REFERENCES lessons(id)  ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT progress_pkey PRIMARY KEY (user_id, lesson_id)
);

CREATE INDEX idx_progress_user_id   ON progress(user_id);
CREATE INDEX idx_progress_lesson_id ON progress(lesson_id);

-- ─── quiz_questions ───────────────────────────────────────────────────────────
CREATE TABLE quiz_questions (
  id                   UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id            UUID    NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  question_text        TEXT    NOT NULL,
  options              JSONB,
  -- 'multiple_choice': auto-graded; 'reflection': student types freely, shown model answer after submit
  question_type        TEXT    NOT NULL DEFAULT 'multiple_choice'
                               CHECK (question_type IN ('multiple_choice', 'reflection')),
  correct_answer_index INTEGER,   -- NULL for reflection questions
  order_index          INTEGER
);

CREATE INDEX idx_quiz_questions_module_id ON quiz_questions(module_id);

-- ─── quiz_attempts ────────────────────────────────────────────────────────────
CREATE TABLE quiz_attempts (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  module_id    UUID        NOT NULL REFERENCES modules(id)  ON DELETE CASCADE,
  score        INTEGER,
  passed       BOOLEAN,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  answers      JSONB
);

CREATE INDEX idx_quiz_attempts_user_id   ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_module_id ON quiz_attempts(module_id);

-- ─── checkpoint_submissions ───────────────────────────────────────────────────
CREATE TABLE checkpoint_submissions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  module_id   UUID        NOT NULL REFERENCES modules(id)  ON DELETE CASCADE,
  content     TEXT,
  file_urls   JSONB,
  status      TEXT        NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'approved', 'needs_revision')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at  TIMESTAMPTZ
);

CREATE INDEX idx_checkpoint_submissions_user_id   ON checkpoint_submissions(user_id);
CREATE INDEX idx_checkpoint_submissions_module_id ON checkpoint_submissions(module_id);

-- ─── certificates ─────────────────────────────────────────────────────────────
CREATE TABLE certificates (
  id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  user_name TEXT        NOT NULL DEFAULT '',
  brief     TEXT        NOT NULL DEFAULT '',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_certificates_user_id ON certificates(user_id);

-- ─── purchases ────────────────────────────────────────────────────────────────
-- One row per completed Stripe Checkout session. Signup is gated on a
-- matching, unclaimed row (see app/(auth)/signup/actions.ts).
CREATE TABLE purchases (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email              TEXT        NOT NULL,
  stripe_session_id  TEXT        NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  amount_total       INTEGER,
  currency           TEXT,
  claimed_at         TIMESTAMPTZ,
  user_id            UUID        REFERENCES users(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_purchases_email ON purchases (lower(email));

-- Keep claimed_at truthful when a linked user disappears (FK ON DELETE SET
-- NULL above, or any future manual/admin deletion): without this, a
-- deleted account leaves behind a purchase that still reads as "claimed"
-- with no way to tell it's actually orphaned. Found via a live audit where
-- two test accounts had been deleted, silently orphaning their purchases.
CREATE OR REPLACE FUNCTION purchases_unclaim_on_orphan() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL AND OLD.user_id IS NOT NULL THEN
    NEW.claimed_at := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_purchases_unclaim_on_orphan
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION purchases_unclaim_on_orphan();

-- ─── bookmarks ──────────────────────────────────────────────────────────────
-- Lets a student flag a lesson to come back to later (e.g. as a reference
-- once they're doing real client work).
CREATE TABLE bookmarks (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id  UUID        NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
