import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildStructuredStudyPath,
  coalesceStudyPathKindParam,
  inferStudyPathKindFromLearnerProfile,
  resolveStructuredStudyPathwayId,
  type StudyPathKind,
} from "@/lib/learner/structured-study-path";

describe("structured-study-path", () => {
  it("infers kind from tier and pathway", () => {
    assert.equal(inferStudyPathKindFromLearnerProfile({ tier: "ALLIED", learnerPathId: null }), "allied");
    assert.equal(inferStudyPathKindFromLearnerProfile({ tier: "NP", learnerPathId: null }), "np");
    assert.equal(inferStudyPathKindFromLearnerProfile({ tier: "LVN_LPN", learnerPathId: null }), "pn");
    assert.equal(inferStudyPathKindFromLearnerProfile({ tier: "RPN", learnerPathId: null }), "pn");
    assert.equal(inferStudyPathKindFromLearnerProfile({ tier: "RN", learnerPathId: "us-rn-nclex-rn" }), "rn");
    assert.equal(inferStudyPathKindFromLearnerProfile({ tier: "RN", learnerPathId: "us-lpn-nclex-pn" }), "pn");
    assert.equal(inferStudyPathKindFromLearnerProfile({ tier: "RN", learnerPathId: "us-np-fnp" }), "np");
  });

  it("coalesceStudyPathKindParam ignores invalid query values", () => {
    assert.equal(coalesceStudyPathKindParam("bogus", "rn"), "rn");
    assert.equal(coalesceStudyPathKindParam("new_grad", "rn"), "new_grad");
  });

  it("defaults pathway per kind", () => {
    assert.equal(resolveStructuredStudyPathwayId("rn", null), "us-rn-nclex-rn");
    assert.equal(resolveStructuredStudyPathwayId("pn", null), "us-lpn-nclex-pn");
    assert.equal(resolveStructuredStudyPathwayId("np", null), "us-np-fnp");
    assert.equal(resolveStructuredStudyPathwayId("allied", null), "us-allied-core");
  });

  it("orders foundation before build and ends with capstone CAT", () => {
    const p = buildStructuredStudyPath({
      kind: "rn",
      pathwayId: "us-rn-nclex-rn",
      weakTopics: [],
    });
    assert.equal(p.version, 1);
    assert.equal(p.pathwayId, "us-rn-nclex-rn");
    const phases = p.steps.map((s) => s.phase);
    const firstFoundation = phases.indexOf("foundation");
    const firstBuild = phases.indexOf("build");
    const firstAdvanced = phases.indexOf("advanced");
    const last = p.steps[p.steps.length - 1]!;
    assert.ok(firstFoundation >= 0);
    assert.ok(firstBuild > firstFoundation);
    assert.ok(firstAdvanced > firstBuild);
    assert.equal(last.phase, "adaptive");
    assert.equal(last.contentType, "cat");
    assert.ok(last.href.includes("/app/practice-tests/cat-launch"));
  });

  it("inserts weak_spot triplets after foundation", () => {
    const p = buildStructuredStudyPath({
      kind: "rn",
      pathwayId: "us-rn-nclex-rn",
      weakTopics: [{ topic: "Stroke", normalizedTopic: "stroke" }],
      maxWeakBlocks: 1,
    });
    assert.ok(p.weakTopicsApplied.includes("Stroke"));
    const idxFoundation = p.steps.findIndex((s) => s.phase === "foundation" && s.contentType === "cat");
    assert.equal(idxFoundation, -1);
    const idxFirstWeak = p.steps.findIndex((s) => s.phase === "weak_spot");
    const idxLastFoundation = p.steps.map((s, i) => (s.phase === "foundation" ? i : -1)).filter((i) => i >= 0).pop();
    assert.ok(idxFirstWeak > (idxLastFoundation ?? -1));
    const weakCat = p.steps.filter((s) => s.phase === "weak_spot" && s.contentType === "cat");
    assert.equal(weakCat.length, 1);
    assert.ok(weakCat[0]!.href.includes("cat=1"));
  });

  it("includes lessons and questions for each curriculum block", () => {
    const p = buildStructuredStudyPath({ kind: "allied", pathwayId: "us-allied-core" });
    const foundation = p.steps.filter((s) => s.phase === "foundation");
    const lessonCount = foundation.filter((s) => s.contentType === "lessons").length;
    const qCount = foundation.filter((s) => s.contentType === "questions").length;
    assert.equal(lessonCount, 3);
    assert.equal(qCount, 3);
  });

  it("new_grad uses RN default pathway", () => {
    const p = buildStructuredStudyPath({ kind: "new_grad", pathwayId: "us-rn-nclex-rn" });
    assert.equal(p.kind, "new_grad" satisfies StudyPathKind);
    assert.ok(p.summary.toLowerCase().includes("new graduate"));
  });
});
