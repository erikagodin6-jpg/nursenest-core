import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import type { I18nShardFilename } from "@shared/i18n-shard-policy";
import {
  loadMarketingMessageShards,
  loadMarketingMessageShardsSync,
} from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_PAGE_BODY_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";

/**
 * SAFE pick
 */
function pickMetadataKeys(
  messages: Record<string, string> | null | undefined,
  keys: readonly string[],
): Record<string, string> {
  const picked: Record<string, string> = {};
  if (!messages) return picked;

  for (const key of keys) {
    const value = messages[key];
    if (typeof value === "string" && value.length > 0) {
      picked[key] = value;
    }
  }

  return picked;
}

/**
 * SAFE merge
 */
function mergeMetadataKeys(
  primary: Record<string, string>,
  fallback: Record<string, string>,
  keys: readonly string[],
): Record<string, string> {
  const merged: Record<string, string> = {};

  for (const key of keys) {
    const p = primary[key];
    const f = fallback[key];

    if (typeof p === "string" && p.length > 0) {
      merged[key] = p;
    } else if (typeof f === "string" && f.length > 0) {
      merged[key] = f;
    } else {
      merged[key] = "";
    }
  }

  return merged;
}

/**
 * SYNC SAFE
 */
export function loadMarketingMetadataMessagesSync(
  locale: string,
  keys: readonly string[],
  shards: readonly I18nShardFilename[] = MARKETING_PAGE_BODY_MESSAGE_SHARDS,
): Record<string, string> {
  try {
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
  } catch {
    const fallback = pickMetadataKeys(
      loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, shards),
      keys,
    );
    return fallback;
  }
}

/**
 * ASYNC SAFE
 */
async function loadMetadataShard(
  locale: string,
  shards: readonly I18nShardFilename[],
): Promise<Record<string, string>> {
  try {
    return (await loadMarketingMessageShards(locale, shards)) ?? {};
  } catch {
    return {};
  }
}

const metadataResolved = new Map<string, Record<string, string>>();
const metadataInflight = new Map<string, Promise<Record<string, string>>>();

function cacheKey(
  locale: string,
  keys: readonly string[],
  shards: readonly I18nShardFilename[],
): string {
  return `${locale}|${keys.join(",")}|${shards.join(",")}`;
}

/**
 * ASYNC PUBLIC
 */
export async function loadMarketingMetadataMessages(
  locale: string,
  keys: readonly string[],
  shards: readonly I18nShardFilename[] = MARKETING_PAGE_BODY_MESSAGE_SHARDS,
): Promise<Record<string, string>> {
  const key = cacheKey(locale, keys, shards);

  const hit = metadataResolved.get(key);
  if (hit) return hit;

  let inflight = metadataInflight.get(key);

  if (!inflight) {
    inflight = (async () => {
      try {
        const primary = pickMetadataKeys(
          await loadMetadataShard(locale, shards),
          keys,
        );

        if (locale === DEFAULT_MARKETING_LOCALE) {
          metadataResolved.set(key, primary);
          metadataInflight.delete(key);
          return primary;
        }

        const fallback = pickMetadataKeys(
          await loadMetadataShard(DEFAULT_MARKETING_LOCALE, shards),
          keys,
        );

        const merged = mergeMetadataKeys(primary, fallback, keys);

        metadataResolved.set(key, merged);
        metadataInflight.delete(key);
        return merged;
      } catch {
        const fallback = pickMetadataKeys(
          await loadMetadataShard(DEFAULT_MARKETING_LOCALE, shards),
          keys,
        );

        metadataResolved.set(key, fallback);
        metadataInflight.delete(key);
        return fallback;
      }
    })();

    metadataInflight.set(key, inflight);
  }

  return inflight;
}