# Lesson flow QA (pathway marketing → lessons → detail)

Two layers validate the six registered pathways in `src/lib/qa/lesson-flow-pathways.ts` (`LESSON_FLOW_PATHWAY_QA`).

## What runs where

| Script | What it does | What it does **not** do |
|--------|----------------|-------------------------|
| `npm run qa:lesson-flows` | Fast HTTP smoke: cookies, GETs, HTML heuristics, HEAD checks on linked routes | Real browser, JS, layout, or auth flows |
| `npm run qa:lesson-flows:browser` | Playwright (Chromium desktop): clicks, first-paint exam cards, CTAs, study loop, breadcrumbs | Mobile viewports (future), visual regression |
| `npm run qa:lesson-flows:all` | HTTP then browser in sequence | — |

## Environment

- **`BASE_URL`** — target origin (default `http://127.0.0.1:3000`). Use the same value for local dev, `next start`, or a deployed preview/prod smoke host.
- **Browser tests require a running server** at `BASE_URL` (Playwright does not start `next dev` for you).

Example:

```bash
cd nursenest-core
BASE_URL=http://127.0.0.1:3000 npm run dev   # terminal 1
BASE_URL=http://127.0.0.1:3000 npm run qa:lesson-flows:browser   # terminal 2
```

Install browsers once (CI or first local run):

```bash
npx playwright install chromium
```

## Adding a pathway

1. Ensure the pathway exists in the exam registry and `LESSON_FLOW_PATHWAY_QA` (see `lesson-flow-pathways.ts`).
2. Confirm the lessons hub exposes a primary lesson link (`data-nn-qa-primary-lesson="true"` on featured or first grouped lesson).
3. Re-run HTTP + browser suites against `BASE_URL`.

## Dev flake notes

- Cold Next dev or DB can cause slow first responses; both runners use bounded retries for GETs.
- Clear `localStorage` `nursenest-region` before region tests if you manually switched region in the same browser profile (Playwright clears it per test).
- `retry_recovered` in the HTTP summary means a later attempt succeeded after an empty/599-style response.

## Wrong-destination helpers

Shared rules live in `assertUrlAllowedForPathway` (marketing paths, related lessons/topic clusters, `/app/*` + `pathwayId`, and auth pages with `callbackUrl` validation).
