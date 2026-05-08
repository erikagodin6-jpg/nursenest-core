# Learner vertical slice — redesign plan

**Date:** 2026-05-08  
**Scope:** Styling/layout only — no auth, entitlements, Stripe, or schema changes.

## Route map

- Shell: `src/app/(student)/app/(learner)/layout.tsx`
- Dashboard `/app`: `page.tsx` + `learner-study-home.tsx` + `learner-dashboard-page-shell.tsx`
- Account: `account/layout.tsx`, `learner-account-shell-header.tsx`, `learner-account-nav.tsx`
- Report: `account/report/page.tsx`, `_lib/learner-report-card-route.tsx`
- Analytics: `account/analytics/page.tsx`

## Design alignment

- `premium-redesign-2026.css` + `semantic-status-tokens.css`
- Homepage parity: multi-hue radials, layered cards, `nn-product-surface-accent`

## Implementation

1. `nn-learner-ds-ambient` on learner shell root
2. Account header + nav semantic surfaces
3. Dashboard page shell grid veil

## Validation

- `npm run typecheck:critical`, `npm run test:homepage`
- E2E: `test:e2e:learner-surfaces-smoke` when paid creds set
