# NurseNest mobile — auth, entitlements, session lifecycle

## Truthpack

The workspace `.vibecheck/truthpack/` directory was **not present** in this clone at authoring time. This document avoids inventing tier names or prices; refer to production `product.json` / `routes.json` when truthpack is regenerated (`vibecheck truthpack`).

## Goals

- **Single auth plane**: mobile talks to the existing **NextAuth (Auth.js) v5** deployment on the NurseNest web app (`PINNED_AUTH_BASE_PATH` = `/api/auth`). No parallel auth server and **no password verification** on device.
- **Server-authoritative entitlements**: subscription and pathway rules stay in Next.js routes (`requireSubscriberSession`, `resolveEntitlement`, `getUserAccess`). Mobile only renders paywalls / upgrade UX from HTTP status + JSON `code`.

## Session transport (cookie jar)

Web uses **httpOnly** session cookies (`authjs.session-token` / `__Secure-authjs.session-token` and legacy `next-auth.*` names). React Native `fetch` does not manage a browser cookie jar, so the app:

1. Calls `GET /api/auth/csrf` and merges `Set-Cookie` into an in-memory **cookie header string** (see `packages/nursenest-mobile-shared` `mergeCookieJar`).
2. Posts credentials to `POST /api/auth/callback/credentials` (form body mirrors web `signIn("credentials", { redirect:false })`).
3. Persists the merged `Cookie` header string in **Expo SecureStore** (`nn_auth_cookie_jar`).
4. Refreshes identity via `GET /api/auth/session` (same endpoint the web `getSession` uses).

### Risks / limitations

- **`Set-Cookie` visibility**: some RN runtimes expose only the first cookie via `headers.get("set-cookie")`. The shared helper prefers `headers.getSetCookie()` when available. If sign-in succeeds but subsequent calls 401, verify runtime cookie merging against a device capture.
- **`SameSite=Lax` + native app**: cookies are attached only to the configured **origin** (`EXPO_PUBLIC_APP_ORIGIN`). Deep links / alternate hosts require explicit engineering (not in V1).
- **JWT refresh**: strategy matches web — JWT session with `updateAge` on the server. Mobile should periodically call `GET /api/auth/session` after long backgrounding (hook not yet wired; call `refreshSession()` from `AuthProvider`).

## 401 / logout hygiene

- API wrapper throws on **401** and invokes `onUnauthorized` → `signOut()` clears SecureStore keys, cookie jar state, Zustand pathway defaults, and **React Query cache** (via `onSessionCleared` in `app/_layout.tsx`).
- TanStack Query defaults **do not retry** when the error object carries `{ status: 401 }` (`mobileQueryClientDefaults`).

## Entitlement & paywall UX

Mobile reads the same JSON the web uses, for example:

| Surface | Route | Gate |
|--------|-------|------|
| Profile / pathway / goals | `GET`/`PATCH` `/api/learner/personal-profile` | Session; entitlement for pathway picks |
| Command center | `GET` `/api/learner/command-center` | `requireSubscriberSession` |
| Readiness | `GET` `/api/learner/readiness` | Subscriber |
| Flashcards due | `GET` `/api/flashcards/due-summary` | Subscriber |
| Engagement nudges | `GET` `/api/learner/engagement-nudges` | Subscriber |

Known denial codes handled in UX helpers (`shouldShowUpgradeUi`, `parseApiErrorCode`): `not_subscribed`, `unauthorized`, `access_verify_failed`, `region_tier_locked`, `learner_path_invalid`.

## Pathway onboarding (V1)

RN / PN / NP pathway IDs are enumerated in `@nursenest/mobile-shared` and must match `nursenest-core/src/lib/exam-pathways/*`. Pending selection is stored in SecureStore; server `learnerPath` is updated at the end of onboarding via `PATCH /api/learner/personal-profile`. Changing pathways later uses the same PATCH plus query invalidation (`(app)/pathway-change.tsx`).

## Manual E2E (cold start)

1. Set `EXPO_PUBLIC_APP_ORIGIN` to staging or dev web origin (https, no trailing slash).
2. Install deps: `npm install` in `apps/mobile` and `packages/nursenest-mobile-shared`.
3. `npx expo start` → launch simulator/device.
4. Sign in with a real learner account; confirm `GET /api/learner/personal-profile` returns 200.
5. Toggle airplane mode briefly → confirm 401 path clears session without redirect loops (single gate in `app/index.tsx`).

## Automated tests (CI)

```bash
npm --prefix packages/nursenest-mobile-shared install
npm --prefix packages/nursenest-mobile-shared run test
```

Pure logic: cookie merge, paywall helpers, pathway allowlist, query-key predicates, query retry policy.
