import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ACS_GOLD_SLUG, getAcsGoldLessonInput } from "./acute-coronary-syndrome-gold-standard";
import {
  CANADIAN_RPN_HIGH_YIELD_GOLD_SLUG,
  getCanadianRpnHighYieldGoldLessonInput,
} from "./canadian-rpn-high-yield-gold-standard";
import { CLINICAL_JUDGMENT_GOLD_SLUG, getClinicalJudgmentGoldLessonInput } from "./clinical-judgment-prioritization-gold-standard";
import { FLUIDS_ELECTROLYTES_GOLD_SLUG, getFluidsElectrolytesGoldLessonInput } from "./fluids-electrolytes-emergencies-gold-standard";
import { HIGH_ALERT_MEDS_GOLD_SLUG, getHighAlertMedsGoldLessonInput } from "./high-alert-medications-gold-standard";
import { SEPSIS_GOLD_SLUG, getSepsisGoldLessonInput } from "./sepsis-early-recognition-gold-standard";
import { prependScopedGoldCatalogLessons, SCOPED_GOLD_PROVIDERS } from "./scoped-gold-registry";
import { SHOCK_GOLD_SLUG, getShockGoldLessonInput } from "./shock-gold-standard";
import { STROKE_ICP_GOLD_SLUG, getStrokeIcpGoldLessonInput } from "./stroke-increased-icp-gold-standard";

const CORE_NURSING_PATHWAYS = [
  "us-lpn-nclex-pn",
  "ca-rpn-rex-pn",
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-pmhnp",
] as const;

const KINDS = new Set([
  "clinical_meaning",
  "exam_relevance",
  "core_concept",
  "clinical_scenario",
  "takeaways",
]);

describe("scoped gold registry", () => {
  it("registry lists injectable slugs in remediation order (waves 1–3 + COPD)", () => {
    assert.deepEqual(
      SCOPED_GOLD_PROVIDERS.map((p) => p.slug),
      [
        CLINICAL_JUDGMENT_GOLD_SLUG,
        SEPSIS_GOLD_SLUG,
        FLUIDS_ELECTROLYTES_GOLD_SLUG,
        ACS_GOLD_SLUG,
        HIGH_ALERT_MEDS_GOLD_SLUG,
        STROKE_ICP_GOLD_SLUG,
        SHOCK_GOLD_SLUG,
        CANADIAN_RPN_HIGH_YIELD_GOLD_SLUG,
        "copd-clinical-judgment-gold",
      ],
    );
  });

  it("prepend does not duplicate slugs already in catalog slice", () => {
    const fake = [{ slug: CLINICAL_JUDGMENT_GOLD_SLUG, title: "x" }] as Parameters<typeof prependScopedGoldCatalogLessons>[1];
    const out = prependScopedGoldCatalogLessons("us-rn-nclex-rn", fake);
    assert.equal(out.filter((l) => l.slug === CLINICAL_JUDGMENT_GOLD_SLUG).length, 1);
  });
});

function assertLessonQuality(lesson: NonNullable<ReturnType<typeof getClinicalJudgmentGoldLessonInput>>) {
  assert.equal(lesson.sections.length, 5);
  for (const s of lesson.sections) {
    assert.ok(KINDS.has(s.kind));
    assert.ok(s.body.length > 80);
  }
  assert.ok((lesson.preTest?.length ?? 0) >= 3);
  assert.ok((lesson.postTest?.length ?? 0) >= 3);
  for (const q of [...(lesson.preTest ?? []), ...(lesson.postTest ?? [])]) {
    assert.ok(q.question.length > 10);
    assert.ok(q.options.length >= 2);
    assert.ok(q.correct >= 0 && q.correct < q.options.length);
    assert.ok((q.rationale?.length ?? 0) > 20);
  }
}

describe("clinical judgment gold standard", () => {
  it("all core nursing pathways have distinct scoped titles", () => {
    const titles = CORE_NURSING_PATHWAYS.map((pid) => getClinicalJudgmentGoldLessonInput(pid)!.title);
    assert.equal(new Set(titles).size, titles.length);
  });

  it("sections and quizzes are valid", () => {
    for (const pid of CORE_NURSING_PATHWAYS) {
      const lesson = getClinicalJudgmentGoldLessonInput(pid);
      assert.ok(lesson);
      assert.equal(lesson!.slug, CLINICAL_JUDGMENT_GOLD_SLUG);
      assert.equal(lesson!.topicSlug, "prioritization-delegation");
      assertLessonQuality(lesson!);
    }
  });
});

describe("sepsis gold standard", () => {
  it("topic and slug stable", () => {
    const lesson = getSepsisGoldLessonInput("us-rn-nclex-rn");
    assert.ok(lesson);
    assert.equal(lesson!.slug, SEPSIS_GOLD_SLUG);
    assert.equal(lesson!.topicSlug, "sepsis");
  });

  it("all pathways have full lesson", () => {
    for (const pid of CORE_NURSING_PATHWAYS) {
      assertLessonQuality(getSepsisGoldLessonInput(pid)!);
    }
  });
});

describe("fluids & electrolytes emergencies gold standard", () => {
  it("topic and slug stable", () => {
    const lesson = getFluidsElectrolytesGoldLessonInput("us-rn-nclex-rn");
    assert.ok(lesson);
    assert.equal(lesson!.slug, FLUIDS_ELECTROLYTES_GOLD_SLUG);
    assert.equal(lesson!.topicSlug, "fluids-electrolytes");
  });

  it("all pathways have full lesson", () => {
    for (const pid of CORE_NURSING_PATHWAYS) {
      assertLessonQuality(getFluidsElectrolytesGoldLessonInput(pid)!);
    }
  });
});

describe("acute coronary syndrome gold standard", () => {
  it("topic and slug stable", () => {
    const lesson = getAcsGoldLessonInput("ca-rn-nclex-rn");
    assert.ok(lesson);
    assert.equal(lesson!.slug, ACS_GOLD_SLUG);
    assert.equal(lesson!.topicSlug, "cardiovascular");
  });

  it("all pathways have full lesson", () => {
    for (const pid of CORE_NURSING_PATHWAYS) {
      assertLessonQuality(getAcsGoldLessonInput(pid)!);
    }
  });
});

describe("high-alert medications gold standard", () => {
  it("topic and slug stable", () => {
    const lesson = getHighAlertMedsGoldLessonInput("ca-rpn-rex-pn");
    assert.ok(lesson);
    assert.equal(lesson!.slug, HIGH_ALERT_MEDS_GOLD_SLUG);
    assert.equal(lesson!.topicSlug, "medication-safety");
  });

  it("all pathways have full lesson", () => {
    for (const pid of CORE_NURSING_PATHWAYS) {
      assertLessonQuality(getHighAlertMedsGoldLessonInput(pid)!);
    }
  });
});

describe("stroke & increased ICP gold standard", () => {
  it("topic and slug stable", () => {
    const lesson = getStrokeIcpGoldLessonInput("us-rn-nclex-rn");
    assert.ok(lesson);
    assert.equal(lesson!.slug, STROKE_ICP_GOLD_SLUG);
    assert.equal(lesson!.topicSlug, "neurological");
  });

  it("all pathways have full lesson", () => {
    for (const pid of CORE_NURSING_PATHWAYS) {
      assertLessonQuality(getStrokeIcpGoldLessonInput(pid)!);
    }
  });
});

describe("shock gold standard", () => {
  it("topic and slug stable", () => {
    const lesson = getShockGoldLessonInput("ca-rn-nclex-rn");
    assert.ok(lesson);
    assert.equal(lesson!.slug, SHOCK_GOLD_SLUG);
    assert.equal(lesson!.topicSlug, "shock");
  });

  it("all pathways have full lesson", () => {
    for (const pid of CORE_NURSING_PATHWAYS) {
      assertLessonQuality(getShockGoldLessonInput(pid)!);
    }
  });
});

describe("Canadian RPN scope & collaboration gold standard", () => {
  it("topic and slug stable", () => {
    const lesson = getCanadianRpnHighYieldGoldLessonInput("ca-rpn-rex-pn");
    assert.ok(lesson);
    assert.equal(lesson!.slug, CANADIAN_RPN_HIGH_YIELD_GOLD_SLUG);
    assert.equal(lesson!.topicSlug, "delegation");
  });

  it("all pathways have full lesson", () => {
    for (const pid of CORE_NURSING_PATHWAYS) {
      assertLessonQuality(getCanadianRpnHighYieldGoldLessonInput(pid)!);
    }
  });
});
