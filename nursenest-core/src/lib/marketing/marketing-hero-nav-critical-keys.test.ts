import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { MARKETING_CHROME_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import {
  MARKETING_HERO_NAV_CRITICAL_KEYS,
  validateMarketingHeroNavCriticalKeys,
} from "@/lib/marketing/marketing-hero-nav-critical-keys";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EN_DIR = path.join(__dirname, "..", "..", "..", "public", "i18n", "en");

function readEnDisk(): MarketingMessages {
  return MARKETING_CHROME_MESSAGE_SHARDS.reduce<MarketingMessages>((merged, shard) => {
    const shardPath = path.join(EN_DIR, `${shard}.json`);
    return {
      ...merged,
      ...(JSON.parse(fs.readFileSync(shardPath, "utf8")) as MarketingMessages),
    };
  }, {});
}

describe("marketing hero/nav critical keys", () => {
  it("English disk bundle satisfies the critical key list", () => {
    const en = readEnDisk();
    const r = validateMarketingHeroNavCriticalKeys(en);
    assert.equal(r.ok, true, r.missing.join(", "));
  });

  it("reports footer gaps when a required footer key is stripped", () => {
    const en = readEnDisk();
    const broken = { ...en };
    delete broken["footer.rights"];
    const r = validateMarketingHeroNavCriticalKeys(broken);
    assert.equal(r.ok, false);
    assert.ok(r.missing.includes("footer.rights"));
  });

  it("reports gaps when a required key is stripped", () => {
    const en = readEnDisk();
    const broken = { ...en };
    const probe = MARKETING_HERO_NAV_CRITICAL_KEYS[0]!;
    delete broken[probe];
    const r = validateMarketingHeroNavCriticalKeys(broken);
    assert.equal(r.ok, false);
    assert.ok(r.missing.includes(probe));
  });
});
