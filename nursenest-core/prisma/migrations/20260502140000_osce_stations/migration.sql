-- CreateTable
CREATE TABLE "osce_stations" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scenario_intro" TEXT NOT NULL,
    "candidate_instructions" TEXT,
    "patient_script" TEXT,
    "steps" JSONB NOT NULL,
    "examiner_checklist" JSONB NOT NULL DEFAULT '[]',
    "critical_fails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rationales" JSONB NOT NULL DEFAULT '[]',
    "time_limit" TEXT,
    "difficulty" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "pathway_id" TEXT,
    "extensions" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "osce_stations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "osce_stations_slug_key" ON "osce_stations"("slug");

-- CreateIndex
CREATE INDEX "osce_stations_pathway_id_category_idx" ON "osce_stations"("pathway_id", "category");

-- CreateIndex
CREATE INDEX "osce_stations_category_difficulty_idx" ON "osce_stations"("category", "difficulty");
