#!/usr/bin/env node
/**
 * Build gate: every string leaf under `public/i18n/en/*.json` must not contain forbidden
 * placeholder/stub values (see `marketing-message-value-policy.ts`).
 *
 * Invoked from `scripts/validate-marketing-production-surface.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS } from "../src/lib/marketing-i18n/marketing-i18n-shard-groups.ts";
import { scanFlatMarketingMessagesForForbiddenValues } from "../src/lib/marketing-i18n/marketing-message-value-policy.ts";

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const enDir = path.join(pkgRoot, "public", "i18n", "en");

function main() {
  if (!fs.existsSync(enDir)) {
    console.error("[validate-marketing-en-shard-placeholder-leakage] missing directory:", enDir);
    process.exit(1);
  }
  const errors: string[] = [];
  for (const shard of MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS) {
    const name = `${shard}.json`;
    const fp = path.join(enDir, name);
    if (!fs.existsSync(fp)) {
      errors.push(`missing shard file: en/${name}`);
      continue;
    }
    const raw = JSON.parse(fs.readFileSync(fp, "utf8")) as Record<string, unknown>;
    const hits = scanFlatMarketingMessagesForForbiddenValues(`en/${name}`, raw);
    for (const h of hits) {
      errors.push(`${h.file} :: ${h.key} → ${h.reason} (value="${h.value}")`);
    }
  }
  if (errors.length) {
    console.error("[validate-marketing-en-shard-placeholder-leakage] FAILED:");
    for (const e of errors) console.error("  -", e);
    process.exit(1);
  }
  console.log(
    `[validate-marketing-en-shard-placeholder-leakage] OK — no forbidden placeholder leaves in default public marketing shards (${MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS.join(",")}).`,
  );
}

main();
