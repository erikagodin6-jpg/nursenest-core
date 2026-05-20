# NurseNest mobile (Expo / React Native)

Expo SDK 52 app under `apps/mobile/`, with shared contracts in `packages/nursenest-mobile-shared/`.

## Commands

| Goal | Command |
| --- | --- |
| Dev server | `npm start` (from this directory) |
| Typecheck | `npm run typecheck` |
| Lint | `npm run lint` |
| Web regression (mobile viewports) | `cd ../nursenest-core && npm run test:e2e:mobile` |
| Web export / bundle probe | `npm run export:web` |
| Release readiness | `npm run release:readiness` |

From **monorepo root**:

```bash
npm run mobile:typecheck
npm run mobile:typecheck:shared
npm run mobile:lint
npm run mobile:eas:build
npm run mobile:release:readiness
```

## EAS

`eas.json` defines `development`, `preview`, and `production` profiles. Run `eas init` / link the project and set `EAS_PROJECT_ID` for real builds; `app.config.ts` falls back to a placeholder UUID for local config only.

## Env

See `env.example`. Required for API + sign-in: `EXPO_PUBLIC_APP_ORIGIN` (or the web origin vars documented there). Optional: PostHog, Sentry DSN, query persistence flag.
