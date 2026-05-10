# Hotfix status: `hotfix/production-nav-homepage-copy`

**Generated:** 2026-05-08 (agent validation run)

## Git

| Item | SHA |
|------|-----|
| **Hotfix tip** | `71d994db08c053152cd0a7bdac96a43aacd84c91` |
| **`origin/main` at validation** | `13597d6fd21471ae3f4b7e737833ede37b375dbe` |

- Branch exists on `origin` as `origin/hotfix/production-nav-homepage-copy` (local worktree aligned via `git reset --hard origin/hotfix/production-nav-homepage-copy` and upstream `origin/hotfix/production-nav-homepage-copy`).
- Rebased onto current `origin/main`: **already linear** (hotfix = main + 1 commit); `git rebase origin/main` was a no-op.
- **Worktree:** this branch is checked out at `/root/nursenest-core-hotfix`. Uncommitted WIP was stashed as `wip-uncommitted-before-hotfix-validation` (see `git stash list` in that repo).

## What changed (commit `71d994db0`)

- `nursenest-core/package.json`
- `nursenest-core/public/i18n/en/pages.json`
- `nursenest-core/reports/production-nav-homepage-copy-hotfix.md`
- `nursenest-core/src/components/layout/site-header.tsx`
- `nursenest-core/src/components/marketing/home/premium-homepage-hero.tsx`
- `nursenest-core/src/config/global-nav-config.ts`
- `nursenest-core/src/lib/marketing/marketing-layout-message-integrity.ts`
- `nursenest-core/src/lib/marketing/minimal-marketing-layout-shell-fallback.ts`
- `nursenest-core/src/lib/marketing/homepage-marketing-visible-copy.test.ts`
- `nursenest-core/src/lib/marketing/homepage-marketing-visible-copy.ts`
- `nursenest-core/src/lib/marketing/homepage-premium-en-pages.contract.test.ts`
- `nursenest-core/src/lib/marketing/marketing-hero-nav-critical-keys.ts`
- `nursenest-core/src/lib/marketing/public-nav-homepage-copy-hotfix.contract.test.ts`

## Validation (from `nursenest-core/`)

| Command | Result |
|---------|--------|
| `npm run typecheck` | **FAIL** — errors in files **not** in the hotfix diff: `learner-study-modes-band.tsx`, `use-delayed-loading.ts`, `blog-ai-provider.ts`, `blog-generation-jobs.ts`, `theme-registry.ts`. |
| `npm run typecheck:critical` | **PASS** |
| `npm run test:unit:cta-copy` | **PASS** |
| `npm run test:homepage` | **PASS** (1 skipped subtest) |
| `npm run validate:marketing-production-surface` | **FAIL** — `(default)/layout.tsx` has two `<SiteFooter />`. **Reproduces on detached `origin/main` (`13597d6fd`)** — baseline, not introduced by the hotfix commit. |

## Deploy readiness

**NOT READY** if the pipeline requires full `npm run typecheck` or hard-fails `validate:marketing-production-surface` without fixing `main` first.

**Hotfix slice:** `typecheck:critical` + focused nav/homepage tests **PASS**.

**Blockers for green full repo typecheck:** fix the five `tsc` errors on unrelated paths (and optionally dedupe `SiteFooter` in default marketing layout) on `main` or a follow-up branch.

## Constraints

- No merge of `integration/release-candidate-2026-05-08` into this work.
- No commit of `reports/release-candidate-final-status.md`.
- No `git push`.
