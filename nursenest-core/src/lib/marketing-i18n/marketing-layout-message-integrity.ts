import { isProductionBuildInvocation } from "@/lib/build/build-safe-mode";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { assertMarketingHeroNavCriticalOrThrow } from "@/lib/marketing/marketing-build-time-chrome-validation";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";

const REQUIRED_MARKETING_SHELL_KEYS = [
  "brand.nurseNest",
  "brand.homeAriaLabel",
  "footer.blog",
  "footer.faq",
  "nav.logIn",
  "nav.language",
  "nav.pricing",
  "nav.preNursing",
  "nav.tools",
  "nav.signup",
  "nav.theme",
  "nav.mega.rn.label",
  "nav.mega.pn.labelCA",
  "nav.mega.np.label",
  "nav.mega.newGrad.label",
  "nav.mega.allied.label",
] as const;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function missingRequiredMarketingShellKeys(
  messages: MarketingMessages,
  fallbackMessages?: MarketingMessages,
): string[] {
  return REQUIRED_MARKETING_SHELL_KEYS.filter((key) => {
    if (isNonEmptyString(messages[key])) return false;
    if (fallbackMessages && isNonEmptyString(fallbackMessages[key])) return false;
    return true;
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
  const fallbackCount = fallbackMessages ? Object.keys(fallbackMessages).length : 0;

  if (messageCount === 0) {
    throw new Error(
      `[marketing-layout] ${route} loaded 0 primary messages for locale "${locale}" (fallbackCount=${fallbackCount}); refusing to render degraded chrome.`,
    );
  }

  const missingRequiredKeys = missingRequiredMarketingShellKeys(messages, fallbackMessages);

  if (missingRequiredKeys.length > 0) {
    throw new Error(
      `[marketing-layout] ${route} locale="${locale}" is missing required marketing shell keys: ${missingRequiredKeys.join(", ")}`,
    );
  }

  /**
   * During next build, the default marketing layout may intentionally use a
   * reduced shard list. Do not require the full hero/nav validation set there.
   */
  if (isProductionBuildInvocation()) {
    return;
  }

  try {
    assertMarketingHeroNavCriticalOrThrow(
      messages,
      `[marketing-layout] ${route} locale="${locale}"`,
    );
  } catch (err) {
    /**
     * Non-English layouts may rely on English fallback messages.
     * If primary locale is missing hero/nav keys but fallback has them,
     * the shell is still renderable.
     */
    if (locale !== DEFAULT_MARKETING_LOCALE && fallbackMessages) {
      assertMarketingHeroNavCriticalOrThrow(
        fallbackMessages,
        `[marketing-layout] ${route} locale="${locale}" fallback="${DEFAULT_MARKETING_LOCALE}"`,
      );
      return;
    }

    throw err;
  }
}