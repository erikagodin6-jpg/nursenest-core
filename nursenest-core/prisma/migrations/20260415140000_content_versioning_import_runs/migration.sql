-- Versioning + import manifests: content_import_runs, content_entity_revisions, published-by columns.
-- See docs/CONTENT_VERSIONING.md

CREATE TYPE "ContentEntityKind" AS ENUM ('EXAM_QUESTION', 'PATHWAY_LESSON', 'CONTENT_ITEM');
CREATE TYPE "ContentImportRunStatus" AS ENUM ('STARTED', 'COMPLETED', 'FAILED', 'CANCELLED');

CREATE TABLE "content_import_runs" (
    "id" TEXT NOT NULL,
    "label" VARCHAR(200),
    "source_kind" VARCHAR(64) NOT NULL,
    "status" "ContentImportRunStatus" NOT NULL DEFAULT 'STARTED',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "manifest" JSONB NOT NULL DEFAULT '{}',
    "report" JSONB NOT NULL DEFAULT '{}',
    "stats" JSONB NOT NULL DEFAULT '{}',
    "input_sha256" VARCHAR(64),
    "git_commit_sha" VARCHAR(64),
    "environment" VARCHAR(32),
    "error_message" VARCHAR(2000),
    "triggered_by_user_id" TEXT,

    CONSTRAINT "content_import_runs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "content_entity_revisions" (
    "id" TEXT NOT NULL,
    "entity_kind" "ContentEntityKind" NOT NULL,
    "entity_id" VARCHAR(128) NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "snapshot_sha256" VARCHAR(64) NOT NULL,
    "reason" VARCHAR(64),
    "previous_version" INTEGER,
    "import_run_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" TEXT,

    CONSTRAINT "content_entity_revisions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "content_import_runs_status_started_at_idx" ON "content_import_runs"("status", "started_at" DESC);
CREATE INDEX "content_import_runs_source_kind_started_at_idx" ON "content_import_runs"("source_kind", "started_at" DESC);

CREATE INDEX "content_entity_revisions_entity_kind_entity_id_version_idx" ON "content_entity_revisions"("entity_kind", "entity_id", "version" DESC);
CREATE INDEX "content_entity_revisions_import_run_id_idx" ON "content_entity_revisions"("import_run_id");
CREATE INDEX "content_entity_revisions_created_at_idx" ON "content_entity_revisions"("created_at" DESC);

ALTER TABLE "content_import_runs" ADD CONSTRAINT "content_import_runs_triggered_by_user_id_fkey" FOREIGN KEY ("triggered_by_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "content_entity_revisions" ADD CONSTRAINT "content_entity_revisions_import_run_id_fkey" FOREIGN KEY ("import_run_id") REFERENCES "content_import_runs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "content_entity_revisions" ADD CONSTRAINT "content_entity_revisions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "exam_questions" ADD COLUMN IF NOT EXISTS "published_by_user_id" TEXT;
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_published_by_user_id_fkey" FOREIGN KEY ("published_by_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "pathway_lessons" ADD COLUMN IF NOT EXISTS "content_version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "pathway_lessons" ADD COLUMN IF NOT EXISTS "published_at" TIMESTAMP(3);
ALTER TABLE "pathway_lessons" ADD COLUMN IF NOT EXISTS "published_by_user_id" TEXT;
ALTER TABLE "pathway_lessons" ADD CONSTRAINT "pathway_lessons_published_by_user_id_fkey" FOREIGN KEY ("published_by_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "content_items" ADD COLUMN IF NOT EXISTS "published_by_user_id" TEXT;
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_published_by_user_id_fkey" FOREIGN KEY ("published_by_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
