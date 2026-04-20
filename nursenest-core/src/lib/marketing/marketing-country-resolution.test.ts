import assert from "node:assert/strict";
import test from "node:test";
import { getExplicitMarketingCountryFromPathname } from "@/lib/marketing/get-country-from-path";
import { getEffectiveMarketingCountry } from "@/lib/marketing/get-effective-country";
import { marketingCountryFromOptionalRegionCookie } from "@/lib/marketing/marketing-country-region-map";
import { CANADA_NAV, US_NAV, getCountryHomepageContent } from "@/lib/marketing/countries/registry";
import { existsSync } from "node:fs";
import { join } from "node:path";

test("getExplicitMarketingCountryFromPathname reads first segment", () => {
  assert.equal(getExplicitMarketingCountryFromPathname("/canada"), "canada");
  assert.equal(getExplicitMarketingCountryFromPathname("/us/rn/nclex-rn"), "us");
  assert.equal(getExplicitMarketingCountryFromPathname("/philippines"), "philippines");
  assert.equal(getExplicitMarketingCountryFromPathname("/middle-east/prometric-nursing-exam"), "middle-east");
});

test("getExplicitMarketingCountryFromPathname strips locale prefix before country", () => {
  assert.equal(getExplicitMarketingCountryFromPathname("/fr/canada"), "canada");
  assert.equal(getExplicitMarketingCountryFromPathname("/tl/philippines"), "philippines");
});

test("getExplicitMarketingCountryFromPathname returns null for non-hub paths", () => {
  assert.equal(getExplicitMarketingCountryFromPathname("/"), null);
  assert.equal(getExplicitMarketingCountryFromPathname("/pricing"), null);
  assert.equal(getExplicitMarketingCountryFromPathname("/blog"), null);
});

test("marketingCountryFromOptionalRegionCookie defaults to canada when unset", () => {
  assert.equal(marketingCountryFromOptionalRegionCookie(undefined), "canada");
});

test("getEffectiveMarketingCountry prefers explicit path over cookie", () => {
  assert.equal(getEffectiveMarketingCountry("/us", "CA"), "us");
  assert.equal(getEffectiveMarketingCountry("/philippines", "US"), "philippines");
});

test("getEffectiveMarketingCountry falls back from cookie then canada", () => {
  assert.equal(getEffectiveMarketingCountry("/", "US"), "us");
  assert.equal(getEffectiveMarketingCountry("/", "CA"), "canada");
  assert.equal(getEffectiveMarketingCountry("/", undefined), "canada");
});

test("Canada nav features REx-PN as primary", () => {
  const rex = CANADA_NAV.primary.find((i) => i.label === "REx-PN");
  assert.ok(rex);
  assert.equal(rex?.kind, "primary");
});

test("US nav does not list REx-PN as primary", () => {
  const rexPrimary = US_NAV.primary.some((i) => i.label === "REx-PN" && i.kind === "primary");
  assert.equal(rexPrimary, false);
});

test("homepage content differs by country", () => {
  assert.notEqual(
    getCountryHomepageContent("canada").headline,
    getCountryHomepageContent("us").headline,
  );
  assert.notEqual(
    getCountryHomepageContent("philippines").primaryCta.href,
    getCountryHomepageContent("middle-east").primaryCta.href,
  );
});

test("/us App Router page module exists", () => {
  const repoRoot = join(process.cwd(), "src", "app", "(marketing)", "(default)", "us", "page.tsx");
  assert.ok(existsSync(repoRoot), `expected ${repoRoot}`);
});
