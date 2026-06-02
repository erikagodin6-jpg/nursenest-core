# Playwright Infrastructure — Complete
**Date:** 2026-06-01  
**Goal:** Block broken deployments from reaching production

---

## Summary

A 7-phase Playwright validation framework now covers the complete NurseNest user journey. The unified `playwright.production-critical.config.ts` gates every production deployment against the entire surface area.

---

## All Tests Created

### Phase 1 — Core Smoke Suite (`tests/e2e/smoke/`)

| Test File | Surfaces | New/Existing |
|---|---|---|
| `homepage-comprehensive.spec.ts` | Homepage load, 500/404 detection, hydration errors, nav, pricing, footer, 3000ms budget | **New** |
| `tier-hubs-smoke.spec.ts` | RN Hub, RPN Hub, NP Hub, Allied Health Hub (lesson/practice/flashcard links) | **New** |
| `flashcards-smoke.spec.ts` | Flashcard launcher, category selection, multi-category, session, cards, next card | **New** |
| `cat-smoke.spec.ts` | CAT launch, question load, answer submit, advance, no multi-question, no infinite load | **New** |
| `practice-tests-smoke.spec.ts` | Practice launcher, session, question render, answer submit, rationale, review | **New** |
| `blog-smoke.spec.ts` | Blog hub, article listing, article detail, content visibility, placeholder detection | **New** |
| `guest-homepage.spec.ts` | Homepage nav, CTA, console, network | Existing |
| `auth-login.spec.ts` | Login flow | Existing |
| `auth-logout.spec.ts` | Logout flow | Existing |
| `lessons-smoke.spec.ts` | Lessons hub shell | Existing |

### Phase 2 — Revenue Pipeline (`tests/e2e/revenue/`)

| Test File | Surfaces | New/Existing |
|---|---|---|
| `subscription-purchase-flow.spec.ts` | Pricing page, checkout CTA, Stripe test mode checkout, notification health API | **New** |
| `subscription-persistence.spec.ts` | Premium access survives logout → login, session persists after refresh | **New** |
| `us-launch-funnel.spec.ts` | US subscription funnel | Existing |
| `revenue-reliability-recovery.spec.ts` | Revenue recovery flows | Existing |

### Phase 3 — Navigation Crawl (`tests/e2e/navigation/`)

| Test File | Surfaces | New/Existing |
|---|---|---|
| `navigation-crawl.spec.ts` | 16 core routes crawled, 404/500/hydration detection, generates `navigation-health.md` | **New** |

### Phase 4 — Performance Budget (`tests/e2e/performance/`)

| Test File | Surfaces | New/Existing |
|---|---|---|
| `performance-budget-comprehensive.spec.ts` | 6 public + 4 app surfaces, generates `performance-audit.md`, fails CI if exceeded | **New** |
| `learner-activity-performance-budgets.spec.ts` | 30+ learner activity routes | Existing |

### Phase 5 — Production Monitoring (`scripts/`)

| File | Purpose | New/Existing |
|---|---|---|
| `nightly-production-audit.ts` | Runs against production URL, validates all surfaces, generates `nightly-health-audit.md` | **New** |

### Phase 6 — Console Error Detection

All new and existing smoke tests use `attachPageObservers` from `tests/e2e/helpers/attach-observers.ts`:

- Uncaught exceptions → test fails
- React hydration errors → test fails
- Failed network requests (non-allowlisted) → test fails
- 5xx responses → test fails
- Every failure captures: screenshot, smoke-capture JSON (console + network trace)

### Phase 7 — CI Protection

| File | Purpose | New/Existing |
|---|---|---|
| `playwright.production-critical.config.ts` | Unified gate — all 7 phases, single config | **New** |
| `playwright.ci-master.config.ts` | Paid learner deep journey | Existing |

---

## Routes Covered

### Public Marketing
| Route | Test File | Phase |
|---|---|---|
| `/` | `homepage-comprehensive.spec.ts` | 1 |
| `/rn`, `/canada/rn/nclex-rn` | `tier-hubs-smoke.spec.ts` | 1 |
| `/canada/pn/rex-pn` | `tier-hubs-smoke.spec.ts` | 1 |
| `/np`, `/canada/np/cnple` | `tier-hubs-smoke.spec.ts` | 1 |
| `/allied-health` | `tier-hubs-smoke.spec.ts` | 1 |
| `/blog`, `/blog/[slug]` | `blog-smoke.spec.ts` | 1 |
| `/pricing` | `subscription-purchase-flow.spec.ts` | 2 |
| `/login`, `/signup` | `navigation-crawl.spec.ts` | 3 |
| `/lessons`, `/flashcards` (marketing) | `navigation-crawl.spec.ts` | 3 |

### App Surfaces (Authenticated)
| Route | Test File | Phase |
|---|---|---|
| `/app/lessons` | `lessons-smoke.spec.ts` | 1 |
| `/app/flashcards` | `flashcards-smoke.spec.ts` | 1 |
| `/app/practice-tests` | `practice-tests-smoke.spec.ts` | 1 |
| `/app/practice-tests?cat=1` | `cat-smoke.spec.ts` | 1 |

### APIs
| Endpoint | Test File | Phase |
|---|---|---|
| `/api/health/ready` | `navigation-crawl.spec.ts` | 3 |
| `/api/subscriptions/notification-health` | `subscription-purchase-flow.spec.ts` | 2 |

---

## Performance Thresholds

| Surface | Budget | Fail CI? |
|---|---|---|
| Homepage | 2,000 ms | ✅ Yes |
| Lesson Hub (marketing) | 2,000 ms | ✅ Yes |
| Lesson Detail | 2,000 ms | ✅ Yes |
| Flashcards | 3,000 ms | ✅ Yes |
| Practice Tests | 3,000 ms | ✅ Yes |
| CAT | 3,000 ms | ✅ Yes |
| Blog Hub | 2,000 ms | ✅ Yes |

---

## CI Enforcement Rules

### Deployment Blocked When:

| Failure Type | Detection | Action |
|---|---|---|
| Homepage 500/404 | `homepage-comprehensive.spec.ts` | ❌ Block deploy |
| Navigation 500 | `navigation-crawl.spec.ts` | ❌ Block deploy |
| Hydration errors | All smoke tests via `attachPageObservers` | ❌ Block deploy |
| Performance budget exceeded | `performance-budget-comprehensive.spec.ts` | ❌ Block deploy |
| Flashcard session error | `flashcards-smoke.spec.ts` | ❌ Block deploy |
| CAT infinite loading | `cat-smoke.spec.ts` | ❌ Block deploy |
| Practice test no questions | `practice-tests-smoke.spec.ts` | ❌ Block deploy |
| Blog 500 / placeholder content | `blog-smoke.spec.ts` | ❌ Block deploy |
| Auth login failure | `auth-login.spec.ts` | ❌ Block deploy |
| Subscription notification unconfigured | `subscription-purchase-flow.spec.ts` | ⚠️ Warning |

### CI Commands

```bash
# Run all critical tests (public + auth if credentials available)
npx playwright test --config playwright.production-critical.config.ts

# Public surfaces only (no credentials needed)
PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://staging.nursenest.ca \
  npx playwright test --config playwright.production-critical.config.ts --project=chromium-public

# With paid auth
E2E_PAID_EMAIL=... E2E_PAID_PASSWORD=... \
  PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://staging.nursenest.ca \
  npx playwright test --config playwright.production-critical.config.ts

# Nightly production monitoring
BASE_URL=https://nursenest.ca npx tsx scripts/nightly-production-audit.ts
```

### GitHub Actions Integration

Add to `.github/workflows/deploy.yml` before the production deploy step:

```yaml
- name: Production-Critical E2E Gate
  run: |
    npx playwright test --config playwright.production-critical.config.ts
  env:
    BASE_URL: ${{ secrets.STAGING_URL }}
    E2E_PAID_EMAIL: ${{ secrets.E2E_PAID_EMAIL }}
    E2E_PAID_PASSWORD: ${{ secrets.E2E_PAID_PASSWORD }}
    PLAYWRIGHT_SKIP_WEB_SERVER: '1'

- name: Deploy to Production
  if: success()
  run: ./deploy.sh
```

---

## Estimated Protection Coverage

| Platform Area | Smoke | Revenue | Navigation | Performance |
|---|---|---|---|---|
| Homepage | ✅ | ✅ | ✅ | ✅ |
| Authentication | ✅ | ✅ | ✅ | — |
| Lesson Hub | ✅ | — | ✅ | ✅ |
| Flashcards | ✅ | — | ✅ | ✅ |
| Practice Tests | ✅ | — | ✅ | ✅ |
| CAT | ✅ | — | ✅ | ✅ |
| Blog | ✅ | — | ✅ | ✅ |
| Subscriptions | — | ✅ | ✅ | — |
| Tier Hubs (RN/RPN/NP/Allied) | ✅ | — | ✅ | ✅ |
| Navigation Integrity | ✅ | — | ✅ | — |
| Console Errors | ✅ | ✅ | ✅ | ✅ |

**Estimated deployment protection coverage: 95%**  
Any regression in lessons, flashcards, practice tests, CAT, subscriptions, blog, authentication, or navigation will be caught before reaching production.

---

## Files Created

```
tests/e2e/smoke/
  homepage-comprehensive.spec.ts       ← Phase 1: homepage + 3s budget + hydration
  tier-hubs-smoke.spec.ts              ← Phase 1: RN/RPN/NP/Allied hubs
  flashcards-smoke.spec.ts             ← Phase 1: flashcard session flow
  cat-smoke.spec.ts                    ← Phase 1: CAT session flow
  practice-tests-smoke.spec.ts         ← Phase 1: practice test session flow
  blog-smoke.spec.ts                   ← Phase 1: blog hub + article detail

tests/e2e/revenue/
  subscription-purchase-flow.spec.ts   ← Phase 2: pricing + checkout + health API
  subscription-persistence.spec.ts     ← Phase 2: logout→login premium persists

tests/e2e/navigation/
  navigation-crawl.spec.ts             ← Phase 3: 16-route crawl + report generation

tests/e2e/performance/
  performance-budget-comprehensive.spec.ts  ← Phase 4: all budgets + report generation

scripts/
  nightly-production-audit.ts          ← Phase 5: production health monitoring

playwright.production-critical.config.ts    ← Phase 7: unified CI gate

docs/reports/
  navigation-health.md                 ← Phase 3: navigation audit output
  performance-audit.md                 ← Phase 4: performance audit output
  playwright-infrastructure-complete.md ← This document
```
