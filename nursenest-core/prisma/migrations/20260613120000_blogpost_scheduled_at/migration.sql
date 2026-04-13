-- Preserve legacy scheduling timestamps on blog imports.
ALTER TABLE "BlogPost"
ADD COLUMN "scheduledAt" TIMESTAMP(3);

CREATE INDEX "BlogPost_scheduledAt_idx" ON "BlogPost"("scheduledAt");
