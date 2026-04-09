-- Speeds pathway-scoped aggregates and scans (synthetic ids: pathway:{pathwayId}:{slug})
CREATE INDEX IF NOT EXISTS "Progress_userId_lessonId_pathway_prefix_idx"
ON "Progress" ("userId", "lessonId")
WHERE "lessonId" LIKE 'pathway:%';
