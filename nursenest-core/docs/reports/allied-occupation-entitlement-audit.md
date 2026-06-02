# Allied Health occupation entitlement — audit

**Last updated:** 2026-05-10

## Immutable profession rule

- **Checkout (marketing):** On `/pricing`, the Allied Health track requires an explicit acknowledgement that **only one profession pathway** is included and that the choice **cannot be changed after purchase** before any paid checkout button proceeds or before redirect to Stripe.
- **Learner profile:** After an active Allied subscription establishes a resolved profession scope, **`alliedProfessionKey` is treated as locked** for normal self-serve updates. `PATCH /api/learner/exam-plan` returns **403** with `error: "allied_profession_locked"` when a locked learner attempts to change profession.
- **Billing UI:** Account billing shows **selected profession**, **locked status** when applicable, and a **support note** via `alliedProfessionSummary` in the billing payload.

## Support / admin override policy

- **Primary correction path:** Learners contact **support** when the wrong occupation was chosen at purchase or sync failed.
- **Engineering / Stripe:** Stripe Dashboard metadata edits are **out-of-band**; intentional changes should use **support / admin** processes, not learner self-serve toggles.

## UX confirmation flow (pricing)

1. User selects **Allied Health** and a **profession** pill.
2. A **warning region** explains single-pathway scope and irreversibility.
3. User checks the acknowledgement checkbox. Acknowledgement resets if segment or profession changes.
4. Checkout buttons and the consent modal **Continue** control stay disabled until acknowledgement.

## Verification

- Playwright: `tests/e2e/allied/allied-pricing-profession-ack.spec.ts`.

