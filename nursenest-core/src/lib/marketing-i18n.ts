export {
  formatMarketingMessage,
  type MarketingMessageKey,
  type MarketingMessages,
} from "@/lib/marketing-i18n-core";
/** Server-only: import from `@/lib/marketing-i18n/load-marketing-messages` (not this barrel). */
export {
  MarketingI18nProvider,
  MarketingI18nShardLayer,
  useMarketingI18n,
  useMarketingLocale,
} from "@/components/i18n/marketing-i18n-provider";
