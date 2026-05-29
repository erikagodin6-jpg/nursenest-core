import assert from "node:assert/strict";
import test from "node:test";
import {
  buildContentQualityIntelligenceReport,
  scoreContentIntelligenceItem,
  type UniversalContentObject,
} from "@/lib/content-quality/content-quality-intelligence-engine";

const strongItem: UniversalContentObject = {
  id: "q-oxytocin",
  contentType: "question",
  pathway: "RN",
  tier: "RN",
  topic: "Maternal Child",
  title: "Which hormone stimulates uterine contractions during labor?",
  stem: "Which hormone stimulates uterine contractions during labor?",
  rationale:
    "Oxytocin binds to oxytocin receptors in uterine smooth muscle, increases intracellular calcium, and strengthens rhythmic myometrial contractions during labor.",
  distractorRationales: [
    "Progesterone maintains pregnancy by reducing uterine contractility, so it has the opposite physiologic effect.",
    "Estrogen supports uterine growth and receptor expression but is not the hormone that directly triggers contractions.",
    "Prolactin supports lactation after birth and does not initiate uterine contractions.",
  ],
  clinicalPearl: "Oxytocin receptor density increases near term, making the uterus more responsive during labor.",
  examTip: "For NCLEX maternal-child questions, separate hormones that maintain pregnancy from hormones that initiate labor.",
  memoryHook: "OxyTOCIN turns on contractions.",
  siConvExplanation: "The key cue is active labor; the physiologic process is rhythmic uterine smooth muscle contraction.",
  references: ["Professional association maternal-newborn nursing textbook"],
  updatedAt: "2026-02-01T00:00:00.000Z",
};

test("CQIE rewards specific educator-quality content", () => {
  const score = scoreContentIntelligenceItem(strongItem, new Date("2026-05-29T00:00:00.000Z"));

  assert.equal(score.qualityBand === "Good" || score.qualityBand === "Excellent", true);
  assert.equal(score.flags.includes("scope_leakage"), false);
  assert.equal(score.curriculumTargets.includes("NCLEX"), true);
});

test("CQIE flags generic rationale wording and specialty leakage", () => {
  const weak = scoreContentIntelligenceItem(
    {
      id: "rn-vent",
      contentType: "question",
      pathway: "RN",
      tier: "RN",
      topic: "Respiratory",
      title: "Ventilator question",
      stem: "The RN adjusts ventilator mode.",
      rationale: "The clinical reasoning is to choose the action that prevents harm and responds to the priority cue.",
      body: "The RN performs PEEP titration for auto-PEEP on a ventilator.",
      updatedAt: "2022-01-01T00:00:00.000Z",
    },
    new Date("2026-05-29T00:00:00.000Z"),
  );

  assert.equal(weak.qualityBand, "Critical");
  assert.equal(weak.flags.includes("scope_leakage"), true);
  assert.equal(weak.scopeFindings.some((finding) => finding.issueType === "rn_icu_ventilator_management"), true);
});

test("CQIE builds review queues, pathway summaries, and curriculum heatmap inputs", () => {
  const report = buildContentQualityIntelligenceReport(
    [
      strongItem,
      {
        id: "rpn-dx",
        contentType: "flashcard",
        pathway: "RPN",
        tier: "RPN",
        topic: "Diagnostics",
        title: "RPN diagnostic management",
        body: "The RPN should make a differential diagnosis and prescribe antibiotic therapy.",
        rationale: "Use the nursing process.",
        updatedAt: "2020-01-01T00:00:00.000Z",
      },
    ],
    "2026-05-29T00:00:00.000Z",
  );

  assert.equal(report.totalItems, 2);
  assert.equal(report.byPathway.RN.count, 1);
  assert.equal(report.reviewQueues.Critical.some((item) => item.itemId === "rpn-dx"), true);
  assert.ok(report.curriculumCoverage.NCLEX.contentCount >= 1);
});

