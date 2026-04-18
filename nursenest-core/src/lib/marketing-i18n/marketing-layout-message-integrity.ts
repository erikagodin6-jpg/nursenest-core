import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { validateMarketingHeroNavCriticalKeys } from "@/lib/marketing/marketing-hero-nav-critical-keys";
import { MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { safeServerLog } from "@/lib/observability/safe-server-log";

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

function resolveNextI18nPublicDir(): string | null {
  const candidates = [
    path.join(process.cwd(), "public", "i18n"),
    path.join(process.cwd(), "nursenest-core", "public", "i18n"),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function readCanonicalEnglishMarketingBundle(): MarketingMessages {
  const i18nDir = resolveNextI18nPublicDir();
  if (!i18nDir) return {};

  const localeDir = path.join(i18nDir, DEFAULT_MARKETING_LOCALE);
  const merged: MarketingMessages = {};
  for (const shard of MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS) {
    const shardPath = path.join(localeDir, `${shard}.json`);
    if (!existsSync(shardPath)) continue;
    const parsed = JSON.parse(readFileSync(shardPath, "utf8")) as Record<string, unknown>;
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string" && value.trim().length > 0) {
        merged[key] = value;
      }
    }
  }
  return merged;
}

export function resolveDefaultEnglishMarketingLayoutMessages({
  route,
  messages,
}: {
  route: string;
  messages: MarketingMessages;
}): MarketingMessages {
  if (Object.keys(messages).length > 0) return messages;

  safeServerLog("i18n", "marketing_layout_en_empty_bundle_fallback", {
    route,
    locale: DEFAULT_MARKETING_LOCALE,
    messageCount: 0,
    fallback: "compiled_en",
  });

  return readCanonicalEnglishMarketingBundle();
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

  const { ok, missing } = validateMarketingHeroNavCriticalKeys(messages);
  if (!ok) {
    throw new Error(
      `[marketing-layout] ${route} is missing critical marketing chrome keys for locale "${locale}": ${missing.join(", ")}`,
    );
  }
}
