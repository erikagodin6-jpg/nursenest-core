# Advanced ECG Paid Module Scaffold

## Scope

Advanced ECG now has a dedicated paid-module scaffold that is separate from base RN, RPN/PN, NP, and Allied subscriptions.

This implementation adds:

- A distinct add-on entitlement key: `module_advanced_ecg`
- A dedicated learner route: `/modules/ecg-advanced`
- A separate checkout route: `/api/subscriptions/checkout/advanced-ecg`
- Dedicated pricing/add-on copy on the pricing page
- Admin publishing/status scaffolding for the add-on surface
- Curriculum scaffolding for the Advanced ECG learner experience

## Entitlement Model

Base subscription access and Advanced ECG add-on access are now intentionally separated.

- Base learner access still resolves through `getUserAccess()`
- `getUserAccess()` now ignores `module_*` subscription rows when deciding base premium access
- Advanced ECG add-on rows use plan codes like `module_advanced_ecg_monthly`
- The new add-on access helper inspects those plan codes separately and grants the Advanced ECG learner surface only when:
  - the learner is signed in
  - the learner still has base access
  - the learner tier is RN or NP
  - the add-on subscription is active / grace / valid paid-through

This prevents:

- add-on-only purchases from becoming base premium access
- RN/NP base subscribers from implicitly receiving Advanced ECG
- `module_*` add-on rows from replacing the learner’s displayed base subscription row

## Route Gating

`/modules/ecg-advanced` now uses a dedicated gate rather than the existing ECG module gate.

Decision outcomes:

- `sign_in_required`
- `module_unavailable`
- `base_subscription_required`
- `tier_not_eligible`
- `advanced_ecg_upgrade_required`

Blocked learners see a dedicated upgrade/paywall-style surface with:

- “Advanced ECG is a separate paid module.”
- “Not included in base exam subscriptions.”
- RN/NP-only scoping copy
- pricing and sign-in CTAs

The route remains separate from the existing `/modules/ecg/*` ECG quiz / drill architecture.

## Pricing / Checkout Copy

The pricing page now includes a dedicated Advanced ECG add-on section with explicit copy:

- “Advanced ECG is a separate paid module.”
- “Not included in base exam subscriptions.”
- “Designed for RN/NP, critical care, emergency, telemetry, and advanced practice ECG interpretation.”

Checkout now flows through a dedicated endpoint:

- `POST /api/subscriptions/checkout/advanced-ecg`

Stripe metadata written for the add-on includes:

- `planCode`
- `moduleKey=advanced_ecg`
- `moduleEntitlement=module_advanced_ecg`
- base-tier / base-country snapshot fields for audit context only

It intentionally does **not** write checkout metadata that would remap the learner’s core `tier` / `country`.

## Admin Controls

The ECG admin page now includes an Advanced ECG add-on section with:

- feature-enabled state
- publish status
- entitlement requirement display
- curriculum scaffold preview
- review readiness counts
- publish controls for `draft` / `qa_preview` / `published`

Publishing is blocked when:

- the feature flag is disabled
- no learner-safe advanced ECG inventory is ready
- high-risk strips still require clinician review
- publish-safe counts lag learner-visible advanced inventory

## Curriculum Scaffold

Scaffolded units:

1. Advanced ECG Foundations
2. 12-Lead Interpretation
3. Ischemia & Infarction
4. Conduction Blocks
5. Pacemakers
6. Electrolytes & Toxicology
7. Critical Care Telemetry
8. ACLS ECG Decision-Making
9. Advanced ECG Case Studies

## Tests Run

Focused node tests:

- `src/lib/subscriptions/subscription-plan-codes.test.ts`
- `src/lib/advanced-ecg/advanced-ecg-access.test.ts`
- `src/lib/advanced-ecg/advanced-ecg-pricing-payload.contract.test.ts`
- `src/lib/advanced-ecg/advanced-ecg-core-ecg-guardrail.test.ts`
- `src/app/modules/ecg-advanced/route-contract.test.ts`
- `src/components/marketing/pricing-advanced-ecg-add-on.test.tsx`

Command:

```bash
node --import tsx --test   src/lib/subscriptions/subscription-plan-codes.test.ts   src/lib/advanced-ecg/advanced-ecg-access.test.ts   src/lib/advanced-ecg/advanced-ecg-pricing-payload.contract.test.ts   src/lib/advanced-ecg/advanced-ecg-core-ecg-guardrail.test.ts   src/app/modules/ecg-advanced/route-contract.test.ts   src/components/marketing/pricing-advanced-ecg-add-on.test.tsx
```

Additional verification:

- direct module import smoke for the changed route/API/admin files
- `ReadLints` on all touched files

## Remaining Risks

- Full-repo `tsc` was too heavy for the current environment and was killed before completion, so verification relied on focused tests, direct import smoke, and lint checks instead of a successful repo-wide typecheck.
- The Advanced ECG add-on uses dedicated Stripe env keys (`STRIPE_PRICE_MODULE_ADVANCED_ECG_*`). Checkout will surface a configuration error until those are populated.
- Admin enable/disable is still feature-flag based; the admin UI currently manages publish state, not runtime environment variables.
- Clinician-review enforcement currently relies on existing ECG readiness / review metadata. If future Advanced ECG lessons need their own dedicated review persistence beyond ECG strip governance, that likely deserves a follow-up data model / tooling pass.
