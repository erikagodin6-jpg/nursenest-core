import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isLocalePrefixedPathnameExcludedFromSitemap,
  isLocaleSitemapIncluded,
  SEO_BLOCKED_LOCALES,
} from "@/lib/i18n/language-readiness";

describe("isLocalePrefixedPathnameExcludedFromSitemap", () => {
  it("does not exclude country / exam hub segments (not marketing locale codes)", () => {
    assert.equal(isLocalePrefixedPathnameExcludedFromSitemap("/us/rn/nclex-rn/lessons"), false);
    assert.equal(isLocalePrefixedPathnameExcludedFromSitemap("/canada/rn/nclex-rn"), false);
  });

  it("excludes partial-tier marketing locale prefixes", () => {
    assert.equal(isLocaleSitemapIncluded("fr"), false);
    assert.equal(isLocaleSitemapIncluded("es"), false);
    assert.equal(isLocalePrefixedPathnameExcludedFromSitemap("/fr/pricing"), true);
    assert.equal(isLocalePrefixedPathnameExcludedFromSitemap("/es/pricing"), true);
  });

  it("allows full-tier marketing locale prefixes", () => {
    assert.equal(isLocaleSitemapIncluded("tl"), true);
    assert.equal(isLocaleSitemapIncluded("hi"), true);
    assert.equal(isLocalePrefixedPathnameExcludedFromSitemap("/tl/pricing"), false);
    assert.equal(isLocalePrefixedPathnameExcludedFromSitemap("/hi/faq"), false);
  });

  it("excludes incomplete-tier marketing locale prefixes", () => {
    assert.equal(isLocaleSitemapIncluded("de"), false);
    assert.equal(isLocalePrefixedPathnameExcludedFromSitemap("/de/pricing"), true);
  });

  it("excludes explicitly blocked locales even when the language registry is ahead of production readiness", () => {
    for (const locale of SEO_BLOCKED_LOCALES) {
      assert.equal(isLocaleSitemapIncluded(locale), false, locale);
      assert.equal(isLocalePrefixedPathnameExcludedFromSitemap(`/${locale}/pricing`), true, locale);
    }
  });

  it("does not exclude the default locale policy", () => {
    assert.equal(isLocaleSitemapIncluded("en"), true);
    assert.equal(isLocalePrefixedPathnameExcludedFromSitemap("/pricing"), false);
  });
});
