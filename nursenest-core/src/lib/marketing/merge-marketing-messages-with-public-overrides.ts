import type { MarketingMessages } from "@/lib/marketing-i18n-core";

export function mergeMarketingMessagesWithPublicOverrides(
  messages: MarketingMessages,
  overrides: Record<string, string> | undefined,
): MarketingMessages {
  if (!overrides) return messages;
  const keys = Object.keys(overrides);
  if (keys.length === 0) return messages;
  return { ...messages, ...overrides };
}
