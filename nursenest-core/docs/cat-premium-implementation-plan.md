# Premium CAT — implementation plan

## Goals

Deliver a **supportive, trustworthy, actionable** CAT experience without changing **psychometrics** (item selection, θ/SE updates, stopping rules, scoring). Work is limited to **presentation**, **rationale structuring**, **linking**, **results interpretation**, **analytics**, and **UX**.

## Reuse (existing)

| Area | Location |
|------|----------|
| Study vs Test mode | `PracticeTestConfigJson.catExamFeedbackMode`, persisted in `PracticeTest.config` (JSON) |
| CAT engine | `src/lib/exams/cat-engine.ts`, `cat-session.ts` |
| Results coach (interpretation layer) | `src/lib/practice-tests/cat-results-coach.ts`, `enrich-cat-results-coach.ts` |
| Study feedback + lesson links | `build-cat-study-feedback.ts`, `resolveRationaleLessonLinksForQuestion` |
| Rationale sections from bank | `buildRationaleSectionsFromQuestion` |
| PostHog learner events | `capturePracticeTestCompletedAnalytics`, `PH.*` in `posthog-conversion-events.ts` |
| Entry points | `practice-tests-hub-client.tsx`, `pathway-cat-session-start-client.tsx`, `POST /api/practice-tests` |

## Add / extend

1. **Coach snapshot** — Broader weakness patterns (tags/stems), θ stability narrative, supportive readiness copy, specific study actions.
2. **Incorrect-row enrichment** — Load `tags`, `bodySystem` for pattern detection (`enrich-cat-results-coach.ts`).
3. **Study feedback** — Richer Layer 3 (question type + trap line); lesson link CTAs; optional PostHog on link click.
4. **Results UI** — Calmer `CatResultsCoachPanel`, “How CAT works” explainer, mode badge.
5. **Entry UI** — Premium two-card mode picker on hub + pathway CAT start.
6. **Analytics** — Extra properties on session completed; new `learner_cat_learning_link_clicked` for follow-through.
7. **Accessibility** — `motion-reduce` friendly surfaces on CAT study panel.

## Rationale-linking logic

- **Server**: `resolveRationaleLessonLinksForQuestion` (pathway + topic + tags + stem) → app `/app/lessons/:id` or hub fallback.
- **Subsections**: If lesson rows expose stable section ids in the future, append `#sectionId` via a small helper; until then, links remain lesson-level (no fake anchors).

## Mode persistence

- Stored in **`practice_tests.config`** as `catExamFeedbackMode: "study" \| "test"`.
- Echoed in **`results.catExamFeedbackMode`** on completion for analytics and static results.
- Exam simulation continues to coerce feedback to **test** on the server (`cat-session.ts`).

## Post-exam recommendations

- Generated in **`buildCatResultsCoach`** from `CatExamReport.categoryBreakdown`, `weakAreas`, and **pattern detection** on incorrect rows — no new DB tables.

## Feature flags

- None required for this pass; optional env could gate “How CAT works” if product wants it off in some regions.

## QA notes (manual)

- Start CAT **Study** → after each answer, rationale + layers + links; cannot advance until continue (existing `catStudyAwaitingContinue`).
- Start CAT **Test** → no rationale/correctness until completion; results show coach + teaching review path.
- Refresh mid-session → mode and progress restored from `config` + `adaptiveState`.
- Complete CAT → `results.catCoach` present; PostHog `learner_practice_test_session_completed` includes `pass_outlook_pct`, `cat_coach_present`, `cat_confidence_level`, `cat_pattern_codes` when applicable.
- Click lesson from study rationale → `learner_cat_learning_link_clicked` fires when PostHog client is initialized (`NEXT_PUBLIC_POSTHOG_KEY`).

## Migration

- **No Prisma schema migration** — mode and coach live in existing JSON columns.

## Final deliverables (this initiative)

| Deliverable | Status |
|-------------|--------|
| Study vs Test mode (persisted in `config`, echoed in results) | Yes |
| Premium layered rationales + pathway lesson links | Yes (`buildCatStudyFeedback`, `resolveRationaleLessonLinksForQuestion`) |
| Premium CAT results / coach (`catCoach`) | Yes |
| Weakness clustering + study-next actions | Yes (`cat-results-coach.ts`) |
| Analytics (mode + coach fields + link click event) | Yes |
| Entry UI (hub + pathway CAT cards) | Yes |
| Subsection anchor helper (future-safe) | Yes (`lesson-section-anchor.ts`) |
