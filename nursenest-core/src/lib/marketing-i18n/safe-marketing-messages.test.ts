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

function withNodeEnv<T>(nodeEnv: string, fn: () => T): T {
  const prev = process.env.NODE_ENV;
  process.env.NODE_ENV = nodeEnv;

  try {
    return fn();
  } finally {
    if (prev === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = prev;
    }
  }
}

describe("safe-marketing-messages", () => {
  it("coerceFlatMessageValue accepts strings, finite numbers, and booleans", () => {
    assert.equal(coerceFlatMessageValue(" hi "), " hi ");
    assert.equal(coerceFlatMessageValue(42), "42");
    assert.equal(coerceFlatMessageValue(true), "true");
  });

  it("coerceFlatMessageValue rejects unsafe values", () => {
    assert.equal(coerceFlatMessageValue(undefined), undefined);
    assert.equal(coerceFlatMessageValue(null), undefined);
    assert.equal(coerceFlatMessageValue(Number.NaN), undefined);
    assert.equal(coerceFlatMessageValue(Number.POSITIVE_INFINITY), undefined);
    assert.equal(coerceFlatMessageValue({}), undefined);
    assert.equal(coerceFlatMessageValue([]), undefined);
  });

  it("normalizeMarketingMessagesRecord drops nested objects, empty strings, and unsafe values", () => {
    const out = normalizeMarketingMessagesRecord({
      a: "ok",
      b: { nested: 1 },
      c: "",
      d: "   ",
      e: Number.NaN,
      f: 12,
      g: false,
    });

    assert.deepEqual(out, {
      a: "ok",
      f: "12",
      g: "false",
    });
  });

  it("safeMessageKey truncates huge keys", () => {
    const long = "x".repeat(600);
    assert.equal(safeMessageKey(long).length, 512);
  });

  it("safeMessageKey preserves normal keys", () => {
    assert.equal(safeMessageKey("pages.home.hero.title"), "pages.home.hero.title");
  });
});

describe("formatMarketingMessage hardened", () => {
  it("coerces non-string scalar leaf values safely", () => {
    const bad = { "x.y": 123, "x.z": true } as MarketingMessages;

    assert.equal(formatMarketingMessage(bad, "x.y", undefined, undefined), "123");
    assert.equal(formatMarketingMessage(bad, "x.z", undefined, undefined), "true");
  });

  it("returns empty string when leaf is non-coercible object", () => {
    withNodeEnv("development", () => {
      const bad = { k: { o: 1 } } as MarketingMessages;
      const s = formatMarketingMessage(bad, "k", undefined, undefined);

      assert.equal(s, "");
    });
  });

  it("returns fallback message when primary value is missing", () => {
    const primary = {} as MarketingMessages;
    const fallback = { "nav.logIn": "Log in" } as MarketingMessages;

    assert.equal(formatMarketingMessage(primary, "nav.logIn", fallback, undefined), "Log in");
  });

  it("returns explicit defaultValue when primary and fallback are missing", () => {
    assert.equal(
      formatMarketingMessage({}, "nav.missing", undefined, "Fallback label"),
      "Fallback label",
    );
  });

  it("in production, missing pages.home.* never returns outage placeholder", () => {
    withNodeEnv("production", () => {
      const s = formatMarketingMessage(
        {},
        "pages.home.hero.intentionallyMissingKey",
        undefined,
        undefined,
      );

      assert.notEqual(s, MARKETING_PRODUCTION_MISSING_PAGE_KEY_PLACEHOLDER);
      assert.equal(s, "");
    });
  });

  it("in development, missing keys return empty string without humanized tails", () => {
    withNodeEnv("development", () => {
      assert.equal(formatMarketingMessage({}, "x.y.title", undefined, undefined), "");
      assert.equal(formatMarketingMessage({}, "pages.home.hero.lead", undefined, undefined), "");
    });
  });

  it("in production, missing pages.pricing.* returns empty string without humanized key tails", () => {
    withNodeEnv("production", () => {
      const s = formatMarketingMessage(
        {},
        "pages.pricing.intentionallyMissingKey",
        undefined,
        undefined,
      );

      assert.notEqual(s, MARKETING_PRODUCTION_MISSING_PAGE_KEY_PLACEHOLDER);
      assert.equal(s, "");
    });
  });

  it("in production, authored mirror-stub leaves never render", () => {
    withNodeEnv("production", () => {
      const bundle = {
        "pages.shop.title": "Title",
        "pages.shop.description": "Description",
      } as MarketingMessages;

      assert.equal(formatMarketingMessage(bundle, "pages.shop.title", undefined, undefined), "");
      assert.equal(formatMarketingMessage(bundle, "pages.shop.description", undefined, undefined), "");
    });
  });

  it("in production, shouty template tokens never render", () => {
    withNodeEnv("production", () => {
      const bundle = {
        "nav.somePill": "LABEL",
        "pages.foo.cta": "CTA",
      } as MarketingMessages;

      assert.equal(formatMarketingMessage(bundle, "nav.somePill", undefined, undefined), "");
      assert.equal(formatMarketingMessage(bundle, "pages.foo.cta", undefined, undefined), "");
    });
  });

  it("does not render forbidden public placeholder substrings", () => {
    withNodeEnv("production", () => {
      const bundle = {
        "pages.foo.title": "Lorem ipsum content",
        "pages.foo.description": "{{missing:pages.foo.description}}",
      } as MarketingMessages;

      assert.equal(formatMarketingMessage(bundle, "pages.foo.title", undefined, undefined), "");
      assert.equal(formatMarketingMessage(bundle, "pages.foo.description", undefined, undefined), "");
    });
  });
});