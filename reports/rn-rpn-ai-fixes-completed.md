# RN / RPN audit — SAFE_FOR_AI fixes completed

**Scope:** Items from `reports/rn-rpn-flow-gaps.md` (mirrored in `docs/rn-rpn-flow-gaps.md`) classified **SAFE_FOR_AI** only — **G5**, **G11**. No Stripe, auth/paywall, schema, CAT engine, flashcard architecture, canonical/hreflang, or lesson source changes.

## Changes (latest batch)

| Gap ID | Change | Files | Risk |
| --- | --- | --- | --- |
| **G5** | Anonymous **ExamSelector** first step: PN row copy now states **US: NCLEX-PN · Canada: REx-PN** before country selection (aligns with signed-in onboarding `examGoalRowsForCountry`). | `src/lib/context/context-routing.ts`, `src/lib/context/context-routing.test.ts`, `src/components/onboarding/trial-onboarding-flow.tsx` (JSDoc only) | **Low** — marketing copy + unit assertion; routing IDs unchanged (`rpn` still maps via `resolveOnboardingRoute`). |
| **G11** | Extend English marketing **i18n sentinel** checks to **US NCLEX-RN** and **Canada NCLEX-RN** hubs (existing PN + REx-PN coverage retained). | `tests/e2e/public/pn-marketing-hub-i18n-sanity.spec.ts` | **Low** — anonymous Playwright; same sentinel regexes as before. |

## Prior SAFE_FOR_AI work (still in tree)

| Gap ID | Change | Files | Risk |
| --- | --- | --- | --- |
| **G5** | Signed-in onboarding step 0: country-specific PN labels (`PN (NCLEX-PN)` vs `RPN (REx-PN)`). | `src/lib/onboarding/exam-goal-rows-for-country.ts`, `exam-goal-rows-for-country.test.ts`, `trial-onboarding-flow.tsx`, onboarding pages | **Low** |
| **G11** | Initial PN hub sentinel tests (US NCLEX-PN, CA REx-PN). | `tests/e2e/public/pn-marketing-hub-i18n-sanity.spec.ts` | **Low** |

## Tests run (targeted)

```bash
cd nursenest-core
node --import tsx --test \
  src/lib/context/context-routing.test.ts \
  src/lib/onboarding/exam-goal-rows-for-country.test.ts
```

## Playwright (optional; needs dev server + baseURL)

```bash
npx playwright test tests/e2e/public/pn-marketing-hub-i18n-sanity.spec.ts
```

## Developer-only / review queue (unchanged)

Per `rn-rpn-flow-gaps.md`: **G1–G4, G6–G10, G12–G15** — pools, blueprints, paywall/Stripe verification, CAT rationale E2E, practice–CAT parity, typecheck CI, admin rollup tiles, hreflang/sitemap ownership, progress API tests, flashcard SQL, etc.
