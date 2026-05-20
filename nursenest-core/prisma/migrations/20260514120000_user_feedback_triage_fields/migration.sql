-- Admin triage: internal notes + optional duplicate-of link (self-referential).

ALTER TABLE "UserFeedbackReport" ADD COLUMN "internalNotes" TEXT;
ALTER TABLE "UserFeedbackReport" ADD COLUMN "duplicateOfId" TEXT;

CREATE INDEX "UserFeedbackReport_duplicateOfId_idx" ON "UserFeedbackReport"("duplicateOfId");

ALTER TABLE "UserFeedbackReport" ADD CONSTRAINT "UserFeedbackReport_duplicateOfId_fkey" FOREIGN KEY ("duplicateOfId") REFERENCES "UserFeedbackReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
