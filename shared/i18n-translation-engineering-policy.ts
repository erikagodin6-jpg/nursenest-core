/**
 * Engineering limits and rules for static translation bundles (compile-time + CI).
 * See docs/i18n-translation-engineering-policy.md.
 */

/** Max size of a single shard file `public/i18n/{locale}/{name}.json` after compile. */
export const I18N_MAX_SHARD_FILE_BYTES = 850_000;

/**
 * Max size of a legacy monolithic `public/i18n/{locale}.json` when the tree still uses one file per locale.
 * Prefer shard layout so individual domains stay under {@link I18N_MAX_SHARD_FILE_BYTES}.
 */
export const I18N_MAX_LEGACY_MONOLITH_FILE_BYTES = 2_200_000;
