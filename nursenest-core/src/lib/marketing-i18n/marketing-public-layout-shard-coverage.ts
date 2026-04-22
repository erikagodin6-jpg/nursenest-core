import { i18nShardForKey, type I18nShardFilename } from "@shared/i18n-shard-policy";
import { MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";

const DEFAULT_PUBLIC_MARKETING_SHARD_SET = new Set<string>(MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS);

/**
 * Shard file (e.g. `pages`, `nav`) that owns this flat key's first segment.
 * Use for diagnostics when a key is missing from a merged bundle.
 */
export function publicMarketingLayoutShardForKey(key: string): I18nShardFilename {
  return i18nShardForKey(key);
}

/** True when the key lives in a shard merged by the default anonymous marketing layout loader. */
export function isKeyInDefaultPublicMarketingMessageLayout(key: string): boolean {
  return DEFAULT_PUBLIC_MARKETING_SHARD_SET.has(i18nShardForKey(key));
}

/**
 * Build-time / test helper: fail fast if any key would not be present in
 * {@link MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS} (e.g. `allied.*` only on allied routes).
 */
export function assertKeysLoadedByDefaultPublicMarketingLayout(keys: readonly string[], context: string): void {
  const bad: Array<{ key: string; shard: I18nShardFilename }> = [];
  for (const key of keys) {
    const shard = i18nShardForKey(key);
    if (!DEFAULT_PUBLIC_MARKETING_SHARD_SET.has(shard)) {
      bad.push({ key, shard });
    }
  }
  if (!bad.length) return;
  const lines = bad.map((b) => `  locale=default-merge key="${b.key}" expectedShard="${b.shard}" surface="${context}"`);
  throw new Error(`[marketing-shard-coverage] Keys not covered by MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS:\n${lines.join("\n")}`);
}
