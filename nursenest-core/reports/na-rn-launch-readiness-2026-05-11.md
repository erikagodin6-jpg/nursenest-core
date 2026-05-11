# North America RN Launch Readiness

Date: 2026-05-11
Scope: `us-rn-nclex-rn`, `ca-rn-nclex-rn`
Decision: No-go for a clean launch signoff in this environment

## What landed

- Hardened RN billing country handling so shared North America Stripe prices no longer invent a CA/US country on reverse lookup.
- Preserved checkout metadata through webhook and reconciliation sync paths so user country/tier writes prefer explicit plan metadata over ambiguous `priceId` inference.
- Repaired RN audit/runbook tooling and added the missing package scripts for readiness, flashcard audits, practice-hub audits, and release-health.
- Raised Canada RN parity in public, mobile, signup, paid, CAT, and owned-pathway suites.
- Added explicit Canada RN sitemap contract coverage and added Canada RN routes to visual evidence capture packs.

## Verification that passed

- `npm run typecheck:critical`
  - Passed after the CA RN parity and SEO updates.
- `npm run test:unit:stripe`
  - Passed: 35 tests, 0 failures.
  - Includes the NA shared-price ambiguity regression and webhook/reconcile metadata preservation checks.
- `npm run test:seo-sitemap`
  - Passed: 57 tests, 0 failures.
  - Includes the explicit CA RN sitemap contract.
- `node --import tsx --test src/lib/seo/sitemap-rn-pn-core-pathways.contract.test.ts`
  - Passed in isolation after stabilizing the contract.
- `npm run readiness:emit-snapshot`
  - Passed and rewrote `src/config/pathway-readiness-snapshot.json`.
- `npm run audit:practice-hub:us-rn`
  - Passed with `totalMatchingRows: 5235`.
- `npm run audit:practice-hub:ca-rn`
  - Passed with `totalMatchingRows: 5235`.
- `npm run qa:release-gate:health`
  - Passed once with 4/4 checks green, including `/api/health/ready`.

## Blocking results

- `npm run qa:release-gate:guest`
  - Failed overall because the dependent health burst check regressed during this run.
  - Failure: `tests/e2e/release/healthz-liveness-burst.spec.ts`
  - Signal: one `/healthz` request measured `824ms`, above the `<200ms` release threshold.
  - Guest-route assertions themselves passed in that run; the failure was the health blocker.

- `npm run qa:release-gate:mobile`
  - Failed before a trustworthy mobile signoff.
  - Guest dependency hit `ERR_CONNECTION_REFUSED` and `ECONNREFUSED` on `/signup` and `/app/onboarding`, which points to local server instability during the release-gate chain rather than a validated mobile pass.

- `npm run qa:release-gate:paid`
  - No paid verification was possible here.
  - All paid projects were explicitly skipped because paid Playwright credentials were not configured.

- `npm run verify:sitemap`
  - Failed with `getaddrinfo ENOTFOUND www.nursenest.ca`.
  - This environment could not resolve the canonical host, so live sitemap verification is still outstanding.

- `npm run verify:robots`
  - Failed with the same DNS resolution error for `www.nursenest.ca`.

- `npm run visual-qa:check-env`
  - Failed because `AUTH_SECRET` or `NEXTAUTH_SECRET` was missing for the visual QA flow.
  - The shared authenticated route-pack capture therefore could not be completed in this environment.

## Credential and environment gaps

- Paid learner credentials missing for release-gate paid projects.
- Free learner credentials missing for free-user release checks.
- Admin credentials missing for admin/support release checks.
- Stripe hosted checkout rehearsal was not opted in for this environment.
- Visual QA auth secret missing.
- DNS resolution for `www.nursenest.ca` unavailable from this container.

## Evidence notes

- Release-gate summaries and artifacts were written under `test-results/release-gate/`.
- Public nursing-hub screenshot capture was started via `playwright.nursing-hubs.config.ts`, but this environment did not complete a clean RN screenshot proof run before surfacing hub-level failures and other unrelated marketing copy noise.
- The strongest environment-independent evidence now lives in the billing contract suite, sitemap suite, readiness snapshot refresh, and both RN practice-hub audits.

## Current go/no-go read

No-go in the current environment.

The RN slice is materially closer to launch-ready now: billing hardening is in place, CA RN parity coverage was added, runbook tooling is repaired, and local contract coverage is green. But this is not yet a clean launch signoff because the release gate is not consistently green, mobile was not validated end-to-end, paid/admin/free credential-gated checks were unavailable, and live sitemap/robots verification is still blocked by environment DNS.

## Remaining blockers to clear

- Re-run `qa:release-gate:guest` after stabilizing the local/staging server enough for `/healthz` to stay under the release threshold.
- Run `qa:release-gate:mobile` to completion without connection-refused failures.
- Supply paid, free, and admin credentials and re-run the release-gate projects that are currently skipped.
- Restore DNS access to `www.nursenest.ca` and re-run `verify:sitemap` and `verify:robots`.
- Provide `AUTH_SECRET` and complete a clean visual QA capture pass if screenshot evidence is required for final signoff.


## Post-report follow-up

- Re-ran `tests/e2e/public/nursing-pathway-hubs-smoke.spec.ts` with `playwright.nursing-hubs.config.ts` after tightening the RN premium heading assertions.
- Result: `14 passed (3.6m)`.
- The prior Canada RN failure was fixed by scoping the `Study tools` and `Readiness & progress` heading checks to the premium hub surface.
- The prior US RN page crash did not reproduce in isolated reruns or in the full nursing-hubs rerun, so it currently looks like a transient environment/browser instability rather than an active deterministic RN hub bug.
