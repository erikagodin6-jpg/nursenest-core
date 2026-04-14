# Production entitlement validation (manual)

Use this checklist against a **staging** or **production** environment. All **premium** decisions must come from the database via `getUserAccess` → `resolveEntitlement` / `requireSubscriberSession`, not from the JWT alone.

## Canonical server APIs

| Mechanism | Role |
|-----------|------|
| `getUserAccess(userId)` | Single source of truth: subscription + trial + admin override |
| `resolveEntitlement(userId)` | `accessScopeFromUserAccess(getUserAccess(...))` for SQL/helpers |
| `requireSubscriberSession()` | Session + `getUserAccess`; returns **403** when `hasPremium` is false |
| `resolveEntitlementForPage(userId)` | Server Components; safe fallback on error |

## Scenarios

### 1. Anonymous — no premium content

- Sign out (or use incognito).
- Open a marketing pathway lesson: expect **preview/teaser** only (`fullAccess === false`); premium sections (exam takeaways, memory anchors, traps) must not render.
- Hit a subscriber API without a cookie, e.g. `GET /api/questions?...`: expect **401** `Unauthorized`.

### 2. Paid user — full access

- Active subscription (or admin override) in DB.
- `/app` question bank and lessons should load; `GET /api/questions` / `GET /api/lessons` return full payloads when `entitlement.hasAccess` is true.
- Response must not rely on `subscriptionStatus` in the JWT for gating (JWT is **hint** only; APIs re-check `getUserAccess`).

### 3. Expired / revoked — access removed

- User with canceled / ended subscription (or `PAST_DUE` under strict policy): `getUserAccess` → `hasPremium: false`.
- Expect paywall / freemium limits on `/app`; subscriber APIs return **403** `not_subscribed` or freemium-limited payloads.
- After revocation, **hard refresh** — HTML uses `private, no-store` for `/app` (see `next.config.ts`).

### 4. New checkout — instant access

- Complete Stripe checkout; webhook updates `User` + `Subscription`.
- Client should refresh entitlement: call **`GET /api/auth/sync-session`** then `session.update(...)` (checkout success / billing flows already wired to merge tier/country).
- **`getUserAccess` reads the DB** on each API request, so the next API call after webhook processing should see premium without relying on stale JWT alone.

## Automated guardrails (CI)

- `src/lib/security/paywall-surface-policy.test.ts` — static checks for session gates, `requireSubscriberSession` on practice tests, cache headers for `/app`.
- Run: `npm run test:paywall-surface-policy` (if scripted) or the test file via `tsx --test`.

## Cached leaks

- **Learner shell** (`/app`, `/app/:path*`): `Cache-Control: private, no-store, must-revalidate` in production (`next.config.ts`).
- **API routes** (`/api/:path*`): same `private, no-store` in production so CDNs/proxies do not serve one user’s JSON to another.

## API bypass review

Subscriber-only routes should use **`requireSubscriberSession()`** or **`resolveEntitlement` + explicit `hasAccess` checks** (see `/api/questions`, `/api/lessons`, `/api/practice-tests/*`, `/api/exams/start`). Do not gate premium content on `session.user.tier` or `subscriptionStatus` alone in API handlers.
