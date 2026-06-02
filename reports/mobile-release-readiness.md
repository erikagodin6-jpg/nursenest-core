# Mobile release readiness — NurseNest Expo (`apps/mobile`)

**Date:** 2026-05-06

## Environment & config

| Item | Status |
|------|--------|
| `EXPO_PUBLIC_*` origins | Documented in-app when unset; no secrets in repo |
| `app.config.ts` | Dynamic config; `EAS_PROJECT_ID` from env; notifications plugin non-secret |
| `eas.json` | `development` / `preview` / `production` profiles present; submit production stub |
| Sentry | `lib/sentry.ts` — init from env; native symbolication noted as follow-up in code comments |

## Validation log

| Command | Result |
|---------|--------|
| `npm --prefix apps/mobile run typecheck` | **Pass** |
| `npm --prefix apps/mobile run lint` | **Pass** |
| `npx expo-doctor` | **Not run** — sandbox `npm`/`npx` failure (`ENOENT` under `~/.cursor-server/...`). Run on a developer machine before store submission. |
| iOS Simulator | **Not run** — not available in this environment |
| Android Emulator | **Not run** — not available in this environment |

## App Store (iOS) checklist

- [ ] Apple Developer Program + App Store Connect app record
- [ ] Privacy Nutrition Labels (analytics: PostHog; cookies/session; optional notifications)
- [ ] **Sign in with Apple** — evaluate if only email/password: may need justification or alternative per Apple guidelines
- [ ] Export compliance / encryption questionnaire (HTTPS + standard crypto)
- [ ] Screenshots per required device sizes
- [ ] **IAP:** App does not sell subscriptions in-app; copy states billing on web — align Review Notes with actual behavior
- [ ] TestFlight internal QA on physical devices (notch, Dynamic Island, Stage Manager split)
- [ ] EAS: production iOS credentials, `eas build --platform ios`, `eas submit`

### iOS blockers (remaining)

1. **Device QA not executed here** — Need real-device pass for navigation, keyboard, and lesson deep links.  
2. **expo-doctor / dependency health** — Must run locally and resolve any reported mismatches.  
3. **App Store Review narrative** — Prepare Review Notes for cookie-based web session auth and web-only subscription management.

## Google Play checklist

- [ ] Play Console listing + content rating questionnaire
- [ ] Data safety form (PostHog, session cookies, crash reporting)
- [ ] Target API level meets Play requirements for Expo SDK 52 / RN 0.76
- [ ] Internal testing track + pre-launch report
- [ ] **Billing:** No Play Billing for NurseNest subscription if web-only — ensure store listing matches
- [ ] EAS: production Android keystore / Play App Signing

### Play blockers (remaining)

1. **Emulator/device QA not executed here.**  
2. **Data safety & content rating** — Forms not filled in this task.  
3. **Play pre-launch report** — Run after first AAB upload.

## Non-blockers / nice-to-haves

- Sentry Expo config plugin for full native symbolication
- Dedicated CAT / flashcard API surfaces when product ready
- `expo-haptics` for light feedback on primary actions (optional, small dep)
