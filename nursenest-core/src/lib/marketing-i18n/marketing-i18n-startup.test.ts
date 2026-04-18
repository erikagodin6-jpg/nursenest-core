import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { shouldBypassMarketingI18nAtStartup } from "@/lib/marketing-i18n/marketing-i18n-startup";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("bypasses marketing i18n loads during production startup window", () => {
  assert.equal(
    shouldBypassMarketingI18nAtStartup({
      uptimeMs: 5_000,
      nodeEnv: "production",
      ci: "0",
    }),
    true,
  );
});

test("does not bypass marketing i18n loads after startup window", () => {
  assert.equal(
    shouldBypassMarketingI18nAtStartup({
      uptimeMs: 30_000,
      nodeEnv: "production",
      ci: "0",
    }),
    false,
  );
});

test("does not bypass marketing i18n loads outside production", () => {
  assert.equal(
    shouldBypassMarketingI18nAtStartup({
      uptimeMs: 5_000,
      nodeEnv: "development",
      ci: "0",
    }),
    false,
  );
});

test("marketing layouts enforce message integrity before rendering chrome", () => {
  const defaultLayout = fs.readFileSync(path.join(__dirname, "..", "..", "app", "(marketing)", "(default)", "layout.tsx"), "utf8");
  const localeLayout = fs.readFileSync(path.join(__dirname, "..", "..", "app", "(marketing)", "[locale]", "layout.tsx"), "utf8");

  assert.equal(defaultLayout.includes("assertMarketingLayoutMessagesIntegrity"), true);
  assert.equal(localeLayout.includes("assertMarketingLayoutMessagesIntegrity"), true);
  assert.equal(defaultLayout.includes("resolveDefaultEnglishMarketingLayoutMessages"), false);
});

test("merged marketing loader startup bypass returns canonical English instead of an empty bundle", () => {
  const source = fs.readFileSync(path.join(__dirname, "load-marketing-messages.ts"), "utf8");

  assert.equal(source.includes('"marketing_i18n_startup_bypass"'), true);
  assert.equal(source.includes("return loadEnglishBundleFromDisk();"), true);
  assert.equal(source.includes("return {} as MarketingMessages;"), true);
});

test("merged marketing loader avoids full-bundle fallback during production build phase", () => {
  const source = fs.readFileSync(path.join(__dirname, "load-marketing-messages.ts"), "utf8");

  assert.equal(source.includes('const MARKETING_BUILD_PHASE = "phase-production-build"'), true);
  assert.equal(source.includes("process.env.NEXT_PHASE === MARKETING_BUILD_PHASE"), true);
  assert.equal(source.includes('"marketing_i18n_build_shard_only"'), true);
  assert.equal(source.includes('mode: "build_shard_only"'), true);
  assert.equal(source.includes("loadMarketingMessageShardsSync(locale, MARKETING_CHROME_MESSAGE_SHARDS)"), true);
  assert.equal(
    source.includes("loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, MARKETING_CHROME_MESSAGE_SHARDS)"),
    true,
  );
});

test("shard marketing loader startup bypass returns canonical English shard messages instead of an empty bundle", () => {
  const source = fs.readFileSync(path.join(__dirname, "load-marketing-message-shards.ts"), "utf8");

  assert.equal(source.includes('event: "marketing_i18n_startup_bypass"'), false);
  assert.equal(source.includes('"marketing_i18n_startup_bypass"'), true);
  assert.equal(source.includes("loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, shards)"), true);
});
