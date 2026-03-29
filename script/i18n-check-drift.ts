#!/usr/bin/env npx tsx
/**
 * Compares marketing authoring files under tools/i18n/marketing/ to merged en.json.
 * Reports keys present in marketing-en.json that are absent from compiled monolith-only output
 * (expected after first compile) and confirms they appear in merged en.json after full compile.
 */
import { existsSync, readFileSync } from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd());
const MARKETING_EN = path.join(ROOT, "tools/i18n/marketing/marketing-en.json");
const MERGED_EN = path.join(ROOT, "client/public/i18n/en.json");

function loadFlat(p: string): Record<string, string> | null {
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8")) as Record<string, string>;
  } catch {
    return null;
  }
}

function main(): void {
  const m = loadFlat(MARKETING_EN);
  const merged = loadFlat(MERGED_EN);
  if (!m) {
    console.error(`Missing ${MARKETING_EN}`);
    process.exit(1);
  }
  if (!merged) {
    console.error(`Missing ${MERGED_EN} — run npm run i18n:compile`);
    process.exit(1);
  }
  const mk = new Set(Object.keys(m));
  const ok = new Set(Object.keys(merged));
  const marketingNotInMerged = [...mk].filter((k) => !ok.has(k));
  if (marketingNotInMerged.length) {
    console.error("[i18n:check-drift] FAIL: marketing keys not in merged en.json:", marketingNotInMerged.slice(0, 30));
    process.exit(1);
  }
  console.log(`[i18n:check-drift] OK — marketing-en (${mk.size} keys) ⊆ merged en.json (${ok.size} keys)`);
}

main();
