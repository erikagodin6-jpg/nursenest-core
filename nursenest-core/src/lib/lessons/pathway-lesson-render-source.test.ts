import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeLesson, getCatalogLessonRawBySlug } from "@/lib/lessons/pathway-lesson-catalog-sync";

/** Legacy synthesizer default when intro body is empty — must not replace real premium spine rows. */
const LEGACY_SYNTH_INTRO_DEFAULT =
  "Read the stem as a safety and prioritization problem first, then match your action to the risk you can justify.";

function filler(n: number): string {
  return Array.from({ length: n }, (_, i) => `word${i}`).join(" ");
}

describe("pathway lesson live render source (PathwayLesson.sections)", () => {
  it("premium-shaped lessons without commitment kinds keep premium section kinds (no legacy-only collapse)", () => {
    const raw = {
      slug: "fixture-premium-spine-no-commitment",
      title: "Fixture lesson",
      topic: "Cardiac",
      topicSlug: "cardiac",
      bodySystem: "cardiovascular",
      previewSectionCount: 1,
      seoTitle: "Fixture SEO title for pathway lesson render source test",
      seoDescription:
        "Fixture seo description with enough words to satisfy catalog description floors for normalization.",
      sections: [
        { id: "1", heading: "Intro", kind: "introduction", body: `${filler(90)}\n\n${filler(95)}` },
        { id: "2", heading: "Patho", kind: "pathophysiology_overview", body: filler(200) },
        { id: "3", heading: "Labs", kind: "labs_diagnostics", body: filler(200) },
      ],
    };
    const n = normalizeLesson(raw as Parameters<typeof normalizeLesson>[0], "us-rn-nclex-rn");
    const kinds = n.sections.map((s) => s.kind);
    assert.ok(
      kinds.includes("pathophysiology_overview"),
      `expected pathophysiology_overview in ${kinds.join(",")}`,
    );
    assert.ok(!kinds.every((k) => k === "clinical_meaning" || k === "exam_relevance"), "unexpected all-legacy-kind spine");
    const corpus = n.sections.map((s) => s.body).join("\n");
    assert.ok(
      !corpus.includes(LEGACY_SYNTH_INTRO_DEFAULT),
      "legacy synthesizer placeholder must not replace substantive premium sections",
    );
  });

  it("multi-section premium AFib-shaped corpus stays clinical (no legacy placeholder shell)", () => {
    const clinical = `${filler(60)}\n\nAtrial fibrillation (AFib) with rapid ventricular response requires rate control and anticoagulation decisions tied to CHA2DS2-VASc.\n\n${filler(60)}`;
    const raw = {
      slug: "fixture-afib-shaped-ca-rn",
      title: "Atrial fibrillation (rate control)",
      topic: "Dysrhythmias",
      topicSlug: "dysrhythmias",
      bodySystem: "cardiovascular",
      previewSectionCount: 1,
      seoTitle: "Atrial fibrillation nursing NCLEX-RN fixture for render source test",
      seoDescription:
        "Fixture AFib lesson seo description with enough words to satisfy catalog description floors for normalization.",
      sections: [
        { id: "i", heading: "Introduction", kind: "introduction", body: clinical },
        { id: "p", heading: "Pathophysiology", kind: "pathophysiology_overview", body: filler(200) },
        { id: "l", heading: "Labs", kind: "labs_diagnostics", body: filler(120) },
        { id: "n", heading: "Nursing", kind: "nursing_assessment_interventions", body: filler(200) },
      ],
    };
    const n = normalizeLesson(raw as Parameters<typeof normalizeLesson>[0], "ca-rn-nclex-rn");
    const corpus = n.sections.map((s) => `${s.heading}\n${s.body}`).join("\n").toLowerCase();
    assert.ok(corpus.includes("fibrillation") || corpus.includes("afib"), "expected AFib clinical vocabulary");
    const placeholderHits = n.sections.filter((s) => s.body.includes(LEGACY_SYNTH_INTRO_DEFAULT)).length;
    assert.ok(placeholderHits === 0, `unexpected legacy placeholder bodies (count=${placeholderHits})`);
  });

  it("catalog ca-rn-nclex-rn fluid-balance-acute-care: premium spine keeps introduction first (not legacy shell)", () => {
    const raw = getCatalogLessonRawBySlug("ca-rn-nclex-rn", "fluid-balance-acute-care");
    if (!raw) {
      assert.ok(false, "expected bundled catalog row for ca-rn-nclex-rn fluid-balance-acute-care");
      return;
    }
    const n = normalizeLesson(raw, "ca-rn-nclex-rn");
    assert.equal(
      n.sections[0]?.kind,
      "introduction",
      `expected premium ordering; first kind was ${n.sections[0]?.kind}`,
    );
  });

  it("catalog us-rn-nclex-rn atrial-fibrillation-rate-control: no legacy synthesizer placeholder in bodies", () => {
    const raw = getCatalogLessonRawBySlug("us-rn-nclex-rn", "atrial-fibrillation-rate-control");
    if (!raw) {
      assert.ok(false, "expected bundled catalog row for us-rn-nclex-rn atrial-fibrillation-rate-control");
      return;
    }
    const n = normalizeLesson(raw, "us-rn-nclex-rn");
    const corpus = n.sections.map((s) => s.body).join("\n");
    assert.ok(
      !corpus.includes(LEGACY_SYNTH_INTRO_DEFAULT),
      "RN AFib catalog lesson must not inject legacy synthesizer intro default",
    );
  });
});
