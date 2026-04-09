import assert from "node:assert/strict";
import test from "node:test";
import { marketingExamHubPath } from "@/lib/marketing/country-exam-offerings";
import {
  ensureMarketingExamHubPath,
  isWellFormedExamHubPath,
} from "@/lib/marketing/nursing-exam-nav-validation";

test("isWellFormedExamHubPath accepts canonical three-segment hubs", () => {
  assert.equal(isWellFormedExamHubPath("/us/rn/nclex-rn"), true);
  assert.equal(isWellFormedExamHubPath("/canada/rpn/rex-pn"), true);
  assert.equal(isWellFormedExamHubPath("/us"), false);
  assert.equal(isWellFormedExamHubPath("/lessons"), false);
});

test("ensureMarketingExamHubPath falls back to RN hub when href is malformed", () => {
  assert.equal(ensureMarketingExamHubPath("US", ""), "/us/rn/nclex-rn");
  assert.equal(ensureMarketingExamHubPath("CA", "/bad"), "/canada/rn/nclex-rn");
});

test("marketingExamHubPath returns well-formed hubs for US and CA (RN / PN / NP / allied)", () => {
  for (const region of ["US", "CA"] as const) {
    for (const id of ["rn", "pn", "np", "allied"] as const) {
      const href = marketingExamHubPath(region, id);
      assert.equal(isWellFormedExamHubPath(href), true, `${region} ${id} -> ${href}`);
    }
  }
});
