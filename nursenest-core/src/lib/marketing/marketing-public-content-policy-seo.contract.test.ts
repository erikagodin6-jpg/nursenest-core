import assert from "node:assert/strict";
import test from "node:test";
import {
  assertMarketingOverrideSeoGuards,
  getMarketingPublicContentKeyDef,
} from "@/lib/marketing/marketing-public-content-policy";

test("SEO guard rejects meta description longer than recommended cap", () => {
  const def = getMarketingPublicContentKeyDef("pages.home.metaDescription");
  assert.ok(def?.seoDescriptionMaxLen);
  const tooLong = "x".repeat((def!.seoDescriptionMaxLen ?? 0) + 5);
  assert.throws(() => assertMarketingOverrideSeoGuards("pages.home.metaDescription", tooLong, def!), /SEO description/);
});

test("SEO guard allows meta description within recommended cap", () => {
  const def = getMarketingPublicContentKeyDef("pages.home.metaDescription");
  assert.ok(def);
  const ok = "x".repeat(Math.min(120, def!.maxLen));
  assert.doesNotThrow(() => assertMarketingOverrideSeoGuards("pages.home.metaDescription", ok, def!));
});

test("plain-text guard rejects angle brackets", () => {
  const def = getMarketingPublicContentKeyDef("pages.home.hero.headline");
  assert.ok(def);
  assert.throws(() => assertMarketingOverrideSeoGuards("pages.home.hero.headline", "bad <b>", def!), /Angle brackets/);
});

test("SEO guard rejects meta title longer than recommended cap", () => {
  const def = getMarketingPublicContentKeyDef("pages.home.metaTitle");
  assert.ok(def?.seoTitleMaxLen);
  const tooLong = "x".repeat((def!.seoTitleMaxLen ?? 0) + 5);
  assert.throws(() => assertMarketingOverrideSeoGuards("pages.home.metaTitle", tooLong, def!), /SEO title/);
});
