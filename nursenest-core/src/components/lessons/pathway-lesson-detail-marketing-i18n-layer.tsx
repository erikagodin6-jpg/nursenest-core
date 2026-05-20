"use client";

import type { ReactNode } from "react";
import { MarketingI18nShardLayer } from "@/components/i18n/marketing-i18n-provider";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";

/**
 * Merges learner + pages i18n shards for client lesson modules (`PathwayLessonActions`, etc.) on marketing
 * lesson detail. Parent marketing layout may not include all `learner.*` keys; without this layer, `t()` falls
 * back to humanized keys (e.g. "Topic Practice Tests Cta").
 */
export function PathwayLessonDetailMarketingI18nLayer({
  messages,
  children,
}: {
  messages: MarketingMessages;
  children: ReactNode;
}) {
  return <MarketingI18nShardLayer messages={messages}>{children}</MarketingI18nShardLayer>;
}
