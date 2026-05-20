-- Background queue fields for admin blog draft batches (server-side pump + idempotency).
ALTER TABLE "BlogDraftGenerationBatch" ADD COLUMN "backgroundProcessing" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "BlogDraftGenerationBatch" ADD COLUMN "idempotencyKey" VARCHAR(128);
ALTER TABLE "BlogDraftGenerationBatch" ADD COLUMN "processorStartedAt" TIMESTAMP(3);
ALTER TABLE "BlogDraftGenerationBatch" ADD COLUMN "lastProcessorError" VARCHAR(512);

CREATE INDEX "BlogDraftGenerationBatch_backgroundProcessing_status_updatedAt_idx" ON "BlogDraftGenerationBatch"("backgroundProcessing", "status", "updatedAt");
CREATE INDEX "BlogDraftGenerationBatch_createdById_idempotencyKey_idx" ON "BlogDraftGenerationBatch"("createdById", "idempotencyKey");
