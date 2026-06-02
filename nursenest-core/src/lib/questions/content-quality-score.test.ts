import assert from "node:assert/strict";
import test from "node:test";
import {
  collectGenericContentPatternIds,
  normalizeContentForDuplicateDetection,
  scoreQuestionContentQuality,
} from "@/lib/questions/content-quality-score";

test("content quality scoring flags generic rationale boilerplate", () => {
  const result = scoreQuestionContentQuality({
    id: "generic-item",
    stem: "A postpartum client has a boggy uterus and heavy lochia. Which action should the nurse take first?",
    rationale: "This answer responds to the priority cue. The clinical reasoning is to choose the action that supports safe care.",
    distractorRationales: ["Not the best answer.", "Less appropriate.", "Not priority."],
    clinicalPearl: "Assess first.",
    examTip: "Use the nursing process.",
    memoryHook: "Choose safety.",
  });

  assert.equal(result.status, "low_quality");
  assert.ok(result.score < 50);
  assert.ok(result.issues.some((issue) => issue.message.includes("responds_priority_cue")));
  assert.ok(result.issues.some((issue) => issue.dimension === "distractorQuality"));
});

test("content quality scoring rewards question-specific educator rationale", () => {
  const result = scoreQuestionContentQuality({
    id: "ob-hormone-item",
    pathway: "NCLEX-RN",
    stem: "Which reproductive hormone stimulates uterine contractions during labor?",
    rationale:
      "Oxytocin stimulates uterine smooth muscle contractions by activating oxytocin receptors in the myometrium. This directly matches the labor cue in the stem. Progesterone is tempting because it is a reproductive hormone, but it maintains uterine relaxation during pregnancy rather than initiating contractions.",
    distractorRationales: [
      "Progesterone is tempting because it is central to pregnancy, but it suppresses uterine contractility and helps maintain pregnancy rather than starting labor.",
      "Estrogen prepares reproductive tissues and increases oxytocin receptor expression near term, but it is not the direct contraction-triggering hormone.",
      "Prolactin is associated with milk production after delivery, not uterine smooth muscle contraction during labor.",
    ],
    clinicalPearl:
      "Oxytocin receptors increase near term, making the uterus more responsive to circulating oxytocin as labor begins.",
    examTip:
      "NCLEX: when two reproductive hormones appear together, compare the physiologic effect in the stem rather than memorizing hormone categories.",
    memoryHook: "Oxytocin turns on contractions.",
  });

  assert.equal(result.status, "high_quality");
  assert.ok(result.score >= 72);
  assert.equal(result.issues.some((issue) => issue.severity === "critical"), false);
});

test("generic pattern and duplicate normalization are stable", () => {
  assert.deepEqual(collectGenericContentPatternIds("The clinical reasoning is to choose the action."), [
    "clinical_reasoning_is",
    "choose_the_action",
  ]);
  assert.equal(
    normalizeContentForDuplicateDetection("Oxytocin = 'OxyTOCIN Turns On Contractions.'"),
    "oxytocin oxytocin turns on contractions",
  );
});
