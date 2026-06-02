# Link integrity, navigation, and user-journey validation

This document maps the “zero-bug navigation” program to **concrete, production-safe** tooling in this repo. Heavy validation runs **offline, in CI, or against a running server** — never on the critical path for end users.

## Master prompt phases (1–12) → repo tools

| Phase | Goal | Implementation |
| --- | --- | --- |
| 1 — Inventory | Map navigation points | `npm run audit:navigation-inventory` → `data/audit/navigation-inventory-*.json` (regex scan of `src/**` for `href` / `router.push` / `redirect`-like paths). Complement with ripgrep as needed. |
| 2 — Route validation | Destinations exist | `npm run audit:internal-links` (static) + `npm run audit:links` (HTTP BFS from `/`). |
| 3 — Context (RN/PN/NP/allied) | Correct pools | Pathway registry + `npm run audit:entitlements` + E2E pathway matrices under `tests/e2e/helpers/pathway-*`. |
| 4 — Fix broken nav | Repair hrefs | Address `audit:internal-links` failures; avoid linking unpublished expansion hubs until launch. |
| 5 — Unpublished content | No thin pages | Expansion `/exams/…` gates + crawler **warnings** (`EXPANSION_UNPUBLISHED_REDIRECT`, `PLACEHOLDER_COPY` in `audit:links` report). |
| 6 — Journey simulation | Real users | `tests/e2e/public/user-journey-smoke-matrix.spec.ts`, `pre-deploy-regression.spec.ts`, paid flows under `tests/e2e/` as applicable. |
| 7 — Link crawler | BFS + status | `npm run audit:links` (`scripts/audit/link-integrity-check.mts`). |
| 8 — Dead-end prevention | Next steps | Product/UX + Playwright smoke (not a global static guarantee). |
| 9 — Nav consistency | Same href → same place | Manual + `audit:navigation-inventory` diff over time; E2E nav audits. |
| 10 — Performance | No runtime crawl in requests | Audits are **CLI/CI only**; use `--max-pages` caps. |
| 11 — Admin safety | RBAC | Crawler skips `/admin` by default; admin tools never in public nav. |
| 12 — Reporting | Broken list | JSON reports in `data/audit/`; CI can archive artifacts. **Do not** claim “zero 404s” without running crawls against the target environment. |

## Layered checks

| Layer | What it proves | How to run |
| --- | --- | --- |
| **Static navigation inventory** | Rough map of internal paths referenced in source | `npm run audit:navigation-inventory` |
| **Static route + href audit** | Hrefs in source resolve to App Router pages, programmatic slugs, or known rewrites; catches broken `href` before deploy | `npm run audit:internal-links` (from **`nursenest-core/`** app directory — script lives at repo `scripts/audit-internal-links.ts`) |
| **HTTP BFS crawl** | Same-origin URLs reachable from `/` return **no 404/5xx** and **no redirect loops** (optional `--ci` fails the process). Adds **soft warnings** for expansion→`/lessons` redirects, placeholder-like copy, thin HTML | `npm run audit:links` — requires `BASE_URL` pointing at a running instance (default `http://127.0.0.1:3000`) |
| **Playwright: link crawl** | Real browser: internal links, hash targets, inert buttons, nav/footer links; writes JSON/MD report | `npx playwright test tests/e2e/public/link-crawl-audit.spec.ts --project=chromium` |
| **Playwright: marketing nav** | Header, mega menus, mobile drawer, country selector, footer | `npx playwright test tests/e2e/public/marketing-navigation-audit.spec.ts --project=chromium` |
| **Playwright: pre-deploy** | High-traffic marketing flows + country selector | `npx playwright test tests/e2e/public/pre-deploy-regression.spec.ts --project=chromium` |
| **Playwright: journey matrix** | Short smoke list for master-prompt journeys | `npx playwright test tests/e2e/public/user-journey-smoke-matrix.spec.ts --project=chromium` |
| **Playwright: navigation / country** | `tests/e2e/navigation/*.spec.ts` | See files under `tests/e2e/navigation/` |
| **Entitlements / paywall** | No tier leakage (separate audit) | `npm run audit:entitlements` |

## `audit:links` behavior

- **Not** a replacement for static analysis: it discovers **HTML links** from fetched pages (BFS), so it complements `audit:internal-links`.
- Skips by default: `/api/*`, `/_next/*`, `/admin/*` (use `--include-admin` if you need admin surfaces with a staff session — otherwise expect login redirects).
- Writes a JSON report under `data/audit/link-integrity-crawl-*.json` (includes `warningsDetail` / per-row `warnings` when HTML is available).
- **`--ci`**: exit code `1` if any failure (404, 5xx, loops, fetch errors).
- **`--ci-warnings`**: with `--ci`, also fail when soft integrity warnings are present (use sparingly — expansion hubs may legitimately 307 to `/lessons` until launched).

## Unpublished / expansion marketing hubs

Regional `/exams/…` hubs may **307** to `/lessons` when the region is not in the public launch set. The crawl treats a **successful final 200** as link-integrity OK (no dead 404); product-specific “preview as live” is an **admin-only** concern (see launch workflow / preview cookie if enabled).

## Phases 1–4 (inventory + fixes)

There is **no** checked-in “all links map” — it would rot instantly. Instead:

1. **Inventory**: ripgrep / IDE search for `href=`, `<Link`, `router.push` as needed; automation favors `audit:internal-links` + `audit:links`.
2. **Context correctness** (RN vs PN vs NP vs allied): enforced by **pathway registry**, **entitlement audits**, and **E2E matrices** (`tests/e2e/helpers/pathway-*`).

## Phase 8 (dead-end prevention)

Product rule: primary surfaces should expose **next steps** (lessons → questions, hub → lessons, etc.). Enforcement is **Playwright smoke** + manual UX review — not a global static guarantee.

## Performance (Phase 10)

- `audit:links` runs in **CI or local** only; it does not run in request handlers.
- Keep `--max-pages` bounded (default 200).

## Admin safety (Phase 11)

- Admin routes remain **RBAC + middleware** gated; the crawler **skips `/admin`** by default to avoid false failures from auth redirects.

## CI suggestion

```bash
npm run build && npm start &
sleep 5
BASE_URL=http://127.0.0.1:3000 npm run audit:links -- --ci
```

Adapt for your CI’s health check and port.
