# Final pre-push QA — 2026-05-08

## Repository

| Item | Value |
|------|--------|
| **Branch** | `main` |
| **Active app** | `nursenest-core/nursenest-core` |

## Committed groups (verified)

| Group | Commit | Message |
|-------|--------|---------|
| **1** | `a9b1866c0` | chore(qa): stabilize release gate and build verification |
| **2 (homepage)** | **`b9ec237de`** | feat(homepage): add premium marketing experience ✓ |
| **3** | `9c5a89740` | feat(learner): polish dashboard and account shell |
| **4** | `fa3a444cd` | feat(lessons): polish pathway lesson surfaces |
| **5** | **`e44418b18`** | feat(study): polish exam and flashcard experiences ✓ |
| **6** | **`e6bf1ab70`** | feat(marketing): polish public ecosystem surfaces ✓ |
| **7** | `b87be96c4` | docs(qa): add premium redesign verification reports |

**Also on branch:** `56c8fb532` docs(qa): add final production readiness report (2026-05-08).

User-listed snapshot omitted Groups 2/5/6 — **they are present** on `main` as above.

---

## Remaining uncommitted work (classification)

### Should commit before push (recommended coherent slice)

| Category | Paths | Notes |
|----------|--------|------|
| **Locale + tooling inputs** | `client/public/i18n/*.json`, `nursenest-core/public/i18n/**/*.json`, `tools/i18n/marketing/**`, `marketing-message-keys.generated.ts`, `tools/i18n/reports/placeholder-fallbacks.json` | Aligns dev logs showing missing `homeHeroCarousel` keys until merged. Single reviewed commit preferred. |

### Follow-up branch / review later

| Category | Paths |
|----------|--------|
| **Paid-user / visual-qa Playwright** | `tests/e2e/paid-user/*.spec.ts`, `tests/e2e/visual-qa/visual-qa-route-pack.spec.ts` |
| **Public smoke specs (untracked)** | `tests/e2e/public/branded-loader-smoke.spec.ts`, `premium-smoke-breadth.spec.ts`, `rn-rpn-pathway-qa.spec.ts` — commit when stabilized |

### Discard / do not commit

| Item | Reason |
|------|--------|
| `pw-phase1-out.txt`, `_write_test*.md`, `pw-learner-smoke.txt` | Scratch logs |
| Root `reports/` duplicates | Canonical copies under `nursenest-core/reports/` (Group 7) |
| `docs/PLAYWRIGHT_*`, `docs/ui-redesign-preview/` | Duplicate of `nursenest-core/reports/ui-redesign-preview/` |

### Leave untracked or `.gitignore` locally

| Item | Reason |
|------|--------|
| `preview-screenshots/qa-rn-rpn/*.png` | Large screenshot dump unless curated |
| Root `reports/ui-redesign-preview/*.md` (untracked) | Duplicates / stale vs package `nursenest-core/reports/` |

### Duplicate / noisy / generated

| Item | Notes |
|------|------|
| `nursenest-core/reports/lesson-normalization-coverage.{md,json}` | ~251KB markdown delta — treat as generated audit; commit only after intentional review |

---

## Validation (this pass)

Run from `nursenest-core/nursenest-core`:

| Command | Result |
|---------|--------|
| `npm run qa:release-gate:check-env` | **PASS** preflight; **WARN** missing paid/free/admin credential pairs (expected locally) |
| `npm run typecheck:critical` | **PASS** |
| `npm run test:homepage` | **PASS** (13 passed, 1 skipped) |
| `npx playwright test -c playwright.release-gate.config.ts --list` | **PASS** (19 tests / 9 files) |
| `npx playwright test -c playwright.release-gate.config.ts` | **PASS** overall; **9 passed, 10 skipped** (free/admin/paid/synthetic paid gated) |

### Release-gate skips (documented)

Synthetic paid smoke (6), free-user, admin-user, paid-env doc test, one phase-1 guest test — **skipped** without full QA secrets.

### Public smoke (untracked specs)

Command:

`npx playwright test tests/e2e/public/branded-loader-smoke.spec.ts tests/e2e/public/premium-smoke-breadth.spec.ts tests/e2e/public/rn-rpn-pathway-qa.spec.ts`

**Result:** **Failures** observed on **branded-loader** + **premium-smoke-breadth** critical paths (chromium + webkit subsets retried): HTTP/primary-surface checks — treat as **needs investigation** before relying on these specs as gate (possible loader regression, server reuse, or path list vs env). Full rn-rpn suite **did not complete** cleanly in combined run.

### Build

**Not re-run** in this pass. Last known local build in prior session: **PASS**. Run `npm run build` before production promote.

### Server / BASE_URL

- Local Playwright uses embedded `next dev` for release gate when targeting localhost.
- For staging: `PLAYWRIGHT_SKIP_WEB_SERVER=1` + `BASE_URL=https://…` + credentials as needed.

---

## Push recommendation

| Question | Answer |
|----------|--------|
| **Safe to push `main` for review?** | **Conditional YES** — automated typecheck + homepage contracts + release-gate Playwright **0 failures**; **dirty tree** should be called out in PR (bulk i18n + generated keys pending). |
| **Safe to merge to production without follow-up?** | **NO** — merge **locale/generated keys** slice; rerun Playwright with staging secrets; fix or quarantine failing **public smoke** specs. |
| **More commits needed before push?** | **Recommended:** one **i18n + generated keys** commit after review; optional separate commits for **public smoke specs** + **paid-user** test edits. |

---

## Next commands

```bash
cd nursenest-core/nursenest-core

npm run qa:release-gate:check-env
npm run typecheck:critical
npm run test:homepage
npm run build
npx playwright test -c playwright.release-gate.config.ts

# Staging
export PLAYWRIGHT_SKIP_WEB_SERVER=1
export BASE_URL=https://your-staging-host
npx playwright test -c playwright.release-gate.config.ts

# Public smoke (after fixing failures / verifying server)
npx playwright test tests/e2e/public/branded-loader-smoke.spec.ts tests/e2e/public/premium-smoke-breadth.spec.ts tests/e2e/public/rn-rpn-pathway-qa.spec.ts
```

---

*Generated 2026-05-08 — automated session.*
