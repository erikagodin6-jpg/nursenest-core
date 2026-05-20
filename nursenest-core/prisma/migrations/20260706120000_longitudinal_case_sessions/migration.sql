-- Longitudinal clinical case session tracking for CNPLE-style management.
-- Additive only: no existing flashcard progress, card, or session rows are touched.

DO $$ BEGIN
  CREATE TYPE "LongitudinalCaseSessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "LongitudinalCaseSessionMode" AS ENUM ('PRACTICE', 'SIMULATION');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "longitudinal_case_sessions" (
  "id"                  TEXT NOT NULL,
  "user_id"             TEXT NOT NULL,
  "scenario_id"         VARCHAR(64) NOT NULL,
  "pathway_id"          VARCHAR(64) NOT NULL,
  "cnple_domains"       VARCHAR(80)[] NOT NULL,
  "status"              "LongitudinalCaseSessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
  "current_stage_index" INTEGER NOT NULL DEFAULT 0,
  "decisions_json"      JSONB NOT NULL DEFAULT '[]',
  "score_json"          JSONB,
  "mode"                "LongitudinalCaseSessionMode" NOT NULL DEFAULT 'PRACTICE',
  "completed_at"        TIMESTAMP(3),
  "created_at"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"          TIMESTAMP(3) NOT NULL,

  CONSTRAINT "longitudinal_case_sessions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "longitudinal_case_sessions_user_id_status_idx"
  ON "longitudinal_case_sessions"("user_id", "status");

CREATE INDEX IF NOT EXISTS "longitudinal_case_sessions_user_id_pathway_id_idx"
  ON "longitudinal_case_sessions"("user_id", "pathway_id");

CREATE INDEX IF NOT EXISTS "longitudinal_case_sessions_scenario_id_idx"
  ON "longitudinal_case_sessions"("scenario_id");

DO $$ BEGIN
  ALTER TABLE "longitudinal_case_sessions"
    ADD CONSTRAINT "longitudinal_case_sessions_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
