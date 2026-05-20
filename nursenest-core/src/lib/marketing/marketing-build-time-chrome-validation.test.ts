import assert from "node:assert/strict";
import test from "node:test";
import { assertMarketingLayoutMessagesIntegrity } from "@/lib/marketing-i18n/marketing-layout-message-integrity";
import { MARKETING_CHROME_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import {
  assertMarketingHeroNavCriticalOrThrow,
  loadEnglishMarketingChromeShardMerge,
  validateEnglishMarketingChromeBuildGate,
  validateMarketingChromeAndPagesHeroShape,
  validateMarketingChromeMessagesShape,
} from "@/lib/marketing/marketing-build-time-chrome-validation";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EN_DIR = path.join(__dirname, "..", "..", "..", "public", "i18n", "en");

function readPagesEn(): MarketingMessages {
  return JSON.parse(fs.readFileSync(path.join(EN_DIR, "pages.json"), "utf8")) as MarketingMessages;
}

test("validateEnglishMarketingChromeBuildGate passes for repo EN shards", () => {
  const r = validateEnglishMarketingChromeBuildGate();
  assert.equal(r.ok, true, r.errors.join("\n"));
});

test("removing any nav chrome key fails build gate (not a silent partial map)", () => {
  const merged = loadEnglishMarketingChromeShardMerge();
  delete merged["nav.logIn"];
  const pages = readPagesEn();
  const r = validateMarketingChromeAndPagesHeroShape(merged, pages);
  assert.equal(r.ok, false);
  assert.match(r.errors.join(" "), /nav\.logIn|chrome missing/);
});

test("removing any required homepage hero key fails build gate", () => {
  const merged = loadEnglishMarketingChromeShardMerge();
  const pages = readPagesEn();
  const p2 = { ...pages };
  delete p2["pages.home.hero.headline"];
  const r = validateMarketingChromeAndPagesHeroShape(merged, p2);
  assert.equal(r.ok, false);
  assert.match(r.errors.join(" "), /pages\.home\.hero\.headline/);
});

test("layout integrity throws on incomplete chrome — no silent accept (same as build gate nav rule)", () => {
  const merged = loadEnglishMarketingChromeShardMerge();
  delete merged["nav.mega.startHere"];
  assert.throws(
    () =>
      assertMarketingLayoutMessagesIntegrity({
        route: "shared-marketing-default",
        locale: "en",
        messages: merged,
      }),
    /nav\.mega\.startHere/,
  );
});

test("assertMarketingHeroNavCriticalOrThrow matches integrity chrome rule", () => {
  const merged = loadEnglishMarketingChromeShardMerge();
  const m2 = { ...merged };
  delete m2["components.homeHeroCarousel.slide01.title"];
  assert.throws(() => assertMarketingHeroNavCriticalOrThrow(m2, "test"), /slide01\.title/);
});

test("carousel title key removal fails validateMarketingChromeMessagesShape", () => {
  const merged = loadEnglishMarketingChromeShardMerge();
  delete merged["components.homeHeroCarousel.slide01.title"];
  const r = validateMarketingChromeMessagesShape(merged);
  assert.equal(r.ok, false);
  assert(r.missing.includes("components.homeHeroCarousel.slide01.title"));
});

test("merged chrome shard count matches MARKETING_CHROME_MESSAGE_SHARDS (sanity)", () => {
  const merged = loadEnglishMarketingChromeShardMerge();
  assert.ok(Object.keys(merged).length > 400, "expected large merged chrome map");
  for (const shard of MARKETING_CHROME_MESSAGE_SHARDS) {
    const raw = JSON.parse(fs.readFileSync(path.join(EN_DIR, `${shard}.json`), "utf8")) as Record<string, unknown>;
    assert.ok(Object.keys(raw).length > 0, `shard ${shard} empty`);
  }
});
