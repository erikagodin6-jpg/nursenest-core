CREATE TABLE IF NOT EXISTS "synthetic_learning_check_results" (
  "id" TEXT NOT NULL,
  "run_id" VARCHAR(96) NOT NULL,
  "check_name" VARCHAR(96) NOT NULL,
  "route" VARCHAR(512) NOT NULL,
  "status" VARCHAR(16) NOT NULL,
  "duration_ms" INTEGER NOT NULL,
  "http_status" INTEGER,
  "error" VARCHAR(1000),
  "screenshot_data_url" TEXT,
  "meta" JSONB,
  "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "synthetic_learning_check_results_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "synthetic_learning_check_results_check_name_checked_at_idx"
  ON "synthetic_learning_check_results" ("check_name", "checked_at" DESC);

CREATE INDEX IF NOT EXISTS "synthetic_learning_check_results_status_checked_at_idx"
  ON "synthetic_learning_check_results" ("status", "checked_at" DESC);

CREATE INDEX IF NOT EXISTS "synthetic_learning_check_results_run_id_idx"
  ON "synthetic_learning_check_results" ("run_id");

CREATE INDEX IF NOT EXISTS "synthetic_learning_check_results_checked_at_idx"
  ON "synthetic_learning_check_results" ("checked_at" DESC);
