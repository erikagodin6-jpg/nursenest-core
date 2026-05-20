-- Admin dismiss/resolve workflow for premium protection abuse queue.
CREATE TYPE "ProtectionAbuseReviewResolution" AS ENUM ('DISMISSED', 'RESOLVED');

ALTER TABLE "protection_abuse_reviews" ADD COLUMN "resolution" "ProtectionAbuseReviewResolution";
ALTER TABLE "protection_abuse_reviews" ADD COLUMN "adminNote" VARCHAR(500);
ALTER TABLE "protection_abuse_reviews" ADD COLUMN "dismissedByUserId" TEXT;

ALTER TABLE "protection_abuse_reviews" ADD CONSTRAINT "protection_abuse_reviews_dismissedByUserId_fkey" FOREIGN KEY ("dismissedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "protection_abuse_reviews_dismissedAt_idx" ON "protection_abuse_reviews"("dismissedAt");
