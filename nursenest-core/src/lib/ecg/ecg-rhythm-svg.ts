/**
 * Educational ECG rhythm strips for the premium ECG suite.
 * Reuses the deterministic legacy waveform generator — not diagnostic quality.
 */

import { getEcgRhythmTemplate } from "@/lib/ecg-module/ecg-rhythm-templates";
import { defaultEcgStripConfigForRhythm, generateEcgWaveform } from "@/lib/ecg-module/ecg-waveform-generator";

export type EcgRhythmId =
  | "nsr"
  | "sinus_brady"
  | "sinus_tachy"
  | "afib"
  | "pvc"
  | "svt"
  | "vt"
  | "vfib"
  | "heart_block"
  | "paced"
  | "st_elevation"
  | "hyperk"
  | "long_qt"
  | "pulseless";

export type EcgRhythmSemanticTone = "success" | "info" | "warning" | "danger";

export type EcgRhythmFixture = {
  id: EcgRhythmId;
  tone: EcgRhythmSemanticTone;
  pathD: string;
};

const TEMPLATE_KEY: Record<EcgRhythmId, string> = {
  nsr: "normal_sinus_rhythm",
  sinus_brady: "sinus_bradycardia",
  sinus_tachy: "sinus_tachycardia",
  afib: "atrial_fibrillation",
  pvc: "pvcs",
  svt: "svt",
  vt: "ventricular_tachycardia",
  vfib: "ventricular_fibrillation",
  heart_block: "third_degree_av_block",
  paced: "paced_rhythm",
  st_elevation: "stemi_pattern",
  hyperk: "hyperkalemia_pattern",
  long_qt: "torsades_de_pointes",
  pulseless: "pea",
};

function toneForTemplateKey(rhythmKey: string): EcgRhythmSemanticTone {
  const t = getEcgRhythmTemplate(rhythmKey);
  if (t?.highRisk) return "danger";
  if (["ventricular_tachycardia", "ventricular_fibrillation", "asystole", "stemi_pattern", "torsades_de_pointes"].includes(rhythmKey)) {
    return "danger";
  }
  if (["atrial_fibrillation", "hyperkalemia_pattern", "third_degree_av_block", "pea"].includes(rhythmKey)) return "warning";
  if (["svt", "paced_rhythm", "sinus_tachycardia"].includes(rhythmKey)) return "info";
  return "success";
}

const CACHE = new Map<EcgRhythmId, EcgRhythmFixture>();

export function getEcgRhythmFixture(id: EcgRhythmId): EcgRhythmFixture {
  const hit = CACHE.get(id);
  if (hit) return hit;
  const rhythmKey = TEMPLATE_KEY[id];
  const config = defaultEcgStripConfigForRhythm(rhythmKey);
  const { path } = generateEcgWaveform(config);
  const tone = toneForTemplateKey(rhythmKey);
  const f: EcgRhythmFixture = { id, tone, pathD: path };
  CACHE.set(id, f);
  return f;
}
