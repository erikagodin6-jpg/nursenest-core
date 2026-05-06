type AlliedProfessionCatalogModule = {
  lessons?: unknown[];
};

/**
 * Static manifest for optional per-profession allied lesson shards.
 *
 * Keep this explicit so Turbopack never has to resolve an open-ended dynamic
 * import for `allied-professions/${file}` when no optional shards are present.
 */
export const ALLIED_PROFESSION_DEDICATED_CATALOGS: Readonly<Record<string, AlliedProfessionCatalogModule>> = {};
