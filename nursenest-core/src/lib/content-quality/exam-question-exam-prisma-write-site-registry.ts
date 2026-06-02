/**
 * Authoritative list of files under `nursenest-core/` that contain Prisma
 * `examQuestion` create / createMany / update / updateMany / upsert calls.
 *
 * **Keep in sync** with `exam-question-exam-prisma-write-path-guard.test.ts` — the guard
 * fails if `rg` discovers a new path not listed here (or a stale entry).
 *
 * Intentionally **does not** include:
 * - `findMany` / `count` / `delete` / raw SQL outside Prisma client (tracked separately in ops docs).
 * - Legacy `server/` Express seeds (see coverage report — run canonical repair after manual inserts).
 */
export const EXAM_QUESTION_EXAM_PRISMA_WRITE_SITE_FILES = [
  "prisma/seed.ts",
  "scripts/import-legacy-client-advanced-questions.mts",
  "scripts/import-legacy-client-career-questions.mts",
  "scripts/link-study-content.ts",
  "src/app/api/admin/ai/drafts/questions/[id]/promote/route.ts",
  "src/app/api/admin/content-pipeline/batch/route.ts",
  "src/app/api/admin/questions/[id]/route.ts",
  "src/app/api/admin/questions/bulk/route.ts",
  "src/app/api/admin/questions/route.ts",
  "src/lib/admin/question-bank-bulk-import.ts",
  "src/lib/content-pipeline/content-revision.ts",
  "src/lib/content-quality/run-exam-question-exam-value-repair.ts",
  "src/lib/content-source-of-truth/verified-content-write-read-parity.e2e.test.ts",
  "src/lib/exams/ensure-core-pathway-exam-questions.ts",
  "src/lib/exams/seed-minimal-question-bank.ts",
  "src/lib/jobs/process-pending.ts",
  "src/lib/legacy/legacy-exam-question-apply.ts",
  "src/lib/lessons/lesson-question-gap-fill.ts",
  "src/lib/replit-import/replit-question-pipeline.ts",
] as const;
