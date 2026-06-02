import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  NURSING_EXAM_ECOSYSTEM_TARGETS,
  evaluateNursingExamTargetReadiness,
  rankNursingExamGaps,
  type NursingExamInventory,
} from "./nursing-exam-ecosystem-readiness";

function inventory(targetId: string, overrides: Partial<NursingExamInventory> = {}): NursingExamInventory {
  return {
    targetId,
    pathwayId: overrides.pathwayId,
    publishedQuestions: 0,
    activeQuestions: 0,
    visibleQuestions: 0,
    publishedLessons: 0,
    publishedFlashcards: 0,
    ngnItems: 0,
    caseStudies: 0,
    questionTypeCounts: {},
    ...overrides,
  };
}

describe("nursing exam ecosystem publication readiness", () => {
  it("encodes the requested minimum inventory floors for priority nursing exams", () => {
    const byId = new Map(NURSING_EXAM_ECOSYSTEM_TARGETS.map((target) => [target.id, target]));
    assert.equal(byId.get("ca-np-cnple")?.minimums.publishedQuestions, 2500);
    assert.equal(byId.get("us-np-fnp")?.minimums.publishedQuestions, 2500);
    assert.equal(byId.get("ca-rn-nclex-rn")?.minimums.publishedQuestions, 10000);
    assert.equal(byId.get("us-rn-nclex-rn")?.minimums.publishedQuestions, 10000);
    assert.equal(byId.get("ca-rpn-rex-pn")?.minimums.publishedQuestions, 5000);
    assert.equal(byId.get("us-lpn-nclex-pn")?.minimums.publishedQuestions, 5000);
    assert.ok(byId.get("us-np-enp"), "ENP target must be tracked even before public pathway launch");
  });

  it("does not mark thin content as publication-ready or monetization-ready", () => {
    const target = NURSING_EXAM_ECOSYSTEM_TARGETS.find((item) => item.id === "ca-np-cnple");
    assert.ok(target);
    const result = evaluateNursingExamTargetReadiness(
      target,
      inventory(target.id, {
        pathwayId: target.pathwayId,
        publishedQuestions: 2499,
        publishedLessons: 120,
        publishedFlashcards: 5000,
        ngnItems: 300,
        caseStudies: 100,
        questionTypeCounts: { MCQ: 2000, SATA: 300, NGN_CASE: 100, ORDERING: 50, FIB_NUMERIC: 49 },
      }),
    );

    assert.equal(result.publicationReady, false);
    assert.equal(result.monetizationReady, false);
    assert.ok(result.gaps.some((gap) => gap.area === "questions" && gap.severity === "blocker"));
  });

  it("requires all major item types before publication", () => {
    const target = NURSING_EXAM_ECOSYSTEM_TARGETS.find((item) => item.id === "us-rn-nclex-rn");
    assert.ok(target);
    const result = evaluateNursingExamTargetReadiness(
      target,
      inventory(target.id, {
        pathwayId: target.pathwayId,
        publishedQuestions: 10000,
        publishedLessons: 160,
        publishedFlashcards: 5000,
        ngnItems: 800,
        caseStudies: 250,
        questionTypeCounts: { MCQ: 9000, SATA: 1000 },
      }),
    );

    assert.equal(result.publicationReady, false);
    assert.ok(result.gaps.some((gap) => gap.area === "question_type" && gap.required === "NGN_CASE"));
  });

  it("ranks critical content gaps before strategic gaps", () => {
    const critical = NURSING_EXAM_ECOSYSTEM_TARGETS.find((item) => item.id === "ca-rn-nclex-rn");
    const strategic = NURSING_EXAM_ECOSYSTEM_TARGETS.find((item) => item.id === "us-np-enp");
    assert.ok(critical);
    assert.ok(strategic);

    const ranked = rankNursingExamGaps([
      evaluateNursingExamTargetReadiness(strategic, inventory(strategic.id)),
      evaluateNursingExamTargetReadiness(critical, inventory(critical.id, { pathwayId: critical.pathwayId })),
    ]);

    assert.equal(ranked[0]?.target.id, "ca-rn-nclex-rn");
  });
});
