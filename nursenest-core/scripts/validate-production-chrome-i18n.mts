#!/usr/bin/env npx tsx
/**
 * Fails non-zero if the merged English bundle is missing any production-chrome i18n key or has empty values.
 * Uses `client/public/i18n/en.json` (byte-identical merged map to Next shard output).
 * Run before `next build` so broken English bundles cannot ship.
 *
 * Full multi-locale parity is enforced by `src/lib/i18n/required-user-ui-i18n-keys.test.ts`
 * and root `npm run i18n:validate` after `i18n:compile`.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTION_CHROME_I18N_KEYS } from "../src/lib/i18n/production-chrome-i18n-keys.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Repo root: nursenest-core/scripts → ../.. */
const REPO_ROOT = path.join(__dirname, "..", "..");
const EN_JSON = path.join(REPO_ROOT, "client", "public", "i18n", "en.json");

function main(): void {
  const errors: string[] = [];
  if (!existsSync(EN_JSON)) {
    console.error(`[i18n:validate-chrome] Missing ${EN_JSON}`);
    process.exit(1);
  }
  const raw = JSON.parse(readFileSync(EN_JSON, "utf8")) as Record<string, string>;
  for (const key of PRODUCTION_CHROME_I18N_KEYS) {
    const v = raw[key];
    if (v === undefined) errors.push(`missing key: ${key}`);
    else if (typeof v !== "string" || v.trim() === "") errors.push(`empty value: ${key}`);
  }
  if (errors.length) {
    console.error("[i18n:validate-chrome] FAILED — English bundle incomplete for production chrome:");
    for (const e of errors.slice(0, 80)) console.error(" ", e);
    if (errors.length > 80) console.error(`  … and ${errors.length - 80} more`);
    process.exit(1);
  }
  console.log(`[i18n:validate-chrome] OK — ${PRODUCTION_CHROME_I18N_KEYS.length} keys`);
}

main();
