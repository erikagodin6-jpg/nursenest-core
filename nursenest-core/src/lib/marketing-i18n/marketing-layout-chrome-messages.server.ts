import "server-only";

import { safeAwait } from "@/lib/async/safe-await";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import {
  loadMarketingMessageShards,
  loadMarketingMessageShardsSync,
} from "@/lib/marketing-i18n/load-marketing-message-shards";
import {
  MARKETING_BUILD_LAYOUT_MESSAGE_SHARDS,
  MARKETING_CHROME_MESSAGE_SHARDS,
} from "@/lib/marketing-i18n/marketing-i18n-shard-groups";

const MARKETING_LAYOUT_MESSAGES_TIMEOUT_MS = 2600;
const LOCALE_CHROME_SHARD_TIMEOUT_MS = 2600;
const MARKETING_BUILD_PHASE = "phase-production-build";

function defaultLayoutShardList() {
  return process.env.NEXT_PHASE === MARKETING_BUILD_PHASE
    ? MARKETING_BUILD_LAYOUT_MESSAGE_SHARDS
    : MARKETING_CHROME_MESSAGE_SHARDS;
}

type DefaultChromeState = {
  shardKey: string;
  resolved: Record<string, string> | null;
  inflight: Promise<Record<string, string>> | null;
};

const defaultChromeState: DefaultChromeState = {
  shardKey: "",
  resolved: null,
  inflight: null,
};

function loadEnglishFallback(shards: readonly string[]) {
  try {
    return loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, shards);
  } catch {
    return {};
  }
}

/**
 * HARD GUARANTEES:
 * - NEVER returns {}
 * - NEVER caches empty bundle
 * - ALWAYS falls back to English
 */
export async function getMarketingDefaultLayoutChromeMessages(): Promise<Record<string, string>> {
  const shards = defaultLayoutShardList();
  const key = shards.join(",");

  if (defaultChromeState.shardKey !== key) {
    defaultChromeState.shardKey = key;
    defaultChromeState.resolved = null;
    defaultChromeState.inflight = null;
  }

  if (defaultChromeState.resolved) return defaultChromeState.resolved;
  if (defaultChromeState.inflight) return defaultChromeState.inflight;

  const p = (async () => {
    try {
      const loaded = await safeAwait(
        loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, shards),
        "marketing_layout.chrome_messages",
        MARKETING_LAYOUT_MESSAGES_TIMEOUT_MS,
      );

      let out: Record<string, string> = loaded ?? {};

      // Retry with sync fill
      if (Object.keys(out).length === 0) {
        try {
          const syncFill = loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, shards);
          if (Object.keys(syncFill).length > 0) {
            out = syncFill;
          }
        } catch {}
      }

      // FINAL GUARANTEE: fallback to English ALWAYS
      if (Object.keys(out).length === 0) {
        const fallback = loadEnglishFallback(shards);

        if (Object.keys(fallback).length === 0) {
          throw new Error(
            "[marketing_layout] CRITICAL: Unable to load ANY marketing chrome i18n (even English fallback)",
          );
        }

        out = fallback;
      }

      // Only cache VALID bundle
      defaultChromeState.resolved = out;

      return out;
    } finally {
      defaultChromeState.inflight = null;
    }
  })();

  defaultChromeState.inflight = p;
  return p;
}

/* =========================
   LOCALE VERSION (FIXED)
   ========================= */

type LocaleChromePayload = {
  messages: Record<string, string>;
  fallbackMessages: Record<string, string> | undefined;
};

const localeChromeResolved = new Map<string, LocaleChromePayload>();
const localeChromeInflight = new Map<string, Promise<LocaleChromePayload>>();

function fillLocaleChromeFromSync(locale: string, shards: readonly string[]): LocaleChromePayload {
  const messages = loadMarketingMessageShardsSync(locale, shards);

  const fallbackMessages =
    locale === DEFAULT_MARKETING_LOCALE
      ? undefined
      : loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, shards);

  return { messages, fallbackMessages };
}

export async function getMarketingLocaleLayoutChromePayload(
  locale: string,
): Promise<LocaleChromePayload> {
  const cached = localeChromeResolved.get(locale);
  if (cached) return cached;

  let p = localeChromeInflight.get(locale);

  if (!p) {
    p = (async () => {
      const shards = defaultLayoutShardList();

      try {
        let messages =
          (await safeAwait(
            loadMarketingMessageShards(locale, shards),
            `marketing_layout.locale:${locale}`,
            LOCALE_CHROME_SHARD_TIMEOUT_MS,
          )) ?? {};

        let fallbackMessages =
          locale === DEFAULT_MARKETING_LOCALE
            ? undefined
            : (await safeAwait(
                loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, shards),
                "marketing_layout.locale_en",
                LOCALE_CHROME_SHARD_TIMEOUT_MS,
              )) ?? {};

        // Sync recovery
        if (Object.keys(messages).length === 0) {
          const sync = fillLocaleChromeFromSync(locale, shards);
          messages = sync.messages;

          if (locale !== DEFAULT_MARKETING_LOCALE) {
            fallbackMessages = sync.fallbackMessages;
          }
        }

        // FINAL GUARANTEE
        if (Object.keys(messages).length === 0) {
          const fallback = loadEnglishFallback(shards);

          if (Object.keys(fallback).length === 0) {
            throw new Error(
              `[marketing_layout] CRITICAL: locale "${locale}" has no valid i18n data`,
            );
          }

          messages = fallback;
        }

        const payload = { messages, fallbackMessages };

        localeChromeResolved.set(locale, payload);
        return payload;
      } finally {
        localeChromeInflight.delete(locale);
      }
    })();

    localeChromeInflight.set(locale, p);
  }

  return p;
}