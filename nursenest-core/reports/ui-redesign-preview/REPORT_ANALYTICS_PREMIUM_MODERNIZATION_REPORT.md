# Analytics & report card — premium modernization (presentation-only)

**Date:** 2026-05-08  
**Scope:** Learner analytics (`/app/account/analytics`), performance report shell, category mastery / lazy analytics skeletons, heatmap, KPI tiles, recommendation loading. **No** scoring, API, persistence, or chart-math changes.

## Strategy

- **Multi-hue:** `--semantic-chart-1`…`5`, panels, `color-mix()` per semantic guardrails.
- **Shells:** Extend `nn-premium-*` patterns in `premium-redesign-2026.css`; keep `nn-premium-analytics-report` as-is.
- **Motion:** `motion-safe` for donut + category bars; `prefers-reduced-motion` fallback for donut arc in CSS.
- **Branded leaf:** `BrandLeafIcon` on Time Analysis skeleton (`analytics-detail-client.tsx`).

## Routes & screenshot paths

| Route | Notes |
|-------|--------|
| `/app/account/analytics` | Main surface |
| `/app/account/report` | Report card |
| `/app` | Report card block when data present |

Drop captures under:
- `reports/ui-redesign-preview/preview-screenshots/` (e.g. `analytics-performance-light.png`, `analytics-performance-dark.png`, `analytics-mobile-375.png`, `study-activity-heatmap-hues.png`)
- `docs/qa-reports/`, `docs/verification-screenshots/` (optional)

## Files changed

- `src/components/study/study-activity-heatmap.tsx` — multi-hue cells; zero-day muted
- `src/components/study/analytics-performance-report.tsx` — KPI icon tint; donut motion-safe
- `src/components/study/analytics-next-steps.tsx` — loading skeleton multi-hue
- `src/app/(student)/app/(learner)/account/analytics/analytics-detail-client.tsx` — leaf + skeleton header
- `src/components/study/category-mastery-section.tsx` — `nn-premium-category-performance-shell`
- `src/app/premium-redesign-2026.css` — shell + heatmap + donut RDM

## Verification

- `npm run typecheck:critical` — pass (exit 0)
- `npm run test:homepage` — pass (exit 0)
- `npx playwright test -c playwright.release-gate.config.ts --list` — 19 tests

**Specs (rg):** `tests/e2e/learner-surfaces/analytics-readiness-report-premium.spec.ts`, `learner-surfaces.smoke.spec.ts`, `visual-qa-route-pack.spec.ts`

## Confirmation

Analytics aggregation, trend pagination, heatmap counts, readiness bands, and recommendation **logic** unchanged — presentation only.

## Blockers

- Screenshots not attached in this session (manual capture recommended).

## Layout vs token-only

- **Layout:** No grid/column restructure; same DOM hierarchy for report + detail client.
- **Tokens:** All new fills use CSS variables and `color-mix(in srgb, …)` (no ad-hoc hex in TSX).

## Loading / hydration (incremental)

- **Time Analysis** panel: still lazy via `useEffect` + server actions; skeleton is visual only.
- **Next steps** loading: uses `nn-analytics-panel-skeleton` + per-card chart hue (replaces undifferentiated `animate-pulse` blocks).
- **Heatmap:** Cell **values** (`questionsAnswered`, `dateKey`) unchanged; only `background` / `borderColor` presentation.

## QA checklist (mobile + dark)

- [ ] 375px width: no main overflow; table/heatmap scroll if needed
- [ ] Dark theme: heatmap and KPI chips remain legible
- [ ] `data-nn-premium-analytics="performance-report"` when user has activity
- [ ] Empty analytics: `data-nn-empty="account-analytics-quiet"` + leaf empty state unchanged

## Legacy

- `ReadinessTrendPanel` multi-stop line/area gradients already in place; not modified for data.
- Report card `LearnerReportCardPremium` not edited this pass (already semantic progress bars).

