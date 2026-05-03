# Printout store + practice question peer analytics

## Summary

Two gated systems are implemented under explicit environment flags. Default behavior keeps learner surfaces and peer statistics off until operators enable them.

## Feature flags

| Flag | Default | Role |
|------|---------|------|
| PRINTABLE_STORE_ENABLED | off | Server: GET /api/printables, learner /app/printables |
| NEXT_PUBLIC_PRINTABLE_STORE_ENABLED | off | With server flag enables learner shell Printouts nav |
| ADMIN_PRINTABLES_ENABLED | on when unset | Admin APIs when learner store is locked |
| QUESTION_PEER_ANALYTICS_ENABLED | off | Record attempts + return peerStats on POST /api/questions/grade |

See nursenest-core/.env.example.

## Printout store

- Learner route: nursenest-core/src/app/(student)/app/(learner)/printables/page.tsx — notFound() when store disabled; robots noindex.
- Hub: printables-learner-hub.tsx
- Nav: learner layout + learner-shell-primary-nav + learner-primary-nav (buildOptionalPrintablesShellNavItem).
- Sitemap: /app URLs excluded by existing public sitemap filters.
- Admin routes and APIs unchanged from prior printable work.

## Peer analytics

- Prisma models: ExamQuestionPracticeAnswerAttempt, ExamQuestionAnswerOptionAggregate, ExamQuestionPerformanceAggregate; enum PracticeQuestionAnswerMode.
- Migration: prisma/migrations/20260502130000_exam_question_peer_analytics/migration.sql
- Logic: src/lib/questions/question-peer-analytics.ts; grade route wires peerStats (best-effort).
- CAT attemptMode skips recording and omits peerStats. Minimum sample 10 attempts before percentages.
- UI: question-bank-peer-performance-panel.tsx; question-bank-practice-client.tsx; practice-question-session-client.tsx sends attemptMode.

## Tests

cd nursenest-core && DIRECT_URL=postgresql://localhost:5432/x DATABASE_URL=postgresql://localhost:5432/x npx prisma validate
node --import tsx --test src/lib/printables/printables-store.contract.test.ts src/lib/questions/question-peer-analytics.contract.test.ts

## Gaps

- Admin raw-count API optional.
- Run DB migration before enabling QUESTION_PEER_ANALYTICS_ENABLED.
