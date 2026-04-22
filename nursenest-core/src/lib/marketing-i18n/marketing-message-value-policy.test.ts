import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertNoPublicPlaceholderCopy,
  isForbiddenAuthoredMarketingLeafValue,
  isKeyContentMirrorStub,
  missingMarketingCopyFallback,
} from "@/lib/marketing-i18n/marketing-message-value-policy";

describe("marketing-message-value-policy", () => {
  it("missingMarketingCopyFallback is empty in production", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "production" });
    try {
      assert.equal(missingMarketingCopyFallback("any.key.title"), "");
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });

  it("missingMarketingCopyFallback humanizes in development", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "development" });
    try {
      assert.equal(missingMarketingCopyFallback("a.b.title"), "Title");
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });

  it("assertNoPublicPlaceholderCopy scrubs forbidden singletons in production", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "production" });
    try {
      assert.equal(assertNoPublicPlaceholderCopy("Title", "test"), "");
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });

  it("assertNoPublicPlaceholderCopy throws in development for forbidden singletons", () => {
    const prev = process.env.NODE_ENV;
    Object.assign(process.env, { NODE_ENV: "development" });
    try {
      assert.throws(() => assertNoPublicPlaceholderCopy("Lead", "test"), /\[marketing\]/);
    } finally {
      Object.assign(process.env, { NODE_ENV: prev });
    }
  });

  it("detects key mirror stubs but allows real acronyms as authored leaves", () => {
    assert.equal(isKeyContentMirrorStub("pages.shop.title", "Title"), true);
    assert.equal(isKeyContentMirrorStub("pages.shop.title", "Shop"), false);
    assert.equal(isForbiddenAuthoredMarketingLeafValue("ETCO2"), false);
    assert.equal(isForbiddenAuthoredMarketingLeafValue("label"), true);
  });

  it("flags ALL_CAPS design tokens like KICKER but not short clinical acronyms", () => {
    assert.equal(isForbiddenAuthoredMarketingLeafValue("KICKER"), true);
    assert.equal(isForbiddenAuthoredMarketingLeafValue("RN"), false);
  });
});
