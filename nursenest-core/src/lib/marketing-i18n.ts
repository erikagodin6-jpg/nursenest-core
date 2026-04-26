export {
  formatMarketingMessage,
  getOptionalPublicMessage,
  getOptionalPublicMessage as getOptionalMarketingMessage,
  getRequiredPublicMessage,
  getRequiredPublicMessage as getRequiredMarketingMessage,
  resolveMarketingCopy,
  type MarketingMessageKey,
  type MarketingMessages,
} from "@/lib/marketing-i18n-core";

export {
  assertNoPlaceholder,
  assertNoPublicPlaceholderCopy,
  humanizedMarketingKeyFallback,
  normalizeResolvedMarketingLeaf,
} from "@/lib/marketing-i18n/marketing-message-value-policy";

export {
  getRequiredPublicMetadataInterpolated,
  getRequiredPublicMetadataLine,
  type MarketingMetadataInterpolationParams,
} from "@/lib/marketing-i18n/marketing-metadata-strict";

export {
  DEFAULT_SITE_BRAND_TITLE,
  DEFAULT_SITE_PRIMARY_DESCRIPTION,
  MARKETING_ALLIED_HUB_META_DESCRIPTION_FALLBACK,
  MARKETING_ALLIED_HUB_META_TITLE_FALLBACK,
  MARKETING_PRICING_CONVERSION_H1_FALLBACK,
  MARKETING_PRICING_CONVERSION_LEAD_FALLBACK,
  MARKETING_PRICING_CONVERSION_TRUST_LINE_FALLBACK,
  MARKETING_PRICING_TIER_SUBHEAD_FALLBACK,
  MARKETING_PUBLIC_FLASHCARD_SLUG_META_DESCRIPTION_GENERIC_FALLBACK,
  MARKETING_PUBLIC_FLASHCARD_SLUG_NOT_FOUND_TITLE_FALLBACK,
} from "@/lib/marketing-i18n/marketing-safe-fallbacks";

export {
  MarketingI18nProvider,
  MarketingI18nShardLayer,
  useMarketingI18n,
  useMarketingLocale,
} from "@/components/i18n/marketing-i18n-provider";