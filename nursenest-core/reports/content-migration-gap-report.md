# Content migration gap report

Authoritative inventory for bulk migrations (2026-05-02). DB counts require `DATABASE_URL` / `npx tsx scripts/run-prisma-with-env.mts` as used elsewhere in this repo.

## OSCE stations (expected **69** legacy merged)

| Source | Canonical destination | Source count | DB migrated |
|--------|----------------------|--------------|-------------|
| `getMergedLegacyOsceSkillStations()` (`legacy-osce-stations-runtime.ts` + `@legacy-client/data/osce-skills-data*`) | `OsceStation` (`osce_stations`) | **69** | Compare with `SELECT count(*) FROM osce_stations` (published rows) |

**Next step:** Run admin/CLI migration with slug collision checks; keep `osce-source-of-truth.e2e.test.ts` green.

## Simulator cases (expected **24** — reconcile)

| Source | Canonical destination | Source count (file audit) | Notes |
|--------|------------------------|---------------------------|--------|
| `client/src/pages/simulators.tsx` | Prefer `ExamQuestion` (+ tags) per `docs/content-source-of-truth-audit.md` | **37** rows with `difficulty:` in file (2026-05-02) | Differs from "24" — confirm product definition (subset vs full file), then import with `stemHash` dedupe. |

**Next step:** Export MCQs to structured JSON → admin question import or `content-pipeline` batch; verify no duplicate `stem_hash`.

## Med-math / medication mastery

| Source | Canonical | Command / test |
|--------|-------------|----------------|
| Pathway shards + scripts | `PathwayLesson` | `npm run migrate:med-math:dry` / `migrate:med-math:write`; `med-math-migration-pipeline.contract.test.ts` |
| Registry | `medication_mastery` is **NOT_VERIFIED** | Complete migration before claiming VERIFIED parity |

## Allied health

| Source | Canonical | Command |
|--------|------------|---------|
| Allied pathway catalogs + DB | `PathwayLesson` / `ExamQuestion` | `npm run report:allied-health-lessons`, `npm run test:allied-health` |

## Collision / duplicate rules

- Questions: `stemHash` on admin create (`/api/admin/questions`).
- Blogs: `ensureUniqueBlogPostSlug`, `findExistingBlogByCanonicalIntent` (`blog-control-panel-generation.ts`); tests: `blog-pipeline-duplicate-guard.contract.test.ts`.
- Lessons: unique `(pathwayId, slug, locale)` on `PathwayLesson`.
