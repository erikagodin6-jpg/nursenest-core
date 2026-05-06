# Med math + legacy flashcard migration audit

_Working checklist; re-scan paths when the repo layout changes._

## Med math — legacy sources (`client/`)

| Area | Path | Status |
|------|------|--------|
| Legacy lessons bundle | `client/src/data/lessons/med-math-lessons.ts` | Used by pathway migration tests (`med-math-migration-pipeline.contract.test.ts`) |
| Legacy numeric item bank | `client/src/data/med-math-questions.ts` | Realism enforced via `validate-med-math-answer-realism.ts` + `MED_MATH_LEGACY_CORPUS_ROUNDING_POLICY` |
| Legacy marketing page | `client/src/pages/med-math.tsx` | Distinct from Next `/tools/med-math` — audit separately |

## Med math — Next app

| Area | Notes |
|------|--------|
| `/tools/med-math` | Calculator shell only — **not** a substitute for migrated lessons + bank items |
| `src/lib/migrations/med-math-pathway-lesson/*` | Lesson → pathway lesson pipeline |

## Realism validation

- **Module:** `validate-med-math-answer-realism.ts`
- **Tests:** `validate-med-math-answer-realism.contract.test.ts`

```bash
cd nursenest-core && node --import tsx --test src/lib/med-math/validate-med-math-answer-realism.contract.test.ts
```

## Legacy flashcard paths (sample)

- `client/src/pages/upgrade.tsx`, `client/src/pages/topic-cluster-page.tsx`, `client/src/App.tsx`
- `client/src/data/flashcards-*.ts`
- `client/src/allied/pages/*flashcards*.tsx`

## Canonical flashcard SoT

See `src/lib/content-source-of-truth/content-registry.ts` (`flashcards`): Prisma `Flashcard` / `FlashcardDeck`, learner `/app/flashcards`, admin `/admin/ai/flashcards` \| `/admin/study-cards`. Registry `verificationStatus` is **PARTIAL** — do not claim full legacy parity without a dedicated audit.

## Completion criteria (do not claim “done” without)

1. Med math bank passes realism validator; canonical promoted items prefer per-row `roundingInstruction`.
2. Legacy flashcard code + APIs + persistence fully audited vs Next learner + admin surfaces.
3. Migrated decks visible live; admin publishes reflect on learner routes.
4. Update this document with migrated row counts from the import job.
