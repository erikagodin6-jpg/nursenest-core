-- Per-user topic performance for centralized weak-area tracking.
CREATE TABLE "UserTopicStat" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" VARCHAR(80) NOT NULL,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "wrongCount" INTEGER NOT NULL DEFAULT 0,
    "wrongStreak" INTEGER NOT NULL DEFAULT 0,
    "lastWrongAt" TIMESTAMP(3),
    "lastAttemptAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTopicStat_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserTopicStat_userId_topic_key" ON "UserTopicStat"("userId", "topic");
CREATE INDEX "UserTopicStat_userId_updatedAt_idx" ON "UserTopicStat"("userId", "updatedAt");

ALTER TABLE "UserTopicStat" ADD CONSTRAINT "UserTopicStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
