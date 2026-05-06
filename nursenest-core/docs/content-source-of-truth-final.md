# Content source-of-truth — final report (program summary)

This document satisfies **Part 10** of the content-architecture brief alongside `docs/content-source-of-truth-audit.md`.

## 1. Canonical source table

Authoritative rows live in **`src/lib/content-source-of-truth/content-registry.ts`** (`CONTENT_REGISTRY`). Types: `lessons`, `flashcards`, `practice_questions`, `cat_questions`, `osce_stations`, `medication_mastery`, `blogs`, `new_grad_content`, `allied_health_content`, `study_plan_items`, `report_card_progress`.

## 2. Legacy sources (high level)

See registry `allowedImportSources` + audit table in `docs/content-source-of-truth-audit.md`.

## 3–5. Migrated counts / duplicates / invalid

**Not batch-executed** in this program slice. Use migration runners under `src/lib/content-migration/` and domain scripts when ready.

## 6–8. Routes

Use **`resolveContentRoutes(contentType, contentId, ctx)`** from `src/lib/content-source-of-truth/resolve-content-routes.ts`. Patterns use `{locale}`, `{hubSlug}`, `{examCode}`, `{lessonSlug}`, `{blogSlug}`, `{pathwayLessonId}`, `{stationId}`.

## 9. Tests + scripts

| Command | Purpose |
|---------|---------|
| `npm run test:content-source-of-truth` | Contract tests only |
| `npm run content:source-of-truth:check` | CI gate (same tests) |
| `npm run content:source-of-truth:reports` | Writes `reports/content-source-of-truth-audit.{json,md}` |
| `npm run test:admin-edit-publish-surface` | Existing admin↔loader registry |

## 10–11. Typecheck / build / gaps

Run locally: `npm run typecheck` then `npm run content:source-of-truth:check`.

**Last run (CI slice):** `npm run content:source-of-truth:check` and `npm run content:source-of-truth:reports` succeed; outputs are `reports/content-source-of-truth-audit.json` and `reports/content-source-of-truth-audit.md` under the app package.

**Gaps:** HTTP E2E proof admin→public→learner for all VERIFIED types; exhaustive orphan grep for `client/src/data`; CAT/study-plan model tightening; bulk migrations (OSCE 69, simulator 24, med-math).

## Permanent fix criteria (not claimed yet)

Registry + CI check green + migrations verified + no live route reads legacy without documented flag + Playwright (or equivalent) proves write path equals read paths for mandatory types.

## OSCE STATUS (stations)

| Item | Status |
|------|--------|
| Write path | **Verified** — `POST/PATCH /api/admin/osce-stations*` → `osce_stations` (Prisma) |
| Read path | **Verified** — public + learner use `osce-stations-resolve.server.ts`; primary = DB when **any published** row exists |
| Admin edit → live | **Verified** (DB + loader contract + `osce-source-of-truth.e2e.test.ts`); full HTTP admin-auth E2E is env-specific |
| Fallback removed | **No** — legacy remains when **no published DB rows** and `OSCE_LEGACY_FALLBACK` is true (dev/staging); blocked once published rows exist |
| Migration count | **5 / 69** sample dry-run script: `npx tsx scripts/osce-legacy-migrate-sample-dry-run.mts` (logs duplicates; `--apply` optional) |

Signals: `safeServerLog("osce","read_path_legacy_fallback")` + non-prod `console.info` when legacy list/detail path runs; tests use `getLastOscePublicReadDiagnostics()` / `resetOscePublicReadDiagnosticsForTests()`.
