# Learner ecosystem UI alignment (2026-05-08)

## Summary

Authenticated learner surfaces (dashboard shell, account hub, analytics/report routes) are aligned with the **homepage premium system**: multi-hue semantic radials (`--semantic-chart-*`), layered cards (`nn-product-surface-accent`, `nn-card-cool`), and soft elevation (`--semantic-shadow-soft`) without changing routes, auth, entitlements, or data loaders.

## Files changed

| File | Change |
|------|--------|
| `src/app/(student)/app/(learner)/layout.tsx` | `nn-learner-ds-ambient` + `relative isolate` on learner root for ambient background |
| `src/app/(student)/app/(learner)/account/layout.tsx` | `nn-learner-account-workspace`, `min-w-0` overflow safety |
| `src/components/student/learner-account-shell-header.tsx` | Premium card header (semantic borders, CTA/focus rings) |
| `src/components/student/learner-account-nav.tsx` | `nn-card-cool` + semantic sidebar chrome |
| `src/components/student/learner-dashboard-page-shell.tsx` | `nn-learner-dashboard-hero` for dashboard hero band |
| `src/app/premium-redesign-2026.css` | Learner ambient, dashboard hero veil, account workspace z-index |
| `tests/e2e/learner-surfaces/learner-surfaces.smoke.spec.ts` | Paid path: `/app/account/overview`, `/app/account/analytics` |
| `reports/ui-redesign-preview/LEARNER_REDESIGN_PLAN.md` | Route map and plan |

## Routes to verify manually

- `/app` — dashboard + study home
- `/app/account/overview` — account shell + nav
- `/app/account/settings` — settings (inherits account layout)
- `/app/account/report` — report card workspace
- `/app/account/analytics` — `nn-learner-page-hero` + reports

## Validation run

- `npm run typecheck:critical` — pass
- `npm run test:homepage` — pass
- `npm run test:e2e:learner-surfaces-smoke` — not run here (requires `QA_PAID_EMAIL` / `QA_PAID_PASSWORD` or `E2E_PAID_*` for paid leg; public marketing tests do not need auth)

## Public slice regression smokes (unchanged contract)

Same learner-smoke file: US RN hub Lessons card, marketing practice hub CAT/linear CTAs, anonymous `GET /api/lessons` → 401.

## Blockers / follow-ups

- **Screenshots:** No stored subscriber session in this environment; add `preview-screenshots/` captures locally after auth (see `preview-screenshots/README.md`).
- **Copy:** `learner-report-card.tsx` still uses a few fixed English labels; i18n pass is separate (no raw keys added).
- **Figma:** No file URL in repo; visual reference remains marketing hero + tokens above.

## Emotional UX note (dashboard)

Goal: **clinical command center** — calm hierarchy, multi-hue status semantics (not monochrome), breathable spacing; account hub reads as premium SaaS settings, not internal admin.
