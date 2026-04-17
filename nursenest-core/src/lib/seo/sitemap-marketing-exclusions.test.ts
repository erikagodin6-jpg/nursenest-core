import assert from "node:assert/strict";
import test from "node:test";
import {
  isAuthNoindexMarketingPathname,
  isEligiblePublicIndexSitemapLoc,
} from "@/lib/seo/sitemap-marketing-exclusions";

test("isAuthNoindexMarketingPathname: default-locale auth paths", () => {
  assert.equal(isAuthNoindexMarketingPathname("/login"), true);
  assert.equal(isAuthNoindexMarketingPathname("/signup"), true);
  assert.equal(isAuthNoindexMarketingPathname("/forgot-password"), true);
  assert.equal(isAuthNoindexMarketingPathname("/reset-password"), true);
  assert.equal(isAuthNoindexMarketingPathname("/pricing"), false);
});

test("isAuthNoindexMarketingPathname: localized auth only for hosted marketing locales", () => {
  assert.equal(isAuthNoindexMarketingPathname("/fr/login"), true);
  assert.equal(isAuthNoindexMarketingPathname("/us/login"), false);
});

test("isEligiblePublicIndexSitemapLoc drops auth URLs for same origin", () => {
  const origin = "https://www.example.test";
  assert.equal(isEligiblePublicIndexSitemapLoc(`${origin}/login`, origin), false);
  assert.equal(isEligiblePublicIndexSitemapLoc(`${origin}/fr/signup`, origin), false);
  assert.equal(isEligiblePublicIndexSitemapLoc(`${origin}/pricing`, origin), true);
});
