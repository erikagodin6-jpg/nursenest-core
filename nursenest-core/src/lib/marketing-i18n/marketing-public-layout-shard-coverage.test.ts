import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MARKETING_HERO_NAV_CRITICAL_KEYS } from "@/lib/marketing/marketing-hero-nav-critical-keys";
import { assertKeysLoadedByDefaultPublicMarketingLayout } from "@/lib/marketing-i18n/marketing-public-layout-shard-coverage";
import {
  getOptionalPublicMessage,
  getRequiredPublicMessage,
  resolveMarketingCopy,
  type MarketingMessages,
} from "@/lib/marketing-i18n-core";

describe("marketing-public-layout-shard-coverage", () => {
  it("hero/nav critical keys are all in the default public marketing layout shard merge", () => {
    assert.doesNotThrow(() =>
      assertKeysLoadedByDefaultPublicMarketingLayout(MARKETING_HERO_NAV_CRITICAL_KEYS, "hero-nav-critical-keys"),
    );
  });

  it("rejects keys that only exist on the allied vertical shard", () => {
    assert.throws(
      () => assertKeysLoadedByDefaultPublicMarketingLayout(["allied.foo.bar"], "test-surface"),
      /marketing-shard-coverage/,
    );
  });
});

describe("public marketing message helpers", () => {
  const en: MarketingMessages = { "pages.smoke.headline": "Real headline" };

  it("getOptionalPublicMessage returns empty when missing", () => {
    assert.equal(getOptionalPublicMessage({}, "pages.missing.key"), "");
  });

  it("getOptionalPublicMessage scrubs forbidden leaves", () => {
    const m: MarketingMessages = { "pages.smoke.k": "KICKER" };
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "production" });
    try {
      assert.equal(getOptionalPublicMessage(m, "pages.smoke.k"), "");
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });

  it("getRequiredPublicMessage throws when missing", () => {
    assert.throws(() => getRequiredPublicMessage({}, "pages.required.missing"), /missing or forbidden/);
  });

  it("resolveMarketingCopy scrubs unsafe ultimateFallback in production", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "production" });
    try {
      assert.equal(resolveMarketingCopy(en, "pages.missing.onlyFallback", undefined, "Title"), "");
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });

  it("resolveMarketingCopy returns safe resolved copy", () => {
    assert.equal(resolveMarketingCopy(en, "pages.smoke.headline", undefined, "ignored"), "Real headline");
  });
});
