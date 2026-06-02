# Platform Governance Masterplan

Date: 2026-05-31

## Executive Answer

Yes, a new developer can know how a feature must be built, tracked, monetized, launched, and governed if the platform treats governance as executable contracts, not a doc-only checklist.

This pass establishes the platform governance spine:

- Route governance remains owned by `src/lib/nav-governance/*`.
- Feature governance is centralized in `nursenest-core/src/lib/platform-governance/feature-registry.ts`.
- Monetization, analytics, content lifecycle, subscription, and launch-readiness contracts validate the feature registry.
- CI enforcement is provided by `npm run test:platform-governance`.
- The executive dashboard is `/admin/platform-governance`.

## Governance Architecture

| Area | Enforced by | Dashboard surface |
|---|---|---|
| Route governance | `src/lib/nav-governance/navigation-contract.ts`, `navigation-audit.ts` | `/admin/navigation-compliance`, `/admin/platform-governance` |
| Feature governance | `src/lib/platform-governance/feature-registry.ts` | `/admin/platform-governance` |
| Monetization governance | `src/lib/platform-governance/monetization-contract.ts` | `/admin/platform-governance` |
| Analytics governance | `src/lib/platform-governance/analytics-contract.ts` | `/admin/platform-governance` |
| Content governance | `src/lib/platform-governance/content-governance-contract.ts` | `/admin/platform-governance` |
| Subscription governance | `src/lib/platform-governance/subscription-contract.ts` | `/admin/platform-governance` |
| Production readiness | `src/lib/platform-governance/launch-readiness.ts` | `/admin/platform-governance` |

## Enforcement Rules

1. A feature must be registered before it is treated as a platform feature.
2. A monetized feature must declare an entitlement guard and source files where the guard is enforced.
3. Analytics events must use stable snake_case names, except explicitly allowlisted vendor events.
4. Subscription features must use server-side entitlement gates.
5. Content-bearing features must declare lifecycle coverage.
6. Launch readiness must score content, QA, analytics, monetization, and reliability.
7. Route exceptions must remain explicitly registered and auditable.

## Developer Workflow

When adding or changing a feature:

1. Add or update the feature row in `feature-registry.ts`.
2. Declare owner, status, tier, monetization, readiness, analytics events, lifecycle, and canonical source files.
3. Add entitlement checks in the page/API/loader that unlocks premium behavior.
4. Add analytics event names to the canonical analytics contract or `PH`.
5. Update subscription rules only when billing behavior changes.
6. Run `npm run test:platform-governance`.
7. Check `/admin/platform-governance` locally or in a deployed admin environment.

## Current Feature Coverage

The registry covers:

- Lessons
- Flashcards
- CAT
- Practice
- Study Plans
- ECG
- Clinical Skills
- Labs
- Pharmacology
- Simulations
- New Grad
- Allied Health

## Future Hardening

Near-term improvements:

- Add file-system scanning for unregistered `/app` learner routes.
- Add analytics extraction from source files and fail on unregistered event strings.
- Add direct Stripe price matrix health into `/admin/platform-governance`.
- Add content inventory counts by lifecycle state.
- Add owner escalation for readiness scores below 70.

Strategic improvements:

- PR bot comments for governance diffs.
- Governance changelog for feature row changes.
- Programmatic route-to-feature ownership map.
- Launch ticket requirements generated from registry gaps.

## Success Criteria

The success criterion is not "the docs are complete." It is:

> A feature cannot quietly become a premium, tracked, launchable platform surface without a registered owner, entitlement posture, analytics posture, subscription posture, content lifecycle, and readiness score.

That is now enforceable through the platform governance contract test and visible in the admin dashboard.
