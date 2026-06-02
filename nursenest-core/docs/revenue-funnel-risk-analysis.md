# Revenue Funnel Risk Analysis

Generated: 2026-05-31

## Before

| Failure state | Risk | Impact |
| --- | --- | --- |
| Checkout redirects before webhook writes `Subscription` | High | Paying learner could land in the app before DB mirror exists and see unpaid gates. |
| Webhook orphan without trusted user metadata | High | Stripe subscription could exist while local entitlement remains inactive until manual support review. |
| Subscriber gate reads stale no-access cache after repair | High | A repaired subscription could still be denied inside the same request/process window. |
| Repeat checkout trial eligibility not checked at checkout | Medium | Returning learners could receive Stripe trials despite prior trial/subscription history. |
| Partial subscription metadata | Medium | Reconciliation had fewer trusted fields to recover plan, region, legal acceptance, and trial context. |
| Admin diagnostics split across endpoints | Medium | Operators had to know which billing and entitlement checks to run during an incident. |

## After

| Control | Result |
| --- | --- |
| Subscriber-gate Stripe recovery | Before returning `not_subscribed`, protected APIs reconcile the user from Stripe and retry entitlement with a fresh uncached read. |
| Checkout-success synchronization | `/api/subscriptions/sync-after-checkout` repairs the Stripe mirror before session/JWT sync on `/app?checkout=success`. |
| Fresh entitlement read API | `getUserAccessFresh` bypasses React/runtime entitlement cache after billing repair. |
| Trial eligibility guard | Checkout only sends `trial_period_days` when the server sees no prior subscription, no started/used trial, and no exhausted trial state. |
| Metadata preservation | Stripe Checkout now writes currency, trial eligibility, trial days, legal policy version, and acceptance timestamp to subscription metadata. |
| Revenue diagnostics dashboard | `/admin/revenue-reliability` displays Stripe config, webhook verification readiness, checkout origin readiness, drift signals, and links to reconcile tools. |
| Regression tests | Static contracts verify recovery ordering, trial checks, metadata preservation, and checkout-success sync ordering; Playwright covers anonymous sync endpoint behavior. |

## Residual Risk

The platform still depends on Stripe API availability for real-time repair. If Stripe is unavailable, the gate keeps existing premium stale-if-error behavior for previously cached premium users, but brand-new purchases may need webhook retry or admin reconciliation once Stripe recovers.
