import { i18nShardForKey, type I18nShardFilename } from "@shared/i18n-shard-policy";
import { MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";

const DEFAULT_PUBLIC_MARKETING_SHARD_SET = new Set<I18nShardFilename>(
  MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
);

function assertUsableMarketingKey(key: string, context: string): string {
  const normalized = key.trim();

  if (!normalized) {
    throw new Error(`[marketing-shard-coverage] Empty marketing key in ${context}`);
  }

  if (!normalized.includes(".")) {
    throw new Error(
      `[marketing-shard-coverage] Invalid flat marketing key "${key}" in ${context}; expected dotted key.`,
    );
  }

  return normalized;
}

/**
 * Shard file, e.g. `pages` or `nav`, that owns this flat key's first segment.
 */
export function publicMarketingLayoutShardForKey(key: string): I18nShardFilename {
  return i18nShardForKey(assertUsableMarketingKey(key, "publicMarketingLayoutShardForKey"));
}

/**
 * True when the key lives in a shard merged by the default anonymous marketing layout loader.
 */
export function isKeyInDefaultPublicMarketingMessageLayout(key: string): boolean {
  const normalized = assertUsableMarketingKey(
    key,
    "isKeyInDefaultPublicMarketingMessageLayout",
  );

  return DEFAULT_PUBLIC_MARKETING_SHARD_SET.has(i18nShardForKey(normalized));
}

/**
 * Build-time / test helper.
 *
 * Fails fast if any key would not be present in MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
 * for example `allied.*`, which should only load on allied-health routes.
 */
export function assertKeysLoadedByDefaultPublicMarketingLayout(
  keys: readonly string[],
  context: string,
): void {
  const bad: Array<{ key: string; shard: I18nShardFilename }> = [];

  for (const rawKey of keys) {
    const key = assertUsableMarketingKey(rawKey, context);
    const shard = i18nShardForKey(key);

    if (!DEFAULT_PUBLIC_MARKETING_SHARD_SET.has(shard)) {
      bad.push({ key, shard });
    }
  }

  if (bad.length === 0) return;

  const lines = bad.map(
    ({ key, shard }) =>
      `  locale=default-merge key="${key}" expectedShard="${shard}" surface="${context}"`,
  );

  throw new Error(
    `[marketing-shard-coverage] Keys not covered by MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS:\n${lines.join(
      "\n",
    )}`,
  );
}