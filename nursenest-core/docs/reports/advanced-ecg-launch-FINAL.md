# Advanced ECG $99 Launch Report

## Summary

Advanced ECG has been productized as a standalone `$99 CAD` lifetime package with:

- dedicated public launch route at `/advanced-ecg`
- dedicated learner route at `/modules/ecg-advanced`
- public checkout gating aligned to module publish/readiness state
- billing/account visibility for owned specialty-package access
- launch-ready screenshot evidence for both guest marketing and authenticated learner states
- focused launch-contract coverage passing in the rollout worktree

## Routes and surfaces

- Public launch page: `/advanced-ecg`
- Pricing add-on block: `/pricing#advanced-ecg-add-on`
- Learner specialty page: `/modules/ecg-advanced`
- Learner purchase success state: `/modules/ecg-advanced?checkout=success`
- Advanced checkout API: `/api/subscriptions/checkout/advanced-ecg`
- Admin ECG module audit: `/admin/modules/ecg`

## Commercial contract

- Product: `Advanced ECG & Telemetry Mastery`
- Price: `$99 CAD`
- Purchase model: one-time lifetime package
- Stripe plan code: `module_advanced_ecg_lifetime`
- Public purchase state: gated by `AdvancedEcgCommercialLaunchState`
- Billing/account surfaces now show owned Advanced ECG package details

## Screenshot evidence

Captured in the rollout worktree under:
`/root/.config/superpowers/worktrees/nursenest-core/advanced-ecg-rollout/docs/screenshots/marketing-slot-captures/supplementary`

Generated screenshots:

- `advanced-ecg-launch-page.png`
- `advanced-ecg-pricing-block.png`
- `advanced-ecg-locked-learner.png`
- `advanced-ecg-unlocked-learner.png`
- `advanced-ecg-purchase-success.png`

## Verification

Focused checks completed in the rollout worktree:

- `node --test scripts/capture-marketing-screenshots.test.mjs`
- `SCREENSHOT_BASE_URL="http://localhost:3101" SCREENSHOT_TARGET_IDS="extra-advanced-ecg-locked-learner" node scripts/capture-marketing-screenshots.mjs`
- `SCREENSHOT_BASE_URL="http://localhost:3101" SCREENSHOT_DEMO_EMAIL="demo-advanced-ecg@internal.nursenest.io" SCREENSHOT_DEMO_PASSWORD="DemoAdvancedECG2024!" SCREENSHOT_TARGET_IDS="extra-advanced-ecg-unlocked-learner,extra-advanced-ecg-purchase-success" node scripts/capture-marketing-screenshots.mjs`

## Auth screenshot fix

The authenticated screenshot blocker was traced to the screenshot capture login helper entering credentials before the hydrated login form had switched to the real `method="post"` submission shell.

Resolution applied:

- added a regression test at `scripts/capture-marketing-screenshots.test.mjs`
- updated `scripts/capture-marketing-screenshots.mjs` to wait for the visible login form and verify `method="post"` before filling and submitting credentials
- re-ran the locked, unlocked, and purchase-success learner captures successfully against the warm local server

## Remaining risks

- Marketing copy warnings and unrelated i18n gaps still exist elsewhere in the repo and should be handled separately from Advanced ECG launch work.
- Screenshot CDN upload remains manual and must follow `docs/SCREENSHOT_CAPTURE_TO_CDN.md` before any production overwrite.
