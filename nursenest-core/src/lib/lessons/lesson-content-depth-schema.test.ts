import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  analyzeLessonContentDepth,
  buildLessonContentDepthFixSections,
  evaluateLessonDepthSequentialGate,
  lessonDepthCohortFromPathwayId,
  rollupDepthByCohort,
} from "@/lib/lessons/lesson-content-depth-schema";
import type { PathwayLessonRecord, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

function sec(kind: string, body: string, extra?: Partial<PathwayLessonSection>): PathwayLessonSection {
  return {
    id: kind,
    heading: kind,
    kind: kind as PathwayLessonSection["kind"],
    body,
    ...extra,
  };
}

describe("lessonDepthCohortFromPathwayId", () => {
  it("classifies RN, PN, NP, Allied, New Grad", () => {
    assert.equal(lessonDepthCohortFromPathwayId("us-rn-nclex-rn"), "RN");
    assert.equal(lessonDepthCohortFromPathwayId("ca-rn-nclex-rn"), "RN");
    assert.equal(lessonDepthCohortFromPathwayId("ca-rpn-rex-pn"), "RPN_PN");
    assert.equal(lessonDepthCohortFromPathwayId("us-np-fnp"), "NP");
    assert.equal(lessonDepthCohortFromPathwayId("ca-allied-core"), "ALLIED");
    assert.equal(lessonDepthCohortFromPathwayId("us-rn-new-grad-transition"), "NEW_GRAD");
  });
});

describe("analyzeLessonContentDepth", () => {
  it("flags missing canonical kinds and legacy-only kinds without deleting legacy from input", () => {
    const lesson: Pick<PathwayLessonRecord, "slug" | "title" | "sections"> = {
      slug: "demo",
      title: "Demo",
      sections: [
        sec("clinical_meaning", "x".repeat(400)),
        sec("core_concept", "pathophysiology mechanism cellular inflammation hypoxia " + "word ".repeat(120)),
      ],
    };
    const a = analyzeLessonContentDepth("us-rn-nclex-rn", lesson);
    assert.ok(a.missingKindsStrict.length > 0);
    assert.ok(a.legacyOnlyKindsPresent.includes("clinical_meaning"));
    assert.equal(a.passesAllSchema, false);
  });

  it("accepts linked_flashcard_prompts section with enough words", () => {
    const filler = "word ".repeat(200);
    const sections: PathwayLessonSection[] = [
      sec("introduction", filler),
      sec("pathophysiology_overview", "mechanism cellular receptor cascade " + filler),
      sec("risk_factors", filler),
      sec("signs_symptoms", "early late red flag worsening " + filler),
      sec("labs_diagnostics", "troponin mmol critical threshold " + filler),
      sec("nursing_assessment_interventions", filler),
      sec("treatments", "medication nursing care intervention protocol " + filler),
      sec("pharmacology", filler),
      sec("clinical_decision_making", filler),
      sec("complications", filler),
      sec(
        "clinical_pearls",
        "Avoid mistaking orthostasis for sepsis when fever is absent; recheck perfusion and lactate trends. " +
          filler,
      ),
      sec("client_education", "teach-back when to seek emergency care call 911 return if " + filler),
      sec("case_study", filler),
      sec("linked_flashcard_prompts", "Flashcard: list three monitoring parameters. " + filler),
    ];
    const a = analyzeLessonContentDepth("us-rn-nclex-rn", { slug: "x", title: "T", sections });
    assert.equal(a.missingFlashcardSurface, false);
    assert.ok(a.missingKindsStrict.length === 0 && a.weakKinds.length === 0);
  });
});

describe("buildLessonContentDepthFixSections", () => {
  it("merges legacy bodies into weak canonical targets without dropping existing strong text", () => {
    const lesson = {
      slug: "z",
      title: "Z",
      sections: [
        sec("introduction", "Strong introduction " + "word ".repeat(150)),
        sec("clinical_meaning", "Legacy clinical framing that should append to intro only if intro were weak."),
      ],
    } as PathwayLessonRecord;
    const fixed = buildLessonContentDepthFixSections(lesson);
    const intro = fixed.find((s) => s.kind === "introduction");
    assert.ok(intro && intro.body.includes("Strong introduction"));
    assert.equal(intro?.body.includes("Legacy clinical"), false);
  });
});

describe("rollupDepthByCohort + sequential gate", () => {
  it("computes completion and gate stops at first failing ordered cohort", () => {
    const analyses = [
      analyzeLessonContentDepth("us-rn-nclex-rn", {
        slug: "a",
        title: "A",
        sections: [sec("clinical_meaning", "short")],
      }),
    ];
    const roll = rollupDepthByCohort(analyses);
    const rn = roll.find((r) => r.cohort === "RN");
    assert.ok(rn && rn.totalLessons === 1);
    const violations = evaluateLessonDepthSequentialGate(roll);
    assert.ok(violations.length > 0);
  });
});
