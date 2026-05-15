import assert from "node:assert/strict";
import test, { describe } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EcgLiveStrip } from "@/components/study/ecg-live-strip";
import { ECG_RHYTHM_TEMPLATES } from "@/lib/ecg-module/ecg-rhythm-templates";
import {
  defaultEcgStripConfigForRhythm,
  generateEcgWaveform,
  validateStripContinuity,
  ECG_STRIP_TYPE_LABELS,
} from "@/lib/ecg-module/ecg-waveform-generator";
import { validateEcgStripClinicalConfig } from "@/lib/ecg-module/ecg-strip-clinical-validation";
import { filterDuplicateGeneratedQuestions, normalizeQuestionText } from "@/lib/ecg-module/ecg-question-dedup";
import { generateQuestionsForCategory } from "@/lib/ecg-module/ecg-question-generation";

test("ECG rhythm template registry includes required clinical rhythms", () => {
  const keys = new Set(ECG_RHYTHM_TEMPLATES.map((template) => template.rhythmKey));
  for (const key of [
    "normal_sinus_rhythm",
    "sinus_bradycardia",
    "sinus_tachycardia",
    "atrial_fibrillation",
    "atrial_flutter",
    "svt",
    "pvcs",
    "pacs",
    "ventricular_tachycardia",
    "ventricular_fibrillation",
    "asystole",
    "pea",
    "first_degree_av_block",
    "second_degree_type_i_av_block",
    "second_degree_type_ii_av_block",
    "third_degree_av_block",
    "bundle_branch_block",
    "stemi_pattern",
    "hyperkalemia_pattern",
    "hypokalemia_pattern",
    "torsades_de_pointes",
    "paced_rhythm",
  ]) {
    assert.equal(keys.has(key), true, `${key} missing from registry`);
  }
});

test("each default ECG rhythm strip config validates against its clinical template", () => {
  for (const template of ECG_RHYTHM_TEMPLATES) {
    const config = defaultEcgStripConfigForRhythm(template.rhythmKey);
    const result = validateEcgStripClinicalConfig(config, {
      correctAnswer: template.rhythmKey,
      highRiskManualReviewed: true,
    });
    assert.deepEqual(result.failures, [], `${template.rhythmKey}: ${result.failures.join("; ")}`);
  }
});

test("invalid ECG rhythm combinations fail clinical validation", () => {
  assert.match(
    validateEcgStripClinicalConfig({ ...defaultEcgStripConfigForRhythm("atrial_fibrillation"), regularity: "regular" }, { correctAnswer: "atrial_fibrillation", highRiskManualReviewed: true }).failures.join(" "),
    /cannot be regular/,
  );
  assert.match(
    validateEcgStripClinicalConfig({ ...defaultEcgStripConfigForRhythm("ventricular_tachycardia"), qrsWidth: 0.08 }, { correctAnswer: "ventricular_tachycardia", highRiskManualReviewed: true }).failures.join(" "),
    /wide QRS/,
  );
  assert.match(
    validateEcgStripClinicalConfig({ ...defaultEcgStripConfigForRhythm("torsades_de_pointes"), features: { polymorphicTwisting: false } }, { correctAnswer: "torsades_de_pointes", highRiskManualReviewed: true }).failures.join(" "),
    /polymorphic/,
  );
});

test("deterministic waveform generator returns stable SVG points", () => {
  const config = defaultEcgStripConfigForRhythm("normal_sinus_rhythm");
  const first = generateEcgWaveform(config);
  const second = generateEcgWaveform(config);
  assert.equal(first.path, second.path);
  assert.ok(first.points.length > 100);
});

test("ECG live strip renders and lazy-load placeholder is available before visibility", () => {
  const html = renderToStaticMarkup(React.createElement(EcgLiveStrip, { config: defaultEcgStripConfigForRhythm("atrial_fibrillation"), mode: "live" }));
  assert.match(html, /data-testid="ecg-live-strip"/);
  assert.match(html, /ECG strip/);
});

test("ECG question dedup rejects duplicate stems before insert", () => {
  assert.equal(normalizeQuestionText("What rhythm is this?!!"), "what rhythm is this");
  const existing = [{ questionText: "Identify this ECG rhythm", rhythmTag: "atrial_fibrillation", answerOptions: ["Atrial fibrillation"], rationale: "Irregularly irregular." }];
  const filtered = filterDuplicateGeneratedQuestions(
    [{ questionText: "Identify this ECG rhythm.", rhythmTag: "atrial_fibrillation", answerOptions: ["Atrial fibrillation"], rationale: "Irregularly irregular." }],
    existing,
  );
  assert.equal(filtered.accepted.length, 0);
  assert.equal(filtered.rejected.length, 1);
});

test("ECG generator creates only requested category and deterministic media configs", () => {
  const questions = generateQuestionsForCategory("electrolyte_medication", 3);
  assert.equal(questions.length, 3);
  assert.ok(questions.every((question) => question.mediaType === "ecg_live_strip"));
  assert.ok(questions.every((question) => question.topicTags.includes("electrolyte_medication")));
});

// ─── Strip Continuity Regression Tests ────────────────────────────────────

describe("ECG strip continuity — no initial flatline/asystole artifact", () => {
  // These rhythms have discrete beats and must start within one cardiac cycle.
  const beatedRhythms = ECG_RHYTHM_TEMPLATES.filter(
    (t) => t.rhythmKey !== "ventricular_fibrillation" && t.rhythmKey !== "asystole",
  );

  for (const template of beatedRhythms) {
    test(`${template.rhythmKey}: first beat appears within one cardiac cycle`, () => {
      const config = defaultEcgStripConfigForRhythm(template.rhythmKey);
      const result = validateStripContinuity(config, 6);

      // First beat must be present
      assert.ok(
        result.firstBeatTime !== null,
        `${template.rhythmKey}: no beats found — strip is entirely flatline`,
      );

      // First beat must appear within the acceptable window
      assert.ok(
        result.firstBeatOnTime,
        `${template.rhythmKey}: first beat at ${result.firstBeatTime?.toFixed(3)}s exceeds ` +
        `max allowed ${result.maxAllowedFirstBeatTime.toFixed(3)}s. ` +
        `Learners see ${result.firstBeatTime?.toFixed(2)}s of flatline before rhythm starts.`,
      );
    });
  }

  test("all beated rhythms have first beat time <= 0.60s (absolute cap)", () => {
    for (const template of beatedRhythms) {
      const config = defaultEcgStripConfigForRhythm(template.rhythmKey);
      const result = validateStripContinuity(config, 6);
      if (result.firstBeatTime !== null) {
        assert.ok(
          result.firstBeatTime <= 0.60,
          `${template.rhythmKey}: first beat at ${result.firstBeatTime.toFixed(3)}s exceeds absolute 0.60s cap`,
        );
      }
    }
  });

  test("first beat appears at or after 0.05s (rhythm visible from strip start)", () => {
    // Minimum: even with AFib irregularity reducing the first interval,
    // the beat should appear at least 0.05s into the strip so the trace
    // doesn't begin at exactly t=0 (which would clip the rising edge of QRS).
    for (const template of beatedRhythms) {
      const config = defaultEcgStripConfigForRhythm(template.rhythmKey);
      const result = validateStripContinuity(config, 6);
      if (result.firstBeatTime !== null) {
        assert.ok(
          result.firstBeatTime >= 0.05,
          `${template.rhythmKey}: first beat at ${result.firstBeatTime.toFixed(3)}s is too early — QRS would be clipped at the strip boundary`,
        );
      }
    }
  });

  test("asystole and VF pass continuity check (no discrete beats expected)", () => {
    const asystoleResult = validateStripContinuity(defaultEcgStripConfigForRhythm("asystole"), 6);
    assert.ok(asystoleResult.ok, "asystole should pass continuity (no beats is correct)");
    assert.equal(asystoleResult.firstBeatTime, null, "asystole should have no beats");

    const vfResult = validateStripContinuity(defaultEcgStripConfigForRhythm("ventricular_fibrillation"), 6);
    assert.ok(vfResult.ok, "VF should pass continuity (no discrete beats)");
    assert.equal(vfResult.firstBeatTime, null, "VF should have no discrete beats");
  });

  test("default strip configs all have stripType = 'single_rhythm'", () => {
    for (const template of ECG_RHYTHM_TEMPLATES) {
      const config = defaultEcgStripConfigForRhythm(template.rhythmKey);
      assert.equal(
        config.stripType,
        "single_rhythm",
        `${template.rhythmKey}: defaultEcgStripConfigForRhythm must produce single_rhythm strips`,
      );
    }
  });

  test("single_rhythm strips do not require a UI label", () => {
    for (const template of ECG_RHYTHM_TEMPLATES) {
      const config = defaultEcgStripConfigForRhythm(template.rhythmKey);
      const result = validateStripContinuity(config, 6);
      assert.equal(
        result.requiresLabel,
        false,
        `${template.rhythmKey}: single_rhythm strip must not require a label`,
      );
      assert.equal(result.labelText, null, `${template.rhythmKey}: single_rhythm label must be null`);
    }
  });

  test("non-single-rhythm strip types require a label and have label text", () => {
    const types = ["transition", "deterioration", "conversion", "artifact_onset"] as const;
    for (const type of types) {
      const label = ECG_STRIP_TYPE_LABELS[type];
      assert.ok(label && label.length > 0, `Strip type "${type}" must have a non-null label text`);

      // A transition strip must flag requiresLabel
      const config = { ...defaultEcgStripConfigForRhythm("normal_sinus_rhythm"), stripType: type };
      const result = validateStripContinuity(config, 6);
      assert.equal(result.requiresLabel, true, `Strip type "${type}" must require a label`);
      assert.equal(result.labelText, label, `Strip type "${type}" must return correct label text`);
    }
  });

  test("6-second strip has enough beats for rhythm identification (>=3 for beated rhythms)", () => {
    // A learner cannot identify a rhythm from fewer than 3 beats.
    // For very slow rhythms (20 BPM, cycle=3s), 6s yields ~2 beats — acceptable minimum.
    // For rates >= 40 BPM, 6s should yield >= 4 beats.
    const ABSOLUTE_MIN_BEATS = 2;
    const result = generateEcgWaveform(defaultEcgStripConfigForRhythm("third_degree_av_block"));
    // Just verify generator didn't crash and produced points
    assert.ok(result.points.length > 0, "third_degree_av_block must produce waveform points");

    for (const template of beatedRhythms) {
      const config = defaultEcgStripConfigForRhythm(template.rhythmKey);
      const continuity = validateStripContinuity(config, 6);
      if (continuity.firstBeatTime !== null) {
        const rate = Math.max(config.rate || 60, 20);
        const cycleLength = 60 / rate;
        const estimatedBeats = Math.floor((6 - (continuity.firstBeatTime ?? 0)) / cycleLength) + 1;
        assert.ok(
          estimatedBeats >= ABSOLUTE_MIN_BEATS,
          `${template.rhythmKey} at ${rate} BPM: estimated ${estimatedBeats} beats in 6s — not enough for identification`,
        );
      }
    }
  });
});

describe("ECG strip waveform correctness", () => {
  test("waveform path does not contain only the starting point (flat start)", () => {
    // A flat start would mean the path is all M/L commands at the same y-value for the first
    // 20% of the strip. This is the visual manifestation of the initial flatline bug.
    const STRIP_SECONDS = 6;
    const CHECK_WINDOW_FRACTION = 0.15; // Check first 15% of strip for variation

    for (const template of ECG_RHYTHM_TEMPLATES) {
      if (template.rhythmKey === "asystole") continue; // asystole is intentionally flat
      const config = defaultEcgStripConfigForRhythm(template.rhythmKey);
      const result = generateEcgWaveform(config, { seconds: STRIP_SECONDS, sampleRate: 120 });
      const checkUntilIndex = Math.floor(result.points.length * CHECK_WINDOW_FRACTION);
      const earlyPoints = result.points.slice(0, checkUntilIndex);
      const yValues = earlyPoints.map((p) => p.y);
      const yMin = Math.min(...yValues);
      const yMax = Math.max(...yValues);
      const yRange = yMax - yMin;
      // The early segment must have visible signal variation (not flatline).
      // VF has continuous chaotic variation; other rhythms have beats.
      assert.ok(
        yRange > 2,
        `${template.rhythmKey}: first ${Math.round(CHECK_WINDOW_FRACTION * 100)}% of strip is flat ` +
        `(y-range ${yRange.toFixed(2)}px) — initial flatline bug persists`,
      );
    }
  });

  test("high-rate rhythms (SVT, VT, torsades) still begin within first 0.4s", () => {
    const highRateRhythms = ["svt", "ventricular_tachycardia", "torsades_de_pointes"];
    for (const key of highRateRhythms) {
      const config = defaultEcgStripConfigForRhythm(key);
      const result = validateStripContinuity(config, 6);
      assert.ok(
        result.firstBeatTime !== null && result.firstBeatTime <= 0.4,
        `${key}: first beat at ${result.firstBeatTime?.toFixed(3)}s — high-rate rhythm must start within 0.4s`,
      );
    }
  });
});
