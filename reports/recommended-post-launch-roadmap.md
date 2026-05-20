# NurseNest — recommended post-launch roadmap

Phased backlog after initial production promote (adjust dates to your release calendar).

## Immediate (0–14 days)

- Land **P0** items from `final-launch-blockers.md` (full `tsc`, staging `qa:release-gate`, triage SEO sitemap test).  
- Run **`verify:seo-indexability`** and **`npm --prefix nursenest-core run build`** on CI with production-like `NODE_OPTIONS` / memory flags (`audit:build-stability` already OK).  
- Update **`docs/entitlements-web-mobile-audit.md`** short addendum: native `apps/mobile` client + pointer to `docs/mobile-production-audit-report.md`.  
- **Truthpack:** restore `.vibecheck/truthpack/` in CI and diff against marketing/checkout copy.

## 30 days

- **Mobile:** Sentry symbolication / EAS plugin, store-grade icons/splash, privacy manifest tasks from mobile production audit.  
- **SEO:** Allied / long-tail audits on a schedule (`content:audit-allied-seo`, blog quality scripts).  
- **Reliability:** Exercise `verify:production-reliability-workflow`, backup scripts (`backup:validate`) in staging DR drill.  
- **i18n:** Run full `i18n:ci` per release branch; address highest-traffic locale gaps first.

## 90 days

- **a11y + quality:** Add scoped Playwright + axe passes on `/`, `/pricing`, learner shell.  
- **Performance:** Profile mobile lesson WebView + JSON path; consider FlashList if lists show jank (per mobile audit).  
- **Platform:** Run remaining Phase 14 governance unit tests in CI matrix if not already.  
- **Content:** `legacy-restoration-map.md` slices — restore proven legacy flows without weakening paywall or pagination rules.

---

## Embedded: stabilization roadmap estimate

| Phase | Estimate |
|-------|----------|
| TS + blog/SEO type fixes | 1–3 days |
| SEO sitemap unit failure | 0.5–1 day |
| Staging release gate (human + env) | 0.5 day |
| Mobile store hardening (parallel) | 3–7 days calendar (often waiting on store review) |

## Embedded: immediate vs deferred

See `final-launch-blockers.md` for the canonical split; this roadmap **executes** that split over 0d / 30d / 90d horizons.
