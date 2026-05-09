# Homepage flash → crash audit (hydration / client runtime)

## Summary

**Symptom:** SSR paints, then within ~1s the marketing segment shows **`Page could not load`** (`src/app/(marketing)/(default)/error.tsx`), i.e. a **client-side error** in the `(marketing)/(default)` tree after hydration — **not** a successful load despite HTTP 200 on first response.

## Root cause (code)

**`src/components/layout/site-header.tsx`** lazy-loads `MarketingHeaderUtilityStrip` with **`dynamic()`** but previously omitted **`import dynamic from "next/dynamic"`**.

After the header chunk executes on the client:

`ReferenceError: dynamic is not defined`

That is caught by Next’s segment **`error.tsx`**, which renders **`NnErrorCard`** with title **`Page could not load`** (exact string — **not** “cannot”).

## Fix on `main`

| Commit | Description |
|--------|-------------|
| `091fd617e` | `fix(production): repair homepage hydration crash` — add `import dynamic from "next/dynamic"` |
| `3bc717535` | Report SHA marker for prior hydration doc |

Contract regression: `src/components/layout/site-header-dynamic-import.contract.test.ts` (runs under `npm run test:homepage`).

## Playwright / production evidence (this audit)

Run from repo **`nursenest-core/`**:

```bash
BASE_URL=https://www.nursenest.ca npx playwright test tests/e2e/public/homepage-stays-loaded-after-hydration.spec.ts --project=chromium --workers=1
```

With assertions updated to match **`Page could not load`**, **`body`** inner text after 5s included:

`Page could not load` / `This page hit an unexpected error...`

→ Confirms the **segment error UI** is still present on **`www.nursenest.ca`** at test time (deploy may lag `main`, or runtime env differs — **confirm Active SHA** in DigitalOcean matches **`main`** tip including **`091fd617e`**).

## Local production reproduction

`npm run start` exits here under **`runtime-env-guard-bootstrap`** (missing `AUTH_SECRET`, AI keys, etc.). Use **DigitalOcean runtime logs** + **browser DevTools** + Playwright against **production URL** until local env matches policy.

## Tests updated

- **`tests/e2e/public/homepage-stays-loaded-after-hydration.spec.ts`**
  - Wait **5s** after load.
  - Fail if **`body`** contains **`Page could not load`** / **`Page cannot load`** / other crash copy.
  - Assert **`[data-nn-app-error-screen]`** count **0** (no marketing `NnErrorCard` shell).
  - Assert **`[data-nn-header-logo]`** visible (header lockup; avoids relying on visible text **NurseNest** when error UI uses logo-only brand).
  - Optional **diagnostic** test: screenshots at ~0ms, 500ms, 2s, 7s (`hydration-t-*.png`).

## Validation commands

```bash
cd nursenest-core
npm run typecheck:critical
npm run test:homepage
npm run build
BASE_URL=https://www.nursenest.ca npx playwright test tests/e2e/public/homepage-stays-loaded-after-hydration.spec.ts --project=chromium --workers=1
```

## Deploy SHA

Record after push: `git rev-parse HEAD` on **`main`**.



**Pushed main:** `1c5e53d4566a6885cee3d79dd6d6b03b4402f071`
