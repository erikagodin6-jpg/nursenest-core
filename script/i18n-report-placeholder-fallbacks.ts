#!/usr/bin/env npx tsx
/**
 * Prints a short summary of the last placeholder-enforcement audit from merge.
 * Full detail: tools/i18n/reports/placeholder-fallbacks.json (written by merge-marketing-i18n).
 */
import { existsSync, readFileSync } from "fs";
import path from "path";
import { PLACEHOLDER_FALLBACK_REPORT_PATH } from "./merge-marketing-i18n";
import { REPO_ROOT } from "./repo-root";

type Report = {
  generatedAt: string;
  totalFallbacks: number;
  byLocale: Record<string, number>;
  events: Array<{
    locale: string;
    key: string;
    localizedValue: string;
    englishValue: string;
    placeholdersInEnglish: string[];
    placeholdersInLocalized: string[];
  }>;
};

function main(): void {
  const verbose = process.argv.includes("--verbose");
  const relFromRepo = path.relative(REPO_ROOT, PLACEHOLDER_FALLBACK_REPORT_PATH);

  if (!existsSync(PLACEHOLDER_FALLBACK_REPORT_PATH)) {
    console.log(`[i18n] placeholder fallbacks: no report file (run npm run i18n:compile) — ${relFromRepo}`);
    process.exit(0);
  }

  const raw = readFileSync(PLACEHOLDER_FALLBACK_REPORT_PATH, "utf8");
  const r = JSON.parse(raw) as Report;

  if (r.totalFallbacks === 0) {
    console.log(`[i18n] placeholder fallbacks: 0 — ${relFromRepo}`);
    return;
  }

  const locales = Object.keys(r.byLocale)
    .sort()
    .map((loc) => `${loc}=${r.byLocale[loc]}`)
    .join(", ");
  console.log(
    `[i18n] placeholder fallbacks: ${r.totalFallbacks} (${locales}) — ${relFromRepo} @ ${r.generatedAt}`,
  );

  if (verbose) {
    const cap = 50;
    for (let i = 0; i < Math.min(cap, r.events.length); i++) {
      const e = r.events[i];
      console.log(
        `  ${e.locale}\t${e.key}\ten:[${e.placeholdersInEnglish.join(", ")}]\tloc:[${e.placeholdersInLocalized.join(", ")}]`,
      );
    }
    if (r.events.length > cap) {
      console.log(`  … ${r.events.length - cap} more rows in JSON`);
    }
  }
}

main();
