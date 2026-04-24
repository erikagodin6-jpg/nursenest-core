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
 *
 * Constants live in `./public-edge-cache-headers` so tests and thin handlers can import headers
 * without resolving this `server-only` module.
 */

export {
  CACHE_HEADER_HOME_STATS,
  CACHE_HEADER_PRICING_OPTIONS,
  CACHE_HEADER_PUBLIC_LIST,
  PRICING_OPTIONS_DATA_REVALIDATE_SEC,
  PUBLIC_FLASHCARD_TAGS_CACHE_REVALIDATE_SEC,
  PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC,
} from "./public-edge-cache-headers";
