# Homepage hydration crash — missing `next/dynamic` import

## Root cause

`src/components/layout/site-header.tsx` calls `dynamic()` to lazy-load `MarketingHeaderUtilityStrip` but omitted **`import dynamic from "next/dynamic"`**.

After hydration the header chunk throws **`ReferenceError: dynamic is not defined`**, which triggers marketing **`error.tsx`** with title **"Page could not load"** — flash of SSR HTML then error UI.

## Files changed

- `src/components/layout/site-header.tsx`
- `src/components/layout/site-header-dynamic-import.contract.test.ts`
- `package.json` (`test:homepage`)
- `tests/e2e/public/homepage-stays-loaded-after-hydration.spec.ts` (10s wait)

## Validation

```bash
cd nursenest-core
npm run typecheck:critical
npm run test:homepage
npm run build
```

## Deploy SHA

(Fill after push: `git rev-parse HEAD`.)
