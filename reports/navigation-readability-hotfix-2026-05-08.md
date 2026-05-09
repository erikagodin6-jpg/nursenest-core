# Navigation readability hotfix — 2026-05-08

## Branch

`hotfix/restore-homepage-nav-copy-2026-05-08`

## Commits

- **Hotfix subject:** `fix(nav): restore readable premium header band` (single commit on this branch; resolve full SHA with `git rev-parse HEAD` after checkout — avoids self-referential amend churn in the report file itself).
- **Parent (base before hotfix):** `a34b2d53ed4158952a85e0cc3f9f248e8f2b0947`

**Note:** An identical patch was briefly committed on `fix/lessons-hub-cleanup-2026-05-08` by mistake; that branch was reset to `13597d6fd` so the hotfix lives only on the hotfix branch above.

## Summary

Middle marketing header band (`[data-nn-header-band="primary"]`) no longer tints with `var(--nav-bg)` from sticky chrome. Neutral `--nn-header-primary-bg` plus a subtle `semantic-info` whisper. Logo wordmark uses `--nn-header-primary-fg` via `--logo-primary` override on `.nn-header-logo-row`.

## Files changed (in commit)

- `nursenest-core/src/app/premium-redesign-2026.css` — primary band / phase-3 shell: no saturated `var(--nav-bg)` tint
- `nursenest-core/src/app/globals.css` — `.nn-header-logo-row` `--logo-primary` → primary foreground
- `nursenest-core/src/lib/theme/navigation-primary-band-readability.contract.test.ts` — new contract tests
- `nursenest-core/tests/e2e/public/marketing-header-bands.spec.ts` — desktop/mobile/blush gradient + contrast checks
- `nursenest-core/package.json` — `test:homepage` includes readability contract (merged with hotfix existing homepage test list)
- `reports/navigation-readability-hotfix-2026-05-08.md` (this file)
- `reports/navigation-readability-hotfix-2026-05-08/home-desktop-nav.png`
- `reports/navigation-readability-hotfix-2026-05-08/home-mobile-nav.png`

## Issues found

- Premium redesign CSS mixed `--nav-bg` (theme chrome) into the primary marketing band, washing logo/nav in theme color.
- Wordmark could follow `--logo-primary` (accent) instead of neutral ink on the logo row.

## Fixes made

- Re-anchor primary band gradients to `--nn-header-primary-bg` / light neutrals with minimal semantic accent.
- Bind logo-row wordmark color to `--nn-header-primary-fg`.
- Contract + E2E guardrails against `var(--nav-bg` in those rules and against hot-pink-like RGB in computed `background-image`.

## Nav states audited (coverage)

| State | How verified |
| --- | --- |
| Desktop marketing | Playwright `marketing-header-bands.spec.ts`; screenshot `home-desktop-nav.png` |
| Mobile viewport | Same spec (mobile block); screenshot `home-mobile-nav.png` |
| Blush / strong theme | Playwright blush theme case — utility/tier still coherent |
| Sticky / scrolled / dropdown open / dark utility strip | Partially via existing spec assertions; **no separate screenshot** for sticky-scroll or open mega-menu in this run |
| Authenticated learner | **Not** re-run in this hotfix (marketing-only E2E) |

## Routes / URLs tested

- Playwright default `BASE_URL` (local dev server) — homepage marketing header (`marketing-header-bands.spec.ts`).

## Commands run

| Command | Result |
| --- | --- |
| `npm run typecheck:critical` (from `nursenest-core/`) | **Pass** |
| `npm run test:homepage` | **Pass** (26 pass, 1 skip) |
| `./node_modules/.bin/playwright test tests/e2e/public/marketing-header-bands.spec.ts --project=chromium` | **Pass** (3 tests) |
| `npx playwright test …` | **Blocked** in this environment: `npm`/`npx` ENOENT under `~/.cursor-server/...`; use local `./node_modules/.bin/playwright` instead |

## Screenshots

- `reports/navigation-readability-hotfix-2026-05-08/home-desktop-nav.png`
- `reports/navigation-readability-hotfix-2026-05-08/home-mobile-nav.png`

## Remaining risks

- Learner-app header and authenticated marketing variants were not Playwright-covered in this slice.
- Sticky-after-scroll and every dropdown permutation rely on CSS contract + existing band tests unless follow-up screenshots are added.

## Coordination

- Unrelated working-tree edits were **not** staged for this commit.
- If you had stashed `package.json` when switching branches earlier, recover with `git stash list` as needed.

## Confirmations

- **No** `git push`, **no** merge to `main`, **no** `main` reset, **no** branch deletion, **no** `git stash drop`
- Logo **asset** unchanged; routing / nav config arrays unchanged
- Scoped to nav/header readability, tests, and this report

## Truthpack

`.vibecheck/truthpack/` was not consulted in this clone (directory absent).
