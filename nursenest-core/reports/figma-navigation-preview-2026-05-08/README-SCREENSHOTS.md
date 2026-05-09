# Screenshot capture notes

Automated PNG capture is implemented in `tests/e2e/preview/figma-navigation-preview.capture.spec.ts` (writes into this directory).

**Local prerequisites**

1. From the isolated worktree app folder `nursenest-core/` install deps (`npm install`) so `node_modules` is real (not a symlink — Turbopack rejects symlinked `node_modules` that escape the project root).
2. Start Next dev with auth secret check skipped for local preview:  
   `NN_SKIP_DEV_AUTH_SECRET=1 npm run dev:next`  
   Use a free port if 3000 is busy (e.g. `--port 3002`).
3. Run Playwright with matching `BASE_URL`:  
   `BASE_URL=http://localhost:3002 npx playwright test tests/e2e/preview/figma-navigation-preview.capture.spec.ts --project=chromium`

If the dev server fails during `instrumentation` / Turbopack compile in your environment, capture manually from the same URLs listed in the main report.

Expected filenames per variant folder (`a/`, `b/`, `c/`):

- `desktop-anonymous-light.png`
- `desktop-learner-light.png`
- `desktop-dropdown-open-light.png`
- `desktop-dropdown-open-dark.png`
- `desktop-anonymous-dark.png`
- `desktop-sticky-scrolled-light.png`
- `mobile-anonymous-light.png`
- `mobile-learner-light.png`
- `mobile-sheet-open-light.png`
