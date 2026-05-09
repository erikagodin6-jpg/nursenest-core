# Figma navigation preview — delivery report (2026-05-08)

## Branch & base

- **Branch:** `preview/figma-navigation-redesign`
- **Base:** `origin/main` @ **13597d6fd21471ae3f4b7e737833ede37b375dbe**

## Isolated worktree

- **Path:** `/root/nursenest-core-figma-nav-preview`
- App package edits live under `/root/nursenest-core-figma-nav-preview/nursenest-core/`.

## Figma

- **Figma file / frame URLs:** not attached — MCP/cloud frame export was not executed in this environment.
- **Fallback design spec:** `nursenest-core/reports/figma-navigation-preview-2026-05-08/design-spec.md`

## Preview URLs (Next.js dev)

Use whatever host/port your dev server prints (`npm run dev:next` from `nursenest-core/`; use `NN_SKIP_DEV_AUTH_SECRET=1` locally if `AUTH_SECRET` is unset).

- **Index:** `/preview/figma-navigation`
- **Variant A:** `/preview/figma-navigation/a` (optional `?auth=anon` \| `?auth=learner`, `?dropdown=1`)
- **Variant B:** `/preview/figma-navigation/b`
- **Variant C:** `/preview/figma-navigation/c`

## Variant intent

| Variant | Intent |
| --- | --- |
| **A** | Ultra-clean clinical: neutral surfaces, restrained borders/shadow on scroll, crisp mega panel. |
| **B** | Playful pastel premium: rounded pills, soft sky/info hover washes, theme nested in a bordered capsule. |
| **C** | App/dashboard hybrid: glassy bar, consolidated utility cluster (theme + account/sign-in cluster). |

## New files (high level)

- Routes: `nursenest-core/src/app/(preview)/preview/figma-navigation/**`
- Components: `nursenest-core/src/components/preview/figma-navigation/**`
- Tests: `nursenest-core/tests/e2e/preview/**`
- Contract: `figma-preview-nav-production-untouched.contract.test.ts`
- Docs: `nursenest-core/reports/figma-navigation-preview-2026-05-08/**`

## Screenshots

Automated capture spec writes PNGs under `nursenest-core/reports/figma-navigation-preview-2026-05-08/{a,b,c}/` — see `README-SCREENSHOTS.md`.

**Status here:** PNG matrix was **not** finalized in CI/agent runtime because the dev server process exited early during local smoke (instrumentation/Turbopack compile instability on repeated starts). Re-run capture locally following README-SCREENSHOTS.md once `next dev` is stable.

## Validation

| Check | Result |
| --- | --- |
| `npm run typecheck:critical` | **PASS** (same critical subset as CI; includes Stripe/auth/db bundles — not limited to preview files). |
| Full `tsc` | Repo has **pre-existing** errors unrelated to preview paths; preview files produced **no** new diagnostics when filtered. |
| Contract tests (`figma-preview-nav-production-untouched.contract.test.ts`) | **PASS** |
| Playwright smoke (`figma-navigation-preview.smoke.spec.ts`) | **BLOCKED** here — server returned **500** under webpack dev (`node:` scheme bundling) / Turbopack session instability during agent run. Retry after clean `npm install` + stable `next dev`. |

## Accessibility (preview)

- Focus: interactive controls use visible focus rings (`focus-visible:outline` + `--ring`) consistent with marketing patterns.
- Keyboard: primary links + mega toggle + mobile sheet support Escape to dismiss sheet.
- Contrast: text uses `--foreground` / `--muted-foreground` on `--background` / `--card` — **pairing is token-based**; dark shots use `data-theme` via `midnight-ink` in Playwright.
- Mobile sheet: `role="dialog"`, `aria-modal="true"`, labelled **Menu**.

## Recommendation

- **Ship toward production (later):** **Variant A** — safest hierarchy match with current premium-clinical marketing tone and smallest novelty debt; B adds warmth without loud chrome; C targets heavier logged-in utility density — adopt only if product intentionally pushes dashboard-forward marketing chrome.

## Explicit confirmations

- **Not pushed** — confirmed (`git push` not run).
- **Not merged** — N/A (local branch only).
- **Not deployed** — N/A.
- **Did not reset `main`** — work isolated on preview branch in separate worktree.
- **Did not delete branches** — no branch deletions.
- **Did not drop stashes** — no stash operations.
- **Production nav untouched** — no edits to `site-header.tsx`, `global-nav-config.ts`, marketing layouts.
- **Leaf logo asset path unchanged** — preview uses existing `HeaderBrandLockup` / `useThemeLogo("leaf")`.
- **Routing structure unchanged** — only additive `/preview/figma-navigation/*` routes.

## Truthpack

- `.vibecheck/truthpack` **not present** in this clone — VibeCheck badge omitted.

