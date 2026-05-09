# Final QA screenshots (2026-05-09)

This pass prioritized automated contract tests, `typecheck:critical`, and `npm run build` in the active workspace. **No browser screenshots were saved here** because full Playwright release-gate and visual capture were not executed to completion in this session (Playwright startup/list is very slow in this environment; use a local/CI run with a running `next dev` or `PLAYWRIGHT_BASE_URL` for route screenshots).

To populate this folder in CI or locally:

1. Start the app (`npm run dev:next` in `nursenest-core/` with required env) or set `PLAYWRIGHT_BASE_URL` to a preview deployment.
2. Run the marketing/hub smoke or visual-qa capture scripts from `nursenest-core/package.json` and copy artifacts into this directory.

Representative routes to capture (from the audit brief): `/`, US RN hub, RPN, NP, New Grad, Allied (occupation + hub), Pre-Nursing, and a signed-in `/app` entry if credentials are available.
