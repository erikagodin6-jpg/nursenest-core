import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  countInternalStudyLinks,
  evaluatePathwayLessonStructuralGate,
  lessonUsesPremiumStructure,
  validatePathwayLessonPremium,
} from "./pathway-lesson-premium";
import { PREMIUM_SECTION_HEADINGS } from "./pathway-lesson-premium";
import type { PathwayLessonRecord, PathwayLessonSection } from "./pathway-lesson-types";

function fillerWords(n: number): string {
  return Array.from({ length: n }, (_, i) => `word${i}`).join(" ");
}

function minimalPremiumSections(overrides: Partial<Record<string, Partial<PathwayLessonSection>>> = {}): PathwayLessonSection[] {
  const kinds = [
    "introduction",
    "pathophysiology_overview",
    "signs_symptoms",
    "red_flags",
    "labs_diagnostics",
    "nursing_assessment_interventions",
    "clinical_pearls",
    "client_education",
    "tier_specific_relevance",
    "country_specific_notes",
    "related_next_steps",
  ] as const;
  return kinds.map((kind) => {
    const minByKind: Record<(typeof kinds)[number], number> = {
      introduction: 180,
      pathophysiology_overview: 140,
      signs_symptoms: 120,
      red_flags: 80,
      labs_diagnostics: 100,
      nursing_assessment_interventions: 180,
      clinical_pearls: 100,
      client_education: 100,
      tier_specific_relevance: 120,
      country_specific_notes: 80,
      related_next_steps: 40,
    };
    const base: PathwayLessonSection = {
      id: kind,
      heading: PREMIUM_SECTION_HEADINGS[kind],
      kind,
      body:
        kind === "introduction"
          ? `${fillerWords(90)}\n\n${fillerWords(95)}`
          : `${fillerWords(minByKind[kind])}`,
    };
    const o = overrides[kind];
    return o ? { ...base, ...o } : base;
  });
}

describe("pathway-lesson-premium", () => {
  it("countInternalStudyLinks counts LESSON wiki and root-relative markdown links", () => {
    const s =
      "See [shock](LESSON:shock-basics) and [bank](/question-bank). Also [x](https://example.com) and [y](//evil).";
    assert.equal(countInternalStudyLinks(s), 2);
  });

  it("lessonUsesPremiumStructure is true when any premium kind is present", () => {
    assert.equal(lessonUsesPremiumStructure([]), false);
    assert.equal(
      lessonUsesPremiumStructure([{ id: "x", heading: "H", kind: "introduction", body: "a" }]),
      true,
    );
  });

  it("validatePathwayLessonPremium passes for filled premium lesson with links and refs", () => {
    const sections = minimalPremiumSections({
      related_next_steps: {
        body: `${fillerWords(45)}\n\n- [One](LESSON:a)\n- [Two](LESSON:b)\n- [Three](/tools)`,
      },
    });
    const lesson = {
      slug: "test-lesson",
      title: "Test Lesson Title",
      seoTitle: "Test SEO Title",
      seoDescription: fillerWords(25),
      sections,
      relatedLessonRefs: [
        { slug: "a", titleHint: "A" },
        { slug: "b", titleHint: "B" },
      ],
    };
    const v = validatePathwayLessonPremium(lesson);
    assert.equal(v.premiumReady, true);
    assert.ok(v.internalLinkCount >= 3);
  });

  it("evaluatePathwayLessonStructuralGate marks legacy catalog-style lesson complete when SEO valid", () => {
    const lesson: PathwayLessonRecord = {
      slug: "x",
      title: "T",
      topic: "",
      topicSlug: "",
      bodySystem: "",
      previewSectionCount: 1,
      seoTitle: "SEO",
      seoDescription: fillerWords(22),
      sections: [
        { id: "clinical_meaning", heading: "H", kind: "clinical_meaning", body: fillerWords(50) },
        { id: "exam_relevance", heading: "H", kind: "exam_relevance", body: fillerWords(50) },
        { id: "core_concept", heading: "H", kind: "core_concept", body: fillerWords(50) },
        { id: "clinical_scenario", heading: "H", kind: "clinical_scenario", body: fillerWords(50) },
        { id: "takeaways", heading: "H", kind: "takeaways", body: fillerWords(50) },
      ],
    };
    const g = evaluatePathwayLessonStructuralGate(lesson);
    assert.equal(g.structureMode, "legacy");
    assert.equal(g.publicComplete, true);
    assert.ok(g.warnings.length > 0);
  });
});
