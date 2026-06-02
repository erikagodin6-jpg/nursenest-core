-- Unpublished nursing clinical scenarios (admin + gated learner preview only).
DO $$ BEGIN CREATE TYPE "ClinicalNursingScenarioTier" AS ENUM ('RN_NCLEX_RN', 'RPN_PN', 'NP', 'NEW_GRAD'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "ClinicalNursingScenarioDifficulty" AS ENUM ('FOUNDATION', 'INTERMEDIATE', 'ADVANCED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "ClinicalNursingScenarioPublishStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "clinical_nursing_scenarios" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(240) NOT NULL,
    "pathway_id" VARCHAR(64) NOT NULL,
    "canonical_category_id" VARCHAR(64) NOT NULL,
    "tier_focus" "ClinicalNursingScenarioTier" NOT NULL,
    "difficulty" "ClinicalNursingScenarioDifficulty" NOT NULL,
    "patient_age_context" VARCHAR(280) NOT NULL,
    "presenting_concern" TEXT NOT NULL,
    "brief_history" TEXT NOT NULL,
    "medications_allergies" TEXT,
    "initial_vitals" JSONB NOT NULL,
    "assessment_findings" TEXT NOT NULL,
    "labs_diagnostics" JSONB,
    "references_json" JSONB NOT NULL DEFAULT '[]',
    "publish_status" "ClinicalNursingScenarioPublishStatus" NOT NULL DEFAULT 'DRAFT',
    "created_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinical_nursing_scenarios_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "clinical_nursing_scenario_stages" (
    "id" TEXT NOT NULL,
    "scenario_id" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "scenario_text" TEXT NOT NULL,
    "vitals" JSONB NOT NULL,
    "assessment_findings" TEXT NOT NULL,
    "lab_updates" JSONB,
    "question_stem" TEXT NOT NULL,
    "options_json" JSONB NOT NULL,
    "correct_option_id" VARCHAR(32) NOT NULL,
    "rationale" TEXT NOT NULL,
    "why_wrong_by_option_id" JSONB NOT NULL,
    "clinical_judgment_focus" TEXT NOT NULL,
    "consequences_by_option_id" JSONB NOT NULL,
    "next_stage_order" INTEGER,

    CONSTRAINT "clinical_nursing_scenario_stages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "clinical_nursing_scenario_stages_scenario_id_order_index_key" ON "clinical_nursing_scenario_stages"("scenario_id", "order_index");

CREATE INDEX IF NOT EXISTS "clinical_nursing_scenarios_pathway_id_publish_status_idx" ON "clinical_nursing_scenarios"("pathway_id", "publish_status");
CREATE INDEX IF NOT EXISTS "clinical_nursing_scenarios_pathway_id_tier_focus_idx" ON "clinical_nursing_scenarios"("pathway_id", "tier_focus");
CREATE INDEX IF NOT EXISTS "clinical_nursing_scenario_stages_scenario_id_idx" ON "clinical_nursing_scenario_stages"("scenario_id");

DO $$ BEGIN
  ALTER TABLE "clinical_nursing_scenarios" ADD CONSTRAINT "clinical_nursing_scenarios_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "clinical_nursing_scenario_stages" ADD CONSTRAINT "clinical_nursing_scenario_stages_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "clinical_nursing_scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
