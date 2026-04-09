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
import { OB_EMERGENCIES_GOLD_SLUG, getObEmergenciesGoldLessonInput } from "./ob-emergencies-gold-standard";
import {
  PEDIATRIC_TRIAGE_EMERGENCIES_GOLD_SLUG,
  getPediatricTriageEmergenciesGoldLessonInput,
} from "./pediatric-triage-emergencies-gold-standard";
import {
  RENAL_DIALYSIS_ACUTE_COMPLICATIONS_GOLD_SLUG,
  getRenalDialysisAcuteComplicationsGoldLessonInput,
} from "./renal-dialysis-acute-complications-gold-standard";
import { SEPSIS_GOLD_SLUG, getSepsisGoldLessonInput } from "./sepsis-early-recognition-gold-standard";
import {
  isPremiumSectionKind,
  PREMIUM_SECTION_KINDS,
  validatePathwayLessonPremium,
} from "@/lib/lessons/pathway-lesson-premium";
import { prependScopedGoldCatalogLessons, SCOPED_GOLD_PROVIDERS } from "./scoped-gold-registry";
import { SHOCK_GOLD_SLUG, getShockGoldLessonInput } from "./shock-gold-standard";
import { STROKE_ICP_GOLD_SLUG, getStrokeIcpGoldLessonInput } from "./stroke-increased-icp-gold-standard";
import { CASE_STUDY_CASEBOOK_PROVIDERS, CASE_STUDY_CASEBOOK_SLUGS } from "./case-study-casebook-specs";
import { BULK_ROWS } from "./launch-wave-1-bulk-rows";
import { LAUNCH_WAVE_1A_SPECS } from "./launch-wave-1a-high-yield-gold";

const CORE_NURSING_PATHWAYS = [
  "us-lpn-nclex-pn",
  "ca-rpn-rex-pn",
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-pmhnp",
] as const;

const LEGACY_KINDS = new Set([
  "clinical_meaning",
  "exam_relevance",
  "core_concept",
  "clinical_scenario",
  "takeaways",
]);

const PREMIUM_KIND_SET = new Set(PREMIUM_SECTION_KINDS);

describe("scoped gold registry", () => {
  it("registry lists injectable slugs in remediation order (waves 1–4 + COPD + launch wave 1)", () => {
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
        OB_EMERGENCIES_GOLD_SLUG,
        PEDIATRIC_TRIAGE_EMERGENCIES_GOLD_SLUG,
        RENAL_DIALYSIS_ACUTE_COMPLICATIONS_GOLD_SLUG,
        "copd-clinical-judgment-gold",
        ...LAUNCH_WAVE_1A_SPECS.map((s) => s.slug),
        ...BULK_ROWS.map((r) => r.slug),
        ...CASE_STUDY_CASEBOOK_SLUGS,
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
  const isPremium = lesson.sections.some((s) => isPremiumSectionKind(s.kind));
  if (isPremium) {
    assert.ok(lesson.sections.length >= 10, "premium lessons should include ≥10 rendered sections (omitted labs/country excluded)");
    for (const s of lesson.sections) {
      assert.ok(isPremiumSectionKind(s.kind), `unexpected kind ${s.kind}`);
      const minBody = s.kind === "related_next_steps" ? 40 : 60;
      assert.ok(s.body.length >= minBody, `section ${s.kind} below minimum body length`);
    }
    const v = validatePathwayLessonPremium({
      slug: lesson.slug,
      title: lesson.title,
      seoTitle: lesson.seoTitle,
      seoDescription: lesson.seoDescription,
      sections: lesson.sections,
      premiumOmittedSections: lesson.premiumOmittedSections,
      relatedLessonRefs: lesson.relatedLessonRefs,
    });
    assert.equal(v.premiumReady, true, v.issues.join(" | "));
  } else {
    assert.equal(lesson.sections.length, 5);
    for (const s of lesson.sections) {
      assert.ok(LEGACY_KINDS.has(s.kind));
      assert.ok(s.body.length > 80);
    }
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

describe("OB emergencies gold standard", () => {
  it("topic and slug stable", () => {
    const lesson = getObEmergenciesGoldLessonInput("us-rn-nclex-rn");
    assert.ok(lesson);
    assert.equal(lesson!.slug, OB_EMERGENCIES_GOLD_SLUG);
    assert.equal(lesson!.topicSlug, "maternity");
  });

  it("all pathways have full lesson", () => {
    for (const pid of CORE_NURSING_PATHWAYS) {
      assertLessonQuality(getObEmergenciesGoldLessonInput(pid)!);
    }
  });
});

describe("pediatric triage emergencies gold standard", () => {
  it("topic and slug stable", () => {
    const lesson = getPediatricTriageEmergenciesGoldLessonInput("ca-rn-nclex-rn");
    assert.ok(lesson);
    assert.equal(lesson!.slug, PEDIATRIC_TRIAGE_EMERGENCIES_GOLD_SLUG);
    assert.equal(lesson!.topicSlug, "pediatrics");
  });

  it("all pathways have full lesson", () => {
    for (const pid of CORE_NURSING_PATHWAYS) {
      assertLessonQuality(getPediatricTriageEmergenciesGoldLessonInput(pid)!);
    }
  });
});

describe("renal dialysis acute complications gold standard", () => {
  it("topic and slug stable", () => {
    const lesson = getRenalDialysisAcuteComplicationsGoldLessonInput("us-lpn-nclex-pn");
    assert.ok(lesson);
    assert.equal(lesson!.slug, RENAL_DIALYSIS_ACUTE_COMPLICATIONS_GOLD_SLUG);
    assert.equal(lesson!.topicSlug, "renal-gu");
  });

  it("all pathways have full lesson", () => {
    for (const pid of CORE_NURSING_PATHWAYS) {
      assertLessonQuality(getRenalDialysisAcuteComplicationsGoldLessonInput(pid)!);
    }
  });
});

describe("clinical casebook case-study lessons", () => {
  it("provider slugs match exported slug list", () => {
    assert.deepEqual(
      CASE_STUDY_CASEBOOK_PROVIDERS.map((p) => p.slug),
      CASE_STUDY_CASEBOOK_SLUGS,
    );
  });

  it("all pathways have valid premium casebook lessons", () => {
    for (const provider of CASE_STUDY_CASEBOOK_PROVIDERS) {
      for (const pid of CORE_NURSING_PATHWAYS) {
        const lesson = provider.getFullLesson(pid);
        assert.ok(lesson, `${provider.slug} missing for ${pid}`);
        assertLessonQuality(lesson!);
      }
    }
  });
});
