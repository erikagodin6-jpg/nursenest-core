# Playwright Conversion Audit

The conversion audit is a focused release gate for the financially critical learner path:

Anonymous visitor -> signup -> email verification -> login -> onboarding -> free paywall -> trial -> premium access -> checkout handoff.

## Command

```bash
npm run test:e2e:conversion-audit
```

## Required Environment

- `QA_SIGNUP_EMAIL_DOMAIN`: allowed catch-all domain for unique test signups.
- `DATABASE_URL`: database used by the running app so the suite can verify account persistence and email-verification token creation.

The hosted Stripe completion test is intentionally opt-in:

```bash
E2E_STRIPE_CHECKOUT_ENABLED=1 \
E2E_STRIPE_CHECKOUT_EMAIL=qa-billing@example.com \
E2E_STRIPE_CHECKOUT_PASSWORD='...' \
npm run test:e2e:conversion-audit
```

Use Stripe test-mode price variables and test credentials only.

## Coverage

- Homepage CTA discovery: Get Started, Sign Up, Pricing, and trial/checkout CTA visibility.
- Browser health: console errors, page errors, request failures, JS failures, and hydration failures.
- Signup form: email, password, password confirmation, validation, API success, persisted user.
- Email verification: verification token creation plus the real `/api/auth/verify-email` route.
- Login: credentials login, remember-me session persistence after refresh, logout, and login again.
- Onboarding: RN, RPN, NP, Pre-Nursing, and Allied Health role options, pathway selection, study goals, completion persistence.
- Free user access: preview surfaces visible, premium content gated, upgrade prompts present.
- Trial: activation, trial dates, trial status, premium access during trial.
- Subscription access: active subscription row grants premium access.
- Checkout: pricing modal policy acceptance, checkout payload, and Stripe redirect handoff.

## Notes

The verification email itself is provider-dependent. The suite proves that signup creates a verification token, then creates a known test token and exercises the same verification route a learner email link uses. This avoids relying on a real inbox while still catching dead verification routes and activation failures.
