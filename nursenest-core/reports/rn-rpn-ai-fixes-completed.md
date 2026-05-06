# RN / RPN audit — SAFE_FOR_AI fixes completed

**Scope:** Items from `reports/rn-rpn-flow-gaps.md` classified **SAFE_FOR_AI** only. No paywall, Stripe, schema, CAT engine, flashcard architecture, canonical/hreflang, or lesson source changes.

## Changes

| Gap ID | Change | Files | Risk |
| --- | --- | --- | --- |
| **G-002** | Onboarding step 0 shows **country-specific** PN copy: US → “PN (NCLEX-PN)”, CA → “RPN (REx-PN)”, other → combined line referencing account country. | `src/lib/onboarding/exam-goal-rows-for-country.ts` (new), `src/lib/onboarding/exam-goal-rows-for-country.test.ts` (new), `src/components/onboarding/trial-onboarding-flow.tsx`, `src/app/(student)/app/(learner)/onboarding/page.tsx`, `onboarding-page-client.tsx` | **Low** — copy + props only; pathway resolution unchanged (`resolveDefaultPathwayIdForOnboarding`). Added `!user` guard on onboarding page. |
| **G-009** | Contract test: `collectExamPathwayUrls` must include US RN, US PN/NCLEX-PN, and CA REx-PN hub roots. | `src/lib/seo/sitemap-rn-pn-core-pathways.contract.test.ts` (new), `package.json` (`test:seo-sitemap` list) | **Low** — read-only URL list assertion. |
| **G-011** | Playwright: public PN hubs must not show common missing-translation sentinels in `body` text. | `tests/e2e/public/pn-marketing-hub-i18n-sanity.spec.ts` (new) | **Low** — anonymous marketing only; heuristic regexes (`[missing`, `{{missing`, `missing canonical English key`). |
| **G-018** | Contract test: `practice/page.tsx` still redirects to `/app/practice-tests` and forwards query via `URLSearchParams`. | `src/lib/practice-tests/practice-alias-redirect.contract.test.ts` (new), `package.json` | **Low** — reads source file (path without `()` for `sh` compatibility). E2E already covered in `tier-matrix-public-marketing-smoke.spec.ts` / `tier-matrix-paid-owned-pathway.spec.ts`. |

## Tests run

```bash
cd nursenest-core
node --import tsx --test \
  src/lib/onboarding/exam-goal-rows-for-country.test.ts \
  src/lib/seo/sitemap-rn-pn-core-pathways.contract.test.ts \
  src/lib/practice-tests/practice-alias-redirect.contract.test.ts
```

**Note:** `npm run test:seo-sitemap` runs the full blog + SEO bundle; in this environment an **existing** `long-tail-seo-trio-blog-seed.contract.test.ts` assertion may fail unrelated to these edits. The three new contract tests and onboarding unit tests pass when run directly (above).

## Playwright (optional, needs dev server)

```bash
npx playwright test tests/e2e/public/pn-marketing-hub-i18n-sanity.spec.ts
```

## Developer-only (unchanged)

All **DEVELOPER_ONLY** / **AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW** rows in `rn-rpn-flow-gaps.md` remain (pools, paywall verification, CAT rationale E2E, Stripe webhooks, admin pool cards, etc.).
