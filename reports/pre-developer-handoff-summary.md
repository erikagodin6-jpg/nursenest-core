# Pre-developer handoff summary

## What was changed

1. **`docs/DEVELOPER_ONBOARDING.md`** — Project map, stack, routes, streams, CAT vs practice, flashcards, entitlements, admin, DO deploy, env, fragile areas, commands.
2. **`docs/SECURITY_AND_PRIVACY_AUDIT.md`** — PASS / NEEDS REVIEW / FAIL / NOT CHECKED matrix (engineering pass, not pentest).
3. **`docs/CORE_LEARNING_SYSTEM_MAP.md`** — RN/RPN/NP/Allied, lessons, questions, CAT, flashcards, paid/free, topic linking.
4. **`reports/pre-developer-cleanup-audit.md`** — Safe / not safe / human-review buckets (no deletions).
5. **`reports/pre-developer-check-results.md`** — Command outcomes.
6. **`nursenest-core/src/lib/stripe/apply-stripe-webhook-event.ts`** — **Low risk:** replace broken `getStripeClientForNotification` with existing `getStripeClient()`; skip SMS notify when Stripe is not configured (`null`). Restores compile correctness; behavior matches checkout path that already uses `getStripeClient`.
7. **`nursenest-core/src/lib/security/pre-developer-handoff-guardrails.contract.test.ts`** — **Low risk:** contract tests for RN vs RPN `contentExamKeys` disjointness and CAT feedback modes (imports existing payload builders).


## What was not changed

- Database schema, Prisma migrations, product architecture, homepage/SEO structure, i18n pipeline, CAT/practice semantics (only documented + one Stripe helper fix).
- No bulk deletion of scripts or legacy trees.

## Commands run

- `npm run typecheck` (under `nursenest-core/nursenest-core/`) — failed; errors logged in check-results.
- `node --import tsx --test src/lib/security/pre-developer-handoff-guardrails.contract.test.ts` — pass (3 tests)


## Failures found

- Widespread TypeScript errors — see `reports/pre-developer-check-results.md`. Stripe undefined symbol fixed.

## Security concerns

- See `docs/SECURITY_AND_PRIVACY_AUDIT.md`. Highest follow-ups: exhaustive `/api/learner/*` authz review, Stripe webhook ops verification, resolve typecheck failures in admin/marketing surfaces.

## Build / deployment concerns

- **Typecheck must pass** before relying on `next build` in CI/DO.
- Run `npm run verify:do-runtime` from repo root when changing Dockerfile or `.do` spec.

## Recommended first 10 tasks for the external developer

1. Bring `npm run typecheck` to green (triage: printables Prisma, OSCE pages, flashcard row types, med-math migration).
2. Run `npm run audit:paywall-security` and `npm run verify:no-cross-tier-leakage` on main.
3. Read `docs/CORE_LEARNING_SYSTEM_MAP.md` + `nursenest-core/docs/production-entitlement-validation.md`.
4. Trace `getUserAccess` → one learner API (`/api/learner/command-center` or similar) end-to-end.
5. Trace `requireAdmin(req)` on three new `api/admin` routes of your choice.
6. Run `npm run test:pathway-lessons` (or subset) locally.
7. Review Stripe webhook idempotency + `apply-stripe-webhook-event.ts` audit logs.
8. Review `next.config.mjs` Cache-Control for `/app` and `/api`.
9. Skim `nursenest-core/docs/stripe-webhook-production-operations.md`.
10. Open tracking tickets for any **NOT CHECKED** rows in the security audit.

## Files to review first

| Priority | Path |
|----------|------|
| P0 | `nursenest-core/src/lib/entitlements/get-user-access.ts` |
| P0 | `nursenest-core/src/lib/entitlements/require-subscriber-session.ts` |
| P0 | `nursenest-core/src/lib/stripe/apply-stripe-webhook-event.ts` |
| P1 | `nursenest-core/src/lib/auth/guards.ts`, `nursenest-core/src/lib/admin/ensure-admin.ts` |
| P1 | `nursenest-core/src/lib/exam-pathways/exam-pathways-catalog.ts` |
| P1 | `nursenest-core/src/lib/practice-tests/cat-session.ts` |
| P2 | `nursenest-core/src/proxy.ts` (admin path headers) |
