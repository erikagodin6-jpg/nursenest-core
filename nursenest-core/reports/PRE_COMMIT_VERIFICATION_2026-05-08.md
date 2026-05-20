# Pre-commit verification — 2026-05-08

**Repo:** `/root/nursenest-core`  
**Next app:** `/root/nursenest-core/nursenest-core`  
**Constraint:** No `git commit` / `git push` performed in this pass.

## Truthpack

- **`.vibecheck/truthpack/`** — **not present** in this workspace. Tier names, copy, and routes were **not** re-verified from truthpack; follow `vibecheck truthpack` / repo sync if needed.

## 1. Git tree (repo root)

| Command | Result |
|--------|--------|
| `git branch --show-current` | `main` |
| `git diff --stat` (summary) | **301 files changed**, 8625 insertions(+), 1427 deletions(-) |
| `git diff --cached --name-only` | *(empty — nothing staged)* |

**`git status --short`:** Large working tree: modified paths under `client/public/i18n/`, `nursenest-core/` (app, configs, i18n, scripts, tests, CSS), `package.json` (root), `tools/i18n/marketing/`, plus many **untracked** paths (`nursenest-core/docs/`, `nursenest-core/reports/`, `nursenest-core/preview-screenshots/`, `nursenest-core/pw-phase1-out.txt`, duplicate `reports/` at repo root, new TSX/tests/components, etc.). Full name lists: use `git status --short` and `git diff --name-only` locally.

## 2. Categorized paths (high level)

| Group | Examples |
|-------|----------|
| **Product code** | `nursenest-core/src/**` (marketing, learner, blog, flashcards, study, layout, tools, etc.); new `middleware.ts`, `premium-loader`, blog components, loading segments |
| **CSS / design** | `globals.css`, `premium-redesign-2026.css`, `styles/learner-ds.css` |
| **i18n / generated** | `nursenest-core/public/i18n/**`, `client/public/i18n/*.json`, `tools/i18n/marketing/**`, `marketing-message-keys.generated.ts` |
| **Tests / Playwright** | `tests/e2e/**`, all `playwright.*.config.ts`, helpers |
| **Scripts / build tooling** | `scripts/*.mjs`, `*.runner.mts`, `package.json` (app + root) |
| **Reports / docs** | `docs/RELEASE_QA.md`, `docs/testing/*`, `reports/**/*.md`, `nursenest-core/reports/**`, root `reports/**` duplicates |
| **Screenshots / artifacts** | `preview-screenshots/**`, `pw-phase1-out.txt`, Playwright `test-results/` (when tests run) |
| **Risky / noisy (review before commit)** | Large PNG trees under `preview-screenshots/qa-rn-rpn/`, `reports/ui-redesign-preview/rn-rpn-playwright-qa/`, `_write_test2.md`, duplicate report trees at repo root vs `nursenest-core/reports/`, `.next`, `playwright-report`, env files (never commit secrets) |

## 3. Verification commands (`nursenest-core/`)

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | **PASS** (exit 0) |
| `npm run test:homepage` | **PASS** — 13 passed, 1 skipped |
| `npx playwright test -c playwright.release-gate.config.ts --list` | **PASS** — 19 tests in 9 files |

## 4. `npm run build`

- **Exit code 137** after ~6.5 minutes.
- Log ends at "Creating an optimized production build …" then **`Killed`** (typical **OOM** / cgroup kill on this host). Lesson-index gate completed before Next compile; failure is **resource**, not a surfaced TypeScript error.
- **Recommendation:** Run builds on CI or a machine with more RAM; optionally raise Node heap / use documented low-memory flags already hinted in logs (`lowMemoryHeuristic`, single worker).

## 5. Playwright smoke

**`BASE_URL`:** `http://127.0.0.1:3000` (matches `getE2eBaseURL()` fallback).

| Run | Result |
|-----|--------|
| `playwright.release-gate.config.ts` → `--project=release-phase-1-guest` | **PASS** — 3 passed, **1 skipped** (free-tier lessons hub: missing `E2E_FREE_EMAIL` + `E2E_FREE_PASSWORD` / `QA_*`) |
| `marketing-visual-qa-guard.spec.ts` (default config, chromium) — **before** nested-`<main>` fix | **12 passed, 1 failed** — `/pricing` strict-mode duplicate `<main>` |
| Same file — **after** fix (single test `/pricing`) | **1 passed** |
| Full **13-test** marketing-visual-qa run **after** fix | **7 passed**, then dev server **stopped responding** (`net::ERR_EMPTY_RESPONSE` on `/blog`, then `ERR_CONNECTION_REFUSED`) — **environment / dev server stability**, not a regression from the pricing landmark fix |

**Artifacts:** Release gate wrote `nursenest-core/test-results/release-gate-summary.md`. Failed/interrupted runs may leave screenshots under `nursenest-core/test-results/`.

## 6. Surgical fix applied (diff-induced breakage)

- **Issue:** Marketing layout already renders a `<main>`; `pricing-page-client.tsx` wrapped content in a second `<main>`, causing Playwright `locator('main')` **strict mode violation** on `/pricing`.
- **Change:** Inner wrapper changed from `<main …>` to `<div …>` (same classes including `nn-pricing-premium-root`). File: `src/components/marketing/pricing-page-client.tsx`.

## 7. Commit hygiene — exclude / caution

- **Exclude:** `test-results/`, `playwright-report/`, `.next/`, `.env*`, huge PNG/screenshot trees, `pw-phase1-out.txt`, accidental duplicates (`reports/` vs `nursenest-core/reports/`), scratch `_write_test2.md` unless intentionally kept.
- **Stage intentionally:** i18n shards and `marketing-message-keys.generated.ts` only if produced by an approved compile pipeline.
- **Prefer:** `git add -p` for mixed product vs report vs screenshot commits.

## 8. Recommended commit groups (logical slices)

1. **Tooling / CI:** `package.json`, `playwright.*.config.ts`, `scripts/*`, `validate-release-gate-env.mjs`, etc.
2. **i18n pipeline:** `public/i18n/**`, `client/public/i18n/**`, `tools/i18n/**`, generated keys (if intended).
3. **Product UI:** `src/**`, `styles/**`, CSS tokens — one or more focused commits by surface (marketing vs learner) if history clarity matters.
4. **Tests:** `tests/e2e/**` separately from app code.
5. **Docs / reports:** `docs/**`, `reports/**` — optional separate PR or commits; many files are **documentation-only** or QA notes.

## 9. Safe to commit?

| Question | Answer |
|----------|--------|
| **Safe to commit?** | **Conditional yes** — `typecheck:critical` and `test:homepage` pass; release-gate guest smoke passed; pricing visual QA **logic** fixed. **Caveats:** full `npm run build` **not** verified (OOM 137); full marketing-visual-qa **not** completed in one run due to dev server dropping mid-suite; large/untracked report + screenshot volume needs **curation**. |
| **Blockers** | Production build not proven on this host; free-tier E2E skipped without creds; truthpack absent for contract verification. |

## 10. Suggested next commands (human — no commit executed here)

```bash
cd /root/nursenest-core
git status
git diff --stat

# Stage selectively
git add -p nursenest-core/src/components/marketing/pricing-page-client.tsx
# …repeat per slice

# Re-verify after staging
cd nursenest-core && npm run typecheck:critical && npm run test:homepage

# Optional: release-gate guest (starts dev server)
cd nursenest-core && BASE_URL=http://127.0.0.1:3000 npx playwright test -c playwright.release-gate.config.ts --project=release-phase-1-guest --workers=1

# Optional: marketing QA (stable server recommended; long run)
cd nursenest-core && BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/public/marketing-visual-qa-guard.spec.ts --project=chromium --workers=1
```

---

*Report path:* `nursenest-core/reports/PRE_COMMIT_VERIFICATION_2026-05-08.md` (app reports convention).
