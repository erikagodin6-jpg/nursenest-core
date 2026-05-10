# Premium Shell Navigation Consistency Audit

Date: 2026-05-10

## Scope

This audit covers NurseNest shell, navigation, branding, overlap, CAT isolation, and theme parity checks across public marketing, learner app, practice/CAT, lessons, flashcards, report/settings, Allied Health, New Grad, and Pre-Nursing surfaces.

Required launch themes are enforced from the shared theme registry:

- Ocean
- Blossom
- Midnight
- Sunset
- Aurora

## Fixes Applied

- Kept the NurseNest learner shell wordmark visible on mobile standard learner pages instead of showing only the leaf mark.
- Updated active CAT/practice session focus chrome to preserve a minimal NurseNest identity with the leaf mark, wordmark, and exit control while keeping global learner navigation suppressed.
- Added a dedicated Playwright shell audit spec for public shell brand/logo/nav visibility, learner shell brand/logo/nav visibility, CAT focused shell isolation, horizontal overflow checks, sticky/dialog overlap checks, required theme matrix parity, and PNG evidence export.
- Added a dedicated Playwright config so anonymous public checks and paid learner/CAT checks run under the correct browser storage.

## Overlapping Features Reviewed

The audit targets duplicated or competing shell systems by asserting a single visible public header/navigation shell on marketing pages and a single visible learner shell/navigation system on standard `/app/*` pages. Active CAT sessions are the exception: the learner shell exists in the route layout but is visually suppressed while the minimal exam shell is visible.

The new checks guard against duplicated global learner nav visibility in CAT mode, hidden NurseNest brand lockups, competing public shell vs learner shell presentation, horizontal overflow, and visible overlap between sticky shell, nav rows, header bands, and dialogs.

## CAT Isolation Verification

CAT/adaptive exam mode is intentionally distraction-free. The updated focus shell preserves minimal NurseNest leaf/wordmark identity, focused exam context, and an exit control.

It suppresses the learner global sticky shell, learner primary/bottom navigation, study-next/remediation shell chrome, live CAT transparency strip, and rationale panel during active exam mode.

## Screenshot Evidence

Expected PNG export directory:

`docs/screenshots/premium-shell-navigation-audit/`

The public audit is configured to capture desktop and mobile PNGs for standard shell surfaces, including all required themes on the homepage. In this local run, PNG export was blocked because the existing Next dev server on port 3000 returned HTTP 500 for `/` and Next refused to start a second dev server from the same checkout. Learner/CAT screenshots are produced when paid E2E credentials are configured and the paid project runs.

## Tests Added

- `tests/e2e/navigation/premium-shell-navigation-consistency-audit.spec.ts`
- `playwright.premium-shell-navigation-audit.config.ts`

Recommended commands:

```bash
./node_modules/.bin/playwright test -c playwright.premium-shell-navigation-audit.config.ts --project=chromium-public --grep "public|theme matrix"
```

When paid E2E credentials are configured:

```bash
./node_modules/.bin/playwright test -c playwright.premium-shell-navigation-audit.config.ts --project=chromium-paid
```

## App Store Readiness Observations

- Shell ownership is centralized and consistent: marketing uses `SiteHeader`, learner routes use `LearnerShellLayout`, and active practice sessions are gated by `LearnerExamChromeGate`.
- Theme parity is registry-driven, reducing the risk of omitting Sunset or Aurora in future audits.
- CAT mode now reads as an intentional licensing-exam shell instead of a missing-navigation state.
- The remaining visual breadth risk is paid learner/CAT evidence generation, which depends on configured paid E2E credentials and a healthy test target.

## Verification Run

- `./node_modules/.bin/playwright test -c playwright.premium-shell-navigation-audit.config.ts --list` passed and registered the audit spec.
- `npm run typecheck:critical -- --pretty false` passed.
- IDE diagnostics reported no linter errors in the touched files.
- `npx eslint ...` was blocked by an npm/Cursor server path error before ESLint started.
- Full `tsc --noEmit --incremental false --pretty false` was blocked by Node heap exhaustion in this low-memory session.
- Public Playwright runtime execution was blocked by an existing unhealthy Next dev server: port 3000 was already in use and `/` returned HTTP 500; starting an isolated second server was refused by Next because another dev server already owned the checkout.

## Unresolved Issues

- PNG screenshot export remains pending until the local dev server is healthy or the audit is run against a healthy `PLAYWRIGHT_BASE_URL`.
- Paid learner and CAT runtime screenshots/checks require paid E2E credentials in the execution environment.
- Figma write/update was not performed in this pass; the automated PNG evidence and report are prepared for visual QA review.
