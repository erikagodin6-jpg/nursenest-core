import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ALLIED_OCCUPATION_PEDAGOGY_PROFILES,
  resolveAlliedOccupationPedagogyProfile,
  resolveNursingProgramTier,
  resolveTierPedagogyProfile,
  TIER_PEDAGOGY_PROFILES,
} from "@/lib/nursing-tiers/tier-pedagogy-profile";

test("resolves pathway role tracks into shared nursing pedagogy tiers", () => {
  assert.equal(resolveNursingProgramTier({ roleTrack: "rpn" }), "RPN");
  assert.equal(resolveNursingProgramTier({ roleTrack: "lpn" }), "RPN");
  assert.equal(resolveNursingProgramTier({ roleTrack: "rn" }), "RN");
  assert.equal(resolveNursingProgramTier({ roleTrack: "np" }), "NP");
  assert.equal(resolveNursingProgramTier({ roleTrack: "allied" }), "ALLIED");
});

test("resolves subscription tier fallbacks when role track is unavailable", () => {
  assert.equal(resolveNursingProgramTier({ stripeTier: "LVN_LPN" }), "RPN");
  assert.equal(resolveNursingProgramTier({ stripeTier: "RPN" }), "RPN");
  assert.equal(resolveNursingProgramTier({ stripeTier: "RN" }), "RN");
  assert.equal(resolveNursingProgramTier({ stripeTier: "NP" }), "NP");
  assert.equal(resolveNursingProgramTier({ stripeTier: "ALLIED" }), "ALLIED");
});

test("keeps all tiers on the RN reference UI pattern while scaling educational depth", () => {
  for (const profile of Object.values(TIER_PEDAGOGY_PROFILES)) {
    assert.equal(profile.uiPattern, "rn-reference");
    assert.deepEqual(profile.rationaleSections, [
      "why-correct",
      "why-incorrect-options-are-tempting",
      "clinical-reasoning",
      "safety-implications",
      "common-exam-traps",
      "tier-specific-teaching",
    ]);
    assert.deepEqual(profile.supportedInteractions, [
      "multiple-choice",
      "select-all-that-apply",
      "case-study",
      "prioritization",
      "medication-safety",
      "professional-ethics",
      "scope-of-practice",
      "patient-communication",
      "documentation",
      "interprofessional-collaboration",
      "emergency-recognition",
      "diagnostic-interpretation",
      "progressive-hints",
      "expandable-rationales",
      "flashcard-review",
      "practice-exam",
    ]);
  }
});

test("scales content priorities by scope without changing workflow contracts", () => {
  const rpn = resolveTierPedagogyProfile({ roleTrack: "rpn" });
  const rn = resolveTierPedagogyProfile({ roleTrack: "rn" });
  const np = resolveTierPedagogyProfile({ roleTrack: "np" });
  const allied = resolveTierPedagogyProfile({ roleTrack: "allied" });

  assert.equal(rpn.rationaleDepth, "bedside-safety");
  assert.ok(rpn.contentPriorities.includes("recognition and reporting"));

  assert.equal(rn.rationaleDepth, "integrated-rn-judgment");
  assert.ok(rn.contentPriorities.includes("delegation"));
  assert.ok(rn.avoid.includes("advanced ventilator management"));

  assert.equal(np.rationaleDepth, "advanced-diagnostic-management");
  assert.ok(np.contentPriorities.includes("differential diagnoses"));

  assert.equal(allied.rationaleDepth, "profession-specific-clinical-reasoning");
  assert.ok(allied.contentPriorities.includes("scope-of-practice reasoning"));
});

test("uses a three-step hint progression for every tier", () => {
  for (const profile of Object.values(TIER_PEDAGOGY_PROFILES)) {
    assert.equal(profile.hintProgression.length, 3);
  }
});

test("maps Allied professions into scalable occupation pedagogy families", () => {
  const respiratory = resolveAlliedOccupationPedagogyProfile("respiratory-therapy");
  assert.equal(respiratory.careerKey, "rrt");
  assert.ok(respiratory.reasoningFocus.includes("oxygen delivery"));

  const paramedic = resolveAlliedOccupationPedagogyProfile("paramedic");
  assert.equal(paramedic.careerKey, "paramedic");
  assert.ok(paramedic.safetyPriorities.includes("scene safety"));

  const lab = resolveAlliedOccupationPedagogyProfile("clinical-research");
  assert.equal(lab.careerKey, "mlt");
  assert.ok(lab.reasoningFocus.includes("quality control"));

  const imaging = resolveAlliedOccupationPedagogyProfile("diagnostic-sonography");
  assert.equal(imaging.careerKey, "imaging");
  assert.ok(imaging.safetyPriorities.includes("radiation protection"));

  const therapy = resolveAlliedOccupationPedagogyProfile("speech-language-pathology");
  assert.equal(therapy.careerKey, "ota_pta");
  assert.ok(therapy.commonQuestionContexts.includes("speech/swallow screening cues"));

  const support = resolveAlliedOccupationPedagogyProfile("health-information-management");
  assert.equal(support.careerKey, "socialwork");
  assert.ok(support.reasoningFocus.includes("privacy"));
});

test("covers the requested Allied Health expansion surface without adding UI forks", () => {
  const covered = new Set(ALLIED_OCCUPATION_PEDAGOGY_PROFILES.flatMap((p) => p.professionKeys));
  for (const key of [
    "respiratory-therapy",
    "paramedic",
    "medical-laboratory-technology",
    "medical-radiation-technology",
    "physiotherapy",
    "occupational-therapy",
    "speech-language-pathology",
    "pharmacy-technician",
    "dental-hygiene",
    "diagnostic-sonography",
    "dietetics",
    "social-work",
    "personal-support-worker",
    "health-care-aide",
    "cardiology-technologist",
    "ecg-tech",
    "anesthesia-assistant",
    "perfusionist",
    "clinical-research",
    "medical-office-assistant",
    "health-information-management",
  ]) {
    assert.ok(covered.has(key), `${key} should resolve to an Allied pedagogy family`);
  }
  assert.equal(TIER_PEDAGOGY_PROFILES.ALLIED.uiPattern, "rn-reference");
});
