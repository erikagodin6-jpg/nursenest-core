#!/usr/bin/env node
/**
 * Static checks that tier-scoped exam access stays centralized (no DB).
 * Full behavior: run `npm run test:e2e:tier-matrix` and Playwright tier gates.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const errors = [];
function mustInclude(rel, needle) {
  const p = join(root, rel);
  if (!existsSync(p)) {
    errors.push(`missing file ${rel}`);
    return;
  }
  const s = readFileSync(p, "utf8");
  if (!s.includes(needle)) errors.push(`${rel} missing: ${needle}`);
}

mustInclude("src/lib/entitlements/content-access-scope.ts", "examQuestionTiersForUserTier");
mustInclude("src/lib/questions/subscriber-discovery-aggregates.ts", "examQuestionsDiscoveryWhereSql");
mustInclude("src/lib/flashcards/flashcard-exam-bank-hub-inventory.ts", "examQuestionsDiscoveryWhereSql");

if (errors.length) {
  console.error("[verify-no-cross-tier-leakage] FAILED\n", errors.join("\n"));
  process.exit(1);
}
console.log("[verify-no-cross-tier-leakage] OK (static). Run: npm run test:e2e:tier-matrix for runtime proof.");
