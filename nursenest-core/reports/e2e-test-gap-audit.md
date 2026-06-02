# E2E test gap audit — NurseNest (audit only)

**Sources:** `tests/e2e/**/*.spec.ts` (~170+ specs), `playwright*.config.ts`, `docs/RELEASE_QA.md`. **No test or production changes.**

**Tags:** `SAFE_FOR_AI` — suitable for automated smoke documentation · `DEV_ONLY` — needs credentials, billing, admin, or opt-in env (not for unattended public automation narratives)

---

## 1. Signup / onboarding

| Coverage present | Key specs / configs |
|------------------|---------------------|
| Signup auto-login smoke | `tests/e2e/smoke/auth-signup-auto-login.spec.ts`, `tests/e2e/auth/signup-auto-login.spec.ts` |
| RN visitor → hub → signup → onboarding | `tests/e2e/rn-student-signup-flow.spec.ts` |
| Tier matrix touches onboarding | `tests/e2e/tier-matrix/tier-matrix-signup-multi-tier.spec.ts` |
| Mobile layout hits `/app/onboarding` | `tests/e2e/mobile/mobile-learner-authenticated-layout.spec.ts` |
| Critical prod guest `/signup` | `tests/e2e/release/critical-production-routes.spec.ts` |

| Gap | Risk | Priority | Tag |
|-----|------|----------|-----|
| **All onboarding exam-goal branches** (RPN, NP, allied) vs RN-only happy path | Wrong default pathway after signup | P1 | SAFE_FOR_AI |
| **Onboarding skip / resume** (partial completion, refresh mid-flow) | Stuck users | P2 | SAFE_FOR_AI |
| **Turnstile-on signup** in CI (doc’d in `stripe-subscriber-journey.spec.ts`) | Signup false negatives | P1 | DEV_ONLY |
| **Smoke-production** suite does **not** include onboarding | Regressions only caught in larger suites | P2 | SAFE_FOR_AI |

---

## 2. Subscription / billing flow

| Coverage present | Notes |
|------------------|-------|
| Pricing UI read-only | `tests/e2e/smoke/smoke-checkout-path.spec.ts` — **no** Stripe session created |
| Release billing read-only | `tests/e2e/release/release-account-billing-smoke.spec.ts` (release gate) |
| Full Stripe hosted checkout | `tests/e2e/paid-user/stripe-subscriber-journey.spec.ts` — **`E2E_STRIPE_CHECKOUT_JOURNEY=1`** opt-in |
| Freemium / paywall contracts | `tests/e2e/auth/freemium-paywall.spec.ts`, `tests/e2e/auth/site-guest-paywall-contract.spec.ts` |
| Tier matrix gating | `tests/e2e/tier-matrix/*.spec.ts` |

| Gap | Risk | Priority | Tag |
|-----|------|----------|-----|
| **Webhook → entitlement** not covered in default CI | Paid access drift after deploy | P0 (manual staging) | DEV_ONLY |
| **Cancel / renew / invoice** UI | Revenue + trust | P2 | DEV_ONLY |
| **Upgrade/downgrade** between tiers in UI | Wrong SKU | P2 | DEV_ONLY |
| **Failed payment / 3DS** paths | Edge cases | P3 | DEV_ONLY |

---

## 3. Lesson hubs (marketing + learner)

| Coverage present | Notes |
|------------------|-------|
| Marketing hub cards / routing | `canada-rn-lessons-hub-cards`, `nursing-lessons-routing`, `nursing-tier-hub-lessons-links`, `lessons-smoke`, `pathway-content-access` |
| Crawl / hub caching | `public-hub-caching`, crawl-health |
| Paid learner lessons hub | `critical-production-routes` paid `/app/lessons`, `paid-user-00-fast-sanity`, `lesson-integrity-paid` |

| Gap | Risk | Priority | Tag |
|-----|------|----------|-----|
| **Allied global hub** `/allied/allied-health/lessons` pagination + filters | SEO + access regression | P1 | SAFE_FOR_AI |
| **NP hub** dense card layout (related lessons) | Layout / perf | P2 | SAFE_FOR_AI |
| **Locale-prefixed hubs** (`/fr/.../lessons`) beyond PN sanity | i18n regressions | P2 | SAFE_FOR_AI |
| **Learner hub** virtual list + search toolbar deep interaction | Large lists | P2 | SAFE_FOR_AI |

---

## 4. Lesson detail (marketing + in-app)

| Coverage present | Notes |
|------------------|-------|
| Guest marketing lesson preview | `critical-production-routes` uses `defaultMarketingLessonPath()` + paywall aside |
| Paywall correctness | `tests/e2e/lessons/lesson-paywall-correctness.spec.ts` |
| Typography / content stability | `lesson-typography-smoke`, `lesson-content-stability` |
| Paid integrity | `lesson-integrity-paid.spec.ts` |
| Mobile lesson flows | `lesson-flows.mobile.spec.ts` |

| Gap | Risk | Priority | Tag |
|-----|------|----------|-----|
| **Subscriber-only supplements** (audio, recall, premium blocks) cross-browser | Premium value | P1 | DEV_ONLY (paid creds) |
| **Legacy slug redirects** on detail | 404 / duplicate content | P2 | SAFE_FOR_AI |
| **In-app** `/app/lessons/[id]` long-form + notes drawer + quiz embed | Core study loop depth | P1 | DEV_ONLY |

---

## 5. Flashcards

| Coverage present | Notes |
|------------------|-------|
| Marketing surface | `tests/e2e/flashcards/flashcards-smoke.spec.ts` (US RN hub entry; comment defers deep paid to paid suite) |
| Critical route paid `/app/flashcards` | `critical-production-routes` |
| Paid inventory / live routes | `flashcards-hub-nclex-inventory`, `flashcards-live-route-tiers` |

| Gap | Risk | Priority | Tag |
|-----|------|----------|-----|
| **Deck study loop** (flip, rate, session complete) in **default** CI | Core product | P1 | DEV_ONLY |
| **Custom deck** create/share | Power users | P3 | DEV_ONLY |
| **Weak queue** integration | Retention | P3 | DEV_ONLY |

---

## 6. CAT (Computerized Adaptive Testing)

| Coverage present | Notes |
|------------------|-------|
| **Release gate** | `paid-user-cat-smoke.spec.ts` — hub → begin → **3 items** |
| Marketing `/practice-exams` | `cat-entrypoints`, `cat-pathway-clarity` |
| Viewport / mode contracts | `cat-exam-mode-contract`, `cat-exam-compact-viewport`, `cat-focused-practice-session-viewport` (env URL), `paid-user-cat-focused-viewport` |

| Gap | Risk | Priority | Tag |
|-----|------|----------|-----|
| **CAT completion → results → study loop CTA** end-to-end | Conversion + trust | P1 | DEV_ONLY |
| **CAT pause / resume / navigator** | Session integrity | P2 | DEV_ONLY |
| **Linear (non-CAT) practice test** full run — submit → results | Majority of exam volume | P0 | DEV_ONLY |
| **CAT insights** page `/app/practice-tests/cat-insights` | History feature | P3 | SAFE_FOR_AI |

---

## 7. Practice exams (marketing vs app)

| Coverage present | Notes |
|------------------|-------|
| Marketing hub + SEO | `seo-surface-audit` includes `/practice-exams`; `learning-routes-live-surfaces` covers `/app/practice-exams` alias → `practice-tests` |
| CAT smoke (subset of “practice exam” product) | See §6 |

| Gap | Risk | Priority | Tag |
|-----|------|----------|-----|
| **Timed linear exam** driver through `practice-test-runner-client` | Largest client surface; highest regression blast radius | P0 | DEV_ONLY |
| **Question bank → launch exam** with real filters | Wrong item pool | P1 | DEV_ONLY |
| **NP / RPN** pathway exam presets | Wrong audience | P2 | DEV_ONLY |

---

## 8. Admin

| Coverage present | Notes |
|------------------|-------|
| Admin shell / access / JWT gate | `admin-dashboard*.spec.ts`, `admin-auth-jwt-gate-regression`, `admin-production-anonymous-redirects` |
| Copy editor safety | `admin-page-copy-editor-safety.spec.ts` |
| Smoke-production admin user | `smoke-production/admin-user.spec.ts` |
| Critical prod `/admin` | `critical-production-routes` |

| Gap | Risk | Priority | Tag |
|-----|------|----------|-----|
| **Blog control panel** (2k+ LOC client) | Staff productivity + content risk | P2 | DEV_ONLY |
| **Pathway lesson admin form** publish flow | Content corruption | P1 | DEV_ONLY |
| **User impersonation / QA view-as** | Safety | P1 | DEV_ONLY |
| **RBAC per route** (not just “can open /admin”) | Authorization holes | P2 | DEV_ONLY |

---

## 9. Mobile routes

| Coverage present | Notes |
|------------------|-------|
| Dedicated suite | `tests/e2e/mobile/*.spec.ts` + `playwright.mobile.config.ts` |
| Paid mobile | `paid-user-mobile.spec.ts` |
| Smoke mobile nav | `smoke-mobile-nav.spec.ts` |
| Public mobile usability | `public/mobile-usability-audit.spec.ts` |

| Gap | Risk | Priority | Tag |
|-----|------|----------|-----|
| **Tablet breakpoints** (iPad) | Layout bugs | P3 | SAFE_FOR_AI |
| **Safe-area / bottom nav** on notched devices | UX | P2 | SAFE_FOR_AI |
| **Mobile + CAT** together (thumb reach) | Drop-off | P2 | DEV_ONLY |

---

## 10. Sitemap / canonical / SEO

| Coverage present | Notes |
|------------------|-------|
| Sitemap caching | `public/sitemap-caching.spec.ts` |
| SEO endpoints | `public/seo-endpoints.spec.ts` |
| SEO surface audit | `seo-surface-audit`, `seo-link-integrity` |
| Localized SEO policy | `seo/localized-seo.spec.ts`, crawl-health `locale-noindex-policy` |

| Gap | Risk | Priority | Tag |
|-----|------|----------|-----|
| **Hreflang / alternate** parity on new marketing templates | International SEO | P2 | SAFE_FOR_AI |
| **Robots** disallow changes | Crawl budget | P2 | SAFE_FOR_AI |
| **Structured data** JSON-LD on lesson/blog | Rich results | P3 | SAFE_FOR_AI |

---

## 11. Localization (i18n)

| Coverage present | Notes |
|------------------|-------|
| Route readiness | `i18n-route-readiness.spec.ts` |
| Localized smoke / auth / homepage | `smoke/localized-*.spec.ts` |
| PN hub sanity | `pn-marketing-hub-i18n-sanity.spec.ts` |
| Visible English heuristic | `visible-english-heuristic.spec.ts` |

| Gap | Risk | Priority | Tag |
|-----|------|----------|-----|
| **ES / FR blog + lesson** content parity | Trust | P2 | SAFE_FOR_AI |
| **RTL** if introduced | Layout break | P3 | SAFE_FOR_AI |

---

## 12. Blogs

| Coverage present | Notes |
|------------------|-------|
| Tag + article routing | `blog-tag-article-routing.spec.ts` |
| Public blog caching | `public-blog-caching.spec.ts` |
| Publication proof | `blog-publication-proof.spec.ts` |

| Gap | Risk | Priority | Tag |
|-----|------|----------|-----|
| **RN lesson-derived blog** pipeline vs marketing lesson | Duplicate / stale URLs | P2 | SAFE_FOR_AI |
| **Admin publish → live** (non-API) | Content ops | P2 | DEV_ONLY |

---

## Summary

The repo has **strong breadth** (public crawl, SEO audits, tier matrix, mobile, CAT entrypoints, release gate). **Deepest gaps** are: **full linear practice test runner**, **Stripe+webhook subscription truth** in CI, **admin beyond shell**, and **smoke-production** omitting onboarding + deep learner loops.

See `high-risk-untested-flows.md` and `recommended-playwright-suite.md` for prioritization and suite design.
