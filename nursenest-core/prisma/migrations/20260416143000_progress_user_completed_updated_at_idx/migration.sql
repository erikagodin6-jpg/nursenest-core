-- Learner shell: "latest incomplete lesson" and similar filters use (userId, completed, updatedAt).
CREATE INDEX "Progress_userId_completed_updatedAt_idx" ON "Progress"("userId", "completed", "updatedAt" DESC);
