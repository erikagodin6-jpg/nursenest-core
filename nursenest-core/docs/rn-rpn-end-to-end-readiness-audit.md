# RN / RPN end-to-end learner readiness audit

**Goal:** Describe what is **in place** for RN (NCLEX-RN) and RPN/PN (Canada REx-PN, US/CA NCLEX-PN) from first visit through paid learner usage, and where **staging/production verification** is still required.

**Constraints (this document):** Read-only audit — no runtime, schema, route, or paywall changes.

**Primary pathway IDs (registry):**

| Learner intent | US | Canada |
| --- | --- | --- |
| RN / NCLEX-RN | `us-rn-nclex-rn` | `ca-rn-nclex-rn` |
| PN / NCLEX-PN | `us-lpn-nclex-pn` | — |
| RPN / REx-PN | — | `ca-rpn-rex-pn` |

**Onboarding mapping** (`src/lib/onboarding/resolve-default-pathway-for-onboarding.ts`):

- Exam goal `rn` → US RN or CA RN pathway.
- Exam goal `rpn` → **US → `us-lpn-nclex-pn`**, **CA → `ca-rpn-rex-pn`** (Canadian “RPN” = REx-PN; US practical nurse = NCLEX-PN).

---

## Readiness source map

Use the right source for the right question. The repo currently exposes **three different lesson/readiness signals**, and they are not interchangeable:

| Question | Authoritative source | Notes |
| --- | --- | --- |
| What does the **public launch gate** think is published right now? | `src/config/pathway-readiness-snapshot.json` and `/admin/country-exam-readiness` | DB-backed / emitted snapshot used by public site gating. |
| How many **versioned lesson bodies** exist in the catalog? | `docs/pathway-lesson-launch-inventory.md` + `../scripts/audit-pathway-lesson-inventory.ts` | Catalog/effective lesson inventory only; useful for authoring backlog, not by itself a public launch signal. |
| Do REx-PN lessons actually resolve on runtime/public surfaces? | `npm run verify:rpn-lessons-visible` | Filesystem + runtime resolver + optional site HTML/direct route verification. |
| Are questions / flashcards / CAT pools actually healthy for launch? | Admin diagnostics and staging/prod checks (`/api/admin/question-bank-coverage`, `/api/admin/exam-coverage-audit`, `/api/flashcards/inventory`, `/api/practice-tests/cat-readiness`) | Runtime truth; required before claiming subscriber readiness. |

This is why `docs/pathway-lesson-launch-inventory.md` may show `61` catalog/effective REx-PN lessons while `src/config/pathway-readiness-snapshot.json` shows `180` lessons for `ca-rpn-rex-pn`. Those counts answer different questions and must be cited with their source.

---

## 1. Anonymous visitor → pathway

**Marketing hubs**

- Default exam hubs follow `buildExamPathwayPath` / registry (`src/lib/exam-pathways/*`).
- Public smoke / production gates hit RN and PN hubs (e.g. `tests/e2e/public/marketing-study-surfaces-production-gate.spec.ts`, `pn-marketing-hub-i18n-sanity.spec.ts` — includes **US RN**, **CA RN**, **US PN**, **CA REx-PN** English hubs for raw i18n sentinel regression).
- CAT marketing entrypoints: `tests/e2e/cat/cat-entrypoints.spec.ts` includes `/us/rn/nclex-rn/cat` and `/canada/pn/rex-pn/cat`; guards wrong US `/us/rpn/rex-pn` links.

**Pricing / CTAs**

- Standard marketing routes (`/pricing`, signup flows) — covered by mobile + smoke suites partially; not pathway-specific in one spec.

**Lesson previews**

- Free tier E2E hits lesson paywall (`tests/e2e/smoke-production/free-user.spec.ts`); paid RN signup flow reaches learner shell (`tests/e2e/rn-student-signup-flow.spec.ts`).

**SEO / canonical**

- Lesson hubs and localized routes have `generateMetadata` patterns (e.g. `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx`).
- Automated: `npm run test:seo-sitemap`, `verify:seo-indexability`, `i18n-route-readiness` for REx-PN paths.

**Mobile**

- `npm run test:e2e:mobile` — marketing + optional paid learner width; `mobile-usability-audit` for public drawers/touch.

---

## 2. Signup / onboarding

**Flow**

- `POST /api/onboarding/complete` sets `examFocus`, `learnerPath`, `targetExamPathwayId`, `onboardingCompletedAt` (`src/app/api/onboarding/complete/route.ts`).
- Client exam selector persists region/locale/profession (`src/components/onboarding/exam-selector.tsx` → `resolveOnboardingRoute`).
- Learner `start-studying` redirects to `/app/onboarding` if incomplete (`src/app/(student)/app/(learner)/start-studying/page.tsx`).

**Tests**

- `tests/e2e/rn-student-signup-flow.spec.ts` — RN goal + “Start studying” through onboarding.
- `tests/e2e/tier-matrix/tier-matrix-signup-multi-tier.spec.ts` — dismisses onboarding with generic selectors.

**Gap (see `rn-rpn-flow-gaps.md`):** No first-class **Canada REx-PN-only** signup E2E mirroring the RN file (coverage gap, not proof of breakage).

---

## 3. Subscription / paywall

**Policy**

- Pathway entitlements ladder: `src/lib/exam-pathways/pathway-entitlements*.ts` + tests (`pathway-entitlements.test.ts`) — RN vs RPN tier/country matrix.

**Automation**

- `npm run verify:no-cross-tier-leakage`, `npm run audit:paywall-security` (unit), tier-matrix Playwright, free-user smoke.

**Staging need:** Stripe webhook edge cases and “subscribed but blocked” false positives require **real** subscription rows — not fully simulatable in static audit.

---

## 4. Learner dashboard

**Implementation**

- Dashboard deferred content in `src/app/(student)/app/(learner)/page.tsx` (pathway context, paywall stats provider).

**Tests**

- Paid mobile layout touches `/app` (`tests/e2e/mobile/mobile-learner-authenticated-layout.spec.ts`).
- No dedicated “RPN dashboard copy” assertion in repo search — **verify** CA RPN user sees correct pathway pill labels in staging.

---

## 5. Lessons

**Hubs / detail**

- Virtualized lists, pathway scoping, paywall on free tier (smoke tests).
- Marketing lesson hub production gate includes `/canada/pn/rex-pn/lessons` with minimum link count.

**Progress / internal links**

- Pathway lesson contracts + `test:pathway-lessons` bundle; internal link validators exist (`validate:internal-links`, audits).

---

## 6. Flashcards

**Pool rules**

- `src/lib/flashcards/flashcard-exam-bank-hub-inventory.ts` — SQL excludes ECG/video/media formats; documented in file header.
- `flashcard-pool-exam-fallback.test.ts` — structural coverage including ECG exclusion.

**Staging need:** **Counts per pathway** (RN vs REx-PN) require DB with populated `ExamQuestion` / flashcard tables — audit cannot assert non-zero pools without data.

---

## 7. CAT exams

**Readiness config**

- `src/lib/exam-pathways/pathway-readiness-config.ts` — `production_ready` CAT for `us-rn-nclex-rn`, `ca-rn-nclex-rn`, `ca-rpn-rex-pn`, `us-lpn-nclex-pn` with min/max items and timers.

**Rationale policy**

- `RationalePanel` modes: `locked` for CAT **test** mode vs `feedback` for study (`src/components/study/cat-rationale-panel.tsx`).
- `PracticeTestRunnerClient` separates `catMode` vs `catFeedbackStudy` and `beforeunload` in exam style (`src/components/student/practice-test-runner-client.tsx`).

**Tests**

- `study-loop-cat-routing.test.ts`, `pathway-cat-flow.test.ts`, paid CAT viewport E2E (`paid-user-cat-focused-viewport.spec.ts`).

---

## 8. Practice exams

- Same runner family as CAT with linear rationale visibility (`linearRationaleVisibility`, `practice-test-runner-client.tsx`).
- Practice hub pages gate by pathway query (`practice-tests/page.tsx`).

**Staging need:** “Same pool as CAT where intended” is a **product** assertion — compare practice test builder config vs CAT blueprint in DB/admin diagnostics (`admin/diagnostics/cat-blueprint-sessions`).

---

## 9. Mobile UX

- Playwright mobile suite + public mobile usability audit (see `docs/mobile-ux-audit.md`).
- **Gap:** Paid mobile tests require credentials; RPN-specific narrow flows not isolated in one spec.

---

## 10. Admin visibility

- **Subscriptions:** `src/app/(admin)/admin/subscriptions/page.tsx` — Stripe row summaries.
- **Users:** `admin/users`, `admin/users/[userId]` — read-only support view with subscription list.
- **CAT pool health:** `admin/diagnostics`, `admin/diagnostics/cat-blueprint-sessions` — pool mapped fraction warnings.

**Gap:** No single “RPN pool deficit alert” named surface — operators use diagnostics pages; document as **process** gap if product wants a dashboard tile.

---

## 11. SEO

- Sitemap / robots / merged route tests (`test:seo-sitemap`, `test:sitemap`).
- i18n route readiness lists REx-PN lesson hub paths (`tests/e2e/i18n/i18n-route-readiness.spec.ts`).

---

## 12. Canada RPN / REx-PN launch signoff sequence

To call the Canada RPN slice truly launch-ready, use one explicit candidate pass and one explicit post-deploy pass.

### Candidate / pre-promote

1. `npm run production:preflight`
2. `npm run verify:do-runtime` (or `npm run release:runtime-checklist` if the human-readable checklist is needed)
3. `npm run qa:release-gate`
4. `npm run verify:rpn-lessons-visible`
5. Confirm the candidate includes all of the following evidence:
   - `/canada/pn/rex-pn` renders and preserves auth callback into a `ca-rpn-rex-pn` learner route
   - paid blocking suite reaches an entitled `ca-rpn-rex-pn` learner lessons surface
   - runtime lesson visibility passes for REx-PN
   - admin/runtime diagnostics show non-zero and launch-acceptable question, flashcard, and CAT pools

### Post-deploy / production

1. `npm run qa:verify:health`
2. `npm run qa:verify:production`
3. `npm run verify:rpn-lessons-visible`
4. Record pass/fail evidence for:
   - public REx-PN hub health
   - paid learner unlock on `ca-rpn-rex-pn`
   - billing route health (portal/cancel smoke remains contract-safe; no destructive Stripe automation on live)
   - runtime content pool visibility

If any item above fails, the slice is not at 100% launch readiness, even if generic RN or homepage checks remain green.

---

## Test commands (quick reference)

| Area | Command |
| --- | --- |
| Pathway lessons | `npm run test:pathway-lessons` |
| Entitlements | (included in pathway / paywall tests) `npm run audit:paywall-security` |
| CAT routing | `node --import tsx --test src/lib/exam-pathways/study-loop-cat-routing.test.ts` (or full unit glob) |
| Flashcard pool | `node --import tsx --test src/lib/flashcards/flashcard-pool-exam-fallback.test.ts` |
| RN signup E2E | `npx playwright test tests/e2e/rn-student-signup-flow.spec.ts` |
| Mobile | `npm run test:e2e:mobile` |
| SEO | `npm run test:seo-sitemap` |

---

## Deliverables

| File | Purpose |
| --- | --- |
| `rn-rpn-flow-gaps.md` | Tabular gaps with severity, revenue impact, AI vs dev. |
| `rn-rpn-implementation-priority-list.md` | Phase 1 ordering for engineering. |
