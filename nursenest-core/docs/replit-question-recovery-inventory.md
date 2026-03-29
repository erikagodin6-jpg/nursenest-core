# Replit-era question bank recovery — inventory and import notes

This document records **where historic content lives in the monorepo**, **which pipelines already exist**, and **how to import without inventing placeholder MCQs**. It does not replace running SQL/counts against your target database.

## 1. Primary sources (by priority)

### A. `data/replit-exports/ai_cache.json` (authoritative for nursing cache extraction)

| Attribute | Detail |
|-----------|--------|
| Size | ~2.5 MB |
| Top-level | Array of **547** rows |
| `output_json` | Typically an **array** per row |
| Estimated nested items | ~**3,896** iterated; ~**1,996** stem/question-shaped; ~**1,900** front/back (flashcard-shaped) |
| Confidence | **High** — Replit production cache; extraction maps to `exam_questions` via existing scripts |

**Importer:** `scripts/replit-export-import/import-pipeline.ts` (`importAiCache` → `INSERT INTO exam_questions` with `stem_hash` dedupe).

**Supporting code:** `scripts/replit-import/nursing-ai-cache-extract.ts`, `field-maps/exam-question-from-legacy.ts`, `nursing-exam-metadata-enrich.ts`, `config/nursing-export-metadata-mapping.json`.

### B. `data/replit-exports/qbank_drafts.json`

| Attribute | Detail |
|-----------|--------|
| Structure | Small object (**2** top-level keys) — draft **bundles**, not thousands of line items |
| Use | Review/publish pipeline; not the main bulk MCQ source |

### C. `data/career-questions/*.json` (~164 files)

| Attribute | Detail |
|-----------|--------|
| Rough total | On the order of **tens of thousands** of items (sum of array lengths — run audit script to refresh) |
| Schema (example) | `stem`, `options`, `correctIndex`, `rationale`, `category`, `topic`, … |
| Product fit | **Allied / certification career** banks — **not** NCLEX RN/RPN/NP unless explicitly remapped |
| Confidence | **High** as allied inventory; **wrong** if merged into nursing tiers without mapping |

**Rule:** map to `career_type`, `tier` (e.g. `allied`), and exam keys that match `questionAccessWhere` — **do not** collapse into `rn` / `rpn`.

### D. `scripts/insert-rn-150.ts`

| Attribute | Detail |
|-----------|--------|
| Content | Large TS file with structured `QuestionData` + Postgres `INSERT` |
| Approx. stems | On the order of **hundreds** of questions (grep `stem:`) |
| Use | Curated RN expansion; run only after reviewing idempotency vs existing `stem_hash` |

### E. Bootstrap (`nursenest-core`)

| Source | Role |
|--------|------|
| `src/lib/exams/seed-minimal-question-bank.ts` | **~8** questions when DB empty — safety net only |

---

## 2. Staging directory vs export directory

`server/seed-replit-json-imports.ts` reads:

- `data/imports/` **or** `REPLIT_IMPORT_DIR`

Exports in the repo are under **`data/replit-exports/`**. Before enabling import:

- Copy or **symlink** `data/replit-exports/*` → `data/imports/`, **or**
- Set `REPLIT_IMPORT_DIR` to the absolute path of `data/replit-exports`.

---

## 3. Environment flags (server seed)

| Variable | Meaning |
|----------|---------|
| `REPLIT_IMPORT_ENABLED=1` | Run pipeline (otherwise no-op) |
| `REPLIT_IMPORT_EXTRACT_AI_CACHE=1` | Extract `ai_cache.output_json` → `exam_questions` (+ flashcard paths per pipeline) |
| `REPLIT_IMPORT_DECK_OWNER_ID` | Required if flashcard deck rows lack `owner_id` |

See `server/seed-replit-json-imports.ts` for the full list.

---

## 4. Prisma target (`exam_questions`)

NurseNest Core uses `ExamQuestion` in `prisma/schema.prisma` (`@@map("exam_questions")`). The legacy `import-pipeline` inserts a **subset** of columns; extended fields (`distractor_rationales`, etc.) can be backfilled later if the source has them.

**Dedupe:** pipeline checks `stem_hash` before insert.

---

## 5. Other `data/replit-exports` files (non-NCLEX or secondary)

Examples: `imaging_questions.json`, `paramedic_scenarios.json`, `flashcard_decks.json`, `encyclopedia_entries.json`, `generation_*.json`, analytics tables. Classify per `scripts/replit-import/file-registry.ts` and `scripts/replit-export-import/catalog.ts` — do not import imaging/paramedic into NCLEX pools without explicit product rules.

---

## 6. Validation checklist (after any import)

1. `SELECT COUNT(*) FROM exam_questions GROUP BY tier, exam, career_type, status;`
2. Spot-check `questionAccessWhere` for a test subscriber (CA/US × tier).
3. Freemium pools unchanged per `freemiumQuestionWhereForProfile`.
4. Re-run app: `/app/questions`, `/app/exams` start with non-trivial pools.

---

## 7. If “thousands” of nursing rows are still missing

This repo may not contain a **full** historic `exam_questions` SQL dump. The **`ai_cache`** path recovers **cache-shaped** MCQs (substantial but not necessarily the entire legacy bank). Obtain additional **DB backups** or **larger exports** from Replit/hosting if counts after import are still far below production expectations.

---

## 8. Related scripts (audit / dry-run)

- `scripts/replit-import/nursing-dry-run-preview.ts`
- `scripts/replit-import/nursing-pre-import-audit.ts`
- `scripts/replit-import/validate-import.ts`

Use these before uncapped production writes.
