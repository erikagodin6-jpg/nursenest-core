# Button / control audit (Playwright)

Systematically inventories **buttons and button-like controls** on major surfaces, classifies interaction hints, flags **destructive-looking** controls (never auto-clicked), and runs **production-safe** probes on non-destructive controls. Separate projects cover **guest**, **paid subscriber**, **free tier**, and **admin** (read-only).

## How the inventory works

1. **Curated seed lists** (`tests/e2e/helpers/button-audit/page-seeds.ts`) define bounded routes per role (marketing, pathway hubs including RN/PN/NP, **Allied** US/CA hubs, learner app, admin).
2. For each URL, Playwright loads the page and runs **`collectInteractiveInventory`** (`inventory-collector.ts`): a single `page.evaluate` pass collects visible elements matching:
   - `button`, `[role="button"]`, `input[type="button"]`, `input[type="submit"]`, `details summary`, anchored QA hooks (`data-nn-qa-*`), `a[data-testid]`, etc.
3. Each row records: route, tag, role, trimmed text, `aria-label`, `href`, `data-testid`, disabled state, **interaction hint** (navigate / submit / dialog / toggle / unknown), bounding rect, and **`destructiveHeuristic`** (see below).
4. **`E2E_BUTTON_AUDIT_MAX_CONTROLS`** (default `60`) caps rows per page so JSON stays bounded.

Override paths entirely with **`E2E_BUTTON_AUDIT_PATHS`** (comma or newline separated).

## How destructive controls are filtered

- **`destructive-patterns.ts`**: regex on text + aria + testid for verbs like delete, remove, cancel subscription, revoke, purge, archive, trash, etc.; plus **billing** mutations (subscribe now, checkout, …) and **logout** / sign-out **links**.
- **`isSafeForDefaultAudit`**: excludes disabled controls, destructive heuristics, logout, billing CTAs, and non-http `href`s (`mailto:`, `tel:`, `javascript:`).
- **Safe clicks** (`safe-interaction.ts`): only controls passing the filter; capped per page via **`E2E_BUTTON_AUDIT_MAX_SAFE_CLICKS`** (default `8`). Locators prefer `data-testid`, then internal `href`, then role+name.
- **Admin** spec: login, inventory `/admin`, **no** bulk clicking; logs destructive-looking candidates only.

## Observers (console, documents, optional API)

`attachButtonAuditObservers(page, baseURL)` records:

- Uncaught **page errors** and filtered **`console.error`** (noise like HMR / favicon stripped).
- **Document** navigations with HTTP **≥400** (excludes `/api/*` document edge cases).
- If **`E2E_BUTTON_AUDIT_TRACK_API=1`**: same-origin **fetch/XHR** responses with status **≥400** (capped); assert empty when enabled.

Pass **`baseURL`** as the second argument so API tracking can match origins.

## Role / state matrix

| Project | Auth | Spec | Artifacts |
|---------|------|------|-----------|
| `audit-guest` | None | `button-audit.guest.spec.ts` | `inventory-guest.json/.md`, `safe-interaction-guest.json/.md`, `meta/guest-inventory-observers.json` |
| `audit-paid` | Paid RN (E2E paid creds + storage state) | `button-audit.subscriber.spec.ts` | `inventory-paid.json`, `safe-interaction-paid.json`, `pathway-integrity-paid.json` |
| `audit-free` | Free tier (`E2E_FREE_*`) | `button-audit.free.spec.ts` | `inventory-free.json`, `safe-interaction-free.json` |
| `audit-admin` | Logs in with `E2E_ADMIN_*` | `button-audit.admin.spec.ts` | `inventory-admin.json` |

**Pathway integrity (paid):** For each entry in `LESSON_FLOW_PATHWAY_QA`, opens the marketing **lessons** hub, clicks the primary lesson link (or first `main a[href*="/lessons/"]`), and asserts the resulting path does not match **forbidden** cross-pathway patterns (wrong country/tier).

## Commands (from `nursenest-core/`)

```bash
# Full config (guest + paid setup + paid + admin [+ free if E2E_FREE_* set])
npm run qa:button-audit

# Guest only (fastest; good for staging/production read-only)
npm run qa:button-audit:guest

# Production / staging — no local dev server
PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://your-host.example npm run qa:button-audit:guest

# Paid (requires DB + E2E_PAID_EMAIL / E2E_PAID_PASSWORD)
npm run qa:button-audit:paid

# Free tier
npm run qa:button-audit:free

# Admin (E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD)
npm run qa:button-audit:admin
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `BASE_URL` | Target origin (default `http://localhost:3000`) |
| `PLAYWRIGHT_SKIP_WEB_SERVER` | `1` = do not start `next dev` |
| `E2E_BUTTON_AUDIT_MAX_CONTROLS` | Max controls per page (default `60`) |
| `E2E_BUTTON_AUDIT_MAX_SAFE_CLICKS` | Max safe clicks per page — guest (default `8`) |
| `E2E_BUTTON_AUDIT_PAID_SAFE_PATHS` | Max learner app paths for paid safe interaction (default `10`) |
| `E2E_BUTTON_AUDIT_FREE_SAFE_PATHS` | Same for free (default `8`) |
| `E2E_BUTTON_AUDIT_PATHS` | Override **guest** seed list (comma/newline) |
| `E2E_BUTTON_AUDIT_TRACK_API` | `1` = fail on same-origin fetch/XHR ≥400 |

## Artifact paths

All under **`nursenest-core/test-results/button-audit/`**:

| File | Description |
|------|-------------|
| `inventory-{guest|paid|free}.json` | Full per-page control inventory |
| `inventory-{role}.md` | Summary table (includes destructive heuristic counts) |
| `safe-interaction-{guest|paid|free}.json` | All safe click outcomes + `failures` |
| `safe-interaction-{role}.md` | Failure summary + screenshot paths |
| `pathway-integrity-paid.json` | Per-pathway navigation probe |
| `inventory-admin.json` | Admin landing inventory + destructive candidates |
| `meta/guest-inventory-observers.json` | Console + document errors + destructive hints |
| `screenshots/*.png` | Safe-click failures |

Optional: symlink for CI — `ln -s test-results/button-audit artifacts/button-audit` (not committed).

## Config

Dedicated **`playwright.button-audit.config.ts`**. Excluded from default `playwright.config.ts` so routine e2e stays fast.

## Safety

- No blind clicks on destructive or billing flows; logout links excluded from safe probes.
- Admin does not exercise destructive table actions.
- Staging/production: use **`PLAYWRIGHT_SKIP_WEB_SERVER=1`** and a read-only URL; prefer **guest** first.
