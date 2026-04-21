import "server-only";

import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { formatMarketingMessage, type MarketingMessages } from "@/lib/marketing-i18n-core";
import { loadMarketingMessageShards, loadMarketingMessageShardsSync } from "@/lib/marketing-i18n/load-marketing-message-shards";
import {
  LEARNER_APP_MESSAGE_SHARDS,
  LEARNER_APP_SHELL_MESSAGE_SHARDS,
} from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-t";

export type { LearnerMarketingT };

/**
 * Marketing UI locale for all `/app/*` surfaces: same cookie + loader as marketing default routes
 * ({@link getMarketingLocaleForDefaultRoute}).
 */
/**
 * Minimal `/app` i18n for the segment layout and chrome: avoids eager-loading the full `pages`
 * marketing shard on every authenticated navigation.
 */
export async function getLearnerShellMarketingBundle(): Promise<{
  locale: string;
  messages: MarketingMessages;
  fallbackMessages: MarketingMessages;
  t: LearnerMarketingT;
}> {
  const locale = await getMarketingLocaleForDefaultRoute();
  const messages = await loadMarketingMessageShards(locale, LEARNER_APP_SHELL_MESSAGE_SHARDS);
  const fallbackMessages = loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, LEARNER_APP_SHELL_MESSAGE_SHARDS);
  const t: LearnerMarketingT = (key, params) =>
    formatMarketingMessage(messages, key, params, fallbackMessages, { locale });
  return { locale, messages, fallbackMessages, t };
}

export async function getLearnerMarketingBundle(): Promise<{
  locale: string;
  messages: MarketingMessages;
  fallbackMessages: MarketingMessages;
  t: LearnerMarketingT;
}> {
  const locale = await getMarketingLocaleForDefaultRoute();
  const messages = await loadMarketingMessageShards(locale, LEARNER_APP_MESSAGE_SHARDS);
  const fallbackMessages = loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, LEARNER_APP_MESSAGE_SHARDS);
  const t: LearnerMarketingT = (key, params) =>
    formatMarketingMessage(messages, key, params, fallbackMessages, { locale });
  return { locale, messages, fallbackMessages, t };
}
