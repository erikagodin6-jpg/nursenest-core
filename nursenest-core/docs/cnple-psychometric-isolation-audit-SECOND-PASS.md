# CNPLE psychometric isolation — second-pass architecture audit

**Date:** 2026-05-20  
**Scope:** `ca-np-cnple` (CNPLE) learner + marketing + API + telemetry + persistence  
**North star:** CNPLE behaves as a governed **LOFT** simulation product with **zero** hidden CAT psychometric assumptions.

## Executive summary

| Area | Status | Notes |
|------|--------|-------|
| Canonical testing model | **Pass** | `PATHWAY_TESTING_MODEL["ca-np-cnple"] → LOFT` |
| CAT engine / session creation | **Pass** | `assertCatEngineAllowedForPathwayId`, `pathwayAllowsCatAdaptiveStart` |
| Routing / nav | **Pass** | CAT launch redirect; learner nav → `/app/cases/cnple` |
| Case telemetry | **Pass** | `cnple_case_*` + `testing_model` dimensions; `assertPathwayPostHogCapture` |
| Post-exam reports (server) | **Pass** | `loft_simulation` skips CAT coach / pass outlook |
| Post-exam UI (client) | **Fixed this pass** | LOFT hero replaces `CatResultsHero` on completion |
| Coaching / recommendations | **Pass** | `loft_readiness` model + sanitization |
| Marketing / SEO | **Pass** | Contract tests + `validateTestingModelMarketingLanguage` |
| Practice-test runner `cat_*` dev logs | **Low risk** | Dev-only `console.debug`; CNPLE should not enter runner |
| Regression matrix | **Pass** | `npm run test:cnple` — **117** tests |

---

## 1. Full CNPLE flow audit

| Flow | CAT leak risk | Finding |
|------|---------------|---------|
| Onboarding / pathway pick | Low | LOFT labels via `getLearnerExamsSurfaceLabel` |
| Dashboard | Low | Use `loftDashboardPriorityThemes()` where wired; no CAT engine CTAs for CNPLE |
| Lessons / flashcards / practice lists | Low | Linear practice links OK; not CAT psychometrics |
| Readiness hub | Low | Blueprint/domain framing in coaching policy |
| Exam launch | **Blocked** | `/app/practice-tests/cat-launch?pathwayId=ca-np-cnple` → `/app/cases/cnple` |
| Active exam | **Isolated** | Longitudinal case shell; LOFT copy on case page |
| Post-exam reports | **Fixed** | Server omits pass outlook; UI now uses `LoftSimulationResultsHero` |
| Recommendations | Pass | `competency-graph-steps` maps LOFT to `simulation`, not `readiness_reassessment` |
| Analytics events | Pass | Governed dimensions on case completion |
| Review / remediation | Pass | Domain + simulation hrefs, not CAT session starts |
| AI coaching | Pass | `coaching-semantics.ts` — `loft_readiness` forbids adaptive wording |
| Email / CMS | Partial | Apply `validateTestingModelMarketingLanguage` at publish boundaries (see debt) |

---

## 2. Routing + navigation audit

**Guards in place:**

- `study-loop-cat-routing.ts` — `app_loft_simulation` → `/app/cases/cnple`
- `cat-launch/page.tsx` — `isCnplePathway` redirect
- `cat-eligibility.ts` — `loftPathwayCatSurfaceBlock` for LOFT pathways
- `learner-primary-nav` / shell — **LOFT Simulation** → `/app/cases/cnple`

**Residual risk:** Deep links to `/app/practice-tests?pathwayId=ca-np-cnple` remain valid for **linear** practice, not CAT — acceptable if UI does not offer CAT start for CNPLE.

---

## 3. Analytics + telemetry audit

**Dimensions (all CNPLE case + governed surfaces):**

- `testing_model` = `LOFT`
- `psychometric_style` = `blueprint_constrained`
- `remediation_style` = `competency_balance`
- `simulation_family` = `canadian_np_readiness`
- `analytics_model` = `loft`

**Guards:**

- `assertCatTelemetryAllowedForPathway()` — server logs via `logTestingModelScopedEvent`
- `assertPathwayPostHogCapture()` — PostHog property keys on LOFT pathways (added this pass)

**CNPLE case events:** `cnple_case_*` namespace only — no `cat_*` keys in shaped payloads.

---

## 4. Post-exam report audit

**Server (`buildPostExamPerformanceReport` / `buildPostExamPerformanceReportFromCase`):**

- `sessionKind === "loft_simulation"` → no `catReport` / `catCoach`
- `passOutlookPct`, `passOutlookBand`, `readinessResult` = `null`
- Coaching copy validated via `validateCoachingCopyForPathway(CNPLE_PATHWAY_ID, …)`

**Client (this pass):**

- `PostExamAdaptiveReport` branches to `LoftSimulationResultsHero` for `loft_simulation`
- Paywall copy pathway-aware (LOFT simulations, not “adaptive sessions”)
- `data-nn-post-exam-loft-report` marker for LOFT completions

---

## 5. AI coaching + recommendations audit

- `resolveCoachingModel` → `loft_readiness` for CNPLE / LOFT sessions
- `sanitizeCoachingNarrative` strips adaptive / theta / SE language
- `readiness-reliability` caps LOFT reliability scoring; `softenPredictions` when appropriate
- Orchestrator uses blueprint/domain framing via `competency-graph-steps`

---

## 6. Database + session model audit

- CNPLE sessions use **case session** APIs (`/api/cases/cnple/session`), not `selectionMode: "cat"` practice tests
- No adaptive termination or CAT confidence fields required on LOFT completion payloads
- **Action:** Periodic schema review if practice-test rows are ever created with `pathwayId=ca-np-cnple` + `selectionMode=cat` (API should reject)

---

## 7. UI/UX audit

| Before (gap) | After (this pass) |
|--------------|-------------------|
| `CatResultsHero` on CNPLE completion (“Review This CAT”, pass probability) | `LoftSimulationResultsHero` — blueprint score, simulation CTAs |
| `data-nn-post-exam-adaptive-report` on all reports | LOFT uses `data-nn-post-exam-loft-report` |
| Generic paywall “adaptive sessions” | LOFT-specific paywall copy |

**Remaining cosmetic debt:** Section CSS classes still use `nn-cat-results__*` in shared report sections — styling only, not learner-facing CAT labels.

---

## 8. Marketing + SEO governance

- `validateTestingModelMarketingLanguage(CNPLE_PATHWAY_ID, copy)` blocks adaptive/CAT claims
- `cnple-content-quality-guardrails.ts` — audit patterns for CNPLE+CAT pairing
- `cnple-product-readiness` + `cnple-hub-readiness` contract suites cover `/simulation`, `/cat` redirect, tier hub CTAs

**Follow-up:** Wire marketing validator into CMS/admin publish hooks if not already enforced at save time.

---

## 9. Regression matrix

```bash
cd nursenest-core && npm run test:cnple
```

| Suite | Tests |
|-------|-------|
| `psychometric-governance.contract.test.ts` | Behavioral contracts + second-pass isolation |
| `testing-model.contract.test.ts` | Map, nav, analytics, grep |
| `cnple-product-readiness.contract.test.ts` | Product surfaces |
| `cnple-hub-readiness.contract.test.ts` | Hubs + marketing routes |

**Result:** 117 passed / 0 failed (2026-05-20 run).

---

## 10. Architecture hardening (this pass)

| Change | File |
|--------|------|
| LOFT results hero (no CAT CTAs / pass probability) | `components/study/loft-simulation-results-hero.tsx` |
| Branch post-exam UI by `sessionKind` | `components/student/post-exam-adaptive-report.tsx` |
| PostHog capture guard | `lib/testing/testing-telemetry-governance.ts` → `assertPathwayPostHogCapture` |
| Case analytics uses guard | `lib/cases/case-session-analytics.ts` |
| Fix telemetry `resolveAnalyticsDimensions` | `testing-telemetry-governance.ts` |
| Expanded contract tests | `psychometric-governance.contract.test.ts` |

**Pattern to prefer:** `getTestingModelForPathwayId` / `getTestingModelDefinition` / policies — avoid new `if (pathway === "cnple")` branches.

---

## 11. Future-proofing

New pathways should add:

1. One entry in `PATHWAY_TESTING_MODEL`
2. Optional overrides in `TESTING_MODEL_DEFINITIONS` capabilities
3. Coaching policy via `getCoachingPolicyForTestingModel`
4. Contract row in `psychometric-governance.contract.test.ts`

Supported models: `LOFT`, `CAT`, `LINEAR` — blueprint-adaptive hybrids should extend definitions, not fork CNPLE conditionals.

---

## 12. Technical debt inventory (prioritized)

| Priority | Item | Effort |
|----------|------|--------|
| P1 | Rename `PostExamAdaptiveReport` → neutral name (e.g. `PostExamPerformanceReportView`) | Small |
| P2 | Shared report CSS: `nn-loft-results` section titles (reduce `nn-cat-results__*` on LOFT) | Small |
| P2 | CMS/admin: call `validateTestingModelMarketingLanguage` on publish | Medium |
| P3 | Client PostHog wrapper calling `assertPathwayPostHogCapture` if browser capture added for cases | Small |
| P3 | Dashboard tiles: ensure all CNPLE copy uses `loftDashboardPriorityThemes()` | Small |
| P4 | E2E: CNPLE user cannot complete CAT session (API 4xx) | Medium |

---

## Recommended hardening tasks

1. Ship LOFT hero + telemetry guard (done in this pass).
2. Add Playwright smoke: CNPLE pathway → case hub, not CAT launch URL after redirect.
3. Admin publish pipeline validation for CNPLE marketing strings.
4. Optional rename of post-exam component for engineer clarity (no behavior change).

---

## Verification

- `npm run test:cnple` — green (117 tests)
- Manual: complete a CNPLE simulation → post-exam hero shows LOFT CTAs, no pass probability line
