#!/usr/bin/env node
/**
 * Contract: `.do/app-nursenest-core-next.yaml` must give bootstrap-critical GENERAL env vars
 * explicit `value:` lines. Empty vars cause `validateRuntimeEnvOrThrow` in `start-standalone.mjs`
 * to exit before bind → DigitalOcean `no_healthy_upstream` / 503.
 *
 * Run: `npm run test:unit:bootstrap-env-spec` from `nursenest-core/`.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const specPath = path.join(repoRoot, ".do", "app-nursenest-core-next.yaml");

function envBlockHasValueAfterKey(specText, key) {
  const needle = `- key: ${key}`;
  const idx = specText.indexOf(needle);
  if (idx === -1) return false;
  const tail = specText.slice(idx).split(/\r?\n/);
  for (let i = 1; i < tail.length; i += 1) {
    const line = tail[i];
    if (/^\s*-\s*key:/.test(line)) break;
    if (/^\s*value\s*:/.test(line)) return true;
  }
  return false;
}

test("DigitalOcean spec: AI_ADMIN_GENERATION_ENABLED has explicit value (bootstrap runtime guard)", () => {
  const spec = fs.readFileSync(specPath, "utf8");
  assert.ok(
    envBlockHasValueAfterKey(spec, "AI_ADMIN_GENERATION_ENABLED"),
    `${specPath}: add value: "false" | "true" under AI_ADMIN_GENERATION_ENABLED`,
  );
});
