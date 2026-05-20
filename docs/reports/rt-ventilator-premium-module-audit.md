# RT Premium Ventilator Module — Architecture Audit & Rollout Plan

**Date:** 2026-05-11  
**Scope:** Respiratory Therapy (RRT) allied premium workstation — premium isolation (ECG-like), marketing preview, learner `/modules/rt-ventilator`, CAT/practice hooks, waveform UX (reuse-only).

---

## 1. Audit summary — current RT tier registration

| Concept | Implementation |
|--------|----------------|
| Stripe / billing career key | `AlliedCareerKey` **`rrt`** (`display-catalog.ts`). |
| Marketing `professionKey` | **`respiratory`** via `ALLIED_CAREER_CANONICAL_PROFESSION_KEY.rrt` (`allied-billing-career-resolution.ts`). |
| Hub URL | `/allied/respiratory` — uses `TierCode.ALLIED` + occupation scope (not a separate Stripe tier enum). |
| Exam question scope | `ALLIED_LEGACY_EXAM_QUESTION_CAREER_TYPES.respiratory → ["rrt"]` + profession tags (`allied-exam-question-scope.ts`). |

**Critical alignment:** `CanonicalLearnerAccess.alliedCareer` stores **`rrt`**. Gates must accept **`alliedCareer === "rrt"`**, not only marketing slug `respiratory`.

---

## 2. Premium entitlement patterns

- **Canonical funnel:** `loadCanonicalLearnerAccessForUserId` → `getUserAccess` → `accessScopeFromUserAccess`.
- **Dashboard tile:** `premium-dashboard-launch-tiles.ts` — `TierCode.ALLIED` + `studyBootstrap.alliedProfessionKey === "respiratory"` + `ENABLE_RT_VENTILATOR_MODULE`.

---

## 3. ECG premium isolation (reference)

| Mechanism | ECG | RT Ventilator |
|-----------|-----|----------------|
| Learner gate | `requireEcgModuleAccess` | `requireRtVentilatorModuleAccess` |
| Tier scope | RN/NP (+ pathway rules) | **ALLIED + `rrt`** |
| Pool exclusion | `NON_ECG_PRACTICE_EXAM_WHERE` | Optional AND `module:rt-ventilator` tag (`rt-ventilator-content-taxonomy.ts`) |

---

## 4. Question renderers & CAT pool

- **CAT pool:** `fetchCatPracticePool` + `questionAccessWhereWithPathway` + allied profession slice (`cat-pool.ts`, `pathway-content-scope.ts`).
- **Targeting:** `PickQuestionsInput.topicNames` + `tags` on rows — taxonomy exports **`RT_VENTILATOR_BANK_TAG`** and planned **`topic`** strings for authoring (no migration in this slice).

---

## 5. Chart / waveform infrastructure

- **`MechanicalVentWaveformPanel`:** SVG scalars using semantic CSS variables — teaching overlay only.
- **Rule:** No parallel waveform engine; extend existing panel patterns only.

---

## 6. Foundation shipped

- Dashboard quick-launch → `/modules/rt-ventilator`.
- Module routes + marketing `/respiratory-therapy/ventilator-training` (flag-gated).
- Taxonomy constants for bank tag + CAT topic hooks.
- Playwright: `rt-ventilator-module.spec.ts`, `rt-ventilator-gating.spec.ts`.

---

## 7. SEO

- Learner `/modules/rt-ventilator*` — **noindex** (layout metadata).
- Marketing landing — indexable only when `NEXT_PUBLIC_ENABLE_RT_VENTILATOR_MARKETING` enables the route.

---

## 8. Missing content / admin dependencies

| Gap | Dependency |
|-----|--------------|
| Ventilator-only CAT slice | Published `ExamQuestion` rows with topics/tags aligned to taxonomy + `isAdaptiveEligible` |
| Rich simulations | Scenario/case-study content pipelines (allied-scoped) |

---

## 9. Next phases

1. Import/tag ventilator bank items; validate CAT readiness scans.
2. Optional hub deep-links with `topicNames` from `rtVentilatorTopicNamesForPickQuestions()` once DB topics match.
3. P–V/F–V loops + simulations — separate design + content program.

---

## 10. Verification

```bash
cd nursenest-core
npm run typecheck:critical
npm run test:homepage
npm run sitemap:validate
npm run test:unit:rt-ventilator
npx playwright test tests/e2e/rt/rt-ventilator-gating.spec.ts tests/e2e/rt/rt-ventilator-module.spec.ts --project=chromium
```

---

## 11. Environment flags

| Flag | Purpose |
|------|---------|
| `ENABLE_RT_VENTILATOR_MODULE` | Learner module |
| `NEXT_PUBLIC_ENABLE_RT_VENTILATOR_MARKETING` | Marketing surfaces |
