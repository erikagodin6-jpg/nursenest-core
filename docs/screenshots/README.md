# Screenshot artifacts (local / CI)

Generated PNGs and manifests for **marketing slot capture**, **hub evidence**, and **visual regression baselines** live under this directory (git repo root: `docs/screenshots/`).

| Subdirectory | Producer | Notes |
|----------------|----------|--------|
| `marketing-slot-captures/` | `npm run capture:marketing-screenshots` from `nursenest-core/` (default `SCREENSHOT_OUTPUT_DIR`) | Slot PNGs + `capture-manifest.json`; CDN upload is manual per `docs/SCREENSHOT_CAPTURE_TO_CDN.md`. |
| `nursing-hubs/` | Manual / hub Playwright follow-ups (RN, PN, NP, New Grad nursing marketing hubs) | Prefer **desktop 1280×720** and **mobile ~390×844**; name files `hub-{pathway}-{theme}-{viewport}-{date}.png`. |
| `allied-hubs/` | Manual / allied hub QA | Include profession or slug in filenames when comparing cohorts. |
| `nav-audit-2026/` | Navigation parity / header audits | Keep before/after pairs with identical viewports; cite Figma frame IDs in PRs per `docs/governance/figma-premium-ui-mandatory-process.md`. |
| `visual-regression-baseline/` | `npm run test:e2e:visual-qa-guest-baseline` (first run with `--update-snapshots`) | Guest marketing baselines; **default repo policy gitignores `*.png` here** — keep reviewed copies outside git or relax ignore intentionally. |
| `authenticated-qa-matrix/` | `npm run test:e2e:visual-qa-authenticated-baseline` (with `--update-snapshots` on first capture) | Paid learner dashboard / practice / flashcards; run `npm run seed:auth-qa` first — see nested `README.md`. |
| `rc-theme-matrix-2026/` | Manual / scripted capture (themes × pathways × surfaces) | Checklist + `captured/` output folder; see nested `README.md`. |
| `final-qa-2026-05-09/` | Ad hoc final QA bundles | See nested `README.md` when present. |

## Viewports and themes

- **Desktop:** 1280×720 minimum for hub hero + module grids; align with Playwright project defaults when capturing from tests.
- **Mobile:** ~390×844 (or Pixel / iPhone profiles from Playwright configs).
- **Themes:** capture **Ocean**, **Blossom**, and **Midnight** when governance requires theme parity (`[data-theme]`). Include a short theme token in filenames (`-ocean-`, `-blossom-`, `-midnight-`).

## Gitignore policy

Root `.gitignore` typically ignores `*.png` under `docs/screenshots/` to reduce unreviewed binary churn. **`.gitkeep`** files keep empty evidence dirs in fresh clones. Intentional baseline commits should relax ignore in a dedicated PR and document the exception.

## Evidence expectations (PRs / reports)

List **Figma links**, **frame IDs**, **routes**, and **before/after** screenshots for material visual changes. Store files under the subdirectory that matches the program.

**Prerequisites:** healthy Next (`npm run dev:next:3000` from `nursenest-core/`), `npm run wait:app:ready`, seeded demo user for authenticated slots. See [`docs/runtime/playwright-local-workflow.md`](../runtime/playwright-local-workflow.md) and [`nursenest-core/docs/runtime/local-runtime-modes.md`](../../nursenest-core/docs/runtime/local-runtime-modes.md).

Do not commit transient captures until reviewed.
