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
    if (prev === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = prev;
  }
}

describe("safe-marketing-messages", () => {
  it("coerceFlatMessageValue accepts valid primitives", () => {
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

  it("normalizeMarketingMessagesRecord removes invalid entries", () => {
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

  it("safeMessageKey truncates overly long keys", () => {
    const long = "x".repeat(600);
    assert.equal(safeMessageKey(long).length, 512);
  });
});

describe("formatMarketingMessage hardened", () => {
  it("coerces scalar values correctly", () => {
    const bundle = { "x.y": 123, "x.z": true } as MarketingMessages;

    assert.equal(formatMarketingMessage(bundle, "x.y", undefined, undefined), "123");
    assert.equal(formatMarketingMessage(bundle, "x.z", undefined, undefined), "true");
  });

  it("ignores invalid object values", () => {
    withNodeEnv("development", () => {
      const bundle = { k: { bad: 1 } } as MarketingMessages;
      assert.equal(formatMarketingMessage(bundle, "k", undefined, undefined), "");
    });
  });

  it("fallback works when primary missing", () => {
    const fallback = { "nav.logIn": "Log in" } as MarketingMessages;

    assert.equal(
      formatMarketingMessage({}, "nav.logIn", fallback, undefined),
      "Log in",
    );
  });

  it("primary value always wins over fallback", () => {
    const primary = { "nav.logIn": "Sign in" } as MarketingMessages;
    const fallback = { "nav.logIn": "Log in" } as MarketingMessages;

    assert.equal(
      formatMarketingMessage(primary, "nav.logIn", fallback, undefined),
      "Sign in",
    );
  });

  it("fallback is ignored if it is empty or invalid", () => {
    const primary = {} as MarketingMessages;
    const fallback = { "nav.logIn": "" } as MarketingMessages;

    assert.equal(
      formatMarketingMessage(primary, "nav.logIn", fallback, undefined),
      "",
    );
  });

  it("defaultValue works as final fallback", () => {
    assert.equal(
      formatMarketingMessage({}, "nav.missing", undefined, "Fallback"),
      "Fallback",
    );
  });

  it("production never returns outage placeholder", () => {
    withNodeEnv("production", () => {
      const s = formatMarketingMessage(
        {},
        "pages.home.hero.missing",
        undefined,
        undefined,
      );

      assert.notEqual(s, MARKETING_PRODUCTION_MISSING_PAGE_KEY_PLACEHOLDER);
      assert.equal(s, "");
    });
  });

  it("development never returns humanized placeholders", () => {
    withNodeEnv("development", () => {
      assert.equal(formatMarketingMessage({}, "x.y.title", undefined, undefined), "");
    });
  });

  it("mirror stub values never render", () => {
    withNodeEnv("production", () => {
      const bundle = {
        "pages.shop.title": "Title",
      } as MarketingMessages;

      assert.equal(formatMarketingMessage(bundle, "pages.shop.title", undefined, undefined), "");
    });
  });

  it("shouty tokens never render", () => {
    withNodeEnv("production", () => {
      const bundle = {
        "nav.bad": "LABEL",
      } as MarketingMessages;

      assert.equal(formatMarketingMessage(bundle, "nav.bad", undefined, undefined), "");
    });
  });

  it("forbidden substrings never render", () => {
    withNodeEnv("production", () => {
      const bundle = {
        "pages.foo.title": "lorem ipsum text",
      } as MarketingMessages;

      assert.equal(formatMarketingMessage(bundle, "pages.foo.title", undefined, undefined), "");
    });
  });

  it("partial bundles do not break rendering", () => {
    withNodeEnv("production", () => {
      const bundle = {
        "nav.logIn": "Log in",
        "nav.language": "",
        "nav.theme": "Theme",
      } as MarketingMessages;

      assert.equal(formatMarketingMessage(bundle, "nav.logIn", undefined, undefined), "Log in");
      assert.equal(formatMarketingMessage(bundle, "nav.language", undefined, undefined), "");
      assert.equal(formatMarketingMessage(bundle, "nav.theme", undefined, undefined), "Theme");
    });
  });
});