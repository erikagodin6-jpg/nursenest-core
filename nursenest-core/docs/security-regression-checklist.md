# Security regression checklist

Use before releases and after auth, billing, entitlement, or API surface changes. Automated coverage lives under `npm run test:security-regression` (see `package.json`).

## Automated (CI-friendly)

| Area | What runs |
| --- | --- |
| Login brute-force | `login-lockout.test.ts` — progressive lockout; `security-regression-sources.test.ts` — IP rate limit + lock key in `auth.ts` |
| Forgot-password misuse | Source: generic success copy (no enumeration); rate policy: `api-rate-limit-policy.test.ts` (`isAuthStrictPath`) |
| Password reset invalidation | Source: `credentialVersion` increment + token delete on reset |
| Premium / subscriber gates | `pathway-entitlements.test.ts` — tier, country, NP vs RN; `authorization-entitlement-policy.test.ts` — static contracts |
| Admin denial | Source: `requireAdmin(req)` on admin lookup; `admin-path-policy.test.ts`, `middleware.test.ts` |
| IDOR (example) | Source: practice test `where: { id, userId: gate.userId }` |
| Stripe webhook signature | `stripe-webhook-signature-contract.test.ts` (SDK HMAC); `stripe-webhook-policy.test.ts` (apply-before-dedupe) |
| Webhook idempotency | Source: `P2002` → duplicate; route order |
| Oversized payloads | `json-body-limit.test.ts` |
| Pagination / caps | `api-pagination-limits-security.test.ts`; questions route static checks |
| Rate limit primitive | `rate-limit-in-memory.test.ts` |

## Manual / not fully automated

- End-to-end login throttle (40/min IP) and lockout UX across multiple app instances (in-memory limits are per instance).
- Full Stripe webhook route with real `STRIPE_WEBHOOK_SECRET` and replay from Dashboard.
- DB-backed idempotency race (two workers inserting same `evt_` id).
- All admin routes’ RBAC matrix (tier vs path) beyond static samples.
- Every user-owned resource route (progress, sessions, etc.) for IDOR — spot-check high-risk handlers.
- CDN/browser caching of authenticated JSON (`Cache-Control` on premium APIs).
- Lessons/flashcards list caps — align with `LESSON_API_OFFSET_LIMIT` / `FLASHCARD_DECK_PAGE` in code review.

## Related docs

- `docs/security-observability.md` — log scopes, correlation, alerts.
