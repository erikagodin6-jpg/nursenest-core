#!/usr/bin/env node
/**
 * Static guard: the scheduled "Production reliability check" workflow must
 * validate required secrets before any production curl and must not echo the secret.
 * Safe for logs — never reads or prints secret values.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..", "..");
const wfPath = path.join(repoRoot, ".github", "workflows", "production-reliability-check.yml");

let raw;
try {
  raw = readFileSync(wfPath, "utf8");
} catch (e) {
  console.error(`[assert-production-reliability-workflow-guard] Missing workflow file: ${wfPath}`);
  process.exit(1);
}

const required = ["NURSENEST_PRODUCTION_BASE_URL", "NURSENEST_RELIABILITY_SECRET"];
for (const name of required) {
  if (!raw.includes(name)) {
    console.error(`[assert-production-reliability-workflow-guard] Workflow must reference ${name}`);
    process.exit(1);
  }
}

const verifyName = "Verify secrets are configured";
if (!raw.includes(verifyName)) {
  console.error(`[assert-production-reliability-workflow-guard] Missing step "${verifyName}"`);
  process.exit(1);
}

if (!raw.includes("id: secrets")) {
  console.error(`[assert-production-reliability-workflow-guard] Verify step must set id: secrets for Conclude messaging`);
  process.exit(1);
}

const iVerify = raw.indexOf(verifyName);
const iCurl = raw.search(/curl[^\n]*\/api\/internal\/reliability\//);
if (iCurl !== -1 && iVerify > iCurl) {
  console.error(
    "[assert-production-reliability-workflow-guard] Verify-secrets step must appear before the first reliability curl",
  );
  process.exit(1);
}

// Never log the shared-secret env value (bash echo / printf of SECRET).
if (/\becho[^\n]*\bSECRET\b/.test(raw) || /\becho[^\n]*\$\{SECRET/.test(raw)) {
  console.error("[assert-production-reliability-workflow-guard] Workflow must not echo SECRET");
  process.exit(1);
}

// Verbose curl can leak request headers in some versions.
if (/\bcurl\s[^#\n]*\s-v(?:\s|$)/.test(raw) || /\bcurl\s[^#\n]*\s--verbose(?:\s|$)/.test(raw)) {
  console.error("[assert-production-reliability-workflow-guard] Workflow curl must not use -v/--verbose");
  process.exit(1);
}

console.log("[assert-production-reliability-workflow-guard] OK:", wfPath);
