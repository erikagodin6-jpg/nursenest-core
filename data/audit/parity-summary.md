# Parity evidence matrix

Generated: 2026-04-14T18:13:35.924Z · `c6d27507`

## What this is

Machine-generated **separation of content vs feature** parity. Rows reference **files and counts**, not unsubstantiated claims.

## Evidence roots

- `client/src`
- `nursenest-core`
- `external/NurseNest`
- `data/audit`

## Summary

| Metric | Value |
|--------|--------|
| Registry pathways | 13 |
| Catalog lesson rows (bundled) | 906 |
| Legacy lesson rows (unimported report) | 4223 |
| Missing from current snapshots | 4084 |
| DB published lessons (en) | skipped |
| DB published questions | skipped |
| DB published decks | skipped |
| Programmatic SEO slugs | 39 |

## Outputs (schema v3)

| File | Purpose |
|------|---------|
| `legacy-content-inventory.json` | What the legacy stack contained (inventoried) |
| `current-content-inventory.json` | Canonical current content sources |
| `legacy-feature-inventory.json` | Legacy feature / client surface |
| `current-feature-inventory.json` | Current app feature surface |
| `legacy-vs-current-content-parity.json` | Content comparison rows |
| `legacy-vs-current-feature-parity.json` | Feature comparison rows |
| `admin-surface-parity.json` | Admin checklist with routes |
| `user-surface-parity.json` | Learner checklist with routes |
| `restoration-priority-queue.json` | Tier 1–5 restoration ordering |
| `parity-final-status.json` | Counts + definition-of-done |

## Next questions (proof-based)

1. Top 25 missing legacy items: filter `unimported-legacy-content.json` class C + RN pathway guess.
2. RN lesson gaps: `pathwayGuessOnMissing.RN` + catalog RN pathway slugs.
3. User study gaps: compare `user-surface-parity.json` routes to legacy client routes (manual).
4. Admin tools gaps: compare `admin-surface-parity.json` to legacy admin.
5. Imported but not routable: cross-check DB slug → `generateStaticParams` / hub link audits.

## Verification

`cd nursenest-core && npm run typecheck` (may require higher heap). This script does not modify application TS outside `scripts/audit/`.

