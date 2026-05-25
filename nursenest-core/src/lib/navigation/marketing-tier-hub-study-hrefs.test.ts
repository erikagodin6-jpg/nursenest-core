import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  isUnsafeOrPlaceholderTierHubHref,
  marketingTierHubStudyActionHref,
  resolveMarketingTierHubStudyActionHref,
} from "@/lib/navigation/marketing-tier-hub-study-hrefs";

describe("marketingTierHubStudyActionHref", () => {
  it("routes tier hub Lessons CTA to the canonical pathway lessons hub (RN, RPN/PN, NP, Allied, New Grad)", () => {
    const usRn = getExamPathwayById("us-rn-nclex-rn");
    const caRpn = getExamPathwayById("ca-rpn-rex-pn");
    const usNp = getExamPathwayById("us-np-fnp");
    const usAllied = getExamPathwayById("us-allied-core");
    const usNewGrad = getExamPathwayById("us-rn-new-grad-transition");
    assert.ok(usRn && caRpn && usNp && usAllied && usNewGrad);
    assert.equal(marketingTierHubStudyActionHref(usRn!, "lessons"), "/us/rn/nclex-rn/lessons");
    assert.equal(marketingTierHubStudyActionHref(caRpn!, "lessons"), "/canada/pn/rex-pn/lessons");
    assert.equal(marketingTierHubStudyActionHref(usNp!, "lessons"), "/us/np/fnp/lessons");
    assert.equal(marketingTierHubStudyActionHref(usAllied!, "lessons"), "/allied/allied-health/lessons");
    assert.equal(marketingTierHubStudyActionHref(usNewGrad!, "lessons"), "/us/rn/new-grad-transition/lessons");
  });

  it("scopes core study surfaces to the pathway URL tree", () => {
    const usPn = getExamPathwayById("us-lpn-nclex-pn");
    assert.ok(usPn);
    assert.equal(marketingTierHubStudyActionHref(usPn, "lessons"), "/us/pn/nclex-pn/lessons");
    assert.equal(marketingTierHubStudyActionHref(usPn, "practice_questions"), "/us/pn/nclex-pn/questions");
    assert.equal(marketingTierHubStudyActionHref(usPn, "exams"), "/app/practice-tests?pathwayId=us-lpn-nclex-pn");
    assert.equal(marketingTierHubStudyActionHref(usPn, "flashcards"), "/flashcards");
  });

  it("never returns empty or fragment-only paths for core actions", () => {
    const caRn = getExamPathwayById("ca-rn-nclex-rn");
    assert.ok(caRn);
    for (const id of ["lessons", "practice_questions", "cat", "exams"] as const) {
      const h = marketingTierHubStudyActionHref(caRn, id);
      assert.ok(h.startsWith("/"));
      assert.notEqual(h, "#");
      assert.equal(h.includes("#"), false);
    }
  });

  it("routes tier hub CAT tile to the public pathway CAT explainer", () => {
    const caRn = getExamPathwayById("ca-rn-nclex-rn");
    assert.ok(caRn);
    assert.equal(marketingTierHubStudyActionHref(caRn, "cat"), "/canada/rn/nclex-rn/cat");
  });
});

describe("isUnsafeOrPlaceholderTierHubHref", () => {
  it("flags empty and fragment-only values", () => {
    assert.equal(isUnsafeOrPlaceholderTierHubHref(undefined), true);
    assert.equal(isUnsafeOrPlaceholderTierHubHref(""), true);
    assert.equal(isUnsafeOrPlaceholderTierHubHref(" "), true);
    assert.equal(isUnsafeOrPlaceholderTierHubHref("#"), true);
    assert.equal(isUnsafeOrPlaceholderTierHubHref("#topics"), true);
  });

  it("flags disallowed protocols", () => {
    assert.equal(isUnsafeOrPlaceholderTierHubHref("javascript:void(0)"), true);
    assert.equal(isUnsafeOrPlaceholderTierHubHref("data:text/html,hi"), true);
    assert.equal(isUnsafeOrPlaceholderTierHubHref("vbscript:evil"), true);
  });

  it("allows normal internal paths", () => {
    assert.equal(isUnsafeOrPlaceholderTierHubHref("/us/rn/nclex-rn/lessons"), false);
  });
});

describe("resolveMarketingTierHubStudyActionHref", () => {
  it("preserves https URLs when explicitly provided", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const ext = "https://example.com/help";
    assert.equal(resolveMarketingTierHubStudyActionHref(pathway, "lessons", ext), ext);
  });

  it("rejects protocol-relative URLs", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    assert.equal(
      resolveMarketingTierHubStudyActionHref(pathway, "lessons", "//evil.example/phish"),
      "/us/rn/nclex-rn/lessons",
    );
  });

  it("preserves safe /app/practice-tests override when pathwayId matches", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const ok = "/app/practice-tests?pathwayId=us-rn-nclex-rn&cat=1";
    assert.equal(resolveMarketingTierHubStudyActionHref(pathway, "exams", ok), ok);
    assert.equal(
      resolveMarketingTierHubStudyActionHref(pathway, "exams", "/app/practice-tests?pathwayId=ca-rn-nclex-rn"),
      "/app/practice-tests?pathwayId=us-rn-nclex-rn",
    );
  });

  it("preserves cat-launch override when pathwayId matches", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const ok = "/app/practice-tests/cat-launch?pathwayId=us-rn-nclex-rn";
    assert.equal(resolveMarketingTierHubStudyActionHref(pathway, "cat", ok), ok);
    assert.equal(
      resolveMarketingTierHubStudyActionHref(pathway, "cat", "/app/practice-tests/cat-launch?pathwayId=ca-rn-nclex-rn"),
      "/us/rn/nclex-rn/cat",
    );
  });
});
