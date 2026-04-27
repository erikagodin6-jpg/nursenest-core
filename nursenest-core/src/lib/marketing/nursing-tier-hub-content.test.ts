import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { buildNursingTierHubContent, resolveNursingTierHubActionHref } from "@/lib/marketing/nursing-tier-hub-content";

describe("buildNursingTierHubContent", () => {
  it("builds stable RN hub content with the four primary study actions", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);

    const content = buildNursingTierHubContent(pathway);

    assert.equal(content.title, "NCLEX-RN practice questions for the US");
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

    assert.equal(content.title, "FNP NP exam prep for the US");
    assert.equal(content.audienceLabel, "NP");
    assert.equal(content.examLabel, "ANCC / AANP - Family NP");
    assert.equal(content.actions[0]?.href, "/us/np/fnp/lessons");
    assert.match(content.includedNote, /Family NP/i);
  });

  it("Canadian RN hub copy names Canada (not US) and keeps /canada/ routes on cards", () => {
    const pathway = getExamPathwayById("ca-rn-nclex-rn");
    assert.ok(pathway);
    const content = buildNursingTierHubContent(pathway);
    assert.match(content.description, /Canada/);
    assert.equal(content.description.includes("United States"), false);
    assert.deepEqual(
      content.actions.map((a) => a.href),
      [
        "/canada/rn/nclex-rn/lessons",
        "/app/flashcards?pathwayId=ca-rn-nclex-rn",
        "/canada/rn/nclex-rn/questions",
        "/canada/rn/nclex-rn/cat",
      ],
    );
  });
});

describe("resolveNursingTierHubActionHref", () => {
  it("ignores placeholder # href and uses pathway lessons index", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const href = resolveNursingTierHubActionHref(pathway, {
      id: "lessons",
      label: "Lessons",
      description: "x",
      href: "#",
    });
    assert.equal(href, "/us/rn/nclex-rn/lessons");
  });

  it("ignores fragment-only hrefs for lessons", () => {
    const pathway = getExamPathwayById("us-lpn-nclex-pn");
    assert.ok(pathway);
    const href = resolveNursingTierHubActionHref(pathway, {
      id: "lessons",
      label: "Lessons",
      description: "x",
      href: "#topics",
    });
    assert.equal(href, "/us/pn/nclex-pn/lessons");
  });

  it("keeps a valid absolute pathway href when present", () => {
    const pathway = getExamPathwayById("us-np-fnp");
    assert.ok(pathway);
    const custom = "/us/np/fnp/lessons?topicSlug=foo";
    const href = resolveNursingTierHubActionHref(pathway, {
      id: "lessons",
      label: "Lessons",
      description: "x",
      href: custom,
    });
    assert.equal(href, custom);
  });
});
