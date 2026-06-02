# Phase 1B — observability hardening and regression gates

This document tracks **warn-only** vs **CI-failing** tooling added on top of Phase 1 (flashcards inventory telemetry, lesson index logs, `client-diagnostic-log`, mobile overflow hints, hydration / large-client reports).

## OOM / exit 137

Full `npm run typecheck` and `npm run build` can exit **137** (OOM / SIGKILL) on constrained runners. Prefer **`npm run typecheck:critical`** for PR smoke. Do **not** claim full typecheck/build pass unless those commands completed successfully on a machine with sufficient memory.

## Gated vs warn-only

| Script | Default behavior |
| --- | --- |
| `npm run report:hydration-risk-routes` | Writes `reports/hydration-risk-routes.md` + `reports/hydration-risk-routes.json`. **Warn-only** if `reports/hydration-risk-baseline.json` is missing. With baseline present: **exit 1** on **new critical** files (risk rank `high`, score ≥ 4500) not already listed in baseline `criticalRels`. Refresh baseline after review: `node scripts/report-hydration-risk-routes.mjs --write-baseline`. |
| `npm run audit:large-client-components` | Phase 1 **warn-only** (exit 0). |
| `npm run audit:flashcards-inventory-parity` | **Static SQL gate parity** always runs — **exit 1** if required substrings are missing from CAT vs flashcard SQL sources. Optional DB row parity runs when `DATABASE_URL` is configured and queries succeed; if **all** core pathways skip due to schema drift / DB errors, prints **WARN** and **exit 0** (static checks still enforced). Real mismatches (`cat_pool_gt_0_but_flashcards_inventory_zero`) **exit 1**. |
| Mobile overflow (Playwright) | **Measurement gate** via `assertMobileHorizontalLayoutHealth` — see `tests/e2e/helpers/mobile-layout-health.ts` and route list `tests/e2e/helpers/mobile-layout-overflow-gate-routes.ts` (`MOBILE_OVERFLOW_GATE_REPORT`). Assertions unchanged (document-level + optional `<main>` excess). |

## npm scripts (Phase 1B)

| Script | Purpose |
| --- | --- |
| `audit:large-client-components` | Large client-component / route payload advisory. |
| `report:hydration-risk-routes` | Hydration-risk heuristics + optional baseline diff. |
| `audit:flashcards-inventory-parity` | CAT vs flashcards inventory SQL parity + optional DB checks. |

## Client diagnostics

`src/lib/runtime/client-diagnostic-log.ts` dedupes by `scope:event:key`, and **`sanitizeClientDiagnosticMeta`** strips emails, absolute URLs, and sensitive key names before JSON serialization. Call sites: flashcards hub, practice test runner, onboarding, mobile E2e helper — keep meta to pathway ids, HTTP status, and numeric measurements only.

## Flashcards inventory regression tests

Run (with other focused suites as needed):

`node --import tsx --test src/lib/flashcards/load-flashcards-exam-inventory.loader.contract.test.ts src/lib/flashcards/load-flashcards-exam-inventory.server.test.ts src/lib/flashcards/flashcard-custom-session-response.test.ts`

Covers: non-zero pool when SQL returns rows (mocked `$queryRaw` + stubbed counts), access denial before aggregates, API route subscription gate before loader, malformed `success: true` without `total` → parse error, HTTP error branch before “empty pool” semantics.
