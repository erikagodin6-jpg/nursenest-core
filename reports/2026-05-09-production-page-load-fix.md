# Production homepage / EN bundle fix — 2026-05-09

## Root cause

Canonical English marketing bundle `nursenest-core/public/i18n/en/pages.json` was missing the **Phase 4 premium homepage** keys enforced by `homepage-premium-en-pages.contract.test.ts`:

- `pages.home.hero.eyebrow`, `headlinePremium`, `subheadingPremium`
- Premium CTAs (`premiumPrimaryCta`, `premiumSecondaryCta`)
- Hero panel labels (`pages.home.hero.panel.live`, `readinessLabel`, `streakLabel`, `masteredLabel`, `ecgLabel`)
- `pages.home.premium.readiness.dashboardCta`

`npm run test:homepage` failed on `main` with `missing key: pages.home.hero.eyebrow`. Shipping EN without these entries broke the homepage premium EN contract and left authoritative strings absent from the flat bundle used by marketing i18n.

## Files changed

| File | Change |
|------|--------|
| `nursenest-core/public/i18n/en/pages.json` | Added 11 flat keys with production copy matching the contract test. |

## Validation commands run

From `nursenest-core/`:

- `npm run typecheck:critical` — pass
- `npm run build` — pass
- `npm run test:homepage` — pass

## Production SHA target

Recorded below as repository `HEAD` after `git push origin main`. DigitalOcean deploy SHA was not read via API in this session.

## Baseline

Pre-fix `HEAD` matched `98110acb8` (`fix(ai): repair OpenRouter invalid-model export mismatch`).


## Git HEAD after push

`7ba118c0fc7e96605be1d7ebf9a58f3a09848ebc`
