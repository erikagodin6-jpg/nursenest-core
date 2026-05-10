# Workspace issue triage

**Audit date:** 2026-05-09  
**Repo root:** `/root/nursenest-core`  
**Primary Next.js app / DigitalOcean `source_dir`:** `/root/nursenest-core/nursenest-core` (`nursenest-core/package.json`)

This document triages **production-relevant** workspace health. Paths treated as **noise** for inflated counts (excluded from blocker lists unless they were the only signal): `docs/screenshots/**`, `playwright-report/**`, `test-results/**`, `.next/**`, generated screenshots, generated i18n bundles, snapshot artifacts (by path pattern).

---

## Executive summary

| Signal | Result |
|--------|--------|
| **IDE diagnostics (Cursor ReadLints)** | **0 issues** on `nursenest-core/src` and broader `nursenest-core/` tree |
| **`npm run typecheck:critical`** | **PASS** (exit 0) |
| **`npm run test:homepage`** | **PASS** — 78 pass, 1 skip, 0 fail |
| **Estimated real production blockers (this audit)** | **0** in exercised surfaces |
| **Inflated / unbounded issue count** | **Not applicable** — no mass IDE diagnostics; no ESLint run completed (see below) |

**Production-safety judgment:** For the **critical TypeScript slice** (auth, Stripe, DB, subscription APIs, mobile-native libs) and **homepage/marketing contract tests**, the workspace is **green**. **Caveats:** (1) Full-repo `npm run typecheck` was **not** run to completion in this session (long-running; aborted after extended wait); production deploy still relies on `next build` / CI, which typecheck more broadly than `typecheck:critical`. (2) ESLint was **not** executed successfully (`eslint` not present under `nursenest-core/node_modules/.bin`; `npx eslint` failed with an environment `ENOENT` under this agent npm path). (3) No Playwright E2E matrix was run—only `test:homepage` (Node test runner contracts).

---

## 1. Commands run (exact)

| # | Command | CWD | Exit | Notes |
|---|---------|-----|------|-------|
| 1 | `npm run typecheck:critical` | `/root/nursenest-core/nursenest-core` | **0** | `tsc --noEmit --incremental false -p tsconfig.typecheck-critical.json` — completed ~78s, no output beyond script banner (success). |
| 2 | `npm run test:homepage` | `/root/nursenest-core/nursenest-core` | **0** | Node `--test` contract suite; summary: `# tests 79`, `# pass 78`, `# fail 0`, `# skipped 1` (`optional: homepage HTML has hero before footer marketing copy`). |
| 3 | `npm run typecheck` (full) | same | **aborted** | Started in background; **did not finish** within audit window (pipeline to `tail` produced no captured summary before kill). **Do not** treat as pass/fail. |

**Package.json location:** Scripts live in `nursenest-core/package.json` (not repo root `package.json`, which orchestrates `npm --prefix nursenest-core` for many tasks).

---

## 2. Issue categories (distinct types observed this audit)

| Category | Count / status | Evidence |
|----------|----------------|----------|
| **TypeScript errors** (critical project) | **0** | `typecheck:critical` exit 0 |
| **TypeScript errors** (full app) | **Unknown** | Full `typecheck` not completed |
| **ESLint errors** | **Not measured** | No local `eslint` binary; `npx eslint` failed (npm `ENOENT` on cursor-server path) |
| **Build / runtime import failures** | **0 observed** | No `tsc` errors in critical config; tests loaded modules successfully |
| **Playwright / E2E failures** | **0** (homepage contracts only) | `test:homepage` is Node contract tests, not `playwright test`; **0 fails** |
| **Accessibility contrast issues** | **0** (as IDE diagnostics) | `ReadLints` clean; contract tests include nav/readability/CSS contracts (passed) |
| **Warnings only** | **0** (IDE) | `ReadLints` reported none |

---

## 3. True blocking errors (production-relevant, noise paths excluded)

**None identified** in this audit:

- Critical-path TypeScript: clean.
- Homepage/marketing/nav/theme/screenshot-registry contracts: all passing; single **intentional skip** (optional network/HTML ordering check), not a failure.

---

## 4. Warnings-only counts

- **IDE (ReadLints):** 0  
- **ESLint warnings:** not collected (tooling unavailable in this environment)

---

## 5. Top recurring root causes

**N/A for failures** — no failing bucket to cluster.

**Process gaps** (not code defects):

1. **Full `typecheck` latency** — too slow for quick triage without CI log capture.  
2. **ESLint execution** — depends on local `node_modules` layout / `npx` resolution in the agent sandbox.  
3. **Scope of `typecheck:critical`** — intentionally narrow (`tsconfig.typecheck-critical.json`): `next-env.d.ts`, `src/lib/stripe/**`, `src/lib/auth/**`, `src/lib/db.ts`, `src/lib/db/**`, `src/app/api/subscriptions/**`, `src/lib/mobile-native/**`). **Does not** prove zero errors across all `src/`.

---

## 6. Files causing most failures (ranked)

**None** — zero failing tests and zero `tsc` errors in the executed checks.

---

## 7. Production-safe? Judgment + caveats

**Judgment:** **Conditionally yes** for **payments/auth/subscriptions/DB/mobile-native typing** and **marketing homepage contracts** as exercised—**no blockers found**.

**Caveats:**

- Run **`npm run typecheck`** (full) or rely on **CI / `next build`** for whole-app TypeScript coverage.  
- Run **ESLint** in a normal dev shell (`cd nursenest-core && npm install` if needed, then `npx eslint src`) to capture style and many correctness rules.  
- Run **targeted Playwright** (e.g. release gate, learner smoke) before treating production safe as comprehensive.

---

## 8. Prioritized fix order

No code fixes required from this audit. **Recommended follow-ups (QA hygiene only):**

1. Confirm **CI** records full `typecheck` / build status for the same commit.  
2. Restore **local ESLint** invocation in dev docs if `eslint` is optional or hoisted—verify `node_modules/.bin/eslint` exists after install.  
3. Optionally add a **faster** full-typecheck artifact in CI logs for triage (or document max runtime expectations).

---

## 9. Real blocker count vs inflated issue count

| Metric | Value |
|--------|-------|
| **Real blockers (production-relevant, noise excluded)** | **0** |
| **Inflated raw issue count** | **0** from IDE; ESLint/typecheck-full not available to inflate |

---

## 10. Methodology notes

- **ReadLints:** `nursenest-core/src`, entire `nursenest-core/` — no diagnostics returned.  
- **Noise exclusion:** No findings landed under excluded paths; counts would exclude them regardless.  
- **Accessibility:** No separate axe/Lighthouse run; contract tests touched header bands, nav readability, semantic token hex guard — all passed.

---

*Generated by workspace audit agent; no application source files were modified.*

## 11. ESLint / flat config note

`nursenest-core/eslint.config.mjs` exists, but **`eslint` is not listed** in `nursenest-core/package.json` `devDependencies`. Automated ESLint in this clone therefore had no local binary; treat lint as **out of band** unless CI installs it separately.
