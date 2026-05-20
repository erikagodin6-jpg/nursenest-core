import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { pathwayLessonMatchesMarketingPathwayContext } from "@/lib/lessons/pathway-lesson-catalog-sync";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

function row(partial: Partial<PathwayLessonRecord>): PathwayLessonRecord {
  return {
    slug: "sepsis-recognition",
    title: "Sepsis recognition",
    topic: "Infection",
    topicSlug: "infection",
    bodySystem: "immune_infectious",
    previewSectionCount: 4,
    seoTitle: "Sepsis recognition",
    seoDescription: "Clinical framing safety cues prioritization patterns and exam-style rationale for sepsis recognition.",
    sections: [],
    structuralQuality: { publicComplete: true },
    exams: ["NCLEX_RN"],
    countries: ["US"],
    ...partial,
  } as PathwayLessonRecord;
}

describe("pathwayLessonMatchesMarketingPathwayContext", () => {
  it("accepts a lesson scoped to the hub pathway exam and country", () => {
    assert.equal(pathwayLessonMatchesMarketingPathwayContext("us-rn-nclex-rn", row({})), true);
  });

  it("rejects when lesson exams exclude the pathway exam", () => {
    assert.equal(pathwayLessonMatchesMarketingPathwayContext("us-rn-nclex-rn", row({ exams: ["NCLEX_PN"] })), false);
  });

  it("allows NCLEX umbrella when pathway is NCLEX-RN", () => {
    assert.equal(pathwayLessonMatchesMarketingPathwayContext("us-rn-nclex-rn", row({ exams: ["NCLEX"] })), true);
  });
});
