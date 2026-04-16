# Button / control audit (Playwright)

Systematically inventories interactive controls on major surfaces and (for guests) performs **production-safe** clicks on non-destructive controls. Paid / free projects add learner-app inventory and pathway integrity checks.

## Artifacts (under `nursenest-core/test-results/button-audit/`)

| File | Description |
|------|-------------|
| `inventory-guest.json` / `.md` | Guest crawl: controls per page |
| `safe-interaction-guest.json` / `.md` | Guest safe clicks + failures |
| `inventory-paid.json` | Paid learner app seeds |
| `inventory-free.json` | Free-tier learner app seeds |
| `pathway-integrity-paid.json` | Pathway navigation checks |
| `inventory-admin.json` | Admin `/admin` inventory |
| `meta/guest-inventory-observers.json` | Console + document HTTP errors (guest inventory) |
| `screenshots/*.png` | Failure screenshots from safe interaction |

## Commands

From the `nursenest-core` package directory:

```bash
# Full suite (local dev server starts when BASE_URL is localhost)
npm run qa:button-audit

# Guest-only (fastest)
npm run qa:button-audit:guest

# Production / staging (no local server)
PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.example.com npm run qa:button-audit:guest
```

Paid / pathway tests need database-backed credentials (same as other paid E2E):

```bash
E2E_PAID_EMAIL=... E2E_PAID_PASSWORD=... npm run qa:button-audit:paid
```

Admin inventory:

```bash
E2E_ADMIN_EMAIL=... E2E_ADMIN_PASSWORD=... npm run qa:button-audit:admin
```

Free-tier (optional project when `E2E_FREE_*` is set):

```bash
E2E_FREE_EMAIL=... E2E_FREE_PASSWORD=... npm run qa:button-audit:free
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `E2E_BUTTON_AUDIT_MAX_CONTROLS` | Max controls per page in inventory (default `60`) |
| `E2E_BUTTON_AUDIT_MAX_SAFE_CLICKS` | Max safe clicks per page for guest (default `8`) |
| `E2E_BUTTON_AUDIT_PATHS` | Comma/newline list of paths — **overrides** guest seed list |
| `BASE_URL` | Target origin |
| `PLAYWRIGHT_SKIP_WEB_SERVER` | `1` = do not start `next dev` |

## Safety

- Destructive-looking controls are **never** auto-clicked (delete, unsubscribe, billing mutations, logout).
- Admin tests only load `/admin` and record inventory — no bulk clicking.
- Pathway tests click **one** primary lesson link per pathway and assert routes stay within allowed patterns.

## Config

Dedicated Playwright config: `playwright.button-audit.config.ts`.  
These specs are **excluded** from the default `playwright.config.ts` so normal `npm run test:e2e` runs stay fast.
