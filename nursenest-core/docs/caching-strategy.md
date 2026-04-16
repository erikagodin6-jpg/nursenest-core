# Public caching strategy (1k+ concurrent users)

This document defines **what** we cache, **where**, **TTLs**, **keys**, **invalidation**, and **boundaries** so anonymous marketing traffic scales without leaking user-specific data across cache lines.

## Layers (when to use what)

| Layer | Use for | Isolation | Typical TTL |
| --- | --- | --- | --- |
| **ISR** (`export const revalidate` on marketing pages) | HTML shells for `/`, `/[locale]/…` — static structure + server-rendered public blocks | Per route segment; combine with locale in URL | 600s homepage (aligned with home-stats data cache) |
| **Next `unstable_cache`** (Data Cache) | Expensive **anonymous** aggregates: home stats, display pricing JSON | **Key parts** must include region/country/locale dimensions when outputs differ; include `rev:${cacheDeploymentRevision()}` to bust on deploy | See table below |
| **HTTP `Cache-Control` (CDN / browser)** | `GET /api/public/*`, `GET /api/pricing/options` | **Only** if response does not vary on `Cookie` / `Authorization` / user headers; document `Vary` if we add locale query params | Aligned with matching `unstable_cache` revalidate |
| **In-process memory** (module singletons) | Dedup within one instance: i18n loader CDN fragments (`loadMarketing-messages`), small maps | Keyed by `locale` + shard + cache generation — **never** key by user id | Until process restart / generation bump |
| **React `cache()`** | Per-request dedupe of the same async call in one RSC tree | Request-scoped — not shared across users | N/A (one request) |

## Key parts and tags (Data Cache)

| Cache id | Key parts (conceptual) | `revalidate` (s) | Tag(s) for `revalidateTag` |
| --- | --- | --- | --- |
| Public home stats | `public-home-stats`, `v5`, `region:global`, `locale:neutral`, `rev:…`, revalidate suffix | 600 | `marketing:public-home-stats` |
| Pricing options (display) | `pricing-options`, `country:CA`, `rev:…`, revalidate suffix | 300 | `marketing:pricing-options` |

`cacheDeploymentRevision()` is derived from `VERCEL_DEPLOYMENT_ID`, `CACHE_REVISION`, `npm_package_version`, or `dev` (see `src/lib/cache/cache-revision.ts`). It **must** appear in Data Cache keys when payloads depend on env (Stripe price IDs, copy baked at build).

### CDN headers (must match data TTL intent)

- Home stats API: `CACHE_HEADER_HOME_STATS` — `s-maxage=600` (see `src/lib/cache/public-edge-cache.ts`).
- Pricing options API: `CACHE_HEADER_PRICING_OPTIONS` — `s-maxage=300`.

If you change `PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC` or `PRICING_OPTIONS_DATA_REVALIDATE_SEC`, update **both** the constant and the matching `s-maxage` comment in `public-edge-cache.ts`.

## Safe invalidation

- **Tag-based:** `import { revalidateTag } from "next/cache"` with `CACHE_TAG_MARKETING_*` from `src/lib/cache/cache-tags.ts` after admin/content operations that change counts or pricing display (or run from a deploy hook).
- **Deploy:** new `rev:` in keys drops old Data Cache entries for new server bundles.
- **Do not** tag learner-private, session, or entitlement responses.

## Cold cache / failure behavior

- **Home stats:** `getPublicHomeStats()` uses DB deadlines, safe mode, and `getDegradedPublicHomeStatsFallback()` so callers always get a **200-shaped** payload with `degraded` / `proofDisplay: "neutral"` when appropriate — no hard dependency on a warm Data Cache.
- **Pricing options:** `buildPricingOptionsPayload()` is synchronous catalog math over Stripe maps; cache miss recomputes quickly. If Stripe envs are wrong, prefer **empty rows** + `checkoutAvailable: false` over 5xx for display JSON.

## What must **NEVER** be cached globally (CDN / shared Data Cache)

- Anything keyed by **user id**, **session**, **email**, **auth cookie**, or **entitlement tier** (including “public” APIs that read `getServerSession` / cookies).
- **Checkout session amounts**, **invoice**, **subscription state**, **exam attempt progress**, **grades**, **PII**.
- **Personalized** recommendations or “continue where you left off”.
- Responses that **vary** on `Cookie` / `Authorization` unless the cache key includes that dimension **and** you intentionally want shared caching (rare; prefer `private, no-store`).

## What **may** be cached per user / session

- **Next.js `cookies()` / headers** inside a **dynamic** route: default is **not** shared across users; still avoid storing user-specific JSON in `unstable_cache` unless the key includes a **stable user-scoped id** and you accept staleness — usually **avoid**; prefer DB reads with short TTL in application logic.
- **Browser `sessionStorage` / React Query** for client-only UX (theme, last tab) — not a substitute for server authorization.

## Country / locale / exam manifests

- **Static catalogs** (e.g. `EXAM_PATHWAYS` in `exam-product-registry.ts`) ship with the bundle — no extra Data Cache; redeploy updates.
- **Locale-specific marketing copy:** `loadMarketingMessages(locale)` — disk + optional CDN; already uses per-locale + generation keys in the i18n loader (see `load-marketing-messages.ts`).
- If we add **locale-specific home stats** or **per-country pricing APIs**, add key parts `locale:xx`, `country:XX` and optional `Vary: Accept-Language` / query param contract — **do not** reuse `region:global` / `locale:neutral` entries.

## Principle

**Cache aggressively where the payload is anonymous and key-complete; never where the payload is user-specific or authorization-dependent.**
