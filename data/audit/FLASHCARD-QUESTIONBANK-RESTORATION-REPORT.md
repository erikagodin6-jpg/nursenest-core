# Flashcard & question bank restoration — implementation report

Generated: 2026-04-15

## Summary

This pass **implements** a source-of-truth audit for legacy flashcard TypeScript modules, a **Prisma import pipeline** with stable `sourceKey` deduplication, **keyboard-driven study flow** on the existing `ActiveStudySession` (aligned with legacy interaction expectations), and **npm scripts** for repeatability. Full **legacy career / advanced question-bank TS imports into `exam_questions`** remain a **separate high-volume job** (see blockers).

## Phase 1 — Audit (completed)

- **Script:** `nursenest-core/scripts/audit/run-legacy-flashcard-questionbank-full-audit.mts`
- **Outputs:**
  - `data/audit/legacy-flashcard-questionbank-source-audit.json`
  - `data/audit/legacy-flashcard-questionbank-source-audit.md`
- **Exact legacy flashcard card count (AST):** **4,380** cards across **27** `client/src/data/flashcards*.ts` files.
- **Database counts:** Populated when `DATABASE_URL` is available at audit time; otherwise the JSON records the error (no fake numbers).

## Phase 2 — Content import (flashcards)

- **Script:** `nursenest-core/scripts/import-legacy-client-flashcards.mts`
- **Dedup key:** `Flashcard.sourceKey` = `legacy_ts:{fileBase}:{legacyCardId}` (unique) — safe re-runs.
- **Deck grouping:** One `FlashcardDeck` per legacy file, slug `legacy-{slugified-file-base}`.
- **Tier / exam family:** Inferred from filename (`np` → NP/NP, `rpn` → RPN/NCLEX_PN, else RN/NCLEX_RN).
- **Category:** Single shared `Category` slug `legacy-client-flashcards` for import hygiene.
- **Visibility:** `SUBSCRIBER` + `PUBLISHED` (matches learner hub; public marketing hub still uses `publicMarketingFlashcardDeckWhere`).
- **Validation output:** `data/audit/legacy-flashcard-import-validation.json` (written on each import run).

**Run (production DB):**

```bash
cd nursenest-core
npm run import:legacy-client-flashcards
# or dry-run parse-only:
npm run import:legacy-client-flashcards:dry-run
```

## Phase 3 — Flashcard UX (completed in-app)

- **Component:** `src/components/study/active-study-session.tsx`
- **Restored interaction patterns:** Space/Enter to **reveal**, ArrowLeft/ArrowRight to **move** (right reveals first if hidden), without stealing keys from the notes field.
- **Existing strengths retained:** progress header, Incorrect/Unsure/Known, session completion, related lesson link, rationale column, semantic tokens — **no legacy CSS pasted**.

## Phase 4 — Question bank UX

- **Status:** The current `QuestionBankPracticeClient` already implements exam-style shell, strike/highlight, graded rationale, next/previous, and mobile-sized controls (`min-h-[3rem]`, responsive grids). No invasive swap was required; further “old site” parity is mostly **content volume + filters**, not missing buttons.

## Phase 5 — Theming

- All changes use existing CSS variables (`--theme-*`, `--semantic-*`). No monolith stylesheets added.

## Phase 6 — Performance / safety

- **Import:** Per-deck upserts; use `--limit=N` for staged imports.
- **Hub:** Existing `/api/flashcards/decks` pagination unchanged (pageSize caps).
- **Client flashcard study:** Session batching remains in API (`/api/flashcards/decks/.../study`).

## Phase 7 — Verification

| Check | Evidence |
|--------|-----------|
| Legacy card count | `legacy-flashcard-questionbank-source-audit.json` → `totals.legacyFlashcardCardsExact` = 4380 |
| Import dry-run | `npm run import:legacy-client-flashcards:dry-run` logs per-file counts |
| Post-import counts | `legacy-flashcard-import-validation.json` after apply |
| Routes | Learner `/app/flashcards`, `/app/questions` unchanged |
| Entitlements | No changes to `resolveEntitlement` or paywall components in this pass |

## What is still missing / blockers

1. **Exam question bank from legacy `career-questions/*` and `advanced-questions/*`:** Thousands of TS modules; requires a dedicated stem-hash pipeline into `ExamQuestion`, tier/country mapping, and batch jobs — **not executed in this commit**.
2. **`content:sync-question-flashcards` npm script** references `scripts/sync-question-flashcards.ts` which may not exist under `nursenest-core/` — verify or add symlink; the **new** import lives at `scripts/import-legacy-client-flashcards.mts`.
3. **DB required** for applying imports; CI without `DATABASE_URL` only proves parsing + audits.

## Files touched (high level)

- `nursenest-core/scripts/legacy/legacy-flashcard-ts-extract.mts` (new)
- `nursenest-core/scripts/audit/run-legacy-flashcard-questionbank-full-audit.mts` (new)
- `nursenest-core/scripts/import-legacy-client-flashcards.mts` (new)
- `nursenest-core/src/components/study/active-study-session.tsx` (keyboard UX)
- `nursenest-core/package.json` (npm scripts)
- `data/audit/legacy-flashcard-questionbank-source-audit.{json,md}` (generated)
- `data/audit/legacy-flashcard-import-validation.json` (generated on import runs)
- `data/audit/FLASHCARD-QUESTIONBANK-RESTORATION-REPORT.md` (this file)
