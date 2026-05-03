import assert from "node:assert/strict";
import test from "node:test";
import {
  ECG_VIDEO_QUESTION_FORMAT,
  ecgQuestionTeachingVisible,
  parseEcgVideoExhibit,
  validateEcgVideoQuestionForPublish,
} from "@/lib/ecg-video-quiz/ecg-video-question";

function validQuestion(overrides: Record<string, unknown> = {}) {
  return {
    stem: "Watch the telemetry strip and identify the rhythm.",
    questionType: "MCQ",
    questionFormat: ECG_VIDEO_QUESTION_FORMAT,
    options: ["Atrial fibrillation", "Normal sinus rhythm", "SVT", "Ventricular tachycardia"],
    correctAnswer: ["Atrial fibrillation"],
    rationale:
      "The rhythm is irregularly irregular with no consistent P waves, which supports atrial fibrillation. Assess hemodynamic stability and follow local protocols.",
    exhibitData: {
      kind: ECG_VIDEO_QUESTION_FORMAT,
      asset: {
        url: "https://cdn.example.test/ecg/afib.webm",
        mimeType: "video/webm",
        alt: "Telemetry clip showing an irregularly irregular rhythm without consistent P waves.",
      },
      rhythmCategory: "Atrial fibrillation",
      recognitionClues: ["Irregularly irregular R-R intervals", "No consistent P waves"],
      linkedLesson: { href: "/lessons/ecg-atrial-fibrillation", title: "Atrial fibrillation ECG review" },
    },
    tags: ["ecg-video"],
    ...overrides,
  };
}

test("valid ECG video question passes publish validation", () => {
  const result = validateEcgVideoQuestionForPublish(validQuestion());
  assert.equal(result.ok, true);
  assert.deepEqual(result.reasons, []);
});

test("missing video asset blocks publish", () => {
  const result = validateEcgVideoQuestionForPublish(validQuestion({ exhibitData: { kind: ECG_VIDEO_QUESTION_FORMAT } }));
  assert.equal(result.ok, false);
  assert.match(result.reasons.join("\n"), /video asset/i);
});

test("missing rationale blocks publish", () => {
  const result = validateEcgVideoQuestionForPublish(validQuestion({ rationale: "" }));
  assert.equal(result.ok, false);
  assert.match(result.reasons.join("\n"), /rationale/i);
});

test("malformed answer options are rejected", () => {
  const result = validateEcgVideoQuestionForPublish(validQuestion({ options: ["Atrial fibrillation"] }));
  assert.equal(result.ok, false);
  assert.match(result.reasons.join("\n"), /answer options/i);
});

test("CAT mode hides ECG teaching during active exam", () => {
  assert.equal(ecgQuestionTeachingVisible("cat", "pre_submit"), false);
  assert.equal(ecgQuestionTeachingVisible("cat", "post_submit"), false);
  assert.equal(ecgQuestionTeachingVisible("cat", "post_exam_review"), true);
});

test("practice mode shows ECG teaching only after submission", () => {
  assert.equal(ecgQuestionTeachingVisible("practice", "pre_submit"), false);
  assert.equal(ecgQuestionTeachingVisible("practice", "post_submit"), true);
});

test("ECG exhibit parser preserves recognition clues and linked lesson", () => {
  const exhibit = parseEcgVideoExhibit(validQuestion().exhibitData);
  assert.equal(exhibit?.rhythmCategory, "Atrial fibrillation");
  assert.deepEqual(exhibit?.recognitionClues, ["Irregularly irregular R-R intervals", "No consistent P waves"]);
  assert.equal(exhibit?.linkedLesson?.href, "/lessons/ecg-atrial-fibrillation");
});
