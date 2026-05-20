import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EXAM_PATHWAYS, getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { resolveLessonContextForPathway, resolveLessonContextForPathwayId } from "@/lib/lessons/lesson-region-exam";
import { pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";

describe("resolveLessonContextForPathway", () => {
  it("maps US PN to NCLEX_PN and US country", () => {
    const p = getExamPathwayById("us-lpn-nclex-pn");
    assert.ok(p);
    assert.deepEqual(resolveLessonContextForPathway(p!), { exam: "NCLEX_PN", country: "US" });
  });

  it("maps Canada PN (RPN) to REX_PN and CA country", () => {
    const p = getExamPathwayById("ca-rpn-rex-pn");
    assert.ok(p);
    assert.deepEqual(resolveLessonContextForPathway(p!), { exam: "REX_PN", country: "CA" });
  });

  it("maps US and Canada RN to NCLEX_RN with correct country", () => {
    const us = getExamPathwayById("us-rn-nclex-rn");
    const ca = getExamPathwayById("ca-rn-nclex-rn");
    assert.ok(us && ca);
    assert.deepEqual(resolveLessonContextForPathway(us!), { exam: "NCLEX_RN", country: "US" });
    assert.deepEqual(resolveLessonContextForPathway(ca!), { exam: "NCLEX_RN", country: "CA" });
  });

  it("maps NP and Allied pathways to exam kind with pathway country", () => {
    const fnp = getExamPathwayById("us-np-fnp");
    const cnple = getExamPathwayById("ca-np-cnple");
    const usAllied = getExamPathwayById("us-allied-core");
    assert.ok(fnp && cnple && usAllied);
    assert.deepEqual(resolveLessonContextForPathway(fnp!), { exam: "NP", country: "US" });
    assert.deepEqual(resolveLessonContextForPathway(cnple!), { exam: "NP", country: "CA" });
    assert.deepEqual(resolveLessonContextForPathway(usAllied!), { exam: "ALLIED", country: "US" });
  });

  it("pathwayRegionAwareExamName separates NCLEX-PN from REx-PN by pathway country", () => {
    const usPn = getExamPathwayById("us-lpn-nclex-pn");
    const caPn = getExamPathwayById("ca-rpn-rex-pn");
    assert.ok(usPn && caPn);
    assert.equal(pathwayRegionAwareExamName(usPn!), "NCLEX-PN");
    assert.equal(pathwayRegionAwareExamName(caPn!), "REx-PN");
  });
});

describe("resolveLessonContextForPathwayId", () => {
  it("infers CA vs US from pathway id prefix without mixing PN exam types", () => {
    assert.deepEqual(resolveLessonContextForPathwayId("us-lpn-nclex-pn"), { exam: "NCLEX_PN", country: "US" });
    assert.deepEqual(resolveLessonContextForPathwayId("ca-rpn-rex-pn"), { exam: "REX_PN", country: "CA" });
  });

  it("keeps new-grad US pathway on US + RN exam context", () => {
    assert.deepEqual(resolveLessonContextForPathwayId("us-rn-new-grad-transition"), { exam: "NCLEX_RN", country: "US" });
  });

  it("matches resolveLessonContextForPathway for every registered pathway id (NP/RN/RPN taxonomies)", () => {
    for (const p of EXAM_PATHWAYS) {
      const a = resolveLessonContextForPathway(p);
      const b = resolveLessonContextForPathwayId(p.id);
      assert.deepEqual(
        b,
        a,
        `lesson context mismatch for pathway ${p.id}: id-based=${JSON.stringify(b)} def-based=${JSON.stringify(a)}`,
      );
    }
  });
});
