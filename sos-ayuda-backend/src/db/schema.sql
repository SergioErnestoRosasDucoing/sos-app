-- S.O.S. Ayuda — PostgreSQL schema
-- Requires pgcrypto for gen_random_uuid()

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE request_status AS ENUM ('pending', 'active', 'completed');
CREATE TYPE sender_type AS ENUM ('user', 'pro');

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. users
CREATE TABLE users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT NOT NULL UNIQUE,
  full_name      TEXT NOT NULL,
  password_hash  TEXT NOT NULL,
  blood_type     VARCHAR(5),
  vehicle_info   TEXT,
  ice_contact    TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- 2. categories
CREATE TABLE categories (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name  VARCHAR(50) NOT NULL UNIQUE
);

-- 3. professionals
-- category_id uses ON DELETE RESTRICT: categories are a fixed catalog
-- (coche, hogar, salud, tecnologia) and should not be deletable while
-- professionals still reference them.
--
-- `role` is the short job title (e.g. "Mecánico especializado") and
-- `specialty` is the marketing badge (e.g. "Mecánica Automotriz & Grúa") —
-- they read differently in the UI, so they stay as separate columns.
CREATE TABLE professionals (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 TEXT NOT NULL,
  role                 TEXT,
  specialty            TEXT,
  rating               NUMERIC(2, 1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  lat                  DOUBLE PRECISION,
  lng                  DOUBLE PRECISION,
  price_per_hour       NUMERIC(10, 2) NOT NULL DEFAULT 0,
  base_visit_price     NUMERIC(10, 2) NOT NULL DEFAULT 0,
  is_fast              BOOLEAN NOT NULL DEFAULT true,
  is_verified          BOOLEAN NOT NULL DEFAULT true,
  experience_years     INTEGER,
  avatar_url           TEXT,
  cover_image_url      TEXT,
  company_name         TEXT,
  company_description  TEXT,
  company_logo_url     TEXT,
  working_hours        TEXT,
  sos_support          TEXT,
  specialties          TEXT[] NOT NULL DEFAULT '{}',
  bio                  TEXT,
  address              TEXT,
  city                 TEXT,
  category_id          UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_professionals_updated_at
  BEFORE UPDATE ON professionals
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_professionals_category_id ON professionals(category_id);

-- 4. professional_reviews
-- professional_id CASCADE: reviews have no independent meaning once the
-- professional they were left for is removed.
-- service_request_id is added via ALTER TABLE below (after table #5,
-- service_requests, exists) since it's a forward reference otherwise.
CREATE TABLE professional_reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  author          TEXT NOT NULL,
  initials        TEXT NOT NULL,
  rating          NUMERIC(2, 1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  comment         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_professional_reviews_professional_id ON professional_reviews(professional_id);

-- 5. service_requests
-- user_id/pro_id CASCADE: a request only makes sense tied to an existing
-- user and professional; removing either party clears their requests.
CREATE TABLE service_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pro_id          UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  status          request_status NOT NULL DEFAULT 'pending',
  total_cost      NUMERIC(10, 2),
  payment_method  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_service_requests_updated_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_service_requests_user_id ON service_requests(user_id);
CREATE INDEX idx_service_requests_pro_id ON service_requests(pro_id);

-- Links a review back to the request it was left for. Nullable — seed
-- reviews have none, since they predate the real post-service review
-- flow — and ON DELETE SET NULL keeps the review as feedback even if the
-- originating request is later removed. The partial unique index enforces
-- "one review per request" only for rows that do have one.
ALTER TABLE professional_reviews
  ADD COLUMN service_request_id UUID REFERENCES service_requests(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX idx_professional_reviews_one_per_request
  ON professional_reviews(service_request_id) WHERE service_request_id IS NOT NULL;

-- 6. messages
-- request_id CASCADE: a conversation's messages have no purpose once the
-- service request itself is deleted.
CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  sender_type sender_type NOT NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_request_id ON messages(request_id);

-- 7. triage_categories
-- One row per category slug (coche/hogar/salud/tecnologia). Intentionally
-- NOT FK'd to `categories`: triage content is edited on its own cadence,
-- independent of the professionals catalog, and coupling them would create
-- an unnecessary dependency between two content domains.
CREATE TABLE triage_categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          VARCHAR(50) NOT NULL UNIQUE,
  category_name TEXT NOT NULL,
  bot_intro     TEXT NOT NULL
);

-- 8. triage_options
-- triage_category_id CASCADE: an option has no meaning once its parent
-- triage category is removed.
CREATE TABLE triage_options (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  triage_category_id  UUID NOT NULL REFERENCES triage_categories(id) ON DELETE CASCADE,
  option_key          VARCHAR(50) NOT NULL,
  label               TEXT NOT NULL,
  icon                VARCHAR(50) NOT NULL,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  UNIQUE (triage_category_id, option_key)
);

CREATE INDEX idx_triage_options_category_id ON triage_options(triage_category_id);

-- 9. triage_critical_alerts
-- triage_category_id CASCADE: same reasoning as triage_options. option_key
-- stores 'default' for the fallback alert, or the matching
-- triage_options.option_key for a symptom-specific alert — kept as plain
-- text (not a FK to triage_options.id) so the 'default' sentinel row
-- doesn't need a matching option row to exist.
CREATE TABLE triage_critical_alerts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  triage_category_id  UUID NOT NULL REFERENCES triage_categories(id) ON DELETE CASCADE,
  option_key          VARCHAR(50) NOT NULL,
  title               TEXT NOT NULL,
  items               TEXT[] NOT NULL,
  UNIQUE (triage_category_id, option_key)
);

CREATE INDEX idx_triage_critical_alerts_category_id ON triage_critical_alerts(triage_category_id);

-- 10. action_plans
-- One row per category slug, same decoupling rationale as triage_categories.
CREATE TABLE action_plans (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              VARCHAR(50) NOT NULL UNIQUE,
  category_title    TEXT NOT NULL,
  subtitle          TEXT NOT NULL,
  safety_tip        TEXT NOT NULL,
  cta_button_text   TEXT NOT NULL,
  target_specialty  TEXT NOT NULL
);

-- 11. action_plan_steps
-- action_plan_id CASCADE: a step has no meaning once its parent plan is removed.
CREATE TABLE action_plan_steps (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_plan_id UUID NOT NULL REFERENCES action_plans(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  description    TEXT NOT NULL,
  sort_order     INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_action_plan_steps_plan_id ON action_plan_steps(action_plan_id);

-- 12. action_plan_contacts
-- action_plan_id CASCADE: same reasoning as action_plan_steps.
CREATE TABLE action_plan_contacts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_plan_id UUID NOT NULL REFERENCES action_plans(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  number         TEXT NOT NULL,
  contact_type   TEXT NOT NULL,
  icon           VARCHAR(50) NOT NULL,
  color          TEXT NOT NULL,
  sort_order     INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_action_plan_contacts_plan_id ON action_plan_contacts(action_plan_id);

-- 13. push_subscriptions
-- user_id CASCADE: a subscription is meaningless once its user is gone.
-- endpoint is globally unique per browser/device registration, so it
-- doubles as the natural upsert key.
CREATE TABLE push_subscriptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint    TEXT NOT NULL UNIQUE,
  p256dh      TEXT NOT NULL,
  auth        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);
