import type { I18nShardFilename } from "@shared/i18n-shard-policy";

/**
 * Shared public chrome shards.
 *
 * Keep this set small and stable. These shards are safe for global shell usage:
 * header, footer, auth links, billing labels, navigation, shared UI, and errors.
 *
 * Do NOT add:
 * - "pages" here: route bodies should load it locally
 * - "allied" here: allied vertical pages should load it only where needed
 * - "admin" here: staff-only copy must never be bundled into anonymous public chrome
 */
export const MARKETING_CHROME_MESSAGE_SHARDS = [
  "marketing",
  "nav",
  "brand",
  "components",
  "common",
  "auth",
  "billing",
  "learner",
  "errors",
] as const satisfies readonly I18nShardFilename[];

/**
 * Minimal build-time anonymous marketing shell.
 *
 * This is intentionally narrower than MARKETING_CHROME_MESSAGE_SHARDS to reduce
 * build memory during prerender. It still covers keys commonly read by the
 * default marketing layout/header/footer during the first layout pass.
 */
export const MARKETING_BUILD_LAYOUT_MESSAGE_SHARDS = [
  "marketing",
  "nav",
  "brand",
  "components",
  "common",
  "auth",
] as const satisfies readonly I18nShardFilename[];

/**
 * Route-owned marketing body copy.
 *
 * Large page-body tables belong to route pages/components, not global layouts.
 */
export const MARKETING_PAGE_BODY_MESSAGE_SHARDS = [
  "pages",
] as const satisfies readonly I18nShardFilename[];

/**
 * Default public marketing route bundle.
 *
 * Use this only where a public marketing route truly needs both chrome and
 * page-body copy. Layout-only code should prefer MARKETING_CHROME_MESSAGE_SHARDS
 * or MARKETING_BUILD_LAYOUT_MESSAGE_SHARDS.
 */
export const MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS = [
  ...MARKETING_CHROME_MESSAGE_SHARDS,
  ...MARKETING_PAGE_BODY_MESSAGE_SHARDS,
] as const satisfies readonly I18nShardFilename[];

/**
 * Allied health vertical copy.
 *
 * Load only under allied-health surfaces. Keeping this out of the shared shell
 * prevents unrelated public pages from paying for allied-specific copy.
 */
export const MARKETING_ALLIED_VERTICAL_MESSAGE_SHARDS = [
  "allied",
] as const satisfies readonly I18nShardFilename[];

/**
 * Subscriber app shell copy.
 *
 * This intentionally excludes "pages" so the app shell can render without
 * pulling large route-body tables into every /app/* layout.
 */
export const LEARNER_APP_SHELL_MESSAGE_SHARDS = [
  ...MARKETING_CHROME_MESSAGE_SHARDS,
] as const satisfies readonly I18nShardFilename[];

/**
 * Subscriber app bundle for routes that require page-body copy.
 */
export const LEARNER_APP_MESSAGE_SHARDS = [
  ...LEARNER_APP_SHELL_MESSAGE_SHARDS,
  ...MARKETING_PAGE_BODY_MESSAGE_SHARDS,
] as const satisfies readonly I18nShardFilename[];

/**
 * Staff-only CMS / ops copy.
 *
 * Loaded from the private admin i18n source, never from public i18n bundles.
 */
export const ADMIN_ONLY_MESSAGE_SHARDS = [
  "admin",
] as const satisfies readonly I18nShardFilename[];

/**
 * Full admin UI bundle.
 *
 * Use for admin pages that need app/page copy plus staff-only labels.
 * Do not use this for anonymous marketing or subscriber learner routes.
 */
export const ADMIN_UI_MESSAGE_SHARDS = [
  ...LEARNER_APP_MESSAGE_SHARDS,
  ...ADMIN_ONLY_MESSAGE_SHARDS,
] as const satisfies readonly I18nShardFilename[];

/**
 * Admin layout shell bundle.
 *
 * Keeps /admin first paint lighter by excluding "pages"; admin route bodies
 * should load their own body copy where needed.
 */
export const ADMIN_LAYOUT_MESSAGE_SHARDS = [
  ...MARKETING_CHROME_MESSAGE_SHARDS,
  ...ADMIN_ONLY_MESSAGE_SHARDS,
] as const satisfies readonly I18nShardFilename[];