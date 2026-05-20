# Pricing Scope Clarity Report

## Summary

This pass tightened the public pricing funnel so the selected pricing tier now explains:

- what's included
- access scope
- what is not included
- what checkout is about to activate

The main pricing flow now centers on a dedicated selected-tier scope panel, with RN, RPN/PN, NP, New Grad, and Allied Health copy aligned to the live entitlement ladder and Allied occupation-scoping rules already enforced in runtime code.

## Files Changed

- `nursenest-core/src/components/marketing/pricing-page-client.tsx`
- `nursenest-core/src/components/marketing/pricing-tier-scope-panel.tsx`
- `nursenest-core/src/components/marketing/pricing-hero.tsx`
- `nursenest-core/src/components/marketing/pricing-sections.tsx`
- `nursenest-core/src/components/marketing/allied-health-pathway-hub.tsx`
- `nursenest-core/src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/pricing/page.tsx`
- `nursenest-core/src/lib/marketing/pricing-subscription-scope-guardrail.contract.test.ts`
- `nursenest-core/src/lib/marketing/pricing-tier-scope-i18n.contract.test.ts`
- `nursenest-core/src/components/marketing/pricing-tier-scope-panel.contract.test.ts`
- `nursenest-core/tests/e2e/pricing/pricing-smoke.spec.ts`
- `nursenest-core/tests/e2e/allied/allied-pricing-profession-ack.spec.ts`
- `tools/i18n/marketing/marketing-en.json`
- generated i18n outputs from `npm run i18n:compile`

## Pricing Copy Added Or Rewritten

- Added a selected-tier scope panel directly under the pricing segment selector with:
  - `What's included`
  - `Access scope`
  - `Not included`
  - checkout reassurance
- Rewrote RN / RPN / LVN-LPN / NP / New Grad / Allied scope copy to lead with the selected pathway or occupation.
- Tightened Allied warning copy so it now explicitly states:
  - one selected occupation only
  - same price can apply across occupations
  - access remains occupation-specific
  - changing occupation later requires support or admin help
- Moved remaining core pricing hero / trial / section copy onto marketing i18n keys.
- Tightened route-level pricing CTA copy so it describes confirming the selected pathway rather than implying broader access.

## Entitlement Assumptions Used

- Runtime code/config was treated as source of truth for this pass because `.vibecheck/truthpack/*` is absent in this checkout.
- RN access is pathway-first in copy, with lower nursing ladder access mentioned only as secondary additional access where runtime entitlements allow it.
- NP access is pathway-first in copy, with broader nursing ladder access framed as additional access rather than the headline promise.
- RPN / LVN-LPN access is scoped to the selected practical-nursing pathway.
- Allied remains isolated to one selected occupation, with checkout metadata (`alliedCareer`, `alliedProfessionKey`) preserving scope.
- No Stripe price IDs were changed, and Allied shared-price behavior remains metadata-driven rather than product-name-driven.

## Tests Run

- `npm run i18n:compile`
- `node --import tsx --test src/components/marketing/pricing-tier-scope-panel.contract.test.ts src/lib/marketing/pricing-tier-scope-i18n.contract.test.ts src/lib/marketing/pricing-subscription-scope-guardrail.contract.test.ts src/lib/marketing/pricing-conversion-clarity-i18n.contract.test.ts src/components/marketing/pricing-allied-career-selector.contract.test.ts src/app/api/subscriptions/checkout/checkout-allied-metadata.contract.test.ts`

Additional verification:

- `ReadLints` on edited pricing files returned no linter errors.

Attempted but blocked by environment:

- `npx playwright test -c playwright.config.ts tests/e2e/pricing/pricing-smoke.spec.ts tests/e2e/allied/allied-pricing-profession-ack.spec.ts --project=chromium`
  - blocked by unstable local Next dev boot / listener availability in this environment
- `npm run typecheck`
  - terminated with exit code `137` in the low-memory environment before completion

## Remaining Risks

- Public pricing display still appears CA-first while checkout runtime supports broader regional price tables; this pass did not attempt regional display parity.
- Some locale overlays still intentionally fall back to English after compile; this pass updated canonical English only.
- The Allied hub CTA band copy was tightened, but that server component still does not load localized pricing strings the same way the main pricing page does.
- Browser-level Playwright validation and a focused manual route pass on `/pricing` and `/fr/pricing` were attempted but not completed because the local Next dev environment was unstable during route boot.
