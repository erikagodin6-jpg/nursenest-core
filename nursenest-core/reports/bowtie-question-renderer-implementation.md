# Bowtie / Trend NGN Question Renderer — Implementation Summary

**Date:** 2026-05-09  
**Commit message:** `feat(exams): add theme-aware bowtie question renderer` (local only; **not pushed** per request).

## Scope

- Theme-aware **Bowtie** UI for learner practice/CAT flows and question bank.
- **Trend** question type uses the same adapter/renderer when `options` JSON validates.
- **No Prisma schema/migration changes** — structured payloads live in existing `options` and `correct_answer` JSON columns.

## Files touched (primary)

| Area | Path |
|------|------|
| Adapter + types | `src/lib/questions/bowtie-adapter.ts` |
| Grading | `src/lib/questions/grade-answer-match.ts` |
| Session scoring | `src/lib/exams/score-session-answers.ts` |
| Grade API | `src/app/api/questions/grade/route.ts`, `freemium-grade/route.ts` |
| Baseline | `src/app/api/learner/baseline-assessment/submit/route.ts` |
| UI | `src/components/exams/questions/bowtie-question-renderer.tsx` |
| Runners | `src/components/student/practice-test-runner-client.tsx`, `question-bank-practice-client.tsx` |
| CAT rationale hint | `src/lib/practice-tests/build-cat-study-feedback.ts` |
| Tests | `src/lib/questions/bowtie-adapter.test.ts`, `grade-answer-match.bowtie.test.ts` |
| NPM script | `package.json` (`test:unit:practice`) |
| Docs | `reports/bowtie-question-data-audit.md`, this file, `reports/bowtie-screenshots/README.txt` |

## Payload shapes

**Bank (`options` JSON)** — object with `bank` array (≥3 items), each `{ id, text }` or legacy string entries (synthetic ids `opt_i`). Optional `slotLabels`, `scenario`, `format: "bowtie"`.

**Answer key (`correct_answer`)** — `{ "correctMapping": { "condition": "<id>", "intervention": "<id>", "monitoring": "<id>" } }`.

**Learner answer** — `{ "type": "bowtie", "mapping": { ... } }`.

## Scoring

- **All-or-nothing:** all three slot ids must match `correctMapping`.
- Same logic in `gradeMatches`, `answerMatches`, CAT `scoreOne`, practice test results.

## Tests run

- `npm run typecheck:critical` — pass  
- `npm run test:unit:practice` — pass (includes new bowtie tests)

## Playwright / screenshots

- No automated Playwright run against a live bowtie session (requires seeded bank row + auth).  
- Screenshot folder placeholder: `reports/bowtie-screenshots/README.txt`.

## Limitations / follow-ups

- Optional API enhancement: add `scenario` to `GET /api/practice-tests/[id]/question` select for column-backed vignettes without duplicating stem.
- Drag-and-drop not implemented (tap-to-assign only).
