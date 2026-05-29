-- Institutional licensing platform: organizations, seat assignments, cohorts, and immutable license events.
-- Additive and idempotent; does not alter learner activity, billing, entitlement, or content tables.

CREATE TABLE IF NOT EXISTS "institutional_organizations" (
  "id" TEXT NOT NULL,
  "name" VARCHAR(160) NOT NULL,
  "slug" VARCHAR(140) NOT NULL,
  "type" VARCHAR(64) NOT NULL,
  "status" VARCHAR(32) NOT NULL DEFAULT 'active',
  "seat_cap" INTEGER NOT NULL DEFAULT 0,
  "primary_timezone" VARCHAR(64) DEFAULT 'UTC',
  "stripe_customer_id" VARCHAR(128),
  "stripe_subscription_id" VARCHAR(128),
  "renewal_at" TIMESTAMP(3),
  "created_by_user_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "institutional_organizations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "institutional_memberships" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "role" VARCHAR(32) NOT NULL,
  "status" VARCHAR(32) NOT NULL DEFAULT 'active',
  "invited_email" VARCHAR(320),
  "assigned_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "removed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "institutional_memberships_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "institutional_cohorts" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "name" VARCHAR(160) NOT NULL,
  "default_pathway_id" VARCHAR(128),
  "status" VARCHAR(32) NOT NULL DEFAULT 'active',
  "starts_at" TIMESTAMP(3),
  "ends_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "institutional_cohorts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "institutional_cohort_memberships" (
  "id" TEXT NOT NULL,
  "cohort_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "role" VARCHAR(32) NOT NULL DEFAULT 'learner',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "left_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "institutional_cohort_memberships_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "institutional_license_events" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "actor_user_id" TEXT,
  "event_type" VARCHAR(64) NOT NULL,
  "seat_delta" INTEGER,
  "meta" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "institutional_license_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "institutional_organizations_slug_key" ON "institutional_organizations"("slug");
CREATE INDEX IF NOT EXISTS "institutional_organizations_status_type_idx" ON "institutional_organizations"("status", "type");
CREATE INDEX IF NOT EXISTS "institutional_organizations_renewal_at_idx" ON "institutional_organizations"("renewal_at");

CREATE UNIQUE INDEX IF NOT EXISTS "institutional_memberships_organization_id_user_id_key" ON "institutional_memberships"("organization_id", "user_id");
CREATE INDEX IF NOT EXISTS "institutional_memberships_user_id_status_idx" ON "institutional_memberships"("user_id", "status");
CREATE INDEX IF NOT EXISTS "institutional_memberships_organization_id_role_status_idx" ON "institutional_memberships"("organization_id", "role", "status");

CREATE INDEX IF NOT EXISTS "institutional_cohorts_organization_id_status_idx" ON "institutional_cohorts"("organization_id", "status");
CREATE INDEX IF NOT EXISTS "institutional_cohorts_default_pathway_id_idx" ON "institutional_cohorts"("default_pathway_id");

CREATE UNIQUE INDEX IF NOT EXISTS "institutional_cohort_memberships_cohort_id_user_id_key" ON "institutional_cohort_memberships"("cohort_id", "user_id");
CREATE INDEX IF NOT EXISTS "institutional_cohort_memberships_user_id_active_idx" ON "institutional_cohort_memberships"("user_id", "active");
CREATE INDEX IF NOT EXISTS "institutional_cohort_memberships_cohort_id_active_role_idx" ON "institutional_cohort_memberships"("cohort_id", "active", "role");

CREATE INDEX IF NOT EXISTS "institutional_license_events_organization_id_created_at_idx" ON "institutional_license_events"("organization_id", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "institutional_license_events_event_type_created_at_idx" ON "institutional_license_events"("event_type", "created_at" DESC);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'institutional_memberships_organization_id_fkey') THEN
    ALTER TABLE "institutional_memberships"
      ADD CONSTRAINT "institutional_memberships_organization_id_fkey"
      FOREIGN KEY ("organization_id") REFERENCES "institutional_organizations"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'institutional_memberships_user_id_fkey') THEN
    ALTER TABLE "institutional_memberships"
      ADD CONSTRAINT "institutional_memberships_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'institutional_cohorts_organization_id_fkey') THEN
    ALTER TABLE "institutional_cohorts"
      ADD CONSTRAINT "institutional_cohorts_organization_id_fkey"
      FOREIGN KEY ("organization_id") REFERENCES "institutional_organizations"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'institutional_cohort_memberships_cohort_id_fkey') THEN
    ALTER TABLE "institutional_cohort_memberships"
      ADD CONSTRAINT "institutional_cohort_memberships_cohort_id_fkey"
      FOREIGN KEY ("cohort_id") REFERENCES "institutional_cohorts"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'institutional_cohort_memberships_user_id_fkey') THEN
    ALTER TABLE "institutional_cohort_memberships"
      ADD CONSTRAINT "institutional_cohort_memberships_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'institutional_license_events_organization_id_fkey') THEN
    ALTER TABLE "institutional_license_events"
      ADD CONSTRAINT "institutional_license_events_organization_id_fkey"
      FOREIGN KEY ("organization_id") REFERENCES "institutional_organizations"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
