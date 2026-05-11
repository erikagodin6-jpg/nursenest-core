# HESI A2 & ATI TEAS expansion — architecture & readiness (Phase 1)

**Status:** Internal planning + scaffolding only. No public rollout, nav, sitemap, billing, or marketing launch.

**Last updated:** 2026-05-10

---

## Executive summary

NurseNest already has a **config-first exam pathway model** (`ExamPathwayDefinition`, `EXAM_PATHWAYS`, `buildExamPathwayPath`, entitlements by `TierCode` + country + `User.learnerPath`). HESI A2, HESI Exit, and ATI TEAS extend this model as **US allied-track pathways** with `ExamFamily.GENERIC`, `TierCode.PRE_NURSING` for Phase 1 scaffolding, and `status: "hidden"` until product approves public surfaces.

Internal QA uses server-only flag `NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS=1` plus `resolveExamPathwaySafe` so `/us/allied/hesi-a2` (and siblings) resolve **without** appearing in public pathway lists or sitemaps.

---

## Phase 1 — Readiness audit

### 1. Tier / pathway registry compatibility

**Reusable:** `ExamPathwayDefinition`, `exam-pathways-catalog.ts`, `exam-product-registry.ts`, `pathway-entitlements.ts` (hidden excluded from subscriber lists).

**Gaps:** No Prisma `ExamFamily.ADMISSIONS` today — use `GENERIC` until schema/product requests otherwise. Future admissions SKU may need `TierCode` or feature flags (Phase 4).

**Conflicts:** Disambiguate with `pathway.id` + `User.learnerPath`, not tier alone (same pattern as NP specialties).

### 2. CAT / practice compatibility

**Reusable:** `cat-eligibility.ts`, `pathway-readiness-config.ts`, pathway question bank snapshots.

**Gaps:** Start with empty `contentExamKeys`; tag `exam_questions.exam` before CAT/marketing pools are meaningful. Keep CAT off or `mini_adaptive` until pools exist.

### 3. Analytics / report-card reuse

**Reusable:** Dashboard readiness surfaces, pathway-scoped telemetry, adaptive study loops.

**Gaps:** Admissions predictors are not first-class — key analytics by `pathway.id` rather than a parallel stack.

### 4. Lesson / flashcard infrastructure

**Reusable:** `PathwayLesson`, DB-first marketing loaders, category-first hubs, pre-nursing `PRE_NURSING` patterns.

**Gaps:** Map HESI/TEAS taxonomies to lesson categories with pagination and bounded payloads (`rn-lesson-library-safety.mdc`).

### 5. Premium entitlement architecture

**Reusable:** `resolveEntitlementForPage`, Stripe tier ladder, staff bypass.

**Gaps:** Server-side gates for premium admissions features — never client-only CAT/bank checks.

### 6. SEO / public marketing architecture

**Reusable:** `listPublishedExamPathwaysForPublicSite`, `collectExamPathwayUrls`, hidden pathways excluded from marketing resolution.

**Safeguards:** Hub metadata uses `marketingRobotsForExamPathway` → **noindex** for hidden pathways. Production must leave `NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS` unset.

**Follow-up:** Apply robots helper to lessons/questions/cat metadata before public launch.

### 7. Visual / theme architecture

**Reusable:** Theme tokens, semantic status tokens, learner shells.

**Notes:** Internal scaffold uses token-based styling only.

### 8. NGN / case-study compatibility

**Reusable:** Engine is pathway-agnostic; content scoping drives usage.

**Gaps:** Admissions may start MCQ-heavy; premium NGN/case studies later.

### 9. Study-plan / progress infrastructure

**Reusable:** Structured study paths, dashboard continuation, pre-nursing study-plan routes.

**Gaps:** Admissions pacing templates need product + Figma.

### 10. Allied / admissions routing compatibility

**Reusable:** Standard `/{country}/{role}/{exam}` via `buildExamPathwayPath`; distinct from global `allied-health` hub shortcut.

**Implemented:** Hidden pathways `us-allied-hesi-a2`, `us-allied-hesi-exit`, `us-allied-ati-teas`.

### Recommended later phases

1. Content tagging (`contentExamKeys`, lessons, flashcards).
2. Free funnel (lessons, mini-quizzes, core flashcards).
3. Premium (CAT, analytics, remediation, simulations) behind entitlements.
4. Public launch: status flip, `PATHWAY_LAUNCH_APPROVED`, nav/sitemap, indexing policy.

---

## Phase 2 — Internal pathway registration (implemented)

| Registry id | Route | Exam key |
|-------------|-------|----------|
| `us-allied-hesi-a2` | `/us/allied/hesi-a2` | `HESI_A2` |
| `us-allied-hesi-exit` | `/us/allied/hesi-exit` | `HESI_EXIT` |
| `us-allied-ati-teas` | `/us/allied/ati-teas` | `ATI_TEAS` |

- Flag: `NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS=1` (server only).
- Hub: `InternalAdmissionsPrepHubScaffold` (no `buildNursingTierHubContent` / NCLEX fallback).

---

## Phase 3 — Content structure planning

**HESI A2:** anatomy & physiology, vocabulary, grammar, reading comprehension, chemistry, biology, math, critical thinking.

**ATI TEAS:** reading, math, science, English/language usage.

**HESI Exit:** med-surg, pharmacology, pediatrics, OB, mental health, leadership, prioritization/delegation.

**Strategies:** lesson mapping by topicSlug clusters; flashcard decks per subdomain; practice pools via `exam` column tags; CAT when pools meet thresholds; remediation via weak-area signals.

---

## Phase 4 — Free vs premium (design)

**Free:** lessons, mini quizzes, foundational flashcards, intro study tools.

**Premium:** CAT/adaptive, analytics, readiness prediction, timed simulations, full banks, remediation engine, advanced cases, admissions predictor, extended progress.

**Rules:** No surprise mid-subscription upsells; align with RN entitlement patterns.

---

## Phase 5 — Figma-first planning

Frames (desktop + mobile; Ocean, Blossom, Midnight, Sunset, Aurora): public hubs, dashboards, admissions analytics, readiness prediction, study plans, remediation, timed exams.

Preserve premium NurseNest language (`docs/governance/figma-premium-ui-mandatory-process.md`).

---

## Phase 6 — QA governance prep

Contract tests + `tests/e2e/admissions/admissions-prep-governance.placeholder.spec.ts` (skipped). Future: Playwright, visual regression, mobile overflow, entitlement matrix, CAT compatibility.

---

## Phase 7 — Safety checklist

| Risk | Mitigation |
|------|------------|
| Public exposure | `hidden`; flag off in prod |
| SEO | noindex on hub; sitemap uses published pathways only |
| RN flows | existing pathways unchanged |
| Billing | untouched in Phase 1 |

**Verify:** `npm run typecheck:critical`, `npm run test:homepage`, `npm run sitemap:validate`

**Contracts:** `tests/contracts/admissions-prep-internal-pathways.contract.test.ts`, `resolve-exam-pathway-safe.admissions.contract.test.ts`

---

## References

- `src/lib/exam-pathways/exam-pathways-data-segment-f-internal-admissions.ts`
- `src/lib/exam-pathways/admissions-prep-internal-pathways.ts`
- `src/lib/exam-pathways/resolve-exam-pathway-safe.ts`
- `src/components/marketing/internal-admissions-prep-hub-scaffold.tsx`
- `docs/exam-product-architecture.md`

---

## Phase 2 implementation evidence (2026-05-11)

### Verified behavior

| Check | Evidence |
|-------|----------|
| Flag off → routes do not resolve | `resolveExamPathwaySafe` returns null; contract tests in `resolve-exam-pathway-safe.admissions.contract.test.ts` and `admissions-prep-phase2.contract.test.ts` |
| Flag on → internal scaffold | Same resolver + early return in `[locale]/[slug]/[examCode]/page.tsx` → `InternalAdmissionsPrepHubScaffold` |
| No RN/NCLEX fallback | Early return before `buildNursingTierHubContent`; contract asserts `isInternalAdmissionsPrepPathwayId` block precedes hub content builder |
| Hidden excluded from public lists | `listPublishedExamPathwaysForPublicSite` tests |
| Sitemap exclusion | `collectExamPathwayUrls` contains no `/allied/hesi-a2|hesi-exit|ati-teas` |
| Robots | `marketingRobotsForExamPathway` → `noindex, nofollow` for `status: "hidden"` |
| Hreflang | `shouldOmitRegionalHreflangForInternalAdmissionsPrep` + `generateMetadata` omits `alternates.languages` for internal admissions pathways |
| No checkout on scaffold | Source scan for `stripe.com`, `/api/subscriptions/checkout`, `loadstripe` |
| No main nav / learner entry | Intentionally not added; pathways remain `hidden` |

### Taxonomy decisions

- **Module:** `src/lib/exam-pathways/admissions-prep-taxonomy.ts`
- **ID prefixes:** `nn.lesson_cat.admissions.{exam}.{slug}`, `nn.practice_pool.admissions.*`, `nn.flashcard_pool.admissions.*`
- **Uniqueness:** Prefixed IDs globally unique; `slug` unique within each `AdmissionsPrepExamKind` (same label may recur across exams, e.g. math).
- **CAT / adaptive flags:** `futureCatEligible` / `futureAdaptivePracticeEligible` on each exam taxonomy (planned only).

### Hidden-route governance

- **Env:** `NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS=1` (server-only). Do not set in production until launch-approved.
- **Registry:** `status: "hidden"` + `acquisitionMode: "info_only"` in segment F.
- **SEO:** Internal hubs omit hreflang; robots stay non-indexable.

### Blockers before public launch

1. Product/legal: naming, trademark (ATI TEAS / HESI / Elsevier), disclaimers.
2. Content: tagged lessons/questions/flashcards per taxonomy IDs; minimum pool thresholds for CAT.
3. Entitlements: Stripe price/SKU strategy for admissions vs PRE_NURSING core (separate phase).
4. Figma: hubs, dashboard, analytics, study plan, remediation, timed exam, mobile (Ocean/Blossom/Midnight/Sunset/Aurora).
5. `PATHWAY_LAUNCH_APPROVED` + status flip + sitemap/nav after QA sign-off.
6. Subroute metadata (`/lessons`, `/questions`, `/cat`) robots parity if those URLs go public.

### Figma / design (before public)

- HESI/TEAS/Exit public hubs, learner dashboard tiles, admissions analytics, readiness prediction, study plans, remediation, timed attempts, full mobile + five themes per `docs/governance/figma-premium-ui-mandatory-process.md`.

### Stripe / entitlements (later phase)

- No checkout or `TierCode` changes in Phase 2. Plan: map admissions premium to a clear SKU or feature flags on `PRE_NURSING` (or new tier) with server-side gating; reuse `resolve-entitlement` patterns; document in product brief before implementation.

### Internal QA checklist

- [ ] Staging: flag on, open `/us/allied/hesi-a2`, `/us/allied/hesi-exit`, `/us/allied/ati-teas` — scaffold sections render.
- [ ] Production: flag off — all three URLs 404.
- [ ] View source: `noindex` / no `alternates.languages` for admissions when resolved.
- [ ] Confirm sitemap build has no admissions URLs.
- [ ] No pricing or checkout strings on scaffold.
- [ ] Run: `npm run typecheck:critical`, `npm run test:homepage`, `npm run sitemap:validate`, admissions contract tests.

### Tests added

- `tests/contracts/admissions-prep-phase2.contract.test.ts` (taxonomy, flag, metadata, sitemap, scaffold hygiene, registry).
- Existing: `admissions-prep-internal-pathways.contract.test.ts`, `resolve-exam-pathway-safe.admissions.contract.test.ts`.


### Phase 1 hidden scaffold implementation update (A2 + ATI TEAS only)

- The hidden scaffold route is now **overview-only** for `us-allied-hesi-a2` and `us-allied-ati-teas` behind `NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS=1`.
- Hidden admissions sibling routes under the same hub tree remain blocked at the layout layer, so pricing, questions, CAT, and lessons do not fall through to generic nursing behavior.
- Learner shell metadata now filters hidden pathways from chrome/context-bar rendering.
- HESI Exit remains `hidden` and out of scope for route enablement in this phase.
- Detailed implementation evidence: `docs/reports/hesi-teas-phase-1-scaffold.md`

---

## Critical launch rule (mandatory)

**No partial public launches** for HESI A2, HESI Exit, or ATI TEAS until they are **100% complete** per a **written launch gate**.

Until **every** launch-gate criterion passes:

- Keep **`status: "hidden"`** on all three pathway rows.
- Keep **`NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS`** unset in production (internal QA only where explicitly enabled).
- Keep **`noindex` / `nofollow`**, **no** intentional sitemap URLs, **no** main nav / learner entry, **no** checkout / Stripe wiring for these tracks.

**Removing `noindex`, adding sitemap URLs, or enabling purchase** happens **only** in the same release as the signed-off launch gate — never incrementally for “partial” readiness.

**Full checklist + sign-off structure:** `docs/governance/admissions-prep-launch-gate.md`
