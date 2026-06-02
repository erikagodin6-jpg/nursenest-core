-- Account lifecycle / inactivity management fields
-- AddColumn: is_deletion_exempt (default false)
ALTER TABLE "User" ADD COLUMN "is_deletion_exempt" BOOLEAN NOT NULL DEFAULT false;
-- AddColumn: inactivity_baseline_at
ALTER TABLE "User" ADD COLUMN "inactivity_baseline_at" TIMESTAMP(3);
-- AddColumn: warning1_sent_at
ALTER TABLE "User" ADD COLUMN "warning1_sent_at" TIMESTAMP(3);
-- AddColumn: warning2_sent_at
ALTER TABLE "User" ADD COLUMN "warning2_sent_at" TIMESTAMP(3);
-- AddColumn: warning3_sent_at
ALTER TABLE "User" ADD COLUMN "warning3_sent_at" TIMESTAMP(3);
-- AddColumn: deleted_at (soft delete timestamp)
ALTER TABLE "User" ADD COLUMN "deleted_at" TIMESTAMP(3);
-- AddColumn: scheduled_permanent_deletion_at
ALTER TABLE "User" ADD COLUMN "scheduled_permanent_deletion_at" TIMESTAMP(3);
-- AddColumn: permanently_purged_at
ALTER TABLE "User" ADD COLUMN "permanently_purged_at" TIMESTAMP(3);
-- AddColumn: last_lifecycle_email_type
ALTER TABLE "User" ADD COLUMN "last_lifecycle_email_type" VARCHAR(64);

-- Indexes for lifecycle queries
CREATE INDEX "User_deleted_at_idx" ON "User"("deleted_at");
CREATE INDEX "User_scheduled_permanent_deletion_at_idx" ON "User"("scheduled_permanent_deletion_at");
