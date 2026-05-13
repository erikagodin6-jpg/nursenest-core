# Live Redesign Deployment Proof

Date: 2026-05-13
Marker: `data-premium-layout-version="2026-05-live-redesign-v1"`
Target production origin: `https://www.nursenest.ca`

## Executive Summary

The premium redesign components were already present in the codebase. This pass does not add another redesign or duplicate component system. It wires a shared proof marker into the production shell boundaries that already render the premium layouts:

- Marketing/default shell for homepage, RN/RPN/NP/allied hubs, marketing ECG pages, and public route chrome.
- Learner shell for lessons, lesson details, practice exams, CAT entry, and flashcards.
- ECG module shell for the paid basic ECG module.
- Advanced ECG shell for the paid advanced ECG module.

The production-safe patch is intentionally small: one shared marker component plus shell-level marker placement and a Playwright proof spec.

## Route To Component Audit

| Live URL | Route file | Current component rendered | Existing redesigned component used | Flag/env | Auth/tier conditionals | CSS/theme imports |
|---|---|---|---|---|---|---|
| `/` | `src/app/(marketing)/(default)/page.tsx` | `HomeRestoredWithDeferredStats` with premium home sections | `components/marketing/home/*`, default marketing shell | none for redesign; region/locale cookies | public; optional staff session only for chrome | `src/app/globals.css` imports `premium-redesign-2026.css`, brand atmosphere, full-platform convergence, color depth, mobile standards |
| `/canada/rn/nclex-rn` | `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx` | dynamic exam pathway page | `NursingTierHubPage` | pathway registry readiness; ECG/clinical/OSCE cards have their own public flags | public; optional session/entitlement payload for resume state | same marketing shell CSS |
| `/canada/pn/rex-pn` | same dynamic route | dynamic exam pathway page | `NursingTierHubPage` | pathway registry readiness | public; optional session/entitlement payload | same marketing shell CSS |
| `/canada/np/cnple` | `src/app/(marketing)/(default)/canada/np/cnple/page.tsx` | authority cluster page | `AuthorityClusterPageView` | none | public | same marketing shell CSS |
| `/canada-np-exam-prep` | `src/app/(marketing)/(default)/canada-np-exam-prep/page.tsx` | CNPLE SEO longform page | existing SEO cluster article shell; covered by premium marketing shell | none | public | same marketing shell CSS |
| `/allied/allied-health` | `src/app/(marketing)/(default)/allied/allied-health/page.tsx` | global allied hub | `AlliedHealthPathwayHub` | measurement preference cookie; ECG/clinical/OSCE cards use their own public flags | public; optional session/DB preference sync | same marketing shell CSS |
| `/app/lessons` | `src/app/(student)/app/(learner)/lessons/page.tsx` | learner lessons hub | `LearnerLessonsVirtualList`, search toolbar, premium learner shell | none for redesign | protected route; `getProtectedRouteSession`; pathway/entitlement-aware content | learner layout imports `learner-exam-shell.css`, `learner-exam-session-premium.css`, `learner-flashcard-premium.css`, `learner-cockpit-premium.css`, `learner-surface-primitives.css`, tokens, learner DS |
| `/app/lessons/[id]` | `src/app/(student)/app/(learner)/lessons/[id]/page.tsx` | lesson detail | `PremiumLessonShell` | none for redesign | protected route; lesson access/paywall guards preserved | learner shell CSS above |
| `/app/practice-tests` | `src/app/(student)/app/(learner)/practice-tests/page.tsx` | practice exam hub | `PracticeTestsHubClient` | exam/pathway state | protected route; entitlement/paywall behavior preserved | learner shell CSS above |
| `/app/practice-tests?cat=1` | same route | CAT entry mode in practice hub | `PracticeTestsHubClient` CAT launcher and focused exam shell path | query-driven CAT mode | protected route; CAT session gates preserved | learner shell CSS above |
| `/app/flashcards` | `src/app/(student)/app/(learner)/flashcards/page.tsx` | flashcard hub | `FlashcardsHubClient` and premium flashcard CSS | none for redesign | protected route; deck/pathway access preserved | learner shell CSS above |
| `/ecg-interpretation` | marketing ECG page | public SEO/marketing page | covered by premium marketing shell | public ECG marketing flags where applicable | public | same marketing shell CSS |
| `/ecg-telemetry-mastery` | marketing advanced ECG page | public SEO/marketing page | covered by premium marketing shell | advanced ECG marketing flags where applicable | public | same marketing shell CSS |
| `/modules/ecg` | `src/app/modules/ecg/layout.tsx`, `src/app/modules/ecg/page.tsx` | paid ECG module hub | `PremiumEducationalModuleShell`, `EcgModuleHub` | `ENABLE_ECG_MODULE`, `NEXT_PUBLIC_ENABLE_ECG_MODULE` | `requireEcgModuleAccess`; module status remains noindex | module shell CSS through app globals + module components |
| `/modules/ecg-advanced` | `src/app/modules/ecg-advanced/layout.tsx`, `src/app/modules/ecg-advanced/page.tsx` | advanced ECG paid hub | `AdvancedEcgModuleShell`, `AdvancedEcgPremiumHub` | `ENABLE_ADVANCED_ECG_MODULE` | `loadAdvancedEcgAccess`; advanced access/tier rules preserved | advanced ECG component CSS classes + globals |

## Patch Summary

Files changed for this redesign deployment proof:

- `src/components/layout/premium-layout-version-marker.tsx`
- `src/app/(marketing)/(default)/layout.tsx`
- `src/app/(student)/app/(learner)/layout.tsx`
- `src/app/modules/ecg/layout.tsx`
- `src/app/modules/ecg-advanced/layout.tsx`
- `tests/e2e/live-redesign-deployment-proof.spec.ts`
- `docs/reports/live-redesign-deployment-proof.md`

The patch does not alter canonical paths, sitemap logic, auth, Stripe, entitlements, route params, or existing page copy.

## Proof Marker Coverage

| Surface | Marker surface value | Coverage |
|---|---|---|
| Marketing/default shell | `marketing-default` | homepage, RN/RPN/NP/allied hubs, marketing ECG pages, public marketing routes |
| Static home fallback shell | `marketing-default-static-home` | homepage static-isolation fallback |
| Marketing failsafe shell | `marketing-default-failsafe` | emergency marketing chrome fallback |
| Learner shell | `learner-shell` | lessons, lesson pages, practice tests, CAT entry, flashcards |
| ECG module | `ecg-module` | `/modules/ecg` after access gate |
| Advanced ECG module | `advanced-ecg-module` | `/modules/ecg-advanced` |

## Playwright Evidence

Added `tests/e2e/live-redesign-deployment-proof.spec.ts`.

Assertions per target:

- Page loads.
- `data-premium-layout-version="2026-05-live-redesign-v1"` exists.
- Legacy layout selectors are absent.
- Primary CTA/action control is visible.
- No horizontal overflow on desktop or 375px mobile.
- Desktop and mobile screenshots are captured.
- Internal navigation link can navigate.

Local focused run completed:

```text
npx playwright test tests/e2e/live-redesign-deployment-proof.spec.ts --project=chromium --grep "public homepage"
1 passed
```

Screenshots from the local proof run are written under:

```text
test-results/live-redesign-deployment-proof/
```

Full authenticated proof requires `QA_PAID_EMAIL` + `QA_PAID_PASSWORD` or equivalent E2E credentials because learner, ECG, and advanced ECG module routes are correctly protected.

## Verification

Completed locally:

```text
npm run typecheck:critical
npx playwright test tests/e2e/live-redesign-deployment-proof.spec.ts --list
node --import tsx --test tests/contracts/premium-lessons-convergence.contract.test.ts tests/contracts/premium-exam-system.contract.test.ts tests/contracts/premium-flashcard-convergence.contract.test.ts
npx playwright test tests/e2e/live-redesign-deployment-proof.spec.ts --project=chromium --grep "public homepage"
```

Results:

- `typecheck:critical`: pass
- Playwright test discovery: 16 tests discovered across Chromium/WebKit
- Premium convergence contracts: 16/16 pass
- Local homepage redesign proof: 1/1 pass

## Deployment Branch

Current branch: `main`

DigitalOcean deploy configs reference `main` with `deploy_on_push: true`:

- `.do/app-nursenest-core-next.yaml`
- `nursenest-core/.do/app.yaml`

Production deploy proof is pending until the marker commit is pushed and DigitalOcean finishes the deploy. After deployment, verify:

```bash
curl -s https://www.nursenest.ca/ | grep 'data-premium-layout-version="2026-05-live-redesign-v1"'
curl -s https://www.nursenest.ca/api/version
```

## Unused Or Dead Redesign Components

No components were deleted in this pass. The goal was live wiring, not cleanup. Candidate preview/demo-only files should be audited separately before removal because several premium components are intentionally shared across marketing, learner, and module surfaces.

Known live redesign components confirmed in use:

- `HomeRestoredWithDeferredStats`
- `NursingTierHubPage`
- `AlliedHealthPathwayHub`
- `AuthorityClusterPageView`
- `LearnerLessonsVirtualList`
- `PremiumLessonShell`
- `PracticeTestsHubClient`
- `FlashcardsHubClient`
- `PremiumEducationalModuleShell`
- `EcgModuleHub`
- `AdvancedEcgModuleShell`
- `AdvancedEcgPremiumHub`

## Remaining Blockers

- Production proof cannot be completed until the marker commit is pushed and the DigitalOcean deploy reaches the new SHA.
- Protected learner/module production proof requires a configured paid QA account or saved auth state. The Playwright spec is ready for that path and skips those checks only when credentials are unavailable.
- Existing homepage missing-copy warnings appeared during local dev rendering. They predate this marker patch and did not block the redesign marker, CTA, no-overflow, or navigation proof.
