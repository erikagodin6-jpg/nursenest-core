# High-risk untested (or thinly tested) flows — NurseNest (audit only)

**Definition:** User-visible flows where **revenue**, **safety**, **data integrity**, or **SEO** are at stake but **default CI / smoke-production** does not fully exercise the behavior.

**Tags:** `SAFE_FOR_AI` | `DEV_ONLY` (per user request)

---

## Tier A — Highest risk / thinnest default automation

| Route / flow | Risk level | Missing coverage | Test priority | Tag |
|--------------|------------|------------------|---------------|-----|
| **`/app/practice-tests/[id]`** linear exam (timer, navigation, submit, results, rationales) | **Critical** | Release gate covers **CAT** hub + 3 items only; no standard **linear** session E2E in gate | **P0** | DEV_ONLY |
| **Stripe Checkout → webhook → entitlement unlock** | **Critical** | `stripe-subscriber-journey.spec.ts` exists but **opt-in** (`E2E_STRIPE_CHECKOUT_JOURNEY=1`); default CI does not prove paid state from payment | **P0** (staging manual or opt-in job) | DEV_ONLY |
| **`/app/question-bank` → session** (large `question-bank-practice-client`) | **High** | API health + navigation specs exist; **full** interactive session not in `qa:release-gate` | **P1** | DEV_ONLY |
| **Admin: lesson publish / blog batch** | **High** | Shell tests exist; **heavy** editors mostly untested in E2E | **P1** | DEV_ONLY |

---

## Tier B — High risk / partial coverage

| Route / flow | Risk level | Missing coverage | Test priority | Tag |
|--------------|------------|------------------|---------------|-----|
| **Onboarding** non-RN paths (RPN, NP, allied goals) | High | `rn-student-signup-flow` + tier matrix sample; not exhaustive per pathway | **P1** | SAFE_FOR_AI |
| **Marketing lesson detail** premium edge cases (logged-in subscriber on marketing URL) | Medium–High | Paywall specs exist; **cross-context** (marketing URL + subscriber cookie) thinner | **P2** | DEV_ONLY |
| **`/app/lessons/[id]`** in-app deep (notes drawer, quiz embed, supplements) | High | Integrity / typography specs; not full interaction matrix | **P1** | DEV_ONLY |
| **Flashcards study loop** (not just hub load) | Medium | `flashcards-smoke` is marketing; deck study in paid suite but not release gate | **P1** | DEV_ONLY |
| **CAT completion** (results, coach, study-next) | Medium | Smoke stops after 3 questions | **P2** | DEV_ONLY |
| **Allied lesson hub** `/allied/allied-health/lessons` | Medium (IA shift) | Public crawl may touch; **dedicated** hub regression lighter than RN | **P2** | SAFE_FOR_AI |

---

## Tier C — Medium risk / coverage exists but flaky or env-heavy

| Route / flow | Risk level | Missing coverage | Test priority | Tag |
|--------------|------------|------------------|---------------|-----|
| **`/pricing`** real checkout click in CI | Medium | `smoke-checkout-path` explicitly read-only | **P2** | DEV_ONLY |
| **`/app/account/billing`** invoice list | Medium | `release-account-billing-smoke` read-only | **P3** | DEV_ONLY |
| **OSCE / clinical scenarios** monetization | Medium | Dedicated specs exist but not in release gate | **P2** | DEV_ONLY |
| **ECG video quiz** | Medium | `ecg-video-quiz.spec.ts` present; confirm in CI matrix | **P3** | SAFE_FOR_AI |

---

## Tier D — SEO / crawl (automated but not “user journey”)

| Route / flow | Risk level | Missing coverage | Test priority | Tag |
|--------------|------------|------------------|---------------|-----|
| **New marketing routes** before added to crawl seeds | Medium | Crawl uses seed lists — **gap** until seeds updated | **P2** | SAFE_FOR_AI |
| **Canonical drift** on programmatic pages | Medium | Audits exist; **per-template** regression thin | **P3** | SAFE_FOR_AI |

---

## Release gate explicit scope (for comparison)

Per `docs/RELEASE_QA.md` + `playwright.release-gate.config.ts`, **blocking** Playwright files are:

- `release-health-apis`, `healthz-liveness-burst`
- `setup/auth` (paid storage state)
- `paid-user-00-fast-sanity`, `paid-user-entitlements`, `paid-user-api-health`, **`paid-user-cat-smoke`**
- `release-account-billing-smoke`

**Not in gate:** linear practice test runner, Stripe journey (default), deep admin, full onboarding matrix, most mobile projects (separate config).

---

## Recommended immediate human QA (production candidate)

1. **Linear practice test:** start → answer → pause → resume → submit → results.  
2. **Subscriber-only lesson body** on marketing + in-app.  
3. **Stripe path** on staging with webhook forwarding (or opt-in journey).  
4. **Allied hub** first page + pagination + one lesson detail.

Tag all four as **DEV_ONLY** when documenting in runbooks (credentials / payment / prod-like data).
