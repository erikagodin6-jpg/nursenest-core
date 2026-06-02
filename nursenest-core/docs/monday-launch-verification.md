# Monday Launch Verification

Date: 2026-05-31

## Completed

- Implemented the US launch billing path as multi-currency: Canada remains CAD and US launch pricing resolves to USD.
- Added tier-specific US Stripe price resolution for RN, LPN/LVN, NP, New Grad, and Allied Health plans.
- Updated pricing payload generation so US learners see USD pricing and Canada learners continue to see CAD pricing.
- Hardened checkout verification coverage for regional price lookup, Stripe Tax enablement, idempotency, retry handling, and North America billing acknowledgement.
- Added required revenue analytics event constants and firing coverage for signup, trial, purchase, cancellation, flashcards, CAT, and practice starts.
- Added webhook capture coverage for `subscription_purchased` alongside existing trial, conversion, and cancellation events.
- Added the admin launch dashboard at `/admin/us-launch-status`.
- Added automated launch readiness contract coverage through `npm run test:us-launch`.
- Added CI-runnable US funnel coverage through `npm run test:e2e:us-launch`.

## Remaining

- Configure production or staging US Stripe price IDs for all required `STRIPE_PRICE_US_*` variables.
- Run the authenticated signup, trial, hosted checkout, subscription creation, cancellation, reactivation, and next-day return checks against a connected QA database.
- Run the Stripe webhook verification against a real Stripe test endpoint with US products and prices configured.
- Re-run the full US launch E2E suite with `QA_SIGNUP_EMAIL_DOMAIN`, QA auth/session configuration, Stripe test credentials, and reachable database services.

## Blocked

- Full local end-to-end signup and study validation is blocked by the local database connection resolving to `HOST:5432`.
- Live checkout and subscription lifecycle validation is blocked until Stripe test credentials and US price IDs are available in the verification environment.
- The runnable unauthenticated and smoke portions of the E2E suite pass, but purchase-path tests are intentionally skipped without QA and Stripe credentials.

## Verification

- `npm run test:us-launch` passed.
- `node --import tsx --test src/lib/pricing/pricing-options-payload-validate.test.ts src/lib/pricing/display-catalog-pricing-tracks.test.ts src/lib/pricing/pricing-options-checkout-availability.contract.test.ts` passed.
- Targeted TypeScript check for touched launch, pricing, checkout, analytics, and feature files returned no matching errors.
- `PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=http://127.0.0.1:3055 npm run test:e2e:us-launch` passed 10 checks and skipped 5 credential-dependent checks.

## Hours Remaining

Estimated time to launch-ready verification: 4-6 hours if Stripe US products, QA credentials, and database access already exist.

Estimated time if US Stripe products or QA fixtures must still be created: 8-12 hours.

## Final Verdict

Needs Work.

The code remediation is in place, but NurseNest should not be marked Launch Ready until the authenticated US RN learner funnel is validated end to end with real QA database access and Stripe test credentials.
