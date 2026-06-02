# Marketing theme readability stabilization — 2026-05-09

## Server mode

- **Production:** `npm run build` then `npm run start` (Next standalone) on **port 3000**, with minimal env for local guardrails:
  - `AI_ADMIN_GENERATION_ENABLED=false`
  - `OPENAI_API_KEY=playwright-placeholder-openai`
  - `AUTH_SECRET=playwright-e2e-local-secret-auth-secret-32b`
- **Not used for this run:** `next dev` / Turbopack (avoids dev-server flake; matches user preference for screenshot runs).

## Playwright

Command (from `nursenest-core/`):

```bash
PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 \
npx playwright test tests/e2e/public/marketing-header-layout-responsive.spec.ts \
  --grep "Ocean / Blossom / Midnight" \
  --project=chromium \
  --workers=1
```

**Result:** exit code **0** (3 passed, serial).

### Flake mitigations

- **`PLAYWRIGHT_SKIP_WEB_SERVER=1`** with **`next start`** avoids webServer `next dev` churn and inotify limits.
- **`--workers=1`** keeps the serial suite predictable.
- **Scoped DOM:** audits and brand geometry use `header[data-nn-header-layout="…"]` and `[data-testid="marketing-header-primary-row"]` so the mobile (hidden at lg+) lockup is not measured.
- **Midnight vs light utility DOM:** row4 uses `[data-testid="marketing-header-utility-band"]`; unified dark uses `[data-testid="marketing-header-utility-inline"]` — tests branch accordingly.
- **Color parsing:** `getComputedStyle` returns `color(srgb …)`; in-browser audit parses that form for luminance and contrast (with a white-surface fallback when glass returns transparent `background-color`).

## Contrast / readability approach (automated)

- **Light (Ocean, Blossom):** utility/tier bands must not read as ink-black (distance / luminance heuristic); primary shell not near-black; wordmark vs sampled background contrast ≥ **2.85** (large text / UI heuristic), with white fallback when shell background is transparent.
- **Blossom:** extra guard `blossomShellPastel` (shell luminance > **0.2**).
- **Midnight:** login link + tier chip text luminance **> 0.78**; utility strip text **> 0.72**.
- **Hot pink:** tier chip must not equal classic hot pink RGB; shell scan rejects neon magenta/fuchsia on scoped chrome surfaces.

## Screenshots (under `nursenest-core/`)

- `docs/screenshots/marketing-header/theme-nav-ocean-1280x900-chromium.png`
- `docs/screenshots/marketing-header/theme-nav-blossom-1280x900-chromium.png`
- `docs/screenshots/marketing-header/theme-nav-midnight-1280x900-chromium.png`
- `docs/screenshots/marketing-header/theme-nav-ocean-390x844-chromium.png`
- `docs/screenshots/marketing-header/theme-nav-blossom-390x844-chromium.png`
- `docs/screenshots/marketing-header/theme-nav-midnight-390x844-chromium.png`

## CSS / tokens

- **No production CSS or token file changes** were required for this slice once tests targeted the correct DOM and color serializations.

## Remaining risks

- **Contrast fallback:** when computed `background-color` is fully transparent, light-theme lockup contrast uses **white (255,255,255)** as a conservative surrogate.
- **`isForbiddenNavPink` heuristic** could theoretically overlap an unusual saturated shell swatch.
- **Remote DATABASE_URL** may be present in dev containers; tests only hit `/`.

## Files changed

- `nursenest-core/tests/e2e/public/marketing-header-layout-responsive.spec.ts`
- `docs/reports/marketing-theme-readability-stabilization-2026-05-09.md`
- `nursenest-core/docs/screenshots/marketing-header/theme-nav-{ocean,blossom,midnight}-1280x900-chromium.png`
- `nursenest-core/docs/screenshots/marketing-header/theme-nav-{ocean,blossom,midnight}-390x844-chromium.png`
