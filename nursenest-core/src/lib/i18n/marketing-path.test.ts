import assert from "node:assert/strict";
import test from "node:test";
import {
  canonicalExamHubPathFromPossiblyLocalizedPath,
  isExamHubMarketingPath,
  isExpansionExamMarketingPath,
} from "@/lib/i18n/exam-hub-path";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

test("withMarketingLocale prefixes non-English marketing paths", () => {
  assert.equal(withMarketingLocale("fr", "/pricing"), "/fr/pricing");
  assert.equal(withMarketingLocale("en", "/pricing"), "/pricing");
});

test("withMarketingLocale does not prefix exam hub country paths", () => {
  assert.equal(withMarketingLocale("fr", "/us/rn/nclex-rn/lessons"), "/us/rn/nclex-rn/lessons");
  assert.equal(withMarketingLocale("de", "/canada/rpn/rex-pn"), "/canada/rpn/rex-pn");
});

test("withMarketingLocale does not prefix global expansion /exams/ hubs (avoid /tl/exams/... 404s)", () => {
  assert.equal(withMarketingLocale("tl", "/exams/philippines"), "/exams/philippines");
  assert.equal(withMarketingLocale("fr", "/exams/india"), "/exams/india");
});

test("withMarketingLocale does not prefix subscriber app or admin (avoid /fr/app/... marketing tree)", () => {
  assert.equal(withMarketingLocale("fr", "/app/lessons"), "/app/lessons");
  assert.equal(withMarketingLocale("de", "/app"), "/app");
  assert.equal(withMarketingLocale("fr", "/admin"), "/admin");
});

test("isExpansionExamMarketingPath", () => {
  assert.equal(isExpansionExamMarketingPath("/exams/philippines"), true);
  assert.equal(isExpansionExamMarketingPath("/exams"), true);
  assert.equal(isExpansionExamMarketingPath("/pricing"), false);
});

test("isExamHubMarketingPath detects us/canada hubs", () => {
  assert.equal(isExamHubMarketingPath("/us/rn/nclex-rn"), true);
  assert.equal(isExamHubMarketingPath("/canada/rpn/rex-pn"), true);
  assert.equal(isExamHubMarketingPath("/fr/pricing"), false);
  assert.equal(isExamHubMarketingPath("/pricing"), false);
});

test("isExamHubMarketingPath detects hubs after a non-English locale prefix", () => {
  assert.equal(isExamHubMarketingPath("/fr/us/rn/nclex-rn"), true);
  assert.equal(isExamHubMarketingPath("/es/canada/np/cnple"), true);
  assert.equal(isExamHubMarketingPath("/fr/pricing"), false);
});

test("canonicalExamHubPathFromPossiblyLocalizedPath strips non-English locale prefixes from exam hubs", () => {
  assert.deepEqual(canonicalExamHubPathFromPossiblyLocalizedPath("/fr/canada/rpn/rex-pn"), {
    locale: "fr",
    canonicalPath: "/canada/rpn/rex-pn",
  });
  assert.deepEqual(canonicalExamHubPathFromPossiblyLocalizedPath("/es/us/rn/nclex-rn/questions"), {
    locale: "es",
    canonicalPath: "/us/rn/nclex-rn/questions",
  });
  assert.equal(canonicalExamHubPathFromPossiblyLocalizedPath("/fr/pricing"), null);
});
