import assert from "node:assert/strict";
import test from "node:test";
import {
  ALLOWED_STUDY_SESSION_LENGTHS,
  DEFAULT_STUDY_SETTINGS,
  normalizeStudySettings,
} from "@/lib/learner/study-settings";

test("normalizeStudySettings returns the shared defaults for missing input", () => {
  assert.deepEqual(normalizeStudySettings(), DEFAULT_STUDY_SETTINGS);
  assert.deepEqual(normalizeStudySettings(null), DEFAULT_STUDY_SETTINGS);
});

test("normalizeStudySettings merges partial values without dropping defaults", () => {
  const settings = normalizeStudySettings({
    enableAdaptivePlan: false,
    enableSpacedRepetition: false,
    preferredSessionLength: 25,
    showHeatmap: false,
  });

  assert.equal(settings.enableAdaptivePlan, false);
  assert.equal(settings.enableSpacedRepetition, false);
  assert.equal(settings.showHeatmap, false);
  assert.equal(settings.enableConfidenceTracking, DEFAULT_STUDY_SETTINGS.enableConfidenceTracking);
  assert.equal(settings.preferredSessionLength, 25);
});

test("normalizeStudySettings clamps unsupported preferred session lengths to the shared default", () => {
  const invalid = normalizeStudySettings({ preferredSessionLength: 999 });
  assert.ok(ALLOWED_STUDY_SESSION_LENGTHS.includes(DEFAULT_STUDY_SETTINGS.preferredSessionLength));
  assert.equal(invalid.preferredSessionLength, DEFAULT_STUDY_SETTINGS.preferredSessionLength);
});
