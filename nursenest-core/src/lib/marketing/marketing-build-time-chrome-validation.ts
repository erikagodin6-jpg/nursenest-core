/**
 * Build-time + strict runtime contract for English marketing chrome and homepage hero copy.
 * Single source for which keys must exist before deploy (see `validate-marketing-production-surface.mjs`
 * and `assertMarketingLayoutMessagesIntegrity`).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { MARKETING_CHROME_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import {
  MARKETING_HERO_NAV_CRITICAL_KEYS,
  validateMarketingHeroNavCriticalKeys,
  type MarketingHeroNavCriticalKeyResult,
} from "@/lib/marketing/marketing-hero-nav-critical-keys";
import { assertKeysLoadedByDefaultPublicMarketingLayout } from "@/lib/marketing-i18n/marketing-public-layout-shard-coverage";

/** Every `pages.home.hero.*` string used by {@link HomeConversionHero} (canonical `en`). */
export const MARKETING_PAGES_HOME_HERO_REQUIRED_KEYS = [
  "pages.home.hero.statQuestions",
  "pages.home.hero.statLessons",
  "pages.home.hero.statUpdates",
  "pages.home.hero.eyebrowBrand",
  "pages.home.hero.headline",
  "pages.home.hero.subheading",
  "pages.home.hero.subheading2",
  "pages.home.hero.scanItem1",
  "pages.home.hero.scanItem2",
  "pages.home.hero.scanItem3",
  "pages.home.hero.scanItem4",
  "pages.home.hero.emotionalAnchorLine",
  "pages.home.hero.nextStepEyebrow",
  "pages.home.hero.safeToTryLine",
  "pages.home.hero.primaryCta",
  "pages.home.hero.secondaryCta",
  "pages.home.hero.ctaSupportingLine",
  "pages.home.hero.statsFallback",
  "pages.home.hero.noCreditCard",
] as const;

function pkgRootFromHere(): string {
  return path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
}

function readEnShardJson(shard: string): Record<string, string> {
  const root = pkgRootFromHere();
  const fp = path.join(root, "public", "i18n", "en", `${shard}.json`);
  const raw = JSON.parse(fs.readFileSync(fp, "utf8")) as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

/** Merged flat map matching runtime `MARKETING_CHROME_MESSAGE_SHARDS` load order (English). */
export function loadEnglishMarketingChromeShardMerge(): MarketingMessages {
  let merged: MarketingMessages = {};
  for (const shard of MARKETING_CHROME_MESSAGE_SHARDS) {
    merged = { ...merged, ...readEnShardJson(shard) };
  }
  return merged;
}

function isMissingString(v: string | undefined): boolean {
  return v === undefined || (typeof v === "string" && v.trim() === "");
}

export type MarketingChromeBuildValidationResult = {
  ok: boolean;
  errors: string[];
  heroNav: MarketingHeroNavCriticalKeyResult;
};

/**
 * Strict gate: full chrome shards + required homepage hero keys in `pages` shard.
 * Used by build prechecks — must not pass with partial maps.
 */
export function validateEnglishMarketingChromeBuildGate(): MarketingChromeBuildValidationResult {
  const errors: string[] = [];
  try {
    assertKeysLoadedByDefaultPublicMarketingLayout(MARKETING_HERO_NAV_CRITICAL_KEYS, "chrome-build-gate/hero-nav");
    assertKeysLoadedByDefaultPublicMarketingLayout(
      MARKETING_PAGES_HOME_HERO_REQUIRED_KEYS,
      "chrome-build-gate/home-hero",
    );
  } catch (e) {
    errors.push(e instanceof Error ? e.message : String(e));
  }
  const merged = loadEnglishMarketingChromeShardMerge();
  const heroNav = validateMarketingHeroNavCriticalKeys(merged);
  if (!heroNav.ok) {
    errors.push(
      `marketing chrome (merged ${MARKETING_CHROME_MESSAGE_SHARDS.join(",")}) missing ${heroNav.missing.length} critical key(s): ${heroNav.missing.slice(0, 24).join(", ")}${heroNav.missing.length > 24 ? " …" : ""}`,
    );
  }

  const pages = readEnShardJson("pages");
  for (const key of MARKETING_PAGES_HOME_HERO_REQUIRED_KEYS) {
    if (isMissingString(pages[key])) {
      errors.push(`pages shard missing or empty required homepage hero key: ${key}`);
    }
  }

  return { ok: errors.length === 0, errors, heroNav };
}

/** Validates an in-memory merged chrome map (e.g. tests) — same nav/carousel/footer rules as production. */
export function validateMarketingChromeMessagesShape(merged: MarketingMessages): MarketingHeroNavCriticalKeyResult {
  return validateMarketingHeroNavCriticalKeys(merged);
}

/** Validates merged chrome + pages map together (tests). */
export function validateMarketingChromeAndPagesHeroShape(
  merged: MarketingMessages,
  pages: MarketingMessages,
): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const nav = validateMarketingHeroNavCriticalKeys(merged);
  if (!nav.ok) errors.push(`chrome missing: ${nav.missing.join(", ")}`);
  for (const key of MARKETING_PAGES_HOME_HERO_REQUIRED_KEYS) {
    if (isMissingString(pages[key])) errors.push(`pages missing: ${key}`);
  }
  return { ok: errors.length === 0, errors };
}

export function assertMarketingHeroNavCriticalOrThrow(messages: MarketingMessages, context: string): void {
  const { ok, missing } = validateMarketingHeroNavCriticalKeys(messages);
  if (!ok) {
    throw new Error(`${context}: missing or empty marketing chrome keys (${missing.length}): ${missing.join(", ")}`);
  }
}
