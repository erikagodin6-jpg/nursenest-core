#!/usr/bin/env node
/**
 * Build gate: merged English marketing chrome shards must include every nav/mega-menu/carousel
 * key in {@link MARKETING_HERO_NAV_CRITICAL_KEYS}, and `pages.json` must include required
 * `pages.home.hero.*` strings. Invoked from `validate-marketing-production-surface.mjs`.
 */
import { validateEnglishMarketingChromeBuildGate } from "@/lib/marketing/marketing-build-time-chrome-validation";

const r = validateEnglishMarketingChromeBuildGate();
if (!r.ok) {
  console.error("[validate-marketing-chrome-critical-keys] FAILED:");
  for (const line of r.errors) console.error("  -", line);
  process.exit(1);
}

console.log("[validate-marketing-chrome-critical-keys] OK — merged EN chrome + pages.home.hero shape.");
