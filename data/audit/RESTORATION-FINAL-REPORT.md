# Legacy flashcards + question bank restoration — final report

## Routes updated

| Route | Change |
|-------|--------|
| `/app/flashcards/[deckRef]` | Accepts `mode=test` \| `mode=learn` (default learn). Passes **test** mode into study client for timed shell. |
| `/app/questions` | (Prior step) Question bank client + practice exam builder on same hub. |

## npm scripts (validation / import)

| Script | Purpose |
|--------|---------|
| `npm run import:legacy-client-flashcards` | Import `client/src/data/flashcards*.ts` → Prisma decks/cards |
| `npm run import:legacy-question-bank` | Advanced MCQ/SATA + career MCQ → `exam_questions` |
| `npm run import:legacy-full-content` | **Flashcards + advanced + career** in one run |
| `npm run validate:legacy-post-import` | After import: DB totals + group-bys → `data/audit/post-import-db-validation.{json,md}` (requires `DATABASE_URL`) |
| `npm run audit:legacy-question-mapping` | Mapping-quality audit (tier, exam, rationale, stem_hash collisions sample) → `data/audit/legacy-question-mapping-quality.json` |
| `:dry-run` variants | Parse/normalize without requiring DB writes for partial phases |

**Operator runbook (real DB):** [`LIVE-DATABASE-IMPORT-INSTRUCTIONS.md`](./LIVE-DATABASE-IMPORT-INSTRUCTIONS.md)

## Machine-readable audits (`data/audit/`)

| File | Contents |
|------|----------|
| `legacy-flashcard-import-validation.json` | Per-file card counts, post-import deck/card totals |
| `legacy-advanced-questions-import-validation.json` | Advanced TS import metrics |
| `legacy-career-questions-import-validation.json` | Career TS import metrics |
| `legacy-question-bank-import-report.json` | Pre/post `exam_questions` when `DATABASE_URL` set |
| `legacy-full-content-import-report.json` | **Combined** pre/post for questions + flashcards |
| `post-import-db-validation.json` | Post-import totals (from `validate:legacy-post-import`) |
| `post-import-db-validation.md` | Short Markdown summary of the same run |
| `legacy-question-mapping-quality.json` | Tier/exam/rationale/stem_hash collision heuristics |
| `FLASHCARDS-UX-GAP-ANALYSIS.md` | Old vs new flashcard UX |
| `QUESTION-BANK-UX-GAP-ANALYSIS.md` | Old vs new question bank / test bank |

## Files changed (this restoration)

- `nursenest-core/src/components/study/active-study-session.tsx` — card layout, stats, timer, keyboard 1–3; optional **resume** props (`initialCardIndex`, `initialRevealed`, `onStudyProgress`, `onSessionComplete`, `onSessionRestart`)  
- `nursenest-core/src/components/flashcards/flashcard-study-client.tsx` — `layout="card"`, `studyMode`; **local resume gate** (checkpoint in `study-session-persistence`) before mounting study when a saved position exists; clears checkpoint on shuffle/reset/complete/restart  
- `nursenest-core/scripts/post-import-validation.mts` — writes `post-import-db-validation.md` + `.json`  
- `nursenest-core/package.json` — `validate:legacy-post-import`, `audit:legacy-question-mapping`  
- `data/audit/LIVE-DATABASE-IMPORT-INSTRUCTIONS.md` — how to run imports + validation on a real DB  
- `nursenest-core/src/app/(student)/app/(learner)/flashcards/[deckRef]/page.tsx` — `mode` search param  
- `nursenest-core/src/components/study/flashcard-deck-card.tsx` — Learn / Test CTAs  
- `nursenest-core/scripts/import-legacy-client-flashcards.mts` — exported `runLegacyClientFlashcardImport`, CLI guard  
- `nursenest-core/scripts/run-legacy-full-content-import.mts` — **new** full orchestrator  
- `nursenest-core/package.json` — `import:legacy-full-content` scripts  
- `data/audit/*.md` — gap analyses + this report  

(Question bank import scripts and `/app/questions` wiring from the prior pass remain in tree; see git history for those paths.)

## Acceptance checklist

- [x] Legacy flashcard **content** import script (flashcards\*.ts) with audit JSON  
- [x] Legacy question bank **content** import (advanced + career) with audit JSON  
- [x] **Full** orchestrator with combined counts  
- [x] Flashcard **UX** strengthened: card layout, learn/test, session stats, keyboard parity, **resume-or-start-fresh gate** for subscriber deck study  
- [x] Question bank **UX**: classic bank on `/app/questions` + practice exam builder (prior pass); see `QUESTION-BANK-UX-GAP-ANALYSIS.md` for old-vs-new gaps  
- [x] Theming: semantic tokens / `color-mix` / progress utilities — no raw hex in new UI  
- [x] Post-import **validation** and **mapping-quality** npm scripts + `data/audit/` outputs  

**Live DB proof** (not reproducible in a DB-less sandbox): run `npm run import:legacy-full-content`, then `npm run validate:legacy-post-import`, then `npm run audit:legacy-question-mapping` with `DATABASE_URL` set; archive the generated JSON/MD under `data/audit/`. See [`LIVE-DATABASE-IMPORT-INSTRUCTIONS.md`](./LIVE-DATABASE-IMPORT-INSTRUCTIONS.md).
