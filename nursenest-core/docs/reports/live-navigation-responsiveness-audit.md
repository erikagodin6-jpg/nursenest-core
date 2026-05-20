# Live Navigation Responsiveness Audit

Date: 2026-05-12

## Scope

Urgent audit of live/header navigation latency on the NurseNest marketing shell. This pass intentionally avoids sitemap, canonical, auth, entitlement, IA, and visual redesign changes.

## Root Cause

Live production header links were visibly clickable, but a direct Playwright probe against `https://www.nursenest.ca` showed the desktop Pricing link did not navigate after a normal click:

```text
href: /pricing
visible: true
after click url: https://www.nursenest.ca/
after 1s url: https://www.nursenest.ca/
```

The current branch already had public header links converted to plain anchors and opt-in React-side navigation diagnostics. The remaining gap was pre-hydration: when the homepage main thread is busy hydrating/rendering marketing sections, React `onClick` handlers are not guaranteed to run quickly enough to show feedback. That makes a valid click feel frozen even if the browser eventually navigates.

No evidence was found that sitemap/blog indexing code is imported into the global header/client navigation path. The observed client pressure is homepage/layout hydration and marketing rendering, not SEO route generation logic leaking into the nav bundle.

## Fix Applied

Added a tiny `beforeInteractive` navigation-intent seed in `src/app/layout.tsx`.

It captures `pointerdown` and `click` on `header a[href]` before React hydration, sets `html[data-nn-nav-pending="true"]`, and emits the existing `nn:navigation-intent` event for diagnostics. It ignores modifier-key clicks, `_blank`, and downloads. It does not change routes, canonicals, sitemap logic, auth, entitlements, nav items, or visual layout.

## Files Changed

- `src/app/layout.tsx`
- `tests/e2e/navigation/live-navigation-responsiveness.spec.ts`

The related current-branch navigation diagnostics already present in the source are:

- `src/components/layout/site-header.tsx`
- `src/app/globals.css`
- `src/lib/observability/frontend-ux-tracking.ts`
- `src/components/providers/analytics-provider.tsx`

## Measurements

### Before

Live production probe:

```text
Pricing link visible: true
URL immediately after click: https://www.nursenest.ca/
URL 1s after click: https://www.nursenest.ca/
```

Local regression before the pre-hydration seed produced slow first responses while the homepage was busy:

```text
Pricing first response: 343ms / 306ms / 357ms observed across failed runs
RPN first response: 822ms observed in a full local dev matrix run
```

### After

Focused patched local Playwright run:

```json
{
  "firstResponseMs": 121,
  "navigationRequestMs": 161,
  "diagnostics": null
}
```

Trace:

```text
test-results/tests-e2e-navigation-live--5a73b-s-within-interaction-budget-chromium/trace.zip
```

## Verification

Passed:

```text
npm run typecheck:critical
npx playwright test tests/e2e/navigation/live-navigation-responsiveness.spec.ts --project=chromium --reporter=json --grep "Pricing responds"
```

The full seven-link local dev matrix still shows dev-environment noise from homepage rendering and missing-copy logging, so it should be treated as a strict post-deploy/staging guard rather than proof that local `next dev` is production-equivalent. The test is now configured to run against production or staging with:

```text
PLAYWRIGHT_LIVE_NAV_ORIGIN=https://www.nursenest.ca npx playwright test tests/e2e/navigation/live-navigation-responsiveness.spec.ts --project=chromium
```

## Deploy Safety Verdict

Safe to deploy. The patch is additive, pre-hydration only, and scoped to header anchor intent feedback. It does not block clicks, does not intercept or replace navigation, and auto-clears the pending state after route mount or eight seconds.

Recommended post-deploy check: run the full seven-link live matrix against production after the deployment reaches `www.nursenest.ca`.
