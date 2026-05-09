# Release candidate — cleanup plan (no auto-delete)

This document classifies **dirty tree** and **artifact** risk so maintainers can merge toward RC **without** mass resets, history rewrites, or deleting historical screenshot/report trees.

## 1. Dirty tree categories

| Category | Examples | Safe handling |
|----------|-----------|---------------|
| **Generated Playwright** | `test-results/`, `playwright-report/`, trace zips | Add to `.gitignore` if leaked; delete locally only after triage |
| **Local env** | `.env.local`, machine-specific `DATABASE_URL` | Never commit; use `docs/environment-reference.md` patterns |
| **Screenshot binaries** | `docs/screenshots/**/*.png` | Root policy often gitignores `*.png`; keep **canonical paths** under `docs/screenshots/`; historical bundles stay unless a **reviewed** PR removes them |
| **Duplicate narrative docs** | Overlapping QA runbooks | Prefer **one canonical** doc per workflow; archive others with a pointer, not silent delete |
| **Stray WIP** | Half-finished features on long-lived branches | **RC branch strategy:** cut `release-candidate/*` from green `main`, cherry-pick or merge only gated PRs |

## 2. Safe vs risky

| Safe | Risky |
|------|--------|
| Delete **local** `node_modules`, `.next` | Delete `docs/reports/**` or `docs/screenshots/**` historical trees (loses audit evidence) |
| `git clean -fd` on **feature** dirs you own | `git clean` on repo root without inspection |
| Regenerate Prisma client | `migrate reset` on shared DBs |

## 3. Canonical vs historical paths

| Canonical | Historical / ad hoc |
|-----------|---------------------|
| `docs/screenshots/` (git root) | Older `reports/*-FINAL.md` bundles, date-stamped audit folders |
| `docs/screenshots/visual-regression-baseline/` | One-off desktop captures in personal branches |
| `docs/reports/release-hardening-status-2026-05-10.md` | Prior session notes |

**Rule:** new capture programs write under **`docs/screenshots/`** subfolders with README intent; do not move legacy trees in the same commit as product code.

## 4. Recommended merge order (RC)

1. **Runtime + auth correctness** — env validation, `dev:next`, no duplicate web servers for Playwright.
2. **Seeds + paid account reset** — deterministic `seed:auth-qa` after `qa-paid-test-account-reset.mts`.
3. **Playwright release gate** — `npm run qa:release-gate:list` then paid slice.
4. **Visual QA** — `visual-qa:critical` with updated baselines in a **dedicated** PR if PNGs are intentionally committed.
5. **Marketing / hub screenshots** — Figma-linked PRs per governance.

## 5. RC branch strategy

- **`main`:** always deployable; no long-lived broken commits.
- **`release-candidate/yyyy-mm-dd`:** integration branch for frozen scope; only cherry-picks from verified PRs.
- **Tag `rc-*`:** after release gate + typecheck critical + agreed screenshot matrix (or documented blockers).

No automatic branch deletion or `git reset --hard` on shared branches.
