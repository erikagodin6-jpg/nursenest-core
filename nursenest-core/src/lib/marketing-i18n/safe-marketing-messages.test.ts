import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatMarketingMessage,
  MARKETING_PRODUCTION_MISSING_PAGE_KEY_PLACEHOLDER,
  type MarketingMessages,
} from "@/lib/marketing-i18n-core";
import {
  coerceFlatMessageValue,
  normalizeMarketingMessagesRecord,
  safeMessageKey,
} from "@/lib/marketing-i18n/safe-marketing-messages";

describe("safe-marketing-messages", () => {
  it("coerceFlatMessageValue accepts strings and finite numbers", () => {
    assert.equal(coerceFlatMessageValue(" hi "), " hi ");
    assert.equal(coerceFlatMessageValue(42), "42");
    assert.equal(coerceFlatMessageValue(true), "true");
    assert.equal(coerceFlatMessageValue(undefined), undefined);
    assert.equal(coerceFlatMessageValue({}), undefined);
    assert.equal(coerceFlatMessageValue([]), undefined);
  });

  it("normalizeMarketingMessagesRecord drops nested objects and keeps strings", () => {
    const out = normalizeMarketingMessagesRecord({
      a: "ok",
      b: { nested: 1 },
      c: "",
    });
    assert.deepEqual(out, { a: "ok" });
  });

  it("safeMessageKey truncates huge keys", () => {
    const long = "x".repeat(600);
    assert.equal(safeMessageKey(long).length, 512);
  });
});

describe("formatMarketingMessage hardened", () => {
  it("does not throw when bundle has non-string leaf values", () => {
    const bad = { "x.y": 123 } as MarketingMessages;
    const s = formatMarketingMessage(bad, "x.y", undefined, undefined);
    assert.equal(s, "123");
  });

  it("returns empty string when leaf is a non-coercible object (never humanized placeholders)", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "development" });
    try {
      const bad = { k: { o: 1 } } as MarketingMessages;
      const s = formatMarketingMessage(bad, "k", undefined, undefined);
      assert.equal(s, "");
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });

  it("in production, missing pages.home.* never returns the outage placeholder", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "production" });
    try {
      const s = formatMarketingMessage({}, "pages.home.hero.intentionallyMissingKey", undefined, undefined);
      assert.notEqual(s, MARKETING_PRODUCTION_MISSING_PAGE_KEY_PLACEHOLDER);
      assert.equal(s, "");
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });

  it("in development, missing keys return empty string (no Title/Lead-style humanized tails)", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "development" });
    try {
      assert.equal(formatMarketingMessage({}, "x.y.title", undefined, undefined), "");
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });

  it("in production, missing pages.pricing.* returns empty string (no humanized key tails)", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "production" });
    try {
      const s = formatMarketingMessage({}, "pages.pricing.intentionallyMissingKey", undefined, undefined);
      assert.notEqual(s, MARKETING_PRODUCTION_MISSING_PAGE_KEY_PLACEHOLDER);
      assert.equal(s, "");
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });

  it("in production, authored mirror-stub leaves never render (e.g. title key with value Title)", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "production" });
    try {
      const bundle = { "pages.shop.title": "Title" } as MarketingMessages;
      assert.equal(formatMarketingMessage(bundle, "pages.shop.title", undefined, undefined), "");
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });

  it("in production, shouty template tokens like LABEL never render", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "production" });
    try {
      const bundle = { "nav.somePill": "LABEL" } as MarketingMessages;
      assert.equal(formatMarketingMessage(bundle, "nav.somePill", undefined, undefined), "");
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });
});
