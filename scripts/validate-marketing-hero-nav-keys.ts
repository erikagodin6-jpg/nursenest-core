/**
 * Validates that canonical English (and optionally another locale) contains all hero + nav critical keys.
 *
 * Usage:
 *   npx tsx scripts/validate-marketing-hero-nav-keys.ts
 *   npx tsx scripts/validate-marketing-hero-nav-keys.ts --overlay fr
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  MARKETING_HERO_NAV_CRITICAL_KEYS,
  validateMarketingHeroNavCriticalKeys,
} from "../src/lib/marketing/marketing-hero-nav-critical-keys";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const I18N_DIR = path.join(__dirname, "..", "public", "i18n");

function loadLocaleJson(locale: string): Record<string, string> {
  const p = path.join(I18N_DIR, `${locale}.json`);
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw) as Record<string, string>;
}

function parseArgs(argv: string[]): { overlay?: string } {
  const overlayIdx = argv.indexOf("--overlay");
  if (overlayIdx !== -1 && argv[overlayIdx + 1]) {
    return { overlay: argv[overlayIdx + 1]!.replace(/\.json$/i, "") };
  }
  return {};
}

const { overlay } = parseArgs(process.argv.slice(2));

const en = loadLocaleJson("en");
const enResult = validateMarketingHeroNavCriticalKeys(en);
if (!enResult.ok) {
  console.error("[validate-marketing-hero-nav-keys] Canonical en.json is missing critical hero/nav keys:\n");
  for (const k of enResult.missing) console.error(`  - ${k}`);
  process.exit(1);
}

if (overlay) {
  const loc = loadLocaleJson(overlay);
  const locResult = validateMarketingHeroNavCriticalKeys(loc);
  if (!locResult.ok) {
    console.error(
      `[validate-marketing-hero-nav-keys] Locale "${overlay}" overlay is missing or empty for critical keys:\n`,
    );
    for (const k of locResult.missing) console.error(`  - ${k}`);
    process.exit(1);
  }
}

console.log(
  overlay
       ? `[validate-marketing-hero-nav-keys] OK — en + overlay "${overlay}" (${MARKETING_HERO_NAV_CRITICAL_KEYS.length} keys checked).`
    : `[validate-marketing-hero-nav-keys] OK — en.json (${MARKETING_HERO_NAV_CRITICAL_KEYS.length} keys checked).`,
);
