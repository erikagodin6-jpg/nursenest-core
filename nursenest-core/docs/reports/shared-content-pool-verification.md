# Shared Content Pool Verification

Date: 2026-06-01

## Executive Summary

The flashcard hub had a consumption defect.

The platform already had shared pools and the flashcard session builder already merged multiple canonical sources, but the flashcard hub inventory endpoint and server bootstrap were still using an exam-question-only inventory path. That created a false zero-card state when a pathway/system had valid lesson-derived or dedicated flashcard content.

Fixed:

- `/app/flashcards` server bootstrap now uses the shared count-only flashcard session inventory path.
- `/api/flashcards/inventory` now uses the same shared merged inventory helper.
- Inventory responses now preserve lesson-derived flashcard diagnostics.
- CAT vs flashcard parity logic now correctly treats CAT as the stricter subset.

## Architecture Verification

Canonical content surfaces must derive from the shared pathway inventory:

| Surface | Verified Source Path | Status |
| --- | --- | --- |
| Questions | `getCanonicalExamQuestionWhereForPathway` and pathway question access gates | Verified by contract test |
| Lessons | `getCatalogPathwayLessonsSync` / pathway lesson catalog | Verified as lesson-derived flashcard input |
| Flashcards | `loadSharedFlashcardsHubInventoryForPathway` -> `buildFlashcardCustomSession(includeCards: false)` | Fixed |
| Practice | CAT/practice canonical question gates | Verified by contract test |
| CAT | Canonical question gates + `CAT_DB_COMPLETENESS_WHERE` | Verified by contract test |
| Readiness | Study-plan/readiness effective pool uses shared question/flashcard availability signals | Verified by contract test |

## Root Cause

Before this fix, flashcard hub counts could come from:

- `/api/flashcards/inventory`
- `FlashcardsPage` server bootstrap
- `buildFlashcardCustomSession`

Only the session builder merged:

- exam-question-backed flashcards
- dedicated `Flashcard` rows
- lesson-derived virtual flashcards

The hub inventory API and server bootstrap used `loadFlashcardsExamInventoryForPathway`, which counted the exam-question SQL pool only. That meant a valid lesson-backed system could show:

| System | Questions | Lessons | Flashcards | CAT | Defect |
| --- | ---: | ---: | ---: | --- | --- |
| NP lesson-only system | 0 or low | >0 | 0 in hub | Depends on question pool | Hub ignored lesson-derived cards |
| RN/RPN/PN systems with dedicated/derived cards | >0 | >0 | Under-counted or 0 in hub | Available | Hub did not consume the same merged pool as launch |

## Flashcard Builder Trace

Current fixed flow:

1. System selection
   - Client sends selected canonical system ids.
   - Selection maps to flashcard builder category ids.

2. Inventory resolution
   - `/api/flashcards/inventory` now calls `loadSharedFlashcardsHubInventoryForPathway`.
   - That helper calls `buildFlashcardCustomSession` with `includeCards: false`.
   - The resulting count is the same merged pool used by launch.

3. Entitlement filter
   - Entitlement and pathway scope are still enforced server-side.
   - Existing access gates were preserved.

4. Session builder
   - `buildFlashcardCustomSession` merges DB flashcards, exam-bank cards, and lesson-derived virtuals.

5. Card generation
   - For lesson-only NP pathways, flashcards are generated from lessons plus questions.
   - Padding/filler virtual cards remain excluded from learner sessions.

## NP Special Case

Decision: flashcards should be generated from **B) lessons + questions**.

Reason:

NP pathways may contain production-ready lesson systems before their question pools reach parity. A system with valid lesson content should not show zero cards simply because the question pool is still thin.

Implemented fallback:

- Lesson-derived virtual cards are part of the hub count path.
- Inventory responses include `lessonVirtualDiagnostics`.
- The hub can now distinguish a genuine empty pool from a lesson-backed pool.

## Required Output

Live per-system counts require a working database connection. This environment cannot query the production database right now.

DB probe attempted:

```bash
npx prisma db execute --schema prisma/schema.prisma --stdin
```

Result:

```text
Environment variable not found: DIRECT_URL.
```

Because live DB access is unavailable, the table below records architecture status and the exact fields that must be populated by the runtime query once database access is restored.

| Pathway | System | Question Count | Lesson Count | Flashcard Count | Practice Availability | CAT Availability | Status |
| --- | --- | ---: | ---: | ---: | --- | --- | --- |
| RN | Cardiovascular | Pending DB | Pending DB | Pending DB | Uses shared question pool | Uses CAT subset | Runtime count pending |
| RN | Respiratory | Pending DB | Pending DB | Pending DB | Uses shared question pool | Uses CAT subset | Runtime count pending |
| RN | Pharmacology | Pending DB | Pending DB | Pending DB | Uses shared question pool | Uses CAT subset | Runtime count pending |
| RPN | All systems | Pending DB | Pending DB | Pending DB | Uses shared question pool | Uses CAT subset | Runtime count pending |
| PN | All systems | Pending DB | Pending DB | Pending DB | Uses shared question pool | Uses CAT subset | Runtime count pending |
| NP | Sample systems | Pending DB | Pending DB | Pending DB | Uses shared question pool | Uses CAT subset where eligible | Lesson fallback fixed |
| Allied | All systems | Pending DB | Pending DB | Pending DB | Uses shared question pool | Uses CAT subset where configured | Runtime count pending |

## Mismatch Rules

After this fix, these are defects:

- `Question Count > 0` and `Flashcard Count = 0`
- `Lesson Count > 0` and `Flashcard Count = 0`
- `Practice Availability = true` and `Flashcard Count = 0` unless all lesson/question/dedicated sources are genuinely empty
- `CAT Availability = true` and `Flashcard Count = 0` unless CAT is sourced from a separate non-flashcard-eligible media pool

Expected relationship:

- CAT pool <= flashcard exam pool
- Practice pool follows CAT-compatible question gates
- Flashcard pool = exam-question-backed cards + dedicated flashcards + lesson-derived flashcards

## Files Changed

- `src/lib/flashcards/load-shared-flashcards-hub-inventory.server.ts`
- `src/app/(app)/app/(learner)/flashcards/page.tsx`
- `src/app/api/flashcards/inventory/route.ts`
- `src/lib/flashcards/flashcard-custom-session-response.ts`
- `src/lib/server/manifest-loader.ts`
- `src/lib/content-inventory/content-inventory-resolver.ts`
- `src/lib/content-inventory/content-inventory-resolver.contract.test.ts`

## Verification

Passed:

```bash
npm run typecheck:critical
node --import tsx --test src/lib/content-inventory/content-inventory-resolver.contract.test.ts
git diff --check
```

Contract result:

- 44 tests passed
- 0 failed

Live count verification:

- Blocked by missing `DIRECT_URL` in the local Prisma CLI environment.
- No live row counts were fabricated.

## Final Assessment

The consumption defect is fixed at the flashcard hub and inventory API layer.

The platform now honors the intended architecture for flashcards:

One pathway. One merged content inventory. Many learning surfaces.

Final live per-system mismatch highlighting should be rerun after database connectivity is restored.
