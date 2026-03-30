# Replit export → NurseNest production migration

This document separates **database imports** from **CDN/object storage**, defines **phase-1 production content**, and lists **excluded** operational exports. It matches the tooling under `scripts/replit-export-import/`.

## Export location

- Preferred: `nursenest-core/data/replit-exports/` (also linked from repo root `data/replit-exports/` when the symlink exists).
- Inventory: `npm run import:replit-exports -- inventory` or `npx tsx scripts/replit-export-import/migration-dry-report.ts`.

## 1. Classification

### Phase 1 — production database (learner + commerce metadata)

| File | Target | Importer | Merge / dedupe |
|------|--------|----------|----------------|
| `content_items.json` | `content_items` | `nursenest-core/scripts/import-content-items-json.ts` | Upsert by `slug` |
| `content_translations.json` | `content_translations` | `importContentTranslations` | Upsert on natural key |
| `exam_questions.json` | `exam_questions` | `importExamQuestionsMonolith` | Upsert by `id` |
| `allied_questions.json` | `exam_questions` (Prisma) | `import-allied-json-to-prisma.ts` | Skip if `stem_hash` / id exists |
| `flashcard_bank.json` | `flashcard_bank` | `importFlashcardBank` | Upsert by `id`; skip `content_hash` conflicts |
| `flashcard_decks.json`, `deck_flashcards.json` | `flashcard_decks`, `deck_flashcards` | `import-pipeline.ts` | Upserts; may need `--deck-owner-id` |
| `digital_products.json` | `digital_products` | `importDigitalProducts` | Upsert by `id` |
| `pricing_plans.json` | `pricing_plans` | `importPricingPlans` | Upsert by `id` |
| Catalog JSON (imaging, lessons, encyclopedia, kill switches, …) | See `scripts/replit-export-import/catalog.ts` | `import-pipeline.ts` | Per table |

### Phase 2 — optional database (not the live question bank)

| File | Target | Notes |
|------|--------|--------|
| `generated_questions.json` | `generated_questions` | Legacy AI batch rows; **not** `exam_questions`. Gated: `--include-generated-questions`; cap with `--max-generated-questions=N`. |

### CDN / media (not JSON-importable as content)

URLs in `digital_products` (`file_url`, `cover_image_url`, `preview_url`), lesson content, SEO pages, paramedic waveforms, design assets, etc. require a **separate** object-storage migration (upload + URL rewrite). **Do not** treat binary paths in exports as sufficient for production.

### Exclude from first production migration (default)

Analytics, logs, PII-heavy, or noisy operational tables, including but not limited to:

`analytics_events.json`, `audit_logs.json`, `page_views.json`, `notification_log.json`, `platform_emergency_log.json`, `platform_health_checks.json`, `verification_reports.json`, `synthetic_test_results.json`, `reliability_alerts.json`, `incident_actions.json`, `users.json`, `dashboard_widgets.json`, `entitlement_cache.json`, `content_quarantine.json` (review separately).

**Operational pipeline tables** (`ai_cache` raw rows, `generation_jobs`, `generation_events`) are **skipped by default** in `orchestrated-import.ts`. Pass `--include-operational-imports` only if you intentionally want parity with Replit job/audit data.

## 2. Recommended migration order

1. **Dry report (no writes):** `npm run replit:migration-report`
2. **Content:** `content_items` → `content_translations`
3. **Questions:** `exam_questions.json` → `allied_questions.json` (Prisma)
4. **Optional:** `generated_questions.json` (only if needed, with cap)
5. **Flashcards:** `flashcard_bank.json` → SQL pipeline (`flashcard_decks`, `deck_flashcards`, imaging flashcards, …) → `allied_flashcards.json` (Prisma)
6. **Products:** `digital_products.json` → `pricing_plans.json`
7. **CDN:** migrate blobs and fix URLs in a controlled second phase
8. **Verify:** row counts + spot-check UI (see below)

**Orchestrated command (repo root):**

- Dry run: `npm run import:replit-data:dry`
- Apply: `npm run import:replit-data:apply -- --deck-owner-id=<user-cuid>`
- Full operational parity: add `--include-operational-imports`
- Legacy generated questions: add `--include-generated-questions` and optionally `--max-generated-questions=5000`

**SQL-only pipeline (no Prisma content steps):**

- `npm run import:replit-exports -- import --skip-operational-imports` (add `--apply` to write)

## 3. Verification checklist

After `--apply`, run SQL (adjust schema if Prisma renamed tables):

```sql
SELECT COUNT(*) AS exam_questions FROM exam_questions;
SELECT COUNT(*) AS content_items FROM content_items;
SELECT COUNT(*) AS content_lessons FROM content_items WHERE type = 'lesson';
SELECT COUNT(*) AS pathway_lessons FROM pathway_lessons;
SELECT COUNT(*) AS translations FROM content_translations;
SELECT COUNT(*) AS flashcard_prisma FROM "Flashcard";
SELECT COUNT(*) AS flashcard_bank FROM flashcard_bank;
SELECT COUNT(*) AS digital_products FROM digital_products;
SELECT COUNT(*) AS generated_questions FROM generated_questions;
```

**Pathway lessons:** there is typically **no** `pathway_lessons.json` in Replit exports; pathway rows come from seeds or other pipelines.

**Lesson availability:** cross-check `content_items` (type `lesson`) and app routes; `pathway_lessons` is a separate Prisma model.

## 4. Manual review items

- **Encyclopedia:** export shape vs `importEncyclopediaEntries` (often missing `overview`); expect skips until mapping is updated.
- **`flashcard_decks`:** missing `owner_id` → set `REPLIT_IMPORT_DECK_OWNER_ID` or `--deck-owner-id`.
- **TLS / `pg`:** if `node-pg` fails SSL but Prisma works, align SSL config in `server/db.ts` or connection string before relying on pool-based importers.
- **Kill switches:** imported with `enabled=false` unless `--apply-kill-switch-state` (dangerous).
- **Duplicates:** allied + monolith exam pools may overlap on stem hash; importers skip duplicates by design.

## 5. Idempotency and safety

- No `TRUNCATE` / `DROP` in these scripts.
- Imports use `INSERT … ON CONFLICT` or Prisma create-with-skip-on-duplicate patterns.
- Re-runs are intended to be safe; review logs for `skipped` / `skipReasons`.
