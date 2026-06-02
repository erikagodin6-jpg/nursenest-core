# NurseNest mobile architecture

## Goals

- **Web (`nursenest-core/`)** remains the canonical SEO, marketing, and public-learning surface.
- **Mobile (`apps/mobile/`)** is the premium learner shell: tabs for Home, Lessons, Flashcards, Practice, and Account.
- **Reuse** Next.js + Auth.js (`/api/auth`) and existing JSON APIs; **no** parallel entitlement engines or duplicated lesson content systems.

## Repository layout

| Path | Role |
|------|------|
| `apps/mobile/` | Expo SDK 52 + React Native + Expo Router app (Hermes). |
| `packages/nursenest-mobile-shared/` | Metro-safe TypeScript: API boundary types, pathway allowlist, cookie/CSRF helpers, lesson URL builders. **No** Prisma, Next server, or Node-only imports. |
| `nursenest-core/src/lib/mobile-native/` | **Source-of-truth contracts** (types + policy comments). Shared package mirrors these where needed; keep comments pointing here. |

## Environment (production-safe)

- **Only** `EXPO_PUBLIC_*` for non-secret config embedded in the client bundle (e.g. `EXPO_PUBLIC_NURSE_NEST_WEB_ORIGIN`).
- Optional `app.json` → `expo.extra.webOrigin` for local overrides (still non-secret).
- **Never** ship `AUTH_SECRET`, `NEXTAUTH_SECRET`, Stripe secrets, or service keys in the app.

## Auth and session

1. **Primary path (implemented in `apps/mobile/lib/auth-context.tsx`):** `postCredentialsSignIn` from `@nursenest/mobile-shared` performs the same CSRF + `POST /api/auth/callback/credentials` sequence as the web app, merges `Set-Cookie` via `readSetCookieHeaders` / `mergeCookieJar` when the runtime exposes them, and stores the composed cookie jar in **Expo SecureStore** (`secureKeys.authCookieJar`). `fetchAuthSession` validates against `/api/auth/session`.
2. **Fetch + Set-Cookie caveat:** Some RN runtimes omit `Set-Cookie` on JS `fetch` responses. The shared helper prefers `headers.getSetCookie()` when available; if sign-in fails only on device, fall back to a **WebView-based** handoff (not shipped in the default route tree) or a future opaque exchange endpoint—see `auth/credentials-sign-in.ts` comments.
3. **Expo Go vs dev client:** SecureStore and native networking behave most reliably in **development/production builds** (`expo run:ios` / `expo run:android`).

## Data and APIs

- Use `createJsonApiClient` from `@nursenest/mobile-shared` with `getCookieHeader` wired to the SecureStore-backed store.
- Higher-level lesson helpers (`lessons-api.ts`, `api-paths.ts`) build the same paths the web app uses; server gates entitlements.

## UI / theme

- RN theme tokens live in `apps/mobile/lib/theme.ts`, aligned to `:root` defaults in `nursenest-core/src/app/semantic-status-tokens.css` (e.g. brand `#1da2d8`).
- `AppThemeProvider` follows system light/dark; expand with explicit toggle later if product requires it.

## Offline and resilience

- `@react-native-community/netinfo` surfaces connectivity (`useNetworkHint`) for future TanStack persistence / queueing.
- `ErrorBoundary` catches render errors; engagement analytics are **stubbed** in `hooks/useAnalytics.ts` until a vetted RN SDK + keys exist.

## Safeguards

- Mobile work **must not** change Prisma schema, marketing SEO routes, admin RBAC, or allied-only surfaces.
- V1 pathway allowlist is **`MOBILE_V1_PATHWAYS`** in `@nursenest/mobile-shared` — extend only when product approves new RN/PN/NP tracks.

## Truthpack

`.vibecheck/truthpack` is **not present** in this clone; do not invent product tiers or prices from memory—read live `product` sources in-repo when changing entitlements or paywall copy.
