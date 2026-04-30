import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildLegacyNpIndex,
  findLegacyNpMatch,
  LEGACY_NP_SLUG_ALIASES,
  mapLegacySectionLabelToKind,
  mapPhase2LessonToCanonicalSections,
  mergeLegacyBodiesIntoLessonSections,
  normalizeLessonTitleForMatch,
} from "@/lib/lessons/np-legacy-lesson-merge";
import { RN_EXPAND_REQUIRED_SECTION_KINDS } from "@/lib/lessons/rn-expanded-lesson-contract";

describe("np-legacy-lesson-merge", () => {
  it("matches exact slug via topicSlug on legacy record", () => {
    const records = [
      {
        topicSlug: "knee-pain-differential",
        topicName: "Knee Pain",
        lesson: { clinicalFraming: "x" },
        sourcePath: "/tmp/a.json",
      },
    ];
    const idx = buildLegacyNpIndex(records);
    const m = findLegacyNpMatch({ slug: "knee-pain-differential", title: "Other", index: idx });
    assert.ok(m);
    assert.equal(m.kind, "slug");
  });

  it("matches normalized title", () => {
    const title = "Stable Angina Risk Stratification";
    const records = [
      {
        topicSlug: "topic-a",
        topicName: title,
        lesson: { clinicalFraming: "y" },
        sourcePath: "/tmp/b.json",
      },
    ];
    const idx = buildLegacyNpIndex(records);
    const m = findLegacyNpMatch({
      slug: "unrelated-slug",
      title: `${title} (NP licensure, Canada)`,
      index: idx,
    });
    assert.ok(m);
    assert.equal(m.kind, "title");
  });

  it("does not overwrite stronger current section with thinner legacy", () => {
    const longBody = Array.from({ length: 200 }, () => "word").join(" ");
    const sections = RN_EXPAND_REQUIRED_SECTION_KINDS.map((kind) => ({
      id: kind,
      kind,
      heading: kind,
      body: kind === "introduction" ? longBody : "",
    }));
    const legacyBodies = { introduction: "short" };
    const { mergedKinds, skippedStrong } = mergeLegacyBodiesIntoLessonSections({ sections, legacyBodies });
    assert.ok(!mergedKinds.includes("introduction"));
    assert.ok(skippedStrong.includes("introduction"));
  });

  it("maps legacy section labels into canonical kinds", () => {
    assert.equal(mapLegacySectionLabelToKind("Pathophysiology overview"), "pathophysiology_overview");
    assert.equal(mapLegacySectionLabelToKind("Exam takeaways"), "clinical_pearls");
    assert.equal(mapLegacySectionLabelToKind("Pharmacology and prescribing"), "pharmacology");
  });

  it("maps phase2 lesson into multiple canonical kinds with substantive bodies", () => {
    const lesson = {
      clinicalFraming: "Framing text for primary care.",
      coreConceptsAndDifferential: { a: 1 },
      redFlagsEscalation: ["fever"],
      managementApproach: {
        diagnosis: ["step 1 with **CRP** >10 mg/L"],
        imagingDecision: { xray: true },
        antibioticSelection: { line: "nitrofurantoin 100 mg BID" },
        conservativeManagement: "rest",
      },
      followUpAndMonitoring: { revisit: "2 weeks" },
      populationConsiderations: { older: "caution" },
    };
    const bodies = mapPhase2LessonToCanonicalSections(lesson);
    assert.ok(bodies.introduction?.includes("Framing"));
    assert.ok(bodies.labs_diagnostics?.includes("CRP"));
    assert.ok(bodies.pharmacology?.toLowerCase().includes("nitrofurantoin"));
    assert.ok(bodies.clinical_decision_making?.toLowerCase().includes("differential"));
  });

  it("normalizeLessonTitleForMatch strips noise", () => {
    assert.equal(
      normalizeLessonTitleForMatch("HTN Guideline-Based Plans (NP licensure, Canada)"),
      normalizeLessonTitleForMatch("htn guideline based plans np licensure canada"),
    );
  });
});

describe("package scripts contract", () => {
  it("documents alias map is an object", () => {
    assert.equal(typeof LEGACY_NP_SLUG_ALIASES, "object");
  });
});
