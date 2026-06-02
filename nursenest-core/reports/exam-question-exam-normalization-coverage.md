# ExamQuestion.exam normalization — write-path coverage

This report inventories **controlled** `ExamQuestion` persistence paths under the `nursenest-core/` Next.js package (`src/`, `scripts/`, `prisma/`) and records how `exam` is normalized before write.

**Canonical helper:** `canonicalExamQuestionExamForDbWrite` (`src/lib/content-quality/exam-question-exam-normalization.ts`)

**Snapshot / JSON rollback helper:** `coerceRecordedExamQuestionExamValue` (same module) — used when re-applying archived Prisma JSON snapshots.

**Guard:** `src/lib/content-quality/exam-question-exam-prisma-write-path-guard.test.ts` + `exam-question-exam-prisma-write-site-registry.ts` — fails if `rg` finds a new `prisma.examQuestion` / `tx.examQuestion` create/createMany/update/updateMany/upsert site not listed in the registry.

See the registry file for the authoritative path list and this document for status notes; keep the table in sync when adding write sites.

## Related (outside Prisma guard)

- `replit-question-normalize.ts` — canonical in `toPrismaCreateInput`.
- `scripts/replit-export-import/monolith-table-import.ts` — canonical on raw INSERT `exam`.
- Legacy `server/**` SQL seeds — exempt; use repair script after manual loads if needed.

## Risks

- New Prisma writes without registry update (guard fails).
- New raw SQL inserts without normalization.
- Future PATCH handlers that set `exam` from JSON without canonical helper.
