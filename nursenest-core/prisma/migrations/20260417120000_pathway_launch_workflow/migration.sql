-- CreateEnum
CREATE TYPE "PathwayLaunchWorkflowStage" AS ENUM (
  'DRAFT',
  'CONTENT_BUILD',
  'QA_REVIEW',
  'SEO_REVIEW',
  'READY_TO_PUBLISH',
  'PUBLISHED_LIVE',
  'POST_PUBLISH_VERIFY'
);

-- CreateTable
CREATE TABLE "pathway_launch_workflows" (
    "id" TEXT NOT NULL,
    "targetKey" VARCHAR(128) NOT NULL,
    "stage" "PathwayLaunchWorkflowStage" NOT NULL DEFAULT 'DRAFT',
    "attestations" JSONB NOT NULL DEFAULT '{}',
    "is_team_focus" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" TEXT,

    CONSTRAINT "pathway_launch_workflows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pathway_launch_workflows_targetKey_key" ON "pathway_launch_workflows"("targetKey");

-- CreateIndex
CREATE INDEX "pathway_launch_workflows_stage_idx" ON "pathway_launch_workflows"("stage");

-- CreateIndex
CREATE INDEX "pathway_launch_workflows_is_team_focus_idx" ON "pathway_launch_workflows"("is_team_focus");
