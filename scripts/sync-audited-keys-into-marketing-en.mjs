#!/usr/bin/env node
/**
 * Ensures audited nav/footer/shell keys in merged en.json exist in marketing-en.json.
 * Skips learner.* (maintained separately).
 * Run after: npm run i18n:compile (repo root)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAuditedKeys } from "./lib/nav-i18n-audit.mjs";
import { ensureRequiredEnNavKeys } from "./lib/ensure-en-nav-keys.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NEST_ROOT = path.join(__dirname, "..");
const REPO_ROOT = path.join(NEST_ROOT, "..");
const EN_PATH = path.join(NEST_ROOT, "public", "i18n", "en.json");
const MARKETING_EN = path.join(REPO_ROOT, "tools", "i18n", "marketing", "marketing-en.json");

function main() {
  ensureRequiredEnNavKeys();
  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const marketingEn = JSON.parse(fs.readFileSync(MARKETING_EN, "utf8"));
  const audited = getAuditedKeys(en);
  let added = 0;
  for (const k of audited) {
    if (k.startsWith("learner.")) continue;
    const v = en[k];
    if (typeof v !== "string") continue;
    if (marketingEn[k] === undefined) {
      marketingEn[k] = v;
      added++;
    }
  }
  const sorted = {};
  for (const key of Object.keys(marketingEn).sort()) {
    sorted[key] = marketingEn[key];
  }
  fs.writeFileSync(MARKETING_EN, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`[sync-marketing-en] added ${added} audited keys; total keys: ${Object.keys(sorted).length}`);
}

main();
