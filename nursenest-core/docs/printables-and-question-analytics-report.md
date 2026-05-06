# Printout store + practice question peer analytics (report)

Canonical write-up: **`reports/printables-and-question-analytics.md`** (repo root). This file is a short pointer for in-repo search.

## Feature flags

- `PRINTABLE_STORE_ENABLED` / `NEXT_PUBLIC_PRINTABLE_STORE_ENABLED` — learner store + nav (`isPrintableStorePublicNavEnabled` requires both).
- `ADMIN_PRINTABLES_ENABLED` — admin when learner store off (existing).
- `QUESTION_PEER_ANALYTICS_ENABLED` — peer stats on grade (default off).

## Printables

- Route: `src/app/(student)/app/(learner)/printables/page.tsx` — `notFound()` when store disabled; `robots: noindex`.
- Hub: `printables-learner-hub.tsx`.
- Nav: `layout.tsx` + `learner-shell-primary-nav.tsx` + `learner-primary-nav.ts`.
- Sitemap: no `/app` URLs in public sitemap (existing filter).

## Peer analytics

- Prisma: `ExamQuestionPracticeAnswerAttempt`, `ExamQuestionAnswerOptionAggregate`, `ExamQuestionPerformanceAggregate`, enum `PracticeQuestionAnswerMode`.
- Migration: `prisma/migrations/20260502130000_exam_question_peer_analytics/migration.sql`.
- Logic: `src/lib/questions/question-peer-analytics.ts`; grade route wires it; question bank UI `question-bank-peer-performance-panel.tsx`.
- CAT: `attemptMode === cat` skips record + `peerStats`.
- Min sample: 10 attempts before percentages.

## Tests

`node --import tsx --test src/lib/printables/printables-store.contract.test.ts src/lib/questions/question-peer-analytics.contract.test.ts`

## Gaps

- Admin raw-count API optional.
- Apply DB migration before enabling peer flag.
