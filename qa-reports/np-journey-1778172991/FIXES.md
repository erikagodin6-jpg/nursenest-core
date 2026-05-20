# NP learner journey fixes

**Run ID:** `np-journey-1778172991`  
**Date:** 2026-05-07

## Findings fixed

### 1. Signup placeholder copy

- **Root cause:** Signup inputs trusted the marketing translator result directly. If a locale bundle returned humanized missing-key text such as `Placeholder First Name`, the nullish fallback never ran.
- **Fix:** Added `safeSignupFieldCopy` and applied it to first/last name placeholders and accessible labels.
- **Files changed:** `src/components/auth/signup-form.tsx`, `src/lib/marketing/signup-copy.ts`, `src/lib/marketing/signup-copy.test.ts`

### 2. US + NP signup exam dropdown

- **Root cause:** Exam focus options were filtered by country only. The NP role still received mixed RN/PN/Canada entries.
- **Fix:** Made exam focus options country- and role-aware. United States + NP now shows only canonical US NP specialties: FNP, AGPCNP, PMHNP, WHNP, and PNP-PC. Changing country or role reconciles stale selections into the valid option set.
- **Files changed:** `src/components/auth/signup-form.tsx`, `src/lib/marketing/signup-exam-focus-options.ts`, `src/lib/marketing/signup-exam-focus-options.test.ts`

### 3. NP marketing hub document titles

- **Root cause:** `/en/np/{specialty}` is a legacy/default-language NP route shape, while the pathway registry only resolved canonical `/us/np/{specialty}`. Metadata safety fallback could also replace pathway titles with generic site metadata after validation failures.
- **Fix:** Added narrow compatibility resolution for `/en/np/fnp`, `/en/np/agpcnp`, `/en/np/pmhnp`, `/en/np/whnp`, and `/en/np/pnp-pc` to canonical US NP pathways. Added pathway-specific fallback metadata for hub and CAT pages so titles do not collapse to generic site copy.
- **Files changed:** `src/lib/exam-pathways/exam-product-registry.ts`, `src/lib/exam-pathways/exam-product-registry.test.ts`, `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx`, `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx`

### 4. Practice Tests capitalization

- **Root cause:** Several learner practice-test surfaces used sentence case for the product label.
- **Fix:** Standardized visible learner UI labels to `Practice Tests` / `Back to Practice Tests`. URLs remain unchanged.
- **Files changed:** `src/app/(student)/app/(learner)/practice-tests/[id]/results/page.tsx`, `src/app/(student)/app/(learner)/practice-tests/cat-insights/page.tsx`, `src/components/student/practice-test-runner-client.tsx`, `src/components/student/practice-test-results-static.tsx`, `src/components/exam/exam-session-error-boundary.tsx`

### 5. Header Start Free click issue

- **Root cause:** Source review did not find a bad href: all Start Free CTAs use `guestMarketingSignupHref`; `/blog` remains a separate More-menu link.
- **Fix:** Added a lightweight source contract test guarding Start Free against `/blog` href regression. No header layout change was made because the misclick was not reproducible from source inspection.
- **Files changed:** `src/components/layout/site-header-start-free.contract.test.ts`

### 6. Local QA Turnstile blocker

- **Root cause:** Local browser QA can be blocked when a public Turnstile site key is set, even when automation cannot complete the widget.
- **Fix:** Added an explicit local/QA-only bypass:
  - Client gate: `NEXT_PUBLIC_QA_BYPASS_TURNSTILE=1`
  - Server enforcement: `QA_BYPASS_TURNSTILE=1`
  - Both are ignored when `NODE_ENV=production`.
- **Production safety:** Production Turnstile is not weakened; the server bypass returns false in production even if the env var is accidentally present.
- **Files changed:** `src/components/auth/signup-form.tsx`, `src/lib/captcha/verify-turnstile.ts`, `src/lib/captcha/verify-turnstile.test.ts`

## Validation

- `node --import tsx --test src/lib/marketing/signup-copy.test.ts src/lib/marketing/signup-exam-focus-options.test.ts src/lib/captcha/verify-turnstile.test.ts src/lib/exam-pathways/exam-product-registry.test.ts src/components/layout/site-header-start-free.contract.test.ts` — **passed** (`5/5` files).
- `npm run typecheck:critical` — **passed**.
- `npx playwright test tests/e2e/public/np-qa-regression.spec.ts --project=chromium` with `127.0.0.1` — **failed due local dev origin/runtime instability**, not accepted as product failure. First signup assertion saw unhydrated server HTML because Next dev blocked `127.0.0.1` chunk/HMR access from a server advertising `localhost`. The NP title route then returned `ERR_EMPTY_RESPONSE`.
- `BASE_URL=http://localhost:3000 npx playwright test tests/e2e/public/np-qa-regression.spec.ts --project=chromium` — **failed due local browser/server harness**, with Chromium sandbox `sandbox_host_linux.cc:41 shutdown: Operation not permitted` in one run and `page.goto: net::ERR_ABORTED` timeouts in another.

## Skipped authenticated QA

Authenticated learner QA may still require a valid local session or seeded auth state. The Turnstile bypass above allows local automation to complete signup only when explicitly enabled in non-production environments.

## Remaining follow-up

- Browser-reproduce the one-off header misclick if it appears again under a running dev server and captured pointer coordinates.
