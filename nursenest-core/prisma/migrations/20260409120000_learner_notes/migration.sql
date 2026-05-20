-- User-authored study notes (metadata + text only; no premium content bodies).
CREATE TYPE "LearnerNoteScope" AS ENUM ('PATHWAY_LESSON', 'CONTENT_LESSON', 'QUESTION_BANK', 'PRACTICE_TEST', 'FLASHCARD_DECK');

CREATE TABLE "LearnerNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scope" "LearnerNoteScope" NOT NULL,
    "contextId" VARCHAR(128) NOT NULL,
    "pathwayId" VARCHAR(64),
    "topic" VARCHAR(200),
    "title" VARCHAR(200),
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearnerNote_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LearnerNote_userId_scope_contextId_key" ON "LearnerNote"("userId", "scope", "contextId");
CREATE INDEX "LearnerNote_userId_updatedAt_idx" ON "LearnerNote"("userId", "updatedAt");

ALTER TABLE "LearnerNote" ADD CONSTRAINT "LearnerNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
