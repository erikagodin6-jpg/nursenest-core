import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  MARKETING_HERO_NAV_CRITICAL_KEYS,
  validateMarketingHeroNavCriticalKeys,
} from "@/lib/marketing/marketing-hero-nav-critical-keys";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EN_JSON = path.join(__dirname, "..", "..", "..", "public", "i18n", "en.json");

function readEnDisk(): MarketingMessages {
  return JSON.parse(fs.readFileSync(EN_JSON, "utf8")) as MarketingMessages;
}

describe("marketing hero/nav critical keys", () => {
  it("English disk bundle satisfies the critical key list", () => {
    const en = readEnDisk();
    const r = validateMarketingHeroNavCriticalKeys(en);
    assert.equal(r.ok, true, r.missing.join(", "));
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
