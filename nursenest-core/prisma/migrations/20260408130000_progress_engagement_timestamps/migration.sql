-- Pathway lesson progress: track first open vs meaningful read vs completion.
ALTER TABLE "Progress" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Progress" ADD COLUMN IF NOT EXISTS "engagedAt" TIMESTAMP(3);
