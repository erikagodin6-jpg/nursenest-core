import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isLocalePrefixedPathnameExcludedFromSitemap,
  isLocaleSitemapIncluded,
} from "@/lib/i18n/language-readiness";

describe("isLocalePrefixedPathnameExcludedFromSitemap", () => {
  it("does not exclude country / exam hub segments (not marketing locale codes)", () => {
    assert.equal(isLocalePrefixedPathnameExcludedFromSitemap("/us/rn/nclex-rn/lessons"), false);
    assert.equal(isLocalePrefixedPathnameExcludedFromSitemap("/canada/rn/nclex-rn"), false);
  });

  it("excludes partial-tier marketing locale prefixes (e.g. French, Tagalog, Hindi)", () => {
    assert.equal(isLocaleSitemapIncluded("fr"), false);
    assert.equal(isLocalePrefixedPathnameExcludedFromSitemap("/fr/pricing"), true);
    assert.equal(isLocaleSitemapIncluded("tl"), false);
    assert.equal(isLocaleSitemapIncluded("hi"), false);
    assert.equal(isLocalePrefixedPathnameExcludedFromSitemap("/tl/pricing"), true);
    assert.equal(isLocalePrefixedPathnameExcludedFromSitemap("/hi/faq"), true);
  });

  it("excludes incomplete-tier marketing locale prefixes", () => {
    assert.equal(isLocaleSitemapIncluded("de"), false);
    assert.equal(isLocalePrefixedPathnameExcludedFromSitemap("/de/pricing"), true);
  });

  it("does not exclude the default locale policy", () => {
    assert.equal(isLocaleSitemapIncluded("en"), true);
    assert.equal(isLocalePrefixedPathnameExcludedFromSitemap("/pricing"), false);
  });
});
