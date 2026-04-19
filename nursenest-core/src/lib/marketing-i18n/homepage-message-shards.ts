import "server-only";

import { cache } from "react";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import {
  MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
  MARKETING_PAGE_BODY_MESSAGE_SHARDS,
} from "@/lib/marketing-i18n/marketing-i18n-shard-groups";

const MARKETING_BUILD_PHASE = "phase-production-build";

function homepageMessageShards() {
  return process.env.NEXT_PHASE === MARKETING_BUILD_PHASE
    ? MARKETING_PAGE_BODY_MESSAGE_SHARDS
    : MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS;
}

export const loadHomepageMessageBundle = cache(async function loadHomepageMessageBundle(locale: string): Promise<{
  messages: Record<string, string>;
  fallbackMessages: Record<string, string> | undefined;
}> {
  const shards = homepageMessageShards();
  const messages = (await loadMarketingMessageShards(locale, shards)) ?? {};

  if (locale === DEFAULT_MARKETING_LOCALE) {
    return { messages, fallbackMessages: undefined };
  }

  const fallbackMessages = (await loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, shards)) ?? {};
  return { messages, fallbackMessages };
});
