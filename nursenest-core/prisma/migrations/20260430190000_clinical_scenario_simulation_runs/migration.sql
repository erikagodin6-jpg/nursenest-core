-- CreateTable
CREATE TABLE "clinical_scenario_simulation_runs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "scenario_id" VARCHAR(64) NOT NULL,
    "pathway_id" VARCHAR(64) NOT NULL,
    "tier_focus" VARCHAR(32) NOT NULL,
    "summary" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clinical_scenario_simulation_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clinical_scenario_simulation_runs_user_id_created_at_idx" ON "clinical_scenario_simulation_runs"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "clinical_scenario_simulation_runs_scenario_id_idx" ON "clinical_scenario_simulation_runs"("scenario_id");

-- AddForeignKey
ALTER TABLE "clinical_scenario_simulation_runs" ADD CONSTRAINT "clinical_scenario_simulation_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
