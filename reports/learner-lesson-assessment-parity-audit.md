# Learner lesson assessment parity audit

## Summary

Learner pathway assessments previously used **`LessonAssessmentQuiz`** (all questions visible, single submit, then graded) while marketing used **`PathwayLessonQuizzes`** with per-question immediate feedback, a **progress pill (`n/total`)**, and **post-test Practice vs Exam-style** tabs with key-based reset.

## Components

| File | Pre-test | Post-test | Progress | Post modes | Reset / bugs |
|------|----------|-----------|----------|------------|--------------|
| `lesson-assessment-flow.tsx` | Wraps pre card | Wraps post card | API + progress event | Via cards | None in flow itself |
| `lesson-pre-assessment-card.tsx` | Idle → **old quiz** → complete | — | Bar in old quiz | — | — |
| `lesson-post-assessment-card.tsx` | — | Locked → idle → **old quiz** → complete | Bar in old quiz | **Missing** | **setState during render** (fixed by deriving phase) |

## Parity gaps (before fix)

1. **UX mismatch**: Submit-all vs marketing immediate rationale flow.
2. **Progress**: Marketing shows `current/total` pill; learner had a different progress bar semantics.
3. **Post-test**: No Practice / Exam-style toggle on learner.
4. **Reset**: Marketing uses React `key` on quiz segments; learner relied on different state machine.
5. **Post card**: Conditional `setPhase` in render body (React violation).

## Safest direction

Extract **`PathwayLessonQuizSet`** + **`itemsResetKey`**, reuse in marketing and learner running states; derive **post** `locked`/`idle` from `lessonComplete` + stored phase via **`useMemo`** (no effect sync).
