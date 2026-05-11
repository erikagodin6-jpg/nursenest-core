import assert from "node:assert/strict";
import test from "node:test";
import {
  ADVANCED_ECG_PACEMAKER_ANNOTATION_FEATURES,
  ADVANCED_ECG_PACEMAKER_TEACHING_SECTIONS,
} from "@/lib/advanced-ecg/advanced-ecg-curriculum";

test("pacemaker track exposes the requested five-part teaching framework", () => {
  assert.equal(ADVANCED_ECG_PACEMAKER_TEACHING_SECTIONS.length, 5);
  assert.deepEqual(
    ADVANCED_ECG_PACEMAKER_TEACHING_SECTIONS.map((section) => section.slug),
    [
      "foundations",
      "paced-rhythm-recognition",
      "malfunctions",
      "critical-care-interpretation",
      "advanced-concepts",
    ],
  );
});

test("pacemaker teaching sections cover paced rhythm recognition and advanced pacing concepts", () => {
  const recognition = ADVANCED_ECG_PACEMAKER_TEACHING_SECTIONS.find((section) => section.slug === "paced-rhythm-recognition");
  const advanced = ADVANCED_ECG_PACEMAKER_TEACHING_SECTIONS.find((section) => section.slug === "advanced-concepts");

  assert.deepEqual(recognition?.topics.includes("ventricular paced rhythms"), true);
  assert.deepEqual(recognition?.topics.includes("AV sequential pacing"), true);
  assert.deepEqual(advanced?.topics.includes("fusion beats"), true);
  assert.deepEqual(advanced?.topics.includes("CRT / biventricular pacing"), true);
  assert.deepEqual(advanced?.topics.includes("pacemaker-mediated tachycardia"), true);
});

test("pacemaker learning experience includes annotated pacing walkthrough affordances", () => {
  assert.deepEqual(ADVANCED_ECG_PACEMAKER_ANNOTATION_FEATURES, [
    "annotated paced strips",
    "pacing-spike highlighting",
    "capture overlays",
    "step-by-step interpretation",
    "malfunction callouts",
    "telemetry scenarios",
    "case progression",
  ]);
});
