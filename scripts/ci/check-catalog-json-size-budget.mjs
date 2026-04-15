#!/usr/bin/env node
/**
 * Warn (GitHub ::warning::) if allowlisted pathway catalog JSON grows beyond a soft budget.
 * Does not fail CI — signals time to move more inventory to Postgres.
 *
 *   MAX_CATALOG_JSON_BYTES=5242880 node scripts/ci/check-catalog-json-size-budget.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const catalog = path.join(repoRoot, "nursenest-core", "src", "content", "pathway-lessons", "catalog.json");
const max = Number(process.env.MAX_CATALOG_JSON_BYTES ?? 5 * 1024 * 1024);

if (!fs.existsSync(catalog)) {
  console.log("check-catalog-json-size-budget: skip (no catalog.json)");
  process.exit(0);
}

const bytes = fs.statSync(catalog).size;
if (bytes > max) {
  console.warn(
    `::warning:: pathway-lessons/catalog.json is ${bytes} bytes (soft budget ${max}). Prefer DB-backed inventory for scale — docs/CONTENT_STORAGE_ARCHITECTURE.md`,
  );
} else {
  console.log(`check-catalog-json-size-budget: OK (${bytes} bytes ≤ ${max})`);
}
