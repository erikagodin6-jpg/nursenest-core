# Printout store + practice question peer analytics

## Files changed / added

### Printables (learner)
- `src/app/(student)/app/(learner)/printables/page.tsx` — `notFound()` unless `PRINTABLE_STORE_ENABLED`; metadata `robots: noindex`.
- `src/app/(student)/app/(learner)/printables/printables-learner-hub.tsx` — client hub calling `GET /api/printables`.
- `src/app/(student)/app/(learner)/layout.tsx` — `printablesNavVisible` via `isPrintableStorePublicNavEnabled()`.
- `src/components/layout/learner-shell-primary-nav.tsx` — optional Printouts row + prop.
- `src/lib/navigation/learner-primary-nav.ts` — `CANONICAL_LEARNER_ROUTES.printables`, `PRINTOUTS_SHELL_NAV_ID`, `buildOptionalPrintablesShellNavItem`.
- `src/lib/navigation/learner-primary-nav.test.ts`, `src/lib/printables/printables-store.contract.test.ts`
- `public/i18n/en/learner.json` — nav + printables + peer strings.

### Question peer analytics
- `prisma/schema.prisma` — enum + 3 models; `User` + `ExamQuestion` relations.
- `prisma/migrations/20260502130000_exam_question_peer_analytics/migration.sql`
- `src/lib/questions/question-peer-analytics.ts`
- `src/app/api/questions/grade/route.ts` — `attemptMode`, `peerStats`
- `src/lib/questions/question-bank-client-types.ts`, `question-peer-analytics.contract.test.ts`
- `src/components/student/question-bank-practice-client.tsx`, `question-bank-peer-performance-panel.tsx`
- `src/components/student/practice-question-session-client.tsx` — `attemptMode` mapping

### Other
- `nursenest-core/.env.example` — `QUESTION_PEER_ANALYTICS_ENABLED`

## Feature flags

| Env | Role |
|-----|------|
| `PRINTABLE_STORE_ENABLED` | Learner printables API + `/app/printables` |
| `NEXT_PUBLIC_PRINTABLE_STORE_ENABLED` | Nav (with server flag) |
| `QUESTION_PEER_ANALYTICS_ENABLED` | Record + return `peerStats` on grade |

## Routes

- Learner: `/app/printables` (404 when store off)
- Admin: existing `/admin/printables/*`
- API: existing admin + learner printables; `POST /api/questions/grade` extended

## Public visibility

- Default: no nav link, hub 404, no sitemap edits under `src/lib/seo` for printables.
- Peer stats: never sent before submit; omitted when flag off or `attemptMode === "cat"`.

## Analytics models / API

- `ExamQuestionPracticeAnswerAttempt`, `ExamQuestionAnswerOptionAggregate`, `ExamQuestionPerformanceAggregate`
- Grade JSON may include `peerStats` (aggregates only; min 10 attempts for percentages)

## Tests run

`node --import tsx --test` on:
- `src/lib/printables/printables-store.contract.test.ts`
- `src/lib/questions/question-peer-analytics.contract.test.ts`
- `src/lib/navigation/learner-primary-nav.test.ts`

Result: 24 passed.

## Gaps remaining

- Admin/staff API for raw aggregate counts (optional product scope).
- Non-English i18n for new keys.
- Local `prisma validate` + `tsc --noEmit` with full `.env` (CI agent lacked `DIRECT_URL`).
