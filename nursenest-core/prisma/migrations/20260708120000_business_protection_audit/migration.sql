-- Enterprise business-protection audit foundation.
-- Additive/idempotent: deployable without modifying historical migrations.

CREATE TABLE IF NOT EXISTS "policy_acceptance_records" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "scope" VARCHAR(64) NOT NULL,
  "policy_bundle_version" VARCHAR(64) NOT NULL,
  "accepted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ip_address" VARCHAR(128),
  "country" VARCHAR(16),
  "user_agent" TEXT,
  "browser" VARCHAR(128),
  "device" VARCHAR(128),
  "wording" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "wording_sha256" VARCHAR(64) NOT NULL,
  "stripe_checkout_session_id" VARCHAR(128),
  "stripe_customer_id" VARCHAR(128),
  "stripe_subscription_id" VARCHAR(128),
  "plan_code" VARCHAR(128),
  "amount_total" INTEGER,
  "currency" VARCHAR(16),
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "policy_acceptance_records_user_created_idx"
  ON "policy_acceptance_records" ("user_id", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "policy_acceptance_records_scope_created_idx"
  ON "policy_acceptance_records" ("scope", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "policy_acceptance_records_checkout_idx"
  ON "policy_acceptance_records" ("stripe_checkout_session_id");

CREATE TABLE IF NOT EXISTS "admin_audit_events" (
  "id" TEXT PRIMARY KEY,
  "actor_user_id" TEXT,
  "action" VARCHAR(96) NOT NULL,
  "target_type" VARCHAR(96),
  "target_id" VARCHAR(160),
  "method" VARCHAR(16),
  "path" VARCHAR(512),
  "result" VARCHAR(32) NOT NULL DEFAULT 'allowed',
  "ip_address" VARCHAR(128),
  "country" VARCHAR(16),
  "user_agent" TEXT,
  "old_value" JSONB,
  "new_value" JSONB,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "admin_audit_events_actor_created_idx"
  ON "admin_audit_events" ("actor_user_id", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "admin_audit_events_action_created_idx"
  ON "admin_audit_events" ("action", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "admin_audit_events_target_created_idx"
  ON "admin_audit_events" ("target_type", "target_id", "created_at" DESC);

CREATE TABLE IF NOT EXISTS "chargeback_evidence_exports" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "generated_by_user_id" TEXT,
  "format" VARCHAR(16) NOT NULL,
  "summary" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "chargeback_evidence_exports_user_created_idx"
  ON "chargeback_evidence_exports" ("user_id", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "chargeback_evidence_exports_admin_created_idx"
  ON "chargeback_evidence_exports" ("generated_by_user_id", "created_at" DESC);
