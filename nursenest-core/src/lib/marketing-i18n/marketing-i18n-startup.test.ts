/**
 * High-signal regression suite for marketing i18n startup + loader behavior.
 *
 * Goals:
 * - Prevent empty-bundle fallbacks (these crash or wedge the homepage)
 * - Guarantee startup bypass returns usable English, not {}
 * - Ensure production build phase does not load full bundles
 * - Enforce layout integrity guards exist
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { shouldBypassMarketingI18nAtStartup } from "@/lib/marketing-i18n/marketing-i18n-startup";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function read(filePath: string): string {
  assert.ok(fs.existsSync(filePath), `Missing file: ${filePath}`);
  return fs.readFileSync(filePath, "utf8");
}

/* ---------------------------
 * Startup bypass logic
 * --------------------------- */

test("bypasses marketing i18n during early production startup", () => {
  assert.equal(
    shouldBypassMarketingI18nAtStartup({
      uptimeMs: 5_000,
      nodeEnv: "production",
      ci: "0",
    }),
    true,
  );
});

test("does not bypass after startup window", () => {
  assert.equal(
    shouldBypassMarketingI18nAtStartup({
      uptimeMs: 30_000,
      nodeEnv: "production",
      ci: "0",
    }),
    false,
  );
});

test("never bypasses outside production", () => {
  assert.equal(
    shouldBypassMarketingI18nAtStartup({
      uptimeMs: 5_000,
      nodeEnv: "development",
      ci: "0",
    }),
    false,
  );
});

/* ---------------------------
 * Layout integrity guards
 * --------------------------- */

test("marketing layouts enforce message integrity before render", () => {
  const defaultLayout = read(
    path.join(__dirname, "..", "..", "app", "(marketing)", "(default)", "layout.tsx"),
  );

  const localeLayout = read(
    path.join(__dirname, "..", "..", "app", "(marketing)", "[locale]", "layout.tsx"),
  );

  assert.match(defaultLayout, /assertMarketingLayoutMessagesIntegrity/);
  assert.match(localeLayout, /assertMarketingLayoutMessagesIntegrity/);

  // Critical: no legacy unsafe fallback
  assert.doesNotMatch(
    defaultLayout,
    /resolveDefaultEnglishMarketingLayoutMessages/,
  );
});

/* ---------------------------
 * Full bundle loader checks
 * --------------------------- */

test("startup bypass returns canonical English (never empty object)", () => {
  const source = read(path.join(__dirname, "load-marketing-messages.ts"));

  assert.match(source, /marketing_i18n_startup_bypass/);
  assert.match(source, /return\s+loadEnglishBundleFromDisk\(\)/);

  // THIS is the bug that crashes your site — block it hard
  assert.doesNotMatch(
    source,
    /return\s+\{\}\s+as\s+MarketingMessages/,
    "loader must NEVER return empty bundle",
  );
});

test("loader has explicit non-empty bundle guard", () => {
  const source = read(path.join(__dirname, "load-marketing-messages.ts"));

  assert.match(
    source,
    /Object\.keys\(.*\)\.length\s*>\s*0/,
    "must validate merged bundle is non-empty before returning",
  );
});

/* ---------------------------
 * Build phase safety
 * --------------------------- */

test("production build phase avoids full bundle load", () => {
  const source = read(path.join(__dirname, "load-marketing-messages.ts"));

  assert.match(source, /MARKETING_BUILD_PHASE/);
  assert.match(source, /isMarketingI18nProductionBuildPhase/);
  assert.match(source, /process\.env\.NEXT_PHASE/);

  assert.match(source, /diskMergeOptionsForBuildPhase/);
  assert.match(source, /marketing_i18n_build_shard_only/);
  assert.match(source, /mode:\s*"build_shard_only"/);

  assert.match(
    source,
    /loadMarketingMessageShardsSync\(locale,\s*MARKETING_CHROME_MESSAGE_SHARDS\)/,
  );

  assert.match(
    source,
    /loadMarketingMessageShardsSync\(DEFAULT_MARKETING_LOCALE,\s*MARKETING_CHROME_MESSAGE_SHARDS\)/,
  );
});

/* ---------------------------
 * Shard loader safety
 * --------------------------- */

test("shard loader bypass returns English shards (not empty)", () => {
  const source = read(path.join(__dirname, "load-marketing-message-shards.ts"));

  assert.match(source, /marketing_i18n_startup_bypass/);

  assert.match(
    source,
    /loadMarketingMessageShardsSync\(DEFAULT_MARKETING_LOCALE,\s*shards\)/,
  );

  assert.doesNotMatch(
    source,
    /return\s+\{\}/,
    "shard loader must never return empty object",
  );
});

/* ---------------------------
 * Critical regression guard
 * --------------------------- */

test("NO marketing loader returns empty object anywhere", () => {
  const fullLoader = read(path.join(__dirname, "load-marketing-messages.ts"));
  const shardLoader = read(path.join(__dirname, "load-marketing-message-shards.ts"));

  const combined = fullLoader + "\n" + shardLoader;

  assert.doesNotMatch(
    combined,
    /return\s+\{\}/,
    "Empty object returns are forbidden — they cause homepage crash + hydration failure",
  );
});