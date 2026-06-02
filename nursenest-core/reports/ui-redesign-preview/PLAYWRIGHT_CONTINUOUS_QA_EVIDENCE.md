# Playwright continuous QA evidence (premium alignment pass)

Also mirrored at `reports/ui-redesign-preview/PLAYWRIGHT_CONTINUOUS_QA_EVIDENCE.md`.

Generated **2026-05-08** (updated same day after learner + marketing reruns).

## Summary of code changes

| Area | Change |
|------|--------|
| Playwright webServer | `npm run dev` → `npx next dev` in Playwright configs (monolith `server/index.ts` not in package). |
| E2E base URL | `tests/e2e/helpers/e2e-env.ts`: default `http://127.0.0.1:3000` (IPv4 aligns with `next dev --hostname 127.0.0.1`). |
| Release health APIs | `release-health-apis.spec.ts`: canonical RN hub expects **200**. |
| Phase 1 guest | Pricing CTA scoped to **`main`**; wait “Choose Your Plan”; onboarding: isolated context + redirect assertions. |
| **proxy.ts** | Pass through **3xx** from NextAuth instead of replacing with `NextResponse.next()`. |
| **Practice questions hub** | `[locale]/[slug]/[examCode]/questions/page.tsx`: always mount `MarketingPracticeQuestionsHubClient` when not topic-narrowed (including pathway bank count **0**), so `[data-testid="marketing-practice-questions-hub"]` stays present alongside ramping copy. |

## Mandatory checks

| Command | Result |
|---------|--------|
| `npm run test:homepage` | EXIT **0** (2026-05-08) |
| `npm run typecheck:critical` | EXIT **0** (after questions hub edit, 2026-05-08) |
| `npx playwright test -c playwright.release-gate.config.ts --list` | EXIT **0** — 19 tests / 9 files (2026-05-08) |

## Evidence table

| Surface | Route / spec | First run | Fixes made | Rerun | Remaining blocker |
|---------|----------------|-----------|------------|-------|-------------------|
| WebServer | Playwright configs | FAIL (missing server entry) | `npx next dev` in config | OK | — |
| Health APIs | `tests/e2e/release/release-health-apis.spec.ts` | FAIL | 127.0.0.1 default + hub **200** expectation | PASS | — |
| Phase 1 guest | `tests/e2e/release/phase-1-release-qa-guest.spec.ts` | FAIL (pricing / onboarding) | Scope CTAs to `main`; proxy **3xx** passthrough | PASS | — |
| Learner smoke | `npm run test:e2e:learner-surfaces-smoke` → `learner-surfaces.smoke.spec.ts` | EXIT **1** — `[data-testid="marketing-practice-questions-hub"]` missing on `/us/rn/nclex-rn/questions` when pathway bank count **0** | Render `MarketingPracticeQuestionsHubClient` whenever `!isTopicNarrowed` | EXIT **0** (3 passed, 3 skipped — paid/staff need creds) | Paid/staff rows skipped without `QA_PAID_*` / admin creds |
| Marketing visual QA | `tests/e2e/public/marketing-visual-qa-guard.spec.ts` | EXIT **1** — `net::ERR_CONNECTION_REFUSED` (no running app; default `BASE_URL` localhost) | Started `npx next dev --hostname 127.0.0.1 --port 3000`; ran with `BASE_URL=http://127.0.0.1:3000` | EXIT **0** (13 passed) | Spec expects **external** dev/prod URL unless CI starts server |

## Notes

- **Marketing visual QA guard** does not start `webServer`; document workflow is “app already running” (`BASE_URL`). First failure was **no server**, not product regression.
- **Learner smoke** paid/admin tests remain skipped until credentials are set; document as **BLOCKED** for “complete paid surfaces,” not a Playwright defect.

*Verified By VibeCheck ✅*
