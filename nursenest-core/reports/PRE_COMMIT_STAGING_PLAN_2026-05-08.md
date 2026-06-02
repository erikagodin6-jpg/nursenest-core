# Pre-commit staging plan — 2026-05-08

**Repo:** `/root/nursenest-core`  
**App:** `/root/nursenest-core/nursenest-core`  
**Constraint:** No `git commit` / `git push` in this pass (planning only).

## 1. Capture state (repo root)

| Command | Result |
|--------|--------|
| `git branch --show-current` | `main` |
| `git diff --stat` | **303 files changed**, 8634 insertions(+), 1432 deletions(-) |
| `git diff --name-only` | Full enumerate: run `git diff --name-only` at repo root (303 paths) |
| `git diff --cached --name-only` | *(empty — nothing staged)* |
| `git status --short` | **303 modified** tracked paths + **91 untracked** paths |

## 2. Cross-read alignment

### 2.1 `reports/PRE_COMMIT_VERIFICATION_2026-05-08.md` vs `nursenest-core/reports/PRE_COMMIT_VERIFICATION_2026-05-08.md`

- **Alignment:** Same content body (truthpack noted absent in workspace).
- **Stale delta:** Verification doc cites **301** files; current **`git diff --stat`** shows **303** files changed.
- **Canonical path:** Prefer **`nursenest-core/reports/`** for app-side QA artifacts.

### 2.2 `reports/ui-redesign-preview/` vs `nursenest-core/reports/ui-redesign-preview/`

| Location | Approx. files | Notes |
|----------|---------------|--------|
| Repo root `reports/ui-redesign-preview/` | **16** | Phase markdown + `phase5-homepage-*-full.png`, `_write_test.txt` |
| Package `nursenest-core/reports/ui-redesign-preview/` | **58** | Full redesign/QA set + `rn-rpn-playwright-qa/` subtree |

**Duplicate basenames in both preview folders:**  
`CAT_PREMIUM_MODERNIZATION_REPORT.md`, `FINAL_PREMIUM_ALIGNMENT_EVIDENCE_REPORT.md`, `FULL_SITE_PREMIUM_QA_REPORT.md`, `FULL_SITE_SCREENSHOT_AUDIT_REPORT.md`, `PRACTICE_EXAM_PREMIUM_MODERNIZATION_REPORT.md`, `PREMIUM_LOADING_SYSTEM.md`, `homepage-regression-fixes-2026-05-08.md`.

**Phase 5B/5C:** Only under package `ui-redesign-preview/` (`PHASE_5B_HOMEPAGE_QA.md`, `PHASE_5C_HOMEPAGE_PRODUCTION_QA.md`).

**Phase 6B/6C:** Untracked duplicates at **`reports/PHASE_6B_*.md`** + **`reports/PHASE_6C_*.md`** **and** **`nursenest-core/reports/`** — consolidate before commit.

### 2.3 Theme allowlist

- `npm run test:homepage` includes **public marketing theme allowlist** — **PASS** (no test conflict with `theme-registry` direction).

## 3. Categorized inventory

### 3.1 Tracked modifications (buckets)

| Category | Pattern |
|----------|---------|
| Product code | `nursenest-core/src/**` |
| CSS / DS | `globals.css`, `premium-redesign-2026.css`, `styles/learner-ds.css` |
| i18n | `client/public/i18n/*.json`, `nursenest-core/public/i18n/**`, `tools/i18n/marketing/**`, `marketing-message-keys.generated.ts` |
| Tests | `nursenest-core/tests/e2e/**` |
| Playwright configs | `nursenest-core/playwright.*.config.ts` |
| Scripts / package | `nursenest-core/scripts/*`, `package.json`, `nursenest-core/package.json`, `nursenest-core/docs/RELEASE_QA.md` |
| Reports (edited) | `nursenest-core/reports/lesson-normalization-coverage.*`, `phase-1-operational-hardening.md` |

### 3.2 Untracked (91) — categories

- **Product:** new `loading.tsx` files, blog components, `premium-loader/`, `new-grad/`, blog category helpers, stderr observability helper.
- **Tests:** new specs (`blog-marketing-redesign`, `branded-loader-smoke`, pathway hubs, `practice-exam/`, etc.).
- **Docs/reports:** `docs/ui-redesign-preview/**`, `PHASE_6*.md`, full package `reports/ui-redesign-preview/**`.
- **Screenshots / QA dumps:** `preview-screenshots/**`, `rn-rpn-playwright-qa/`.
- **Do not commit:** `pw-phase1-out.txt`, `_write_test2.md`, `pw-learner-smoke.txt` (unless intentional artifacts).

## 4. Duplicates / conflicts to flag

- Duplicate **`PRE_COMMIT_VERIFICATION_2026-05-08.md`**, **`release-gate-checklist.md`**, **Phase 6B/6C** at repo root `reports/` vs `nursenest-core/reports/`.
- Overlapping **`ui-redesign-preview`** markdown filenames (root subset vs package superset).
- Generated **`marketing-message-keys.generated.ts`** + i18n shards — confirm pipeline provenance before staging.

## 5. Safe verification (`nursenest-core/`)

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | **PASS** |
| `npm run test:homepage` | **PASS** — 13 passed, 1 skipped |
| `npx playwright test -c playwright.release-gate.config.ts --list` | **PASS** — **19 tests**, **9 files** |

**Optional smoke:** Not run (no confirmed healthy dev server). Use **`BASE_URL=http://127.0.0.1:3000`** when available. Prior verification notes **`npm run build` → exit 137 (OOM)** on constrained hosts.

## 6. Recommended commit groups + exact `git add` lines

Run from **`/root/nursenest-core`**.

**Group 1 — Minimal regression slice**

```bash
git add nursenest-core/src/components/marketing/pricing-page-client.tsx
```

**Group 2 — Tooling**

```bash
git add package.json nursenest-core/package.json
git add nursenest-core/playwright.*.config.ts
git add nursenest-core/scripts/*.mjs nursenest-core/scripts/*.mts
git add nursenest-core/docs/RELEASE_QA.md
```

**Group 3 — i18n**

```bash
git add client/public/i18n/*.json
git add nursenest-core/public/i18n
git add tools/i18n/marketing
git add nursenest-core/src/lib/i18n/marketing-message-keys.generated.ts
```

**Group 4 — Application source + styles**

```bash
git add nursenest-core/src nursenest-core/styles
```

**Group 5 — E2E**

```bash
git add nursenest-core/tests/e2e
```

**Group 6 — Tracked operational reports**

```bash
git add nursenest-core/reports/lesson-normalization-coverage.json nursenest-core/reports/lesson-normalization-coverage.md nursenest-core/reports/phase-1-operational-hardening.md
```

**Group 7 — Untracked product/tests** — use explicit paths after human review (avoid `git add .`).

**Group 8 — Docs / QA markdown** — after dedupe:

```bash
git add nursenest-core/docs
git add nursenest-core/reports/PRE_COMMIT_VERIFICATION_2026-05-08.md
git add nursenest-core/reports/release-gate-checklist.md
git add nursenest-core/reports/PHASE_6_BUILD_STABILIZATION.md
git add nursenest-core/reports/PHASE_6B_ALLIED_INDEX_PIPELINE.md
git add nursenest-core/reports/PHASE_6C_BUILD_PERFORMANCE.md
```

**Leave unstaged:** `.next/`, `test-results/`, `playwright-report/`, `.env*`, huge PNG trees unless policy requires.

## 7. Clean / delete candidates

| Candidate | Action |
|-----------|--------|
| Duplicate Phase 6 + verification at repo root `reports/` | Delete or ignore after choosing `nursenest-core/reports/` |
| Root `reports/ui-redesign-preview/` overlap | Merge into package tree or drop redundant files |
| `_write_test.txt`, `_write_test2.md` | Remove if scratch |

## 8. Blockers & safe for first commit?

| Question | Answer |
|----------|--------|
| **Safe to commit?** | **Conditional yes** — critical checks pass; **blockers:** production build not proven on this host (OOM history); duplicate QA trees need resolution; truthpack not present in workspace for contract re-verification. |
| **First recommended commit group** | **Group 1** (`pricing-page-client.tsx`) for smallest slice **or** **Group 2** if tooling-first. |
| **Files to avoid** | Artifacts, `.env*`, duplicate markdown, scratch logs, large screenshot dumps |

## 9. Next commands (human — no commit here)

```bash
cd /root/nursenest-core/nursenest-core
npm run typecheck:critical && npm run test:homepage
cd ..
git add nursenest-core/src/components/marketing/pricing-page-client.tsx
# git commit -m "..." when ready
```

---

*Mirror:* `/root/nursenest-core/reports/PRE_COMMIT_STAGING_PLAN_2026-05-08.md` (same contents).
