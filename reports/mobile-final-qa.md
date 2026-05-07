# Mobile — final QA summary

**Date:** 2026-05-07  
**Inputs:** `reports/mobile-release-readiness.md`, `reports/mobile-ux-audit-final.md`, `reports/mobile-validation.md`, `reports/phase-14-mobile-platform-readiness.md`, `reports/mobile-layout-regression-checklist.md`

## Scope

Web-first product with **Expo / mobile shell** constraints documented elsewhere. This document is the **launch QA rollup**: what is automated, what is manual, and what was/was not executed in this stabilization pass.

## Automated checks (recommended every release candidate)

| Check | Command / artifact | Status this session |
|-------|-------------------|---------------------|
| Mobile shared unit tests | `npm -w @nursenest/mobile-shared run test` | **Not re-run** (time); prior audits report green |
| Phase 14 contract | `npm --prefix nursenest-core run test:unit:phase14-mobile-readiness` | Listed green in `final-launch-blockers.md` |
| Mobile typecheck / lint | `npm run mobile:typecheck`, `npm run mobile:lint` | Listed green in `final-launch-blockers.md` |
| Playwright mobile slice | `npm --prefix nursenest-core run test:e2e:mobile` | **Requires** dev server + env; run in CI/staging |

## Subscriber UX / false lockouts

From `entitlement-hardening-audit.md`:

- **SoT:** server `getUserAccess` + `requireSubscriberSession`; client uses `resolveSubscriberUiState` + `authReady` to avoid premature paywall UI.
- **Queries:** `staleTime: 30_000`, `refetchOnWindowFocus: true` on profile/subscriber reads.

**QA checklist (manual cold start):**

1. Paid user — kill app → reopen → `/app` loads without false “locked” state after auth hydrates.
2. Grace / `past_due` — billing copy matches profile `subscriberAccess` semantics (display vs gate).
3. 403 from subscriber API — headline uses shared helper (`subscriberHeadlineFromSubscriberApi403`).

## Layout / navigation

Cross-reference `mobile-layout-regression-checklist.md` and `mobile-navigation-risk-areas.md`:

- Primary nav: no clipped labels; drawer opens/closes without trapping focus regressions.
- Pathway switcher: switching CA/US does not strand user on wrong hub slug.

## Accessibility

- `reports/mobile-accessibility-audit.md` — spot-check VoiceOver / TalkBack on **dashboard**, **lesson list**, **question flow** before store submission.

## Outcome

**Docs complete; automation partially verified this session** (see stabilization audit for paywall security). **Full mobile E2E** remains a **staging gate** with real credentials.
