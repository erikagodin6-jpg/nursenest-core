# Auth migration map (Replit → portable)

## Current touchpoints

### Server

- **`server/admin-auth.ts`** — JWT signing (`ADMIN_JWT_SECRET`), `resolveAuthUser`, Bearer / `x-user-token` / `x-user-id`, password path hits DB; optional `USER_AUTH_CACHE_TTL_MS` row cache.
- **`server/entitlements.ts`** — Sets `req.authUser` after resolution for entitlement middleware.
- **`server/routes.ts`** — Many handlers call `resolveAuthUser` / `requireAdmin`; preview cookies (`nursenest_preview`).
- **`server/auth-config.ts`** — Read-only helpers for Replit env (`REPLIT_DEPLOYMENT`, domains); extend here when introducing a new issuer.

### Client

- Search: `useAuth`, `admin-fetch`, `credentials: "include"`, token storage in localStorage for user tokens (varies by feature).

## Replit coupling

- **`REPLIT_DEPLOYMENT`**, **`REPLIT_DEV_DOMAIN` / `REPLIT_DOMAINS`** — assumed for redirects or host checks in some flows (audit client + server for `replit` string).
- **Session + cookies** — behavior may assume same-site deployment on Replit hostnames.

## Recommended replacement sequence

1. Define target session model (opaque server-side session id + minimal JWT or cookie).
2. Implement `resolveAuthUser` behind an interface; keep route signatures stable.
3. Migrate client to new login callback and storage; keep `admin-fetch` contract.
4. Remove Replit-only env branches once staging validates.

## Highest-risk migration area

- **`resolveAuthUser`** and any path that mixes **admin JWT**, **user JWT**, and **session cookie** — order of checks and cache invalidation must stay correct to avoid privilege confusion.

## Preparatory change (this repo)

- Centralized **`server/auth-config.ts`** for Replit-related env reads so future work replaces one module.
