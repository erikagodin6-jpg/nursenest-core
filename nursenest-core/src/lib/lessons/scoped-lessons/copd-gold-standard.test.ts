import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COPD_GOLD_STANDARD_SLUG,
  copdGoldVariantForPathway,
  getCopdGoldStandardLessonInput,
} from "@/lib/lessons/scoped-lessons/copd-gold-standard";

const FIVE_PATHWAYS = [
  "us-lpn-nclex-pn",
  "ca-rpn-rex-pn",
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "us-np-fnp",
] as const;

describe("copd gold standard scoped lessons", () => {
  it("defines one slug and five pathway variants", () => {
    assert.equal(COPD_GOLD_STANDARD_SLUG, "copd-clinical-judgment-gold");
    for (const pid of FIVE_PATHWAYS) {
      assert.ok(copdGoldVariantForPathway(pid));
    }
  });

  it("each variant has five canonical sections and valid quizzes", () => {
    const kinds = new Set([
      "clinical_meaning",
      "exam_relevance",
      "core_concept",
      "clinical_scenario",
      "takeaways",
    ]);
    for (const pid of FIVE_PATHWAYS) {
      const lesson = getCopdGoldStandardLessonInput(pid);
      assert.ok(lesson);
      assert.equal(lesson!.slug, COPD_GOLD_STANDARD_SLUG);
      assert.equal(lesson!.topicSlug, "copd");
      assert.equal(lesson!.sections.length, 5);
      for (const s of lesson!.sections) {
        assert.ok(kinds.has(s.kind));
        assert.ok(s.body.length > 80);
      }
      assert.ok((lesson!.preTest?.length ?? 0) >= 3);
      assert.ok((lesson!.postTest?.length ?? 0) >= 3);
      for (const q of [...(lesson!.preTest ?? []), ...(lesson!.postTest ?? [])]) {
        assert.ok(q.question.length > 10);
        assert.ok(q.options.length >= 2);
        assert.ok(q.correct >= 0 && q.correct < q.options.length);
      }
    }
  });

  it("titles differ by scope so hubs do not read as generic", () => {
    const usPn = getCopdGoldStandardLessonInput("us-lpn-nclex-pn")!.title;
    const caRpn = getCopdGoldStandardLessonInput("ca-rpn-rex-pn")!.title;
    const usRn = getCopdGoldStandardLessonInput("us-rn-nclex-rn")!.title;
    const caRn = getCopdGoldStandardLessonInput("ca-rn-nclex-rn")!.title;
    const fnp = getCopdGoldStandardLessonInput("us-np-fnp")!.title;
    const set = new Set([usPn, caRpn, usRn, caRn, fnp]);
    assert.equal(set.size, 5);
    assert.match(usPn, /NCLEX-PN/i);
    assert.match(caRpn, /REx-PN|Canada/i);
    assert.match(usRn, /NCLEX-RN/i);
    assert.match(caRn, /NCLEX-RN/i);
    assert.match(caRn, /Canada/i);
    assert.match(fnp, /FNP|primary care/i);
  });
});
