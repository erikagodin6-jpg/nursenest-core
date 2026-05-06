# RN / RPN end-to-end learner readiness audit (NurseNest)

**Audit type:** Read-only review of routes, onboarding, entitlements, study surfaces, admin tooling, SEO scripts, and automated tests. **No runtime verification** against production/staging data was performed in this pass.

**Primary pathway IDs (registry):**

| Track | US | Canada |
| --- | --- | --- |
| RN NCLEX-RN | `us-rn-nclex-rn` | `ca-rn-nclex-rn` |
| PN / RPN | `us-lpn-nclex-pn` (NCLEX-PN) | `ca-rpn-rex-pn` (REx-PN) |

**Onboarding mapping** (`resolveDefaultPathwayIdForOnboarding`): exam goal `rn` → US/CA RN pathways; `rpn` → **US** `us-lpn-nclex-pn` vs **CA** `ca-rpn-rex-pn`. This is intentional registry wiring but **copy** must clarify US “PN” vs Canadian “RPN”.

---

## 1. Anonymous visitor

- **Home → hub:** Homepage tier cards (`data-nn-home-tier-card`) drive to marketing hubs; tier-matrix E2E covers RN and **CA PN/RPN** hub (`TIER_MATRIX_SIGNUP_ROWS`).
- **Pricing:** Public `/pricing`; learner paywall surfaces use `resolveEntitlementForPage` / subscriber gates.
- **Lesson previews:** Marketing lesson hubs + public lesson surfaces; free learner sees paywall on `/app/lessons` (smoke tests).
- **SEO:** `generateMetadata` on lesson hub routes (`.../lessons/page.tsx`) builds canonical + OG; `npm run test:seo-sitemap`, `verify:seo-indexability`, `verify:sitemap`, `verify:robots` exist.
- **CTAs / mobile nav:** Site header + mobile menu; `npm run test:e2e:mobile`, `tests/e2e/public/mobile-usability-audit.spec.ts`.

---

## 2. Signup / onboarding

- **API:** `POST /api/onboarding/complete` persists `examFocus`, `examDate`, `learnerPath`, `targetExamPathwayId`, `onboardingCompletedAt` using `resolveDefaultPathwayIdForOnboarding`.
- **Routes:** `/app/onboarding` redirects completed users to `/app/start-studying`; dashboard `/app` redirects incomplete users to `/app/onboarding`.
- **Tier-matrix signup:** Covers RN + **CA** PN/RPN hub → signup; requires `QA_SIGNUP_EMAIL_DOMAIN` and Turnstile bypass for full E2E.

---

## 3. Subscription / paywall

- **Core resolver:** `resolveEntitlementForPage` (fail-closed patterns in layout).
- **Automation:** `verify:no-cross-tier-leakage`, `audit:paywall-security`, tier-matrix cross-tier gating specs.
- **Stripe:** Admin subscriptions page and user detail show **masked** Stripe ids — audit only; no Stripe logic changes here.

---

## 4. Learner dashboard

- **Server:** `(learner)/page.tsx` loads entitlement, redirects onboarding, resolves pathway identity.
- **Risk:** DB errors on user fetch are caught and dashboard may render without redirect to onboarding — documented in code path (non-fatal).

---

## 5. Lessons

- **Hubs:** Marketing + app routes scoped by `pathwayId`; internal links via hub builders (`learnerLessonsUrl`, etc.).
- **Progress:** `POST /api/lessons/pathway-progress`, `PathwayLessonProgressTracker` client.
- **Tests:** `test:pathway-lessons`, marketing hub safety tests.

---

## 6. Flashcards

- **Primary DB list:** `GET /api/flashcards` uses `prisma.flashcard` with entitlement `where`.
- **Exam bank augmentation:** `loadExamQuestionRowsForFlashcardPool` excludes ECG/video-unfriendly formats (`FLASHCARD_USABILITY_SQL`); `buildFlashcardCustomSession` can augment from exam bank; `loadLessonLinkedFlashcardVirtuals` builds virtuals from lesson-linked question ids.
- **Core pathway audit list:** `CORE_PATHWAY_AUDIT_ROWS` includes RN + CA RPN + US LPN PN (`ensure-core-pathway-exam-questions.ts`).

---

## 7. CAT exams

- **Rationale UX:** `cat-rationale-panel.tsx` — modes `locked` vs `feedback` (test vs study).
- **Pools:** CAT uses pathway-scoped study pools; `ensure-core-pathway-exam-questions` and CAT-focused E2E (`paid-user-cat-focused-viewport`, cat smoke) when credentials exist.
- **Hub URL:** `/app/practice-tests?cat=1&pathwayId=…` (`learnerCatHubUrl`).

---

## 8. Practice exams

- **Hub:** `/app/practice-tests?pathwayId=…`; legacy alias `/app/practice?…` documented in tier matrix helper.
- **Rationales:** Practice flows differ from CAT test-mode locking — verify with practice E2E + product spec.

---

## 9. Mobile UX

- **Playwright:** `playwright.mobile.config.ts` + `tests/e2e/mobile/*` (overflow, marketing routes, optional paid auth).
- **Public audit:** `mobile-usability-audit.spec.ts` (touch targets, drawers).

---

## 10. Admin visibility

- **User detail:** `loadAdminUserSupportDetail` — subscriptions, exam attempts/sessions (incl. adaptive), practice tests, progress groupBy, flashcard progress/sessions, recent activity tables (`admin/users/[userId]/page.tsx`).
- **Dashboard:** `AdminDashboardOverview` — user counts, active subscribers, question bank by tier.
- **Subscriptions:** `/admin/subscriptions` — recent rows, Stripe price matrix gaps.
- **Gap:** Pathway-specific **empty pool** alerts may require running `audit:exam-bank` / `content:ensure:exam-bank` rather than a single admin widget (see gap list).

---

## 11. SEO

- **Tests:** `npm run test:seo-sitemap`, `test:sitemap`, verify scripts for sitemap/robots/public links.
- **Hreflang / English:** Covered by i18n + SEO tests — any change is **DEVELOPER_ONLY** / copy review.

---

## Evidence commands (for developers)

```bash
cd nursenest-core
npm run verify:no-cross-tier-leakage
npm run test:pathway-lessons
npm run test:seo-sitemap
npm run test:e2e:mobile
# With credentials:
npx playwright test -c playwright.tier-matrix.config.ts
```

See **`reports/rn-rpn-flow-gaps.md`** (package `nursenest-core/reports/`, also copied to repo root `reports/`) and **`reports/rn-rpn-implementation-priority-list.md`** for phased work.
