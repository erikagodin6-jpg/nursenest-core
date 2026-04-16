import "server-only";

/**
 * HTTP cache headers for **anonymous, non-user-specific** JSON and static marketing data.
 *
 * - **`/app/*` and authenticated APIs** must stay `private, no-store` (see `next.config.ts`).
 * - **`/api/public/*`** may use `public` so DigitalOcean / CDN edges can cache one payload for many users.
 * - **Locale / country:** Marketing **HTML** is split by route (`/`, `/fr/...`); shared stats JSON is
 *   locale-neutral today. If we add locale-specific counts, add query params + `Vary` and separate
 *   {@link unstable_cache} key parts — never serve user-specific HTML from `public` cache.
 *
 * TTLs align with `PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC` and pathway lesson ISR where applicable.
 */

/** Next.js Data Cache + origin: homepage / paywall / `GET /api/public/home-stats` (same `unstable_cache`). */
export const PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC = 600;

/** Must match {@link CACHE_HEADER_PRICING_OPTIONS} `s-maxage` and `getCachedPricingOptionsPayload` revalidate. */
export const PRICING_OPTIONS_DATA_REVALIDATE_SEC = 300;

/**
 * Browser (max-age) short — revalidate in background via s-maxage + SWR at CDN.
 * CDN (s-maxage) holds aligned with data cache; stale-while-revalidate absorbs traffic spikes.
 */
export const CACHE_HEADER_HOME_STATS: HeadersInit = {
  "Cache-Control":
    "public, max-age=120, s-maxage=600, stale-while-revalidate=1800, stale-if-error=86400",
};

/** Aligns with {@link getCachedPublicFlashcardTags} revalidate + `GET /api/public/flashcard-tags` CDN TTL. */
export const PUBLIC_FLASHCARD_TAGS_CACHE_REVALIDATE_SEC = 120;

/** Lighter public lists (e.g. flashcard tags) — shorter edge TTL. */
export const CACHE_HEADER_PUBLIC_LIST: HeadersInit = {
  "Cache-Control": "public, max-age=60, s-maxage=120, stale-while-revalidate=600, stale-if-error=3600",
};

/**
 * Display pricing catalog (`GET /api/pricing/options`) — env-derived labels only; **Stripe checkout still validates**
 * price IDs server-side. Short CDN TTL reduces load during traffic spikes; bump when changing `STRIPE_*_PRICE` envs.
 */
export const CACHE_HEADER_PRICING_OPTIONS: HeadersInit = {
  "Cache-Control": "public, max-age=120, s-maxage=300, stale-while-revalidate=900, stale-if-error=3600",
};
