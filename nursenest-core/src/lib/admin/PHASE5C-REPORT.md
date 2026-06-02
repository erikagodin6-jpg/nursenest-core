# Phase 5C — Admin / institutional adaptive learning visibility

> `reports/` is `.cursorignore`d in this workspace — keep this file here and optionally copy to `reports/phase-5c-admin-adaptive-learning-visibility.md` locally for publishing.

## Audit — existing admin user surfaces

| Surface | Path | Primary data sources |
|--------|------|----------------------|
| User search + newest registrations | `/admin/users` | `loadAdminUserSearch` → `prisma.user.findMany` (bounded); dashboard cards → `user.groupBy`, `user.findMany(take: 40)`, `user.count` |
| Support detail (pre–Phase 5C) | `/admin/users/[userId]` | `loadAdminUserSupportDetail` → `resolveEntitlement` / `getUserAccess` via `resolveEntitlement`, `prisma.subscription`, usage `count`/`groupBy`, bounded `findMany` for attempts/sessions/progress/topics |
| Support JSON | `GET /api/admin/users/[userId]/support` | Same loader + `requireAdmin(req)` |
| Phase 5C overview block | `/admin/users/[userId]` | `loadAdaptiveLearnerAdminSummary` → `resolveEntitlement`, bounded `UserTopicStat`, latest `PracticeTest`/`ExamSession` **adaptive JSON** (performance + snapshot extractors only — no stems) |
| Phase 5C JSON | `GET /api/admin/users/[userId]/adaptive-summary` | Same + `requireAdmin(req)` |
| Filtered directory | `/admin/users` (query params) | `loadAdminUserDirectory` → `prisma.user.findMany` with `take: PAGE_SIZE+1`, cursor pagination, subscription `some` filter, `topicStats some` for weak filter |

## Feature flags

- **`ADAPTIVE_LEARNING_ENABLED`** — when unset/false, the adaptive recommendations panel is hidden in admin UI; summaries and directory filters still load.

## Validation notes

- Run from `nursenest-core/`:
  - `npm run test:unit:practice` → exit **0**
  - `npm run test:unit:flashcards` → exit **0**
  - `node --import tsx --test src/lib/adaptive-learning/adaptive-recommendation-engine.test.ts` → exit **0**
  - `node --import tsx --test src/lib/admin/adaptive-learner-summary-admin.test.ts` → exit **0**
  - `node --import tsx --test src/lib/admin/adaptive-summary-api-route.contract.test.ts` → exit **0**
  - `npm run typecheck:critical` → exit **0** (in this environment)
- `src/lib/security/authorization-entitlement-policy.test.ts` currently has **pre-existing** failing subtests (staff-session regex + cron jobs guard); not introduced by Phase 5C.
- Full `typecheck` not run here (risk of OOM); `typecheck:critical` used per project guidance.

## Constraints honored

- No schema migrations.
- No new public routes; admin-only `/admin/*` and `/api/admin/*`.
- Subscription/access via existing `resolveEntitlement` / `getUserAccess` path (not reimplemented).
- Bounded queries (`take` / pagination); no unbounded `findMany` for listings.
