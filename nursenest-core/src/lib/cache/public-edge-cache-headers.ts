/**
 * Public edge cache TTLs and `Cache-Control` values for **anonymous** JSON and marketing data.
 *
 * Kept **without** `server-only` so route handlers and unit tests can import headers without pulling
 * the `server-only` gate (see `public-edge-cache.ts` for the server-bundled re-export).
 */

/** Next.js Data Cache + origin: homepage / paywall / `GET /api/public/home-stats` (same `unstable_cache`). */
export const PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC = 3600;

/** Must match {@link CACHE_HEADER_PRICING_OPTIONS} `s-maxage` and `getCachedPricingOptionsPayload` revalidate. */
export const PRICING_OPTIONS_DATA_REVALIDATE_SEC = 300;

/**
 * Browser (max-age) short — revalidate in background via s-maxage + SWR at CDN.
 * CDN (s-maxage) holds aligned with data cache; stale-while-revalidate absorbs traffic spikes.
 */
export const CACHE_HEADER_HOME_STATS: HeadersInit = {
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=86400",
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
