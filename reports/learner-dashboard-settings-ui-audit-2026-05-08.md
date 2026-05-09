# Learner dashboard / settings UI audit — 2026-05-08

## Guest behavior (verified)

Unauthenticated requests to learner alias routes (`/app/dashboard`, `/app/settings`, `/app/report-card`) **hit the auth gate first**. The browser lands on **`/login`** with a **`callbackUrl`** query parameter.

- **`callbackUrl`** preserves the **original alias path** (e.g. `/app/dashboard`), including query string if present.
- **`callbackUrl` host variance**: middleware/auth may emit an absolute URL (`http://127.0.0.1:3000/app/dashboard` vs `http://localhost:3000/...`). Assertions normalize via URL parsing and compare **pathname + search** only — **not** hostname.
- **Raw i18n keys**: the login/auth surface body text must not expose raw `learner.*.*.*` key patterns.

Canonical redirects to `/app`, `/app/account/settings`, and `/app/account/report` apply **after** authentication (see signed-in E2E when QA credentials are present).

## Allied marketing URL resolution (contract fix)

`resolveMarketingHref("/allied-health/:profession/lessons")` maps to `alliedHealthLessonsIndexPath`, which returns **`/allied/allied-health/lessons?…`**. Those paths must stay **on-origin** (not prefixed with `marketingPublicSiteOrigin()`). `isCoreAlliedMarketingPath` now recognizes `/allied/allied-health/…` and compares pathname without tripping on `?…` query suffixes.

## Verification commands (from `nursenest-core/` package root)

```bash
npm run typecheck:critical
npm run test:learner-account
```

Playwright guest slice (requires dev server at `BASE_URL`; reuse with `PLAYWRIGHT_SKIP_WEB_SERVER=1`):

```bash
PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=http://127.0.0.1:3000 \
  LEARNER_UI_AUDIT_SCREENSHOTS=1 \
  node node_modules/@playwright/test/cli.js test \
  -c playwright.learner-surfaces-smoke.config.ts \
  --grep 'auth gate \+ callbackUrl \(guest\)'
```

**Results (local run):** `typecheck:critical` PASS; `test:learner-account` PASS (14 tests); guest Playwright slice PASS (3 tests).

Authenticated sections skip without QA paid credentials (`QA_PAID_EMAIL` / `QA_PAID_PASSWORD` or `E2E_PAID_*` / `PLAYWRIGHT_TEST_*`).

## Screenshots

Under app package (`cwd` = `nursenest-core/`):

- `reports/learner-dashboard-settings-ui-audit-2026-05-08/screenshots/guest-login-app_dashboard.png`
- `reports/learner-dashboard-settings-ui-audit-2026-05-08/screenshots/guest-login-app_settings.png`
- `reports/learner-dashboard-settings-ui-audit-2026-05-08/screenshots/guest-login-app_report-card.png`

Repo-root copies: `reports/learner-dashboard-settings-ui-audit-2026-05-08/screenshots/` (same filenames + `.gitkeep`).
