import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  countInternalStudyLinks,
  evaluatePathwayLessonStructuralGate,
  lessonQualifiesForPremiumNormalization,
  lessonQualifiesForPremiumStructuralGate,
  lessonSectionsHaveMeaningfulClinicalContent,
  lessonUsesPremiumStructure,
  PREMIUM_SECTION_HEADINGS,
  SUBSTANTIVE_PREMIUM_SECTION_MIN_PLAIN_CHARS,
  validatePathwayLessonPremium,
} from "./pathway-lesson-premium";
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

  it("lessonUsesPremiumStructure is true only when premium spine commitment sections are substantive", () => {
    assert.equal(lessonUsesPremiumStructure([]), false);
    assert.equal(
      lessonUsesPremiumStructure([{ id: "x", heading: "H", kind: "introduction", body: "a" }]),
      false,
    );
    assert.equal(
      lessonUsesPremiumStructure([
        { id: "i", heading: "I", kind: "introduction", body: "x".repeat(50) },
        { id: "p", heading: "P", kind: "pathophysiology_overview", body: "y".repeat(200) },
      ]),
      false,
    );
    assert.equal(
      lessonUsesPremiumStructure([
        { id: "rf", heading: "RF", kind: "red_flags", body: `${fillerWords(45)}` },
      ]),
      true,
    );
  });

  it("lessonQualifiesForPremiumNormalization is true with three substantive premium sections even without commitment kinds", () => {
    assert.equal(
      lessonQualifiesForPremiumNormalization([
        { id: "i", heading: "I", kind: "introduction", body: `${fillerWords(50)}` },
        { id: "p", heading: "P", kind: "pathophysiology_overview", body: `${fillerWords(50)}` },
        { id: "ss", heading: "SS", kind: "signs_symptoms", body: `${fillerWords(50)}` },
      ]),
      true,
    );
    assert.equal(
      lessonQualifiesForPremiumNormalization([
        { id: "i", heading: "I", kind: "introduction", body: `${fillerWords(50)}` },
        { id: "p", heading: "P", kind: "pathophysiology_overview", body: `${fillerWords(50)}` },
      ]),
      false,
    );
  });

  it("lessonQualifiesForPremiumNormalization: intro + pathophysiology + labs without red_flags", () => {
    assert.equal(
      lessonQualifiesForPremiumNormalization([
        { id: "i", heading: "I", kind: "introduction", body: `${fillerWords(50)}` },
        { id: "p", heading: "P", kind: "pathophysiology_overview", body: `${fillerWords(50)}` },
        { id: "l", heading: "L", kind: "labs_diagnostics", body: `${fillerWords(50)}` },
      ]),
      true,
    );
  });

  it("lessonQualifiesForPremiumNormalization: extended clinical kinds without canonical premium kinds", () => {
    assert.equal(
      lessonQualifiesForPremiumNormalization([
        { id: "a", heading: "A", kind: "clinical_manifestations", body: `${fillerWords(50)}` },
        { id: "b", heading: "B", kind: "treatment_management", body: `${fillerWords(50)}` },
        { id: "c", heading: "C", kind: "nursing_priorities", body: `${fillerWords(50)}` },
      ]),
      true,
    );
  });

  it("lessonQualifiesForPremiumNormalization: substantive legacy five-block alone does not qualify", () => {
    assert.equal(
      lessonQualifiesForPremiumNormalization([
        { id: "1", heading: "H", kind: "clinical_meaning", body: `${fillerWords(50)}` },
        { id: "2", heading: "H", kind: "exam_relevance", body: `${fillerWords(50)}` },
        { id: "3", heading: "H", kind: "core_concept", body: `${fillerWords(50)}` },
      ]),
      false,
    );
  });

  it("meaningful clinical prose bypasses normalization gate without premium spine kinds", () => {
    const a = `${fillerWords(160)} The nursing diagnosis priority is airway first. ${fillerWords(160)}`;
    const b = fillerWords(170);
    const c = fillerWords(170);
    const sections = [
      { id: "1", heading: "Block A", kind: "clinical_meaning" as const, body: a },
      { id: "2", heading: "Block B", kind: "clinical_meaning" as const, body: b },
      { id: "3", heading: "Block C", kind: "clinical_meaning" as const, body: c },
    ];
    assert.equal(lessonSectionsHaveMeaningfulClinicalContent(sections), true);
    assert.equal(lessonQualifiesForPremiumStructuralGate(sections), false);
    assert.equal(lessonQualifiesForPremiumNormalization(sections), true);
  });

  it("lessonQualifiesForPremiumNormalization: three premium headings with bodies under plain-text floor do not qualify", () => {
    const thin = "x".repeat(Math.max(0, SUBSTANTIVE_PREMIUM_SECTION_MIN_PLAIN_CHARS - 1));
    assert.equal(
      lessonQualifiesForPremiumNormalization([
        { id: "i", heading: "I", kind: "introduction", body: thin },
        { id: "p", heading: "P", kind: "pathophysiology_overview", body: thin },
        { id: "l", heading: "L", kind: "labs_diagnostics", body: thin },
      ]),
      false,
    );
  });

  it("validatePathwayLessonPremium passes for filled premium lesson with links and refs", () => {
    const sections = minimalPremiumSections({
      signs_symptoms: {
        body: `**Vignette — 58-year-old patient presents with progressive dyspnea.** ${fillerWords(130)} Nursing assessment includes vitals, work of breathing, and oxygenation. Prioritize airway and circulation while gathering history.\n\n${fillerWords(90)}`,
      },
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

  it("evaluatePathwayLessonStructuralGate marks legacy lesson complete when SEO + spine + scenario pass", () => {
    const scenarioLead =
      "**Vignette — 44-year-old patient presents to the unit with chest pressure.** Nursing assessment includes vitals, pain, and cardiac monitoring. Prioritize airway, breathing, and circulation while notifying the provider per protocol.\n\n";
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
        { id: "clinical_meaning", heading: "H", kind: "clinical_meaning", body: fillerWords(200) },
        { id: "exam_relevance", heading: "H", kind: "exam_relevance", body: fillerWords(100) },
        { id: "core_concept", heading: "H", kind: "core_concept", body: fillerWords(160) },
        { id: "clinical_scenario", heading: "H", kind: "clinical_scenario", body: scenarioLead + fillerWords(160) },
        { id: "takeaways", heading: "H", kind: "takeaways", body: fillerWords(120) },
      ],
    };
    const g = evaluatePathwayLessonStructuralGate(lesson);
    assert.equal(g.structureMode, "legacy");
    assert.equal(g.publicComplete, true);
    assert.ok(g.warnings.length > 0);
  });
});
