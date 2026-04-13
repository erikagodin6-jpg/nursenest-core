import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { buildNursingTierHubContent } from "@/lib/marketing/nursing-tier-hub-content";

describe("buildNursingTierHubContent", () => {
  it("builds stable RN hub content with the four primary study actions", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);

    const content = buildNursingTierHubContent(pathway);

    assert.equal(content.title, "RN learning and exam prep");
    assert.equal(content.audienceLabel, "RN");
    assert.equal(content.examLabel, "NCLEX-RN");
    assert.deepEqual(
      content.actions.map((action) => [action.id, action.label, action.href]),
      [
        ["lessons", "Lessons", "/us/rn/nclex-rn/lessons"],
        ["flashcards", "Flashcards", "/app/flashcards?pathwayId=us-rn-nclex-rn"],
        ["practice_questions", "Practice Questions", "/us/rn/nclex-rn/questions"],
        ["exams", "Exams", "/us/rn/nclex-rn/cat"],
      ],
    );
  });

  it("uses region-aware PN naming for the United States", () => {
    const pathway = getExamPathwayById("us-lpn-nclex-pn");
    assert.ok(pathway);

    const content = buildNursingTierHubContent(pathway);

    assert.equal(content.audienceLabel, "LPN / LVN");
    assert.equal(content.examLabel, "NCLEX-PN");
    assert.match(content.includedNote, /LPN \/ LVN/i);
  });

  it("uses region-aware PN naming for Canada", () => {
    const pathway = getExamPathwayById("ca-rpn-rex-pn");
    assert.ok(pathway);

    const content = buildNursingTierHubContent(pathway);

    assert.equal(content.audienceLabel, "RPN");
    assert.equal(content.examLabel, "REx-PN");
    assert.match(content.includedNote, /RPN/i);
  });

  it("keeps NP landing copy tier-first while preserving the current default pathway links", () => {
    const pathway = getExamPathwayById("us-np-fnp");
    assert.ok(pathway);

    const content = buildNursingTierHubContent(pathway);

    assert.equal(content.title, "NP learning and exam prep");
    assert.equal(content.audienceLabel, "NP");
    assert.equal(content.examLabel, "ANCC / AANP - Family NP");
    assert.equal(content.actions[0]?.href, "/us/np/fnp/lessons");
    assert.match(content.includedNote, /Family NP/i);
  });
});
