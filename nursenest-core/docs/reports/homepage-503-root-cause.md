# Homepage 503 / 500 Root Cause Report

Generated: 2026-06-01

## Executive summary

Production homepage links were reproduced with Playwright against `https://nursenest.ca`.

The homepage itself and health endpoints were alive, but homepage cards that route into the shared marketing exam hub were returning `500 Internal Server Error`. The user-reported `503` symptom is consistent with upstream health degradation under load, but the direct incident reproduction found application-level `500` failures on the affected hub routes.

## Root cause

The shared nursing-tier marketing hub client component called `useSession()` directly:

`src/components/marketing/nursing-tier-hub-page.tsx`

When the shared exam hub was rendered without an available NextAuth `SessionProvider` context, `next-auth/react` threw:

`[next-auth]: useSession must be wrapped in a <SessionProvider />`

That exception aborts server rendering and produces the production `Internal Server Error` body for generic exam hub routes linked from the homepage.

The fix replaces the hard `useSession()` dependency with a non-throwing `useContext(SessionContext)` read. If a provider is present, signed-in behavior is preserved. If not, the public hub renders as a guest instead of crashing.

## Affected routes

Production direct HTTP and Playwright click checks:

| Route | Result before fix | Notes |
| --- | ---: | --- |
| `/` | 200 | Homepage loaded. |
| `/canada/rn/nclex-rn` | 500 | Homepage RN hub card. |
| `/canada/pn/rex-pn` | 500 | Homepage PN/RPN hub card. |
| `/canada/rpn/rex-pn` | 308 -> 500 | Redirects to canonical PN path, then fails. |
| `/us/rn/nclex-rn` | 500 | Same shared generic hub failure. |
| `/us/pn/nclex-pn` | 500 | Same shared generic hub failure. |
| `/canada/np/cnple` | 500 | Same shared nursing-tier hub failure. |
| `/canada-np-exam-prep` | 200 | Static NP landing route not affected. |
| `/lessons` | 200 | Homepage link passed. |
| `/flashcards` | 200 | Homepage link passed. |
| `/practice-tests` | 200 | Homepage link passed. |
| `/cat` | 200 | Direct route passed. |
| `/pricing` | 200 | Homepage link passed. |
| `/blog` | 200 | Homepage link passed. |
| `/login` | 200 | Homepage link passed. |
| `/signup` | 200 | Homepage link passed. |
| `/readyz` | 200 | Readiness was not the immediate failure path. |
| `/healthz` | 200 | Liveness was not the immediate failure path. |

## Evidence

Playwright clicked homepage navigation/card links in production. The RN and PN/RPN hub clicks landed on:

- Final URL: `https://nursenest.ca/canada/rn/nclex-rn`, status `500`, body `Internal Server Error`
- Final URL: `https://nursenest.ca/canada/pn/rex-pn`, status `500`, body `Internal Server Error`

Production build metadata:

- Live commit: `9324d83e6cc4773fb86b9bce8cc6d5cacd1bbe29`
- Branch: `main`
- Recorded at: `2026-06-01T19:27:43.735Z`

Local isolated server-render reproduction before the patch:

```text
/canada/rn/nclex-rn renderToString error Error: [next-auth]: `useSession` must be wrapped in a <SessionProvider />
/canada/pn/rex-pn renderToString error Error: [next-auth]: `useSession` must be wrapped in a <SessionProvider />
```

Local isolated server-render verification after the patch:

```text
/canada/rn/nclex-rn render ok 41934
/canada/pn/rex-pn render ok 49624
/canada/np/cnple render ok 62334
/us/rn/nclex-rn render ok 42103
```

## Files changed

- Root-cause code delta from live production: `src/components/marketing/nursing-tier-hub-page.tsx`
- Report generated in this workspace: `docs/reports/homepage-503-root-cause.md`

Note: the current workspace `HEAD` already contains the `SessionContext` guard. Live production is still on `9324d83e6cc4773fb86b9bce8cc6d5cacd1bbe29`, which contains the throwing `useSession()` call.

## Before / after behavior

Before:

- Public exam hub rendering could throw if `useSession()` was evaluated without a provider.
- A homepage click into RN, PN/RPN, or other nursing-tier generic hubs returned `500 Internal Server Error`.

After:

- Public exam hub rendering reads session context only if present.
- If session context is unavailable, the page renders as a guest.
- Signed-in hub link behavior is still preserved when the marketing auth provider is present.

## Verification

Passed:

- `npm run typecheck:critical`
- Direct route render probe for:
  - `/canada/rn/nclex-rn`
  - `/canada/pn/rex-pn`
  - `/canada/np/cnple`
  - `/us/rn/nclex-rn`

Could not complete local production build verification because this workspace contains an unrelated untracked `src/middleware.ts` file while the tracked app already uses `src/proxy.ts`. Next.js 16 aborts with:

```text
Both middleware file "./src/src/middleware.ts" and proxy file "./src/src/proxy.ts" are detected.
```

After temporarily parking and restoring that untracked shim for verification only, the direct `next build` retry was killed by the container before completion.

Targeted component test command also could not run in this install because `@happy-dom/global-registrator/register` is missing.

## Deployment note

Live production will continue to return the reproduced `500` responses until this code change is deployed. After deployment, rerun the same Playwright homepage-click check and direct HTTP checks for the affected routes before declaring production recovery.
