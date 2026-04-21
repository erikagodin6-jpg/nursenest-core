#!/usr/bin/env node
/**
 * Build gate: merged English marketing chrome shards must include every nav/mega-menu/carousel
 * key in {@link MARKETING_HERO_NAV_CRITICAL_KEYS}, and `pages.json` must include required
 * `pages.home.hero.*` strings. Invoked from `validate-marketing-production-surface.mjs`.
 *
 * Node 22 + tsx can surface `SyntaxError: does not provide an export named …` for a **static**
 * import of this module (ESM evaluation / loader edge). Dynamic `import()` after the entry module
 * finishes linking avoids that failure mode on Heroku/DigitalOcean.
 */
const gateModuleUrl = new URL("../src/lib/marketing/marketing-build-time-chrome-validation.ts", import.meta.url)
  .href;

const mod = await import(gateModuleUrl);
const validateEnglishMarketingChromeBuildGate = mod.validateEnglishMarketingChromeBuildGate as () => {
  ok: boolean;
  errors: string[];
};
if (typeof validateEnglishMarketingChromeBuildGate !== "function") {
  console.error("[validate-marketing-chrome-critical-keys] FAILED: gate export missing", Object.keys(mod));
  process.exit(1);
}

const r = validateEnglishMarketingChromeBuildGate();
if (!r.ok) {
  console.error("[validate-marketing-chrome-critical-keys] FAILED:");
  for (const line of r.errors) console.error("  -", line);
  process.exit(1);
}

console.log("[validate-marketing-chrome-critical-keys] OK — merged EN chrome + pages.home.hero shape.");
