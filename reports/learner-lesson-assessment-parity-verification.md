# Learner lesson assessment parity verification

## ESLint

Ran on:

- `src/components/lessons/pathway-lesson-quiz-set.tsx`
- `src/components/lessons/pathway-lesson-quizzes.tsx`
- `src/components/lessons/lesson-pre-assessment-card.tsx`
- `src/components/lessons/lesson-post-assessment-card.tsx`

**Result:** pass with `--max-warnings 0`.

## Behavioral checks (code-level)

| # | Check | Result |
|---|--------|--------|
| 1 | Pre-test when items exist | Pass — `hasPre` + non-empty `items`; empty → `null` |
| 2 | Post-test when items exist | Pass — `hasPost` + `resolvedPhase` |
| 3 | Post Practice mode | Pass — `postMode === "practice"` in `PathwayLessonQuizSet` |
| 4 | Post Exam-style | Pass — grading after `Show results`; completion callback when revealed |
| 5 | Mode switch resets | Pass — `key` includes `postTestMode` |
| 6 | Progress pill | Pass — `onQuestion`/`total` in shared set |
| 7 | Empty items | Pass — flow short-circuits; cards return `null` |
| 8 | ESLint | Pass |

## Not run here

- Full `tsc` (known unrelated errors elsewhere)
- Browser E2E
