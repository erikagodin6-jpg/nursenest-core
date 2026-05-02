# Content source-of-truth audit (generated)

Generated: 2026-05-02T17:23:32.228Z (`npm run content:source-of-truth:reports`)

## Registry summary

| id | verification | canonical storage | admin edit | learner read | legacy OK | generated OK |
|---|----|----|----|----|----|----|
| lessons | VERIFIED | PathwayLesson (pathway_lessons) | /admin/pathway-lessons/edit \| /admin/pathway-lessons/[id] | /app/lessons/{pathwayLessonId} | true | true |
| flashcards | PARTIAL | Flashcard, FlashcardDeck (Prisma) | /admin/ai/flashcards \| /admin/study-cards | /app/flashcards | false | false |
| practice_questions | VERIFIED | ExamQuestion (exam_questions) | /admin/questions \| /admin/ai/drafts/questions/[id] | /app/questions | false | false |
| cat_questions | PARTIAL | ExamQuestion pool + CatBlueprintSession / CAT runtime services | /admin/diagnostics/cat-blueprint-sessions | /app/exams (CAT flows) | false | false |
| osce_stations | PARTIAL | OsceStation (osce_stations) | /admin/osce-stations \| /admin/osce-stations/[id] | /app/osce \| /app/osce/{stationId} | true | false |
| medication_mastery | NOT_VERIFIED | PathwayLesson + ExamQuestion (target state) | /admin/pathway-lessons/* + /admin/questions | /app/lessons/{pathwayLessonId} | true | false |
| blogs | VERIFIED | BlogPost | /admin/blog/control-panel \| /admin/blog?id= | — | true | true |
| new_grad_content | PARTIAL | PathwayLesson (+ pathway catalogs) | /admin/pathway-lessons/* | /app/lessons/{pathwayLessonId} | false | true |
| allied_health_content | PARTIAL | PathwayLesson (+ allied catalogs) | /admin/pathway-lessons/* | /app/lessons/{pathwayLessonId} | false | true |
| study_plan_items | NOT_VERIFIED | none (computed from progress + PathwayLesson + planner context) | — | /app/study-plan | false | false |
| report_card_progress | PARTIAL | Progress* / UserTopicStats / dashboard aggregates (multiple Prisma models) | /admin/analytics/* (read-mostly) | /app (dashboard / report card surfaces) | false | false |

## Legacy / generated inventory (high level)

- client/src/data/** (legacy Vite/monolith — migration sources)
- client/src/pages/** (legacy pages — not Next learner SoT)
- @legacy-client/** (bundled legacy — gated or migration only)
- src/content/pathway-lessons/*.json (catalog merge — DB wins when present)
- src/content/pathway-lessons/generated-indexes (build artifacts)

## Next steps

- Run domain migrations (OSCE, med-math, simulators MCQs) into canonical tables.
- Add Playwright proofs for admin PATCH → public/learner HTML where status is PARTIAL.
