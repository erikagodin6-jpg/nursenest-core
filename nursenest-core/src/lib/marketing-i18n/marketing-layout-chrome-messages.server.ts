import "server-only";

import { safeAwait } from "@/lib/async/safe-await";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import {
  MARKETING_BUILD_LAYOUT_MESSAGE_SHARDS,
  MARKETING_CHROME_MESSAGE_SHARDS,
  MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
} from "@/lib/marketing-i18n/marketing-i18n-shard-groups";

const MARKETING_LAYOUT_MESSAGES_TIMEOUT_MS = 1200;
const MARKETING_BUILD_PHASE = "phase-production-build";

function defaultLayoutShardList() {
  return process.env.NEXT_PHASE === MARKETING_BUILD_PHASE
    ? MARKETING_BUILD_LAYOUT_MESSAGE_SHARDS
    : MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS;
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
    const loaded = await safeAwait(
      loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, shards),
      "marketing_layout.chrome_messages",
      MARKETING_LAYOUT_MESSAGES_TIMEOUT_MS,
    );
    const out = loaded ?? {};
    defaultChromeState.resolved = out;
    defaultChromeState.inflight = null;
    return out;
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
      const messages = (await loadMarketingMessageShards(locale, MARKETING_CHROME_MESSAGE_SHARDS)) ?? {};
      const fallbackMessages =
        locale === DEFAULT_MARKETING_LOCALE
          ? undefined
          : ((await loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, MARKETING_CHROME_MESSAGE_SHARDS)) ?? {});
      const payload: LocaleChromePayload = { messages, fallbackMessages };
      localeChromeResolved.set(locale, payload);
      localeChromeInflight.delete(locale);
      return payload;
    })().catch((err) => {
      localeChromeInflight.delete(locale);
      throw err;
    });
    localeChromeInflight.set(locale, p);
  }
  return p;
}
