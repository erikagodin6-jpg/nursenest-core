import assert from "node:assert/strict";
import test from "node:test";
import { normalizeMarketingPageTitle } from "@/lib/seo/normalize-page-title";

test("normalizeMarketingPageTitle strips repeated brand suffix", () => {
  assert.equal(
    normalizeMarketingPageTitle("NCLEX Study Plan | NurseNest | NurseNest"),
    "NCLEX Study Plan",
  );
});

test("normalizeMarketingPageTitle strips single brand suffix", () => {
  assert.equal(normalizeMarketingPageTitle("NCLEX Study Plan | NurseNest"), "NCLEX Study Plan");
});

test("normalizeMarketingPageTitle strips leading NurseNest prefix", () => {
  assert.equal(normalizeMarketingPageTitle("NurseNest | NCLEX Study Plan"), "NCLEX Study Plan");
});
