# App Store compliance review (engineering — not legal advice)

## Facts

- **No** Apple IAP / Google Play Billing in this codebase for NurseNest subscriptions.
- Upgrades described as **website / billing** only; neutral wording in mobile UX.
- Mobile is an **authenticated learner client** (session cookies → same Next APIs).

## Risks (non-exhaustive)

- WebViews that complete purchase could change review posture — prefer Safari/system browser if policy requires.
- Adding IAP or “restore purchases” would change classification — explicitly out of scope.

## Copy guardrails

- Avoid in-app purchase phrasing; use “website”, “billing flow”, “when you are ready”.
