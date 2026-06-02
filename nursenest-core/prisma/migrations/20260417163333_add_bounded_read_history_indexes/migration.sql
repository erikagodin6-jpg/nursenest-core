-- Support deterministic bounded learner-history reads.
-- Keep this migration narrow: add only the missing history indexes used by normalized loaders.

CREATE INDEX "ExamSession_userId_updatedAt_createdAt_idx"
ON "ExamSession"("userId", "updatedAt" DESC, "createdAt" DESC);

CREATE INDEX "practice_tests_userId_updatedAt_idx"
ON "practice_tests"("userId", "updatedAt" DESC);

CREATE INDEX "practice_tests_userId_status_completedAt_idx"
ON "practice_tests"("userId", "status", "completedAt" DESC);
