# Mobile navigation — risk areas

Use when changing **header**, **learner shell**, **drawers**, or **exam chrome**.

## Marketing (`site-header.tsx`)

- Sticky + **safe area** on top bar and drawer scroll regions.  
- Tier / region / language: avoid overlapping dropdowns and scrims.  
- Breakpoint consistency: mobile-only vs `xl` desktop rows.

## Learner shell

- **Bottom nav:** fixed with safe-area padding; main column must retain bottom padding so content is not obscured.  
- **Pathway pill / study strip:** must wrap on narrow widths.  
- **Exam chrome hidden mode:** preserve scroll contracts for `#nn-learner-main` / CAT panels (`globals.css`).

## Drawers (`mobile-context-drawer.tsx`)

- `overscroll-y-contain` on inner scroll; verify body scroll restored after close.

## Playwright sentinels

- `tests/e2e/smoke/smoke-mobile-nav.spec.ts`  
- `tests/e2e/mobile/*.spec.ts`  
- `tests/e2e/public/mobile-usability-audit.spec.ts`
