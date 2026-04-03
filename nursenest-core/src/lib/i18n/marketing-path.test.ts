import assert from "node:assert/strict";
import test from "node:test";
import { isExamHubMarketingPath } from "@/lib/i18n/exam-hub-path";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

test("withMarketingLocale prefixes non-English marketing paths", () => {
  assert.equal(withMarketingLocale("fr", "/pricing"), "/fr/pricing");
  assert.equal(withMarketingLocale("en", "/pricing"), "/pricing");
});

test("withMarketingLocale does not prefix exam hub country paths", () => {
  assert.equal(withMarketingLocale("fr", "/us/rn/nclex-rn/lessons"), "/us/rn/nclex-rn/lessons");
  assert.equal(withMarketingLocale("de", "/canada/rpn/rex-pn"), "/canada/rpn/rex-pn");
});

test("isExamHubMarketingPath detects us/canada hubs", () => {
  assert.equal(isExamHubMarketingPath("/us/rn/nclex-rn"), true);
  assert.equal(isExamHubMarketingPath("/canada/rpn/rex-pn"), true);
  assert.equal(isExamHubMarketingPath("/fr/pricing"), false);
  assert.equal(isExamHubMarketingPath("/pricing"), false);
});
