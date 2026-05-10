# Hybrid blog (static + long-tail + DB) — merge readiness

**Date:** 2026-05-10  
**Scope:** Verification of hybrid blog static/DB implementation against the requested checklist and automated gates.  
**Reference:** `docs/reports/hybrid-blog-static-db-implementation-report.md` was **not found** in this workspace (searched repo root and `nursenest-core/docs/reports/`). Verification is based on the **current tree** and the commands below.

---

## Executive summary — safe to merge?

**Yes — with conditions**, based on:

- Code review of visibility, static corpus wiring, long-tail validation, slug-collision script semantics, and import resolution.
- **`npm run validate:blog-static-longtail`**, **`npm run typecheck:critical`**, **`npm run test:blog-recovery`**, and **`npm run test:homepage`** all exited **0** (see command table).

**Conditions / caveats:**

1. **Full `npm run typecheck`** was started in this environment but **did not complete within the verification window** (full-project `tsc` can run for a long time with no stdout until finish). CI or a local follow-up should confirm full `tsc` green before treating that as proven.
2. **`.vibecheck/truthpack/`** is **absent** in this clone (see Truthpack). Product/route claims for merge messaging should still follow org truthpack policy where that bundle exists.
3. **`test:blog-recovery`** hit a configured database in logs (`isProductionDb: true` in contract output). Ensure CI/staging uses an appropriate DB or mocks so merge gates are intentional, not accidental production reads.

---

## Files reviewed (high-signal)

| Area | Path |
|------|------|
| Marketing denylist + env | `src/lib/blog/blog-visibility.ts` |
| Static corpus index/get | `src/lib/blog/static-blog-posts.ts` |
| Long-tail validation | `src/lib/blog/blog-static-longtail-validate.ts`, `scripts/blog/validate-blog-static-longtail.mts` |
| Slug overlap diagnostic | `scripts/blog/diagnose-blog-slug-collisions.mts` |
| NPM scripts | `package.json` (`validate:blog-static-longtail`, `diagnose:blog-slug-collisions`, `test:blog-recovery`) |

**Recent commits touching this effort** (from `git log -5 --oneline --name-only`):

- `14457c05b` — blog visibility helper, hybrid longtail contract test, slug collision diagnostic, `blog-slug-collision-diagnostic.txt`, `package.json`
- `77d47b0a6` — longtail validation tighten (`blog-static-longtail-validate.ts`)
- `34c2fcfda` — longtail validation, merge, safe queries, content MD, tests, `static-blog-posts.ts`, etc.

---

## Command table (run from `nursenest-core/`)

| Command | Exit code | Notes |
|---------|------------|--------|
| `npm run validate:blog-static-longtail` | **0** | `OK: 3 long-tail file(s)` |
| `npm run typecheck:critical` | **0** | `tsc -p tsconfig.typecheck-critical.json` |
| `npm run test:blog-recovery` | **0** | 62 tests passed (includes `hybrid-blog-static-longtail.contract.test.ts`) |
| `npm run test:homepage` | **0** | 78 passed, 1 skipped |
| `npm run typecheck` (full, optional) | **not recorded** | Started; no completion + exit code captured within the session window |

---

## Checklist (user bullets)

| # | Item | Status |
|---|------|--------|
| 1 | **`isBlogSlugHiddenFromPublicMarketingCatalog`** — optional comma-separated `BLOG_STATIC_MARKETING_HIDDEN_SLUGS`; trims parts; exact slug match after trim; empty env → not hidden | **Confirmed** (`blog-visibility.ts` ~169–184) |
| 2 | **`static-blog-posts.ts`** — import of helper resolves; used in `listStaticBlogPostsForIndex` / `getStaticBlogPost` | **Confirmed** (lines ~11, ~27–35) |
| 3 | **Long-tail validation** — non-empty `tags` required | **Confirmed** (`blog-static-longtail-validate.ts` line ~23: `!r.tags?.length` → `"missing or empty tags"`) |
| 4 | **`diagnose-blog-slug-collisions.mts`** — read-only by default; `--write-report` writes `docs/reports/blog-slug-collision-diagnostic.txt` | **Confirmed** (`writeReport` gate; `REPORT_REL` matches that path under app root) |
| 5 | **Truthpack** — document missing `.vibecheck/truthpack` when absent | **Partial**: Directory **absent** in this clone. **Blog-specific** source does **not** add an explicit “truthpack missing” comment. **Other** repo docs do (e.g. `docs/visual-qa.md`, `docs/mobile-exam-systems-architecture.md`, `docs/testing/authenticated-qa-stabilization-FINAL.md`). For strict “not silent” on **this** feature slice, consider a one-line note in the hybrid blog report or `scripts/blog/README` if/when the implementation report is added. |

---

## Code citations (brief)

**Denylist helper and env (optional list, trim, comma-split, exact match):** see `nursenest-core/src/lib/blog/blog-visibility.ts` lines 169–184 (`isBlogSlugHiddenFromPublicMarketingCatalog`, `BLOG_STATIC_MARKETING_HIDDEN_SLUGS`).

**Static corpus wiring:** see `nursenest-core/src/lib/blog/static-blog-posts.ts` lines 11 and 27–35 (import + filter in `listStaticBlogPostsForIndex` / early return in `getStaticBlogPost`).

**Tags required:** see `nursenest-core/src/lib/blog/blog-static-longtail-validate.ts` line 23 (`missing or empty tags`).

**Collision script — report only with flag:** see `nursenest-core/scripts/blog/diagnose-blog-slug-collisions.mts` lines 32, 77–80 (`--write-report`, `docs/reports/blog-slug-collision-diagnostic.txt`).

---

## Remaining risks

- **Full `tsc` vs critical:** `typecheck:critical` passed; full project `typecheck` may still surface errors outside the critical project graph — treat full run as an extra merge gate if your team requires it.
- **Production DB in tests:** Contract tests may connect to a real `DATABASE_URL`; confirm CI secrets point at a safe DB.
- **Truthpack gap on blog-only narrative:** Absence is documented elsewhere in `docs/` but not in every blog module; align documentation if compliance requires explicit callouts per feature area.
- **Implementation report missing:** Onboarding/reviewers lack the narrative doc until it is committed or linked from the PR description.

---

## Full `tsc` vs `typecheck:critical`

- **`typecheck:critical`:** Subset project (`tsconfig.typecheck-critical.json`); **passed (exit 0)** here — good signal for blog-related critical paths included in that graph.
- **`npm run typecheck`:** Full monolith/app `tsc --noEmit`; **not verified complete** in this run — recommend CI or a dedicated local completion before relying on it for merge.
