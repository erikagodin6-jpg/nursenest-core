import { isProductionBuildInvocation } from "@/lib/build/build-safe-mode";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { assertMarketingHeroNavCriticalOrThrow } from "@/lib/marketing/marketing-build-time-chrome-validation";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";

const REQUIRED_EN_MARKETING_SHELL_KEYS = [
  "brand.nurseNest",
  "brand.homeAriaLabel",
  "nav.logIn",
  "nav.language",
  "nav.theme",
  "nav.pricing",
  "footer.blog",
  "footer.faq",
] as const;

function missingRequiredEnMarketingShellKeys(messages: MarketingMessages): string[] {
  return REQUIRED_EN_MARKETING_SHELL_KEYS.filter((key) => {
    const value = messages[key];
    return typeof value !== "string" || value.trim().length === 0;
  });
}

export function assertMarketingLayoutMessagesIntegrity({
  route,
  locale,
  messages,
  fallbackMessages,
}: {
  route: string;
  locale: string;
  messages: MarketingMessages;
  fallbackMessages?: MarketingMessages;
}) {
  const messageCount = Object.keys(messages).length;
  if (messageCount === 0) {
    const fallbackCount = fallbackMessages ? Object.keys(fallbackMessages).length : 0;
    throw new Error(
      `[marketing-layout] ${route} loaded 0 primary messages for locale "${locale}" (fallbackCount=${fallbackCount}); refusing to render degraded chrome.`,
    );
  }

  if (locale === DEFAULT_MARKETING_LOCALE) {
    const missingRequiredKeys = missingRequiredEnMarketingShellKeys(messages);
    if (missingRequiredKeys.length > 0) {
      throw new Error(
        `[marketing-layout] ${route} is missing required English marketing shell keys: ${missingRequiredKeys.join(", ")}`,
      );
    }
  }

  // Default marketing layout intentionally loads `MARKETING_BUILD_LAYOUT_MESSAGE_SHARDS`
  // during `next build` prerender (subset of chrome); extra keys may load under `<main>` or at
  // runtime via `MARKETING_CHROME_MESSAGE_SHARDS`. Do not block the production build on keys
  // absent from the reduced build merge only.
  if (isProductionBuildInvocation()) {
    return;
  }

  assertMarketingHeroNavCriticalOrThrow(messages, `[marketing-layout] ${route} locale="${locale}"`);
}
