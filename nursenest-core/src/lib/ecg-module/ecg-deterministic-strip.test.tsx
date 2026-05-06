import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EcgLiveStrip } from "@/components/study/ecg-live-strip";
import { ECG_RHYTHM_TEMPLATES } from "@/lib/ecg-module/ecg-rhythm-templates";
import { defaultEcgStripConfigForRhythm, generateEcgWaveform } from "@/lib/ecg-module/ecg-waveform-generator";
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
