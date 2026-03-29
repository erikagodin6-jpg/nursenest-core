export { formatMarketingMessage, type MarketingMessages } from "@/lib/marketing-i18n-core";
/** Server-only: import from `@/lib/marketing-i18n/load-marketing-messages` (not this barrel). */
export {
  MarketingI18nProvider,
  useMarketingI18n,
  useMarketingLocale,
} from "@/components/i18n/marketing-i18n-provider";
