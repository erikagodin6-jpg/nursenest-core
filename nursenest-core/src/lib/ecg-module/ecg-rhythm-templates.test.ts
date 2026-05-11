import assert from "node:assert/strict";
import test from "node:test";
import { getEcgRhythmTemplate } from "@/lib/ecg-module/ecg-rhythm-templates";

test("ECG rhythm templates include the missing high-priority core and advanced keys", () => {
  const sinusArrhythmia = getEcgRhythmTemplate("sinus_arrhythmia");
  const junctional = getEcgRhythmTemplate("junctional_rhythm");
  const digoxinToxicity = getEcgRhythmTemplate("digoxin_toxicity_pattern");
  const drugQt = getEcgRhythmTemplate("drug_induced_qt_prolongation");

  assert.ok(sinusArrhythmia, "sinus_arrhythmia template should exist");
  assert.equal(sinusArrhythmia?.rhythmRegularity, "regularly_irregular");
  assert.equal(sinusArrhythmia?.pWavePresence, "present");

  assert.ok(junctional, "junctional_rhythm template should exist");
  assert.equal(junctional?.pWavePresence, "variable");
  assert.equal(junctional?.difficulty, "intermediate");

  assert.ok(digoxinToxicity, "digoxin toxicity ECG pattern should exist");
  assert.equal(digoxinToxicity?.highRisk, true);
  assert.match(digoxinToxicity?.clinicalTags.join(" ") ?? "", /drug|toxicity/i);

  assert.ok(drugQt, "drug-induced QT prolongation template should exist");
  assert.equal(drugQt?.qtBehavior, "prolonged");
  assert.match(drugQt?.clinicalTags.join(" ") ?? "", /drug|qt/i);
});
