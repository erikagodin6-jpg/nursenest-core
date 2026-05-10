import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  pathwayQuestionsMarketingHubH1,
  pathwayQuestionsMarketingHubMetaTitle,
} from "@/lib/lessons/pathway-questions-hub-seo";

describe("pathway-questions-hub-seo", () => {
  it("produces distinct H1 copy for Canada RN vs US RN NCLEX pathways", () => {
    const ca = getExamPathwayById("ca-rn-nclex-rn");
    const us = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(ca && us);
    const caH1 = pathwayQuestionsMarketingHubH1(ca);
    const usH1 = pathwayQuestionsMarketingHubH1(us);
    assert.match(caH1, /Canada/i);
    assert.match(usH1, /United States/i);
    assert.ok(!caH1.includes("United States"));
    assert.notStrictEqual(caH1, usH1);
    assert.match(caH1, /NCLEX-RN.*practice questions/i);
  });

  it("Canada REx-PN pathway includes exam and PN role wording (mirrors lesson hub)", () => {
    const pn = getExamPathwayById("ca-rpn-rex-pn");
    assert.ok(pn);
    const h1 = pathwayQuestionsMarketingHubH1(pn);
    assert.match(h1, /REx-PN/i);
    assert.match(h1, /\(RPN\)/);
    assert.match(h1, /practice questions for Canada/i);
  });

  it("meta title includes brand suffix once and matches H1 stem", () => {
    const ca = getExamPathwayById("ca-rn-nclex-rn");
    assert.ok(ca);
    const meta = pathwayQuestionsMarketingHubMetaTitle(ca);
    assert.ok(meta.endsWith("| NurseNest"));
    assert.ok(meta.includes(pathwayQuestionsMarketingHubH1(ca)));
  });

  it("NP pathway uses catalog short name in H1 (no generic Practice questions fallback)", () => {
    const np = getExamPathwayById("ca-np-cnple");
    assert.ok(np);
    const h1 = pathwayQuestionsMarketingHubH1(np);
    assert.match(h1, /exam prep questions for Canada/i);
    assert.ok(np.shortName.length > 0);
    assert.ok(h1.includes(np.shortName) || h1.toLowerCase().includes(np.shortName.toLowerCase()));
  });

  it("Allied Canada pathway uses allied headline (not displayName-only generic)", () => {
    const allied = getExamPathwayById("ca-allied-core");
    assert.ok(allied);
    const h1 = pathwayQuestionsMarketingHubH1(allied);
    assert.match(h1, /Allied health practice questions for Canada/i);
  });
});
