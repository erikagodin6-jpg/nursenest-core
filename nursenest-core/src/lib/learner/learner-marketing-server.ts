import "server-only";

import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { formatMarketingMessage, type MarketingMessages } from "@/lib/marketing-i18n-core";
import { loadMarketingMessages, loadMarketingMessagesSync } from "@/lib/marketing-i18n/load-marketing-messages";

export type LearnerMarketingT = (
  key: string,
  params?: Record<string, string | number | undefined>,
) => string;

/**
 * Marketing UI locale for all `/app/*` surfaces: same cookie + loader as marketing default routes
 * ({@link getMarketingLocaleForDefaultRoute}).
 */
export async function getLearnerMarketingBundle(): Promise<{
  locale: string;
  messages: MarketingMessages;
  fallbackMessages: MarketingMessages;
  t: LearnerMarketingT;
}> {
  const locale = await getMarketingLocaleForDefaultRoute();
  const messages = await loadMarketingMessages(locale);
  const fallbackMessages = loadMarketingMessagesSync(DEFAULT_MARKETING_LOCALE);
  const t: LearnerMarketingT = (key, params) => formatMarketingMessage(messages, key, params, fallbackMessages);
  return { locale, messages, fallbackMessages, t };
}
