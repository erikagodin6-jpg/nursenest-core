# Security and privacy audit — pre-external-developer pass

**Scope:** Static review of code paths, docs, and existing guard tests. This is **not** a penetration test or formal certification. Each line uses one of: **PASS** | **NEEDS REVIEW** | **FAIL** | **NOT CHECKED**.

| Area | Status | Notes |
|------|--------|--------|
| Auth/session (NextAuth + DB user) | **NEEDS REVIEW** | Session is standard NextAuth; premium decisions must not rely on JWT tier alone—`getUserAccess` re-reads DB (`get-user-access.ts`, `require-subscriber-session.ts`). Full threat model not exercised here. |
| Admin-only UI (`/admin`) | **PASS** | `requireAdmin()` uses DB-backed `getStaffSession()` + `adminRouteGateDecision` / path policy (`guards.ts`, `admin-path-policy.ts`). |
| Admin-only APIs (`/api/admin/*`, `/api/debug/*`) | **PASS** | `requireAdmin(req)` in `ensure-admin.ts`; static tests require `requireAdmin(req)` not `requireAdmin(_req)` (`security-regression-sources.test.ts`). |
| User PII in logs | **NEEDS REVIEW** | Structured logs truncate IDs; grep new `safeServerLog` calls for accidental email/full payloads. |
| Subscriber APIs (`/api/questions`, `/api/lessons`, `/api/practice-tests`, …) | **PASS** | Policy tests assert session + entitlement wiring (`paywall-surface-policy.test.ts`, `authorization-entitlement-policy.test.ts`). |
| Cross-user cache / stale keys | **PASS** | Question list stale keys include user id (`authorization-entitlement-policy.test.ts`). |
| Paid content Cache-Control | **PASS** | `/app` and subscriber JSON use private/no-store patterns asserted in paywall policy tests; `/api/public/*` intentionally cacheable with explicit policy. |
| Stripe checkout / webhooks | **NEEDS REVIEW** | Webhook handler documents Stripe vs DB SoT (`apply-stripe-webhook-event.ts`). Webhook auth + idempotency need periodic ops verification (`stripe-webhook-production-operations.md`). |
| Subscription tier → question bank | **PASS** | Static script `verify-no-cross-tier-leakage.mjs` + `content-access-scope.ts` centralization. |
| Pathway isolation (RN vs PN exam columns) | **PASS** | `questionAccessWhereWithPathway` + `contentExamKeys` on pathways; CAT pool policy documented (`cat-adaptive-policy.ts`). |
| Public marketing lessons (no leaked premium) | **PASS** | Paywall test asserts teaching supplements gated on `fullAccess` in pathway lesson body. |
| Cron endpoints | **PASS** | Shared `enforceCronSecretOrResponse` asserted for key cron routes (`authorization-entitlement-policy.test.ts`). |
| Database queries (cross-user) | **NOT CHECKED** | ORM queries generally scoped by `userId` in learner APIs; full audit requires tracing each `/api/learner/*` handler and Prisma `where` clauses. |
| RSC / server component data leaks | **NOT CHECKED** | Requires page-by-page review of serialized props to client components. |
| Third-party subprocessors | **NOT CHECKED** | Stripe, PostHog, Sentry, email—see privacy policy and vendor DPAs outside this repo. |

## Auth / session handling

- **Mechanism:** NextAuth JWT/session + Prisma `User` / `Subscription` rows.
- **Status:** **NEEDS REVIEW** for session fixation / cookie flags at edge—Next + hosting config; in-app entitlement refresh uses `GET /api/auth/sync-session` (mentioned in `production-entitlement-validation.md`).

## Admin-only routes

- **Status:** **PASS** for documented RBAC layers (`admin-permissions.md`, `ensure-admin.ts`, `requireAdmin()` for pages).

## User data exposure risk

- **Learner JSON APIs:** Mix of user-scoped progress, notes, mistakes—each should require session and `userId` from session, not from client body. **NOT CHECKED** exhaustively.
- **Admin exports:** Super-tier paths; **NEEDS REVIEW** when adding new export routes.

## API routes returning subscription / study data

Examples: `/api/learner/*`, `/api/lessons`, `/api/questions`, `/api/practice-tests/*`, `/api/flashcards/*`.  
**Status:** **NEEDS REVIEW** per route in backlog; global patterns **PASS** in policy tests.

## Paid entitlement checks

- **Status:** **PASS** for documented canonical APIs (`getUserAccess`, `resolveEntitlement`, `requireSubscriberSession`). **FAIL** if any new route gates on `session.user.subscriptionStatus` only—search in PRs.

## Stripe / subscription flow

- Checkout: `src/app/api/subscriptions/checkout/route.ts` (and related). Webhooks: `apply-stripe-webhook-event.ts`, `subscriptions/webhook`.  
- **Status:** **NEEDS REVIEW** for race conditions between checkout success UI and webhook latency; mitigated by DB-backed `getUserAccess` on next request.

## Public lesson / blog / SEO routes

- Must not emit other users’ data or subscriber-only payloads. Marketing layout uses server gating for premium sections.  
- **Status:** **PASS** for static checks in `paywall-surface-policy.test.ts`; **NEEDS REVIEW** for each new dynamic segment.

## TODOs / risk markers found in this pass

- `npm run typecheck` reports multiple TS errors (printables admin, OSCE marketing, flashcards, migrations)—**NEEDS REVIEW** for whether any indicate runtime exposure or are compile-only drift (`reports/pre-developer-check-results.md`).
- Truthpack files (`.vibecheck/truthpack/`) were **not present** in this workspace clone—product/route enumerations should be verified against production docs or regenerated per internal process. **NOT CHECKED**

## How to extend this audit

1. Run `npm run audit:paywall-security` and `npm run test:pathway-lessons` before releases.  
2. Add route-specific rows to this table as you review `/api/*`.  
3. For GDPR/PII: pair with legal/officer review—this doc is engineering-facing only.
