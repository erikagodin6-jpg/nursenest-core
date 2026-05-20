# Homepage hydration — root cause and fix (2026-05-09)

## Root cause

**`site-header.tsx` called `dynamic()` without `import dynamic from "next/dynamic"`.** In the browser, the module throws `ReferenceError: dynamic is not defined` when the header chunk loads, which surfaces the marketing error boundary title **"Page could not load"** after hydration.

## Additional fix

**`public/i18n/en/pages.json`** was merged with the 11 premium homepage keys required by `homepage-premium-en-pages.contract.test.ts` so EN ships authoritative hero/panel/readiness strings.

## Validation

- `npm run typecheck:critical`
- `npm run test:homepage`
- `npm run build`

## Playwright (optional local smoke)

After `npm run build && npm run start`:

`BASE_URL=http://localhost:3000 npx playwright test tests/e2e/public/homepage-stays-loaded-after-hydration.spec.ts --project=chromium`
