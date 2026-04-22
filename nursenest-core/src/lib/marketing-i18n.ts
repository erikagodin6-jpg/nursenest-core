export {
  formatMarketingMessage,
  getOptionalMarketingMessage,
  getOptionalPublicMessage,
  getRequiredMarketingMessage,
  getRequiredPublicMessage,
  type MarketingMessageKey,
  type MarketingMessages,
} from "@/lib/marketing-i18n-core";
export { assertNoPlaceholder } from "@/lib/marketing-i18n/marketing-message-value-policy";
export { getRequiredPublicMetadataLine } from "@/lib/marketing-i18n/marketing-metadata-strict";
export {
  DEFAULT_SITE_BRAND_TITLE,
  DEFAULT_SITE_PRIMARY_DESCRIPTION,
  MARKETING_PRICING_CONVERSION_H1_FALLBACK,
  MARKETING_PRICING_CONVERSION_LEAD_FALLBACK,
  MARKETING_PRICING_CONVERSION_TRUST_LINE_FALLBACK,
  MARKETING_PRICING_TIER_SUBHEAD_FALLBACK,
} from "@/lib/marketing-i18n/marketing-safe-fallbacks";
/** Server-only: import from `@/lib/marketing-i18n/load-marketing-messages` (not this barrel). */
export {
  MarketingI18nProvider,
  MarketingI18nShardLayer,
  useMarketingI18n,
  useMarketingLocale,
} from "@/components/i18n/marketing-i18n-provider";
