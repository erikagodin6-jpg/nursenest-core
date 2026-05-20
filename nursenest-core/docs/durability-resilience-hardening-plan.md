# NurseNest durability, resilience, and performance hardening

**Status:** Planning document — conservative “hardening pass,” not a product redesign.  
**Scope:** Improve stability, speed, and operability **without** changing user-visible auth, admin access, paid gating, or working subscriber flows.

---

## Principles (non-negotiable)

- **Do not** weaken server-side entitlement checks (`resolveEntitlementForPage`, `getUserAccess`, paywall components, staff session helpers).
- **Do not** change JWT/session contracts, cookie settings, or NextAuth `basePath` without a backward-compatible rollout and tests.
- **Do not** introduce caches that substitute for Postgres for **access decisions** (auth, subscription status, role).
- **Do not** split databases or introduce microservices for this pass.
- Prefer: **indexes**, **query shape** (`select`), **timeouts**, **graceful degradation of non-core panels**, **observability**, **background/async** for non-critical work.

---

## 1. “Do no harm” audit — risk tiers

| Tier | Meaning | Examples in this repo | Action this pass |
|------|---------|-------------------------|------------------|
| **Tier 1** | Safe, internal-only, backward-compatible | Add missing **read** indexes (verified by `EXPLAIN`); narrow Prisma `select` on hot paths; **graceful try/catch** around optional dashboard widgets with fallback UI; extend **structured logs** (no PII) for slow routes | Implement **only** after baseline tests green; one change class per PR |
| **Tier 2** | Safe behind **feature flag** or env gate | Experimental **ISR** / `unstable_cache` for **public** lesson metadata; optional **query timeout** env for reporting routes; **sampled** performance logging | Ship flag **default off** or match current behavior |
| **Tier 3** | Could affect login, admin, or paid access | Auth provider changes; middleware matcher changes; subscription schema changes; **caching entitlement results** in Redis without invalidation; cookie/session renames; broad refactors of `src/lib/auth.ts` or `src/lib/entitlements/*` | **Defer** — not in this pass |

---

## 2. Critical paths inventory (protect first)

### Authentication & session

| Area | Routes / entrypoints | Key code |
|------|----------------------|----------|
| Login UI | `/login` | `src/components/auth/login-form.tsx`, marketing layouts |
| Auth API | `/api/auth/*` | NextAuth handler + `PINNED_AUTH_BASE_PATH` — `src/lib/auth.ts`, `src/lib/auth-middleware.ts`, `src/lib/auth-callbacks.ts` |
| Session sync (if used) | `/api/auth/sync-session` | `src/app/api/auth/sync-session/route.ts` |
| Edge / proxy | All matched paths | `src/proxy.ts` (guest `/app/lessons` → `/lessons`, JWT check, `middlewareAuth`) |

**Rules:** No behavior change to `authorized()`, `authCallbacks`, or credential `authorize()` without tests and rollback.

### Admin

| Area | Routes | Key code |
|------|--------|----------|
| Admin UI | `/admin`, `/api/admin/*` | `src/lib/auth/staff-roles.ts`, `getStaffSession`, admin layouts and API routes |
| Admin headers | `x-nn-admin-path` | Set in `src/proxy.ts` for `/admin` and `/api/admin` |

### Entitlements & billing (subscriber)

| Concern | Loaders / surfaces |
|---------|-------------------|
| Core entitlement | `src/lib/entitlements/resolve-entitlement.ts`, `resolveEntitlementForPage`, `src/lib/entitlements/get-user-access.ts` |
| Learner shell | `src/app/(student)/app/(learner)/layout.tsx` |
| Paywall UI | `src/components/student/subscription-paywall.tsx` (and call sites) |
| Billing / account | `src/lib/learner/load-billing-page-payload.ts`, `src/app/(student)/app/(learner)/account/*` |

### Core learner surfaces (must stay up under partial failure)

| Surface | Typical routes | Notes |
|---------|----------------|-------|
| Dashboard | `/app` | `src/app/(student)/app/(learner)/page.tsx` — avoid blocking on non-critical data |
| Lessons | `/app/lessons`, `/app/lessons/[id]` | Heavy DB; prioritize pagination + indexes (Tier 1) |
| Questions / bank | `/app/questions` | Same |
| Flashcards | `/app/flashcards`, `/app/flashcards/[deckRef]` | Same |
| CAT / practice | `/app/practice-tests/*` | Same |
| Onboarding gate | `/app/onboarding` | **Do not** remove server checks; QA/test accounts use `scripts/qa-paid-test-account-reset.mts` |

---

## 3. Tests — baseline before/after (proof of no regression)

Run against **`BASE_URL`** (staging or production) with appropriate credentials — **do not** weaken assertions.

| Concern | Existing harness (examples) |
|---------|----------------------------|
| User login | `tests/e2e/paid-user/paid-user-login-flow.spec.ts`, `tests/e2e/auth/auth-audit.spec.ts` |
| Paid subscriber + shell | `tests/e2e/setup/auth.setup.ts` + `tests/e2e/paid-user/paid-user-smoke.spec.ts`, `paid-subscriber-audit.spec.ts` |
| Lessons / CAT / flashcards / nav | `tests/e2e/paid-user/paid-user-journey.spec.ts`, `paid-user-cat-smoke.spec.ts`, `tests/e2e/flashcards/flashcards-smoke.spec.ts`, `tests/e2e/lessons/lesson-flows.spec.ts` |
| API health | `tests/e2e/paid-user/paid-user-api-health.spec.ts`, `tests/e2e/public/pre-deploy-regression.spec.ts` |
| Entitlements | `tests/e2e/paid-user/paid-user-entitlements.spec.ts` |

**Minimum baseline command (paid project):**

```bash
cd nursenest-core
npx playwright test --project=setup-paid-auth --project=chromium-paid
```

**Recommendation:** Add/keep a **CI job** that runs this on deploy candidates; gate production promote on green + `/api/health` + `/api/health/ready`.

---

## 4. Database durability (single Postgres — behavior-neutral)

**Allowed (Tier 1):**

- Add **indexes** only after verifying with `EXPLAIN (ANALYZE, BUFFERS)` on production-like data; prefer concurrent index creation in maintenance windows.
- Replace `findMany` without `take` on learner lists with **bounded** queries (already partially enforced by lesson library rules — see `.cursor/rules/rn-lesson-library-safety.mdc`).
- Use explicit `select` on `User`, `Subscription`, and hot junction tables in loaders to reduce payload and memory.

**Forbidden this pass:**

- Breaking renames, dropping columns used by auth/JWT/session hydration, or migrations that require **downtime** without a rollout plan.

**Hot paths to profile first (read-heavy):**

- `User` by `id` / `email` (login, session hydration)
- `Subscription` by `userId` (entitlements)
- `PathwayLesson` / `contentItem` lists for `/app/lessons`
- Question bank queries for `/app/questions`
- Flashcard deck queries for `/app/flashcards`

---

## 5. Separate critical vs non-critical work

**Critical path (must not block HTML for core study):** auth resolution, entitlement boolean, main lesson/question/flashcard body, primary nav.

**Non-critical (should not block page shell):** analytics pings, recommendations, secondary dashboard tiles, non-essential personalization, heavy aggregates.

**Pattern:** Load non-critical blocks via **separate React suspense boundaries** or **client fetch** with error boundaries; on failure, **omit widget** — never fail the whole route. Audit `src/app/(student)/app/(learner)/page.tsx` and dashboard components for `await` chains that can be split.

---

## 6. Caching — safe rules

| Data | OK to cache? | Pattern |
|------|----------------|--------|
| Auth / session | **No** edge cache of “is subscriber” as sole source of truth | Always verify in DB or signed JWT fields already in token |
| Public lesson **metadata** (title, slug) | Yes, short TTL + tag invalidation | Next.js cache / CDN — **not** a substitute for entitlement check on the page |
| User-specific progress | Only with **short TTL** or **explicit invalidation** on write | Avoid stale “locked” states |
| Admin permissions | **No** coarse cache that could elevate or drop roles | DB + `getStaffSession` |

---

## 7. API resilience

For **core** route handlers under `/api` that learner flows depend on:

- Use **bounded timeouts** on DB calls (Prisma `$queryRaw` with statement timeout at DB session level, or app-level `Promise.race` with care).
- Return **structured JSON errors** (no stack traces to client); log server-side with `safeServerLog` / Sentry.
- **Never** map entitlement failure to **500** if the correct response is **402/403** with existing paywall UI — preserve semantics.

---

## 8. Deploy and migration safety (existing + verify)

Already present:

- **Liveness:** `GET /api/health` — no DB (`src/app/api/health/route.ts`).
- **Readiness:** `GET /api/health/ready` — `checkDatabaseReadiness` (`src/app/api/health/ready/route.ts`, `src/lib/db/prisma-readiness.ts`).

**Checklist before promote:**

1. `GET /api/health` → 200  
2. `GET /api/health/ready` → 200 (DB reachable)  
3. `npx prisma migrate deploy` (CI/staging first)  
4. Run Playwright paid smoke (above) on staging  
5. Smoke: login, one lesson, one question bank entry, flashcards hub (manual or automated)

---

## 9. Observability (outages and slow paths)

**Already:** `safeServerLog`, Sentry (`@sentry/nextjs`), auth incident logging in `src/lib/auth.ts` (`logAuthIncidentLine`).

**Tier 1 additions (safe):**

- Consistent **`subsystem`** / **`route`** fields on logs for: login failures, entitlement denials, `/api/health/ready` failures, slow queries (> e.g. 1s) on known routes.
- **Do not** log passwords, full session tokens, or raw PII.

---

## 10. Remove / simplify (only low-value risk)

Candidates **after** measurement:

- Duplicate fetches in a single request pipeline (merge loaders).
- Redundant client `useEffect` session refetch storms — reduce to one canonical pattern (careful, Tier 2).
- **Do not** remove paywall components, entitlement imports, or admin guards.

---

## 11. Partial degradation (design intent)

If subsystem A fails:

| Failure | Required behavior |
|---------|-------------------|
| Recommendations API | Show static or empty state; **dashboard still loads** |
| Analytics | **No** blocking `await` on learner shell |
| i18n missing key | Fallback copy (already partially handled in `src/lib/marketing-i18n-core.ts`); **no** auth side effect |
| Secondary DB read (e.g. optional snapshot) | Time out → hide card |

Paid user must **always** be able to: sign in, open lessons, practice, flashcards — subject to real entitlement rules.

---

## 12. Change template (per PR)

For each change, document:

| Field | Content |
|-------|---------|
| **What** | Files touched, behavior |
| **Why safe** | No auth/entitlement semantics change; or flag off |
| **User-visible** | “No change” or “faster load / fewer errors in edge case X” |
| **Tests** | Playwright projects + manual checklist row |
| **Rollback** | Revert commit; disable env flag; drop index concurrently if DB |

---

## Validation matrix (required before “pass complete”)

| Check | Method |
|-------|--------|
| User login | Playwright login flow + manual `/login` |
| Admin login | Manual / dedicated admin smoke (staging) |
| Paid subscriber access | `setup-paid-auth` + paid smoke / audit |
| Lessons | Lesson E2E + paid journey |
| CAT/practice | `paid-user-cat-smoke` / journey specs |
| Flashcards | `flashcards-smoke` + paid specs |
| Account/billing | Paid audit account sections + manual billing |
| No surprise redirects | Compare pre/post onboarding URLs for test accounts |
| Error rates | Sentry / logs for 401/403/5xx on `/app/*` post-deploy |

---

## Suggested execution order (conservative)

1. **Freeze baseline:** Run Playwright paid + health checks; save results.  
2. **Tier 1 only:** Indexes + `select` narrowing + non-critical suspense — **one vertical slice per PR**.  
3. **Re-run** full validation matrix after each merge.  
4. **Tier 2:** Feature-flagged improvements with default = current behavior.  
5. **Tier 3:** Backlog with explicit risk review.

---

## Files likely touched in future Tier 1 PRs (not exhaustive)

- `src/lib/entitlements/get-user-access.ts`, `resolve-entitlement.ts` — read optimization only  
- `src/app/(student)/app/(learner)/page.tsx`, `lessons/page.tsx`, `questions/page.tsx`, `flashcards/*` — loader splitting / selects  
- `prisma/migrations/*` — **new indexes only** with reviewed SQL  
- `src/lib/observability/safe-server-log.ts` — structured fields  
- `tests/e2e/**` — extend coverage, not weaken  

**Explicitly avoid in Tier 1:** `src/lib/auth.ts` (credentials authorize), `src/lib/auth-middleware.ts` `authorized()`, `src/proxy.ts` redirect semantics, cookie options in auth config.

---

*This document is the deliverable for the planning phase. Implementation should proceed as small, reviewed PRs following the tier and validation rules above.*
