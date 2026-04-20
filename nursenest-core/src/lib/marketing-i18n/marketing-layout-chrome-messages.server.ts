import "server-only";

import { safeAwait } from "@/lib/async/safe-await";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import {
  MARKETING_BUILD_LAYOUT_MESSAGE_SHARDS,
  MARKETING_CHROME_MESSAGE_SHARDS,
} from "@/lib/marketing-i18n/marketing-i18n-shard-groups";

/** Must exceed `MARKETING_SHARD_ASYNC_FACTORY_BUDGET_MS` in `load-marketing-message-shards.ts` (2500). */
const MARKETING_LAYOUT_MESSAGES_TIMEOUT_MS = 2600;
/** Must exceed `MARKETING_SHARD_ASYNC_FACTORY_BUDGET_MS` in `load-marketing-message-shards.ts` (2500). */
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

/**
 * Singleton chrome bundle for `(marketing)/(default)` layout — loader runs here, not in `layout.tsx`.
 * Runtime uses `MARKETING_CHROME_MESSAGE_SHARDS` only; `pages.*` loads under `<main>` via
 * `MarketingMainI18nShards`.
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
      const out = loaded ?? {};
      defaultChromeState.resolved = out;
      return out;
    } catch {
      /* Leave `resolved` null so a later request can retry after transient FS/network issues. */
      return {};
    } finally {
      defaultChromeState.inflight = null;
    }
  })();
  defaultChromeState.inflight = p;
  return p;
}

type LocaleChromePayload = {
  messages: Record<string, string>;
  fallbackMessages: Record<string, string> | undefined;
};

const localeChromeResolved = new Map<string, LocaleChromePayload>();
const localeChromeInflight = new Map<string, Promise<LocaleChromePayload>>();

/**
 * Singleton chrome bundle for `(marketing)/[locale]` layout.
 */
export async function getMarketingLocaleLayoutChromePayload(locale: string): Promise<LocaleChromePayload> {
  const hit = localeChromeResolved.get(locale);
  if (hit) return hit;

  let p = localeChromeInflight.get(locale);
  if (!p) {
    p = (async () => {
      const messages =
        (await safeAwait(
          loadMarketingMessageShards(locale, MARKETING_CHROME_MESSAGE_SHARDS),
          `marketing_layout.locale_chrome:${locale}`,
          LOCALE_CHROME_SHARD_TIMEOUT_MS,
        )) ?? {};
      const fallbackMessages =
        locale === DEFAULT_MARKETING_LOCALE
          ? undefined
          : ((await safeAwait(
              loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, MARKETING_CHROME_MESSAGE_SHARDS),
              `marketing_layout.locale_chrome_en`,
              LOCALE_CHROME_SHARD_TIMEOUT_MS,
            )) ?? {});
      const payload: LocaleChromePayload = { messages, fallbackMessages };
      localeChromeResolved.set(locale, payload);
      localeChromeInflight.delete(locale);
      return payload;
    })().catch(() => {
      localeChromeInflight.delete(locale);
      const empty: LocaleChromePayload = {
        messages: {},
        fallbackMessages: locale === DEFAULT_MARKETING_LOCALE ? undefined : {},
      };
      localeChromeResolved.set(locale, empty);
      return empty;
    });
    localeChromeInflight.set(locale, p);
  }
  return p;
}
