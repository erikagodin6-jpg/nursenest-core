-- Retention / transactional email idempotency and analytics
CREATE TABLE IF NOT EXISTS "EmailNotificationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailNotificationLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "EmailNotificationLog_userId_kind_createdAt_idx" ON "EmailNotificationLog"("userId", "kind", "createdAt");
CREATE INDEX IF NOT EXISTS "EmailNotificationLog_createdAt_idx" ON "EmailNotificationLog"("createdAt");

DO $$ BEGIN
  ALTER TABLE "EmailNotificationLog" ADD CONSTRAINT "EmailNotificationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
