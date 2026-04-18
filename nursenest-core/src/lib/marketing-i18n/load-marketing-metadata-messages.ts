import { cache } from "react";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import type { I18nShardFilename } from "@shared/i18n-shard-policy";
import { loadSharedMarketingMessagesOnce } from "@/lib/marketing-i18n/shared-marketing-message-cache";
import { loadMarketingMessageShards, loadMarketingMessageShardsSync } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_PAGE_BODY_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";

function pickMetadataKeys(messages: Record<string, string>, keys: readonly string[]): Record<string, string> {
  const picked: Record<string, string> = {};
  for (const key of keys) {
    const value = messages[key];
    if (typeof value === "string" && value.length > 0) {
      picked[key] = value;
    }
  }
  return picked;
}

function mergeMetadataKeys(
  primary: Record<string, string>,
  fallback: Record<string, string>,
  keys: readonly string[],
): Record<string, string> {
  const merged: Record<string, string> = {};
  for (const key of keys) {
    const primaryValue = primary[key];
    const fallbackValue = fallback[key];
    if (typeof primaryValue === "string" && primaryValue.length > 0) {
      merged[key] = primaryValue;
    } else if (typeof fallbackValue === "string" && fallbackValue.length > 0) {
      merged[key] = fallbackValue;
    }
  }
  return merged;
}

export function loadMarketingMetadataMessagesSync(
  locale: string,
  keys: readonly string[],
  shards: readonly I18nShardFilename[] = MARKETING_PAGE_BODY_MESSAGE_SHARDS,
): Record<string, string> {
  const primary = pickMetadataKeys(
    loadMarketingMessageShardsSync(locale, shards),
    keys,
  );

  if (locale === DEFAULT_MARKETING_LOCALE) {
    return primary;
  }

  const fallback = pickMetadataKeys(
    loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, shards),
    keys,
  );

  return mergeMetadataKeys(primary, fallback, keys);
}

async function loadMetadataShard(
  locale: string,
  shards: readonly I18nShardFilename[],
): Promise<Record<string, string>> {
  const shardKey = shards.join(",");
  return loadSharedMarketingMessagesOnce(`marketing-metadata-shards:${locale}:${shardKey}`, async () => {
    return (await loadMarketingMessageShards(locale, shards)) ?? {};
  });
}

export const loadMarketingMetadataMessages = cache(async function loadMarketingMetadataMessages(
  locale: string,
  keys: readonly string[],
  shards: readonly I18nShardFilename[] = MARKETING_PAGE_BODY_MESSAGE_SHARDS,
): Promise<Record<string, string>> {
  const primary = pickMetadataKeys(await loadMetadataShard(locale, shards), keys);

  if (locale === DEFAULT_MARKETING_LOCALE) {
    return primary;
  }

  const fallback = pickMetadataKeys(await loadMetadataShard(DEFAULT_MARKETING_LOCALE, shards), keys);
  return mergeMetadataKeys(primary, fallback, keys);
});
