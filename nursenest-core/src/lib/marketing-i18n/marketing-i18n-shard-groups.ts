import type { I18nShardFilename } from "@shared/i18n-shard-policy";

/**
 * Shards needed for global marketing chrome (header/footer/shell) without route-body tables.
 * Excludes `pages` (large route-owned keyspace) and `allied` (vertical-specific).
 */
export const MARKETING_CHROME_MESSAGE_SHARDS = [
  "marketing",
  "learner",
  "auth",
  "billing",
  "nav",
  "brand",
  "errors",
  "components",
  "common",
] as const satisfies readonly I18nShardFilename[];

/**
 * Build-time marketing layout shell: anonymous public chrome keys for prerender (narrower than
 * {@link MARKETING_CHROME_MESSAGE_SHARDS} to save memory). Must still cover homepage/header/footer
 * paths that read synchronously during the layout pass.
 */
export const MARKETING_BUILD_LAYOUT_MESSAGE_SHARDS = [
  "marketing",
  "nav",
  "components",
  "auth",
  "brand",
] as const satisfies readonly I18nShardFilename[];

/** Route/marketing page bodies (`pages.*` keys). */
export const MARKETING_PAGE_BODY_MESSAGE_SHARDS = ["pages"] as const satisfies readonly I18nShardFilename[];

/**
 * Default marketing shell + route-body copy for prerendered public pages.
 * Keeps allied vertical keys out of the shared layout bundle.
 */
export const MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS = [
  ...MARKETING_CHROME_MESSAGE_SHARDS,
  ...MARKETING_PAGE_BODY_MESSAGE_SHARDS,
] as const satisfies readonly I18nShardFilename[];

/** Allied health marketing vertical (`allied.*`). Loaded only under `/allied-health/*`. */
export const MARKETING_ALLIED_VERTICAL_MESSAGE_SHARDS = ["allied"] as const satisfies readonly I18nShardFilename[];

/**
 * Subscriber `/app/*` surfaces: full product copy without the allied marketing vertical.
 * Includes `pages` for a few shared snippets (e.g. paywall sample question copy).
 */
export const LEARNER_APP_MESSAGE_SHARDS = [
  ...MARKETING_CHROME_MESSAGE_SHARDS,
  ...MARKETING_PAGE_BODY_MESSAGE_SHARDS,
] as const satisfies readonly I18nShardFilename[];

/** Staff-only CMS / ops copy — loaded from `i18n-admin-only/{locale}/admin.json`, never from `public/`. */
export const ADMIN_ONLY_MESSAGE_SHARDS = ["admin"] as const satisfies readonly I18nShardFilename[];

/**
 * Admin chrome (`(admin)` layout): learner/marketing shards plus staff `admin` shard.
 * Do not use for anonymous or subscriber marketing surfaces.
 */
export const ADMIN_UI_MESSAGE_SHARDS = [
  ...LEARNER_APP_MESSAGE_SHARDS,
  ...ADMIN_ONLY_MESSAGE_SHARDS,
] as const satisfies readonly I18nShardFilename[];

/**
 * Admin shell header/footer only — omits heavy `pages` shard to keep `/admin` first paint fast.
 * (Route bodies under `(admin)` load their own copy where needed.)
 */
export const ADMIN_LAYOUT_MESSAGE_SHARDS = [
  ...MARKETING_CHROME_MESSAGE_SHARDS,
  ...ADMIN_ONLY_MESSAGE_SHARDS,
] as const satisfies readonly I18nShardFilename[];
