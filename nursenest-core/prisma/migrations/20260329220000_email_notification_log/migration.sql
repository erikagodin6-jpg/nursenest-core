-- Retention / transactional email idempotency and analytics
CREATE TABLE "EmailNotificationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailNotificationLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "EmailNotificationLog_userId_kind_createdAt_idx" ON "EmailNotificationLog"("userId", "kind", "createdAt");
CREATE INDEX "EmailNotificationLog_createdAt_idx" ON "EmailNotificationLog"("createdAt");

ALTER TABLE "EmailNotificationLog" ADD CONSTRAINT "EmailNotificationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
