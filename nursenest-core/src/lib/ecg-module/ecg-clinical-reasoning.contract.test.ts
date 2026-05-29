/**
 * ECG Clinical Reasoning — Contract Tests
 *
 * Enforces completeness and clinical safety rules for every published
 * EcgClinicalReasoningEntry. CI fails if any published rhythm is missing
 * required clinical content.
 *
 * Run:
 *   npx tsx --test src/lib/ecg-module/ecg-clinical-reasoning.contract.test.ts
 */

import assert from "node:assert/strict";
import test, { describe } from "node:test";

import {
  ECG_CLINICAL_REASONING_REGISTRY,
  PUBLISHED_REASONING_ENTRIES,
  LIFE_THREATENING_ENTRIES,
  HIGH_RISK_ENTRIES,
  getClinicalReasoningEntry,
  REGISTRY_RHYTHM_KEYS,
} from "@/lib/ecg-module/ecg-clinical-reasoning-registry";

import {
  validateClinicalReasoningEntry,
  PUBLISHED_REQUIRED_FIELDS,
  PUBLISHED_MIN_LENGTHS,
  RHYTHMS_REQUIRING_EMERGENCY_CRITERIA,
} from "@/lib/ecg-module/ecg-clinical-reasoning-schema";

// ─── Schema completeness ──────────────────────────────────────────────────────

describe("ECG Clinical Reasoning — schema completeness for all published entries", () => {
  test("registry is non-empty", () => {
    assert.ok(ECG_CLINICAL_REASONING_REGISTRY.length > 0, "Registry must not be empty");
  });

  test("all published entries have unique rhythmKey", () => {
    const keys = PUBLISHED_REASONING_ENTRIES.map((e) => e.rhythmKey);
    assert.equal(keys.length, new Set(keys).size, "Duplicate rhythmKey in published entries");
  });

  for (const entry of PUBLISHED_REASONING_ENTRIES) {
    test(`${entry.rhythmKey}: passes schema validation (all required fields present)`, () => {
      const errors = validateClinicalReasoningEntry(entry);
      assert.deepEqual(
        errors,
        [],
        `Schema violations in "${entry.rhythmKey}":\n  ${errors.join("\n  ")}`,
      );
    });
  }
});

// ─── Required field minimums ──────────────────────────────────────────────────

describe("ECG Clinical Reasoning — required field minimums", () => {
  for (const entry of PUBLISHED_REASONING_ENTRIES) {
    test(`${entry.rhythmKey}: recognition has ≥3 items`, () => {
      assert.ok(
        entry.recognition.length >= 3,
        `${entry.rhythmKey}: recognition has ${entry.recognition.length} items, minimum 3`,
      );
    });

    test(`${entry.rhythmKey}: nursingPriorities has ≥2 items`, () => {
      assert.ok(
        entry.nursingPriorities.length >= 2,
        `${entry.rhythmKey}: nursingPriorities has ${entry.nursingPriorities.length} items, minimum 2`,
      );
    });

    test(`${entry.rhythmKey}: has ≥1 commonTrap`, () => {
      assert.ok(
        entry.commonTraps.length >= 1,
        `${entry.rhythmKey}: no commonTraps — at least one trap is required for published entries`,
      );
    });

    test(`${entry.rhythmKey}: has ≥1 compareContrast relationship`, () => {
      assert.ok(
        entry.compareContrast.length >= 1,
        `${entry.rhythmKey}: no compareContrast — every published rhythm must contrast with at least one other`,
      );
    });

    test(`${entry.rhythmKey}: has RN professionNote`, () => {
      const hasRn = entry.professionNotes.some((n) => n.profession === "RN");
      assert.ok(hasRn, `${entry.rhythmKey}: missing RN professionNote`);
    });

    test(`${entry.rhythmKey}: mechanism and conductionPath are non-trivial (>50 chars)`, () => {
      assert.ok(
        entry.mechanism.length > 50,
        `${entry.rhythmKey}: mechanism is too short (${entry.mechanism.length} chars) — must explain the electrical basis`,
      );
      assert.ok(
        entry.conductionPath.length > 20,
        `${entry.rhythmKey}: conductionPath too short`,
      );
    });

    test(`${entry.rhythmKey}: hemodynamicImpact has stablePresentation and unstablePresentation`, () => {
      assert.ok(
        entry.hemodynamicImpact.stablePresentation.length > 0,
        `${entry.rhythmKey}: hemodynamicImpact.stablePresentation is empty`,
      );
      assert.ok(
        entry.hemodynamicImpact.unstablePresentation.length > 0,
        `${entry.rhythmKey}: hemodynamicImpact.unstablePresentation is empty`,
      );
    });

    test(`${entry.rhythmKey}: monitoringRequirements is non-empty`, () => {
      assert.ok(
        entry.monitoringRequirements.length >= 1,
        `${entry.rhythmKey}: monitoringRequirements must have ≥1 item`,
      );
    });
  }
});

// ─── Clinical safety — high and life-threatening rhythms ──────────────────────

describe("ECG Clinical Reasoning — clinical safety for high-risk rhythms", () => {
  test("all life_threatening entries have clinicalSafetyFlags", () => {
    for (const entry of LIFE_THREATENING_ENTRIES) {
      assert.ok(
        entry.clinicalSafetyFlags.length >= 1,
        `Life-threatening rhythm "${entry.rhythmKey}" has no clinicalSafetyFlags — required for patient safety`,
      );
    }
  });

  test("all entries in RHYTHMS_REQUIRING_EMERGENCY_CRITERIA have codeBlue or rapidResponse", () => {
    for (const rhythmKey of RHYTHMS_REQUIRING_EMERGENCY_CRITERIA) {
      const entry = getClinicalReasoningEntry(rhythmKey);
      if (!entry || entry.publishStatus === "draft") continue;

      const hasEmergency =
        entry.escalationCriteria.codeBlue.length > 0 ||
        entry.escalationCriteria.rapidResponse.length > 0;
      assert.ok(
        hasEmergency,
        `${rhythmKey}: life-threatening rhythm must have codeBlue or rapidResponse escalation criteria`,
      );
    }
  });

  test("high-risk entries have immediateActions populated", () => {
    for (const entry of LIFE_THREATENING_ENTRIES) {
      assert.ok(
        entry.immediateActions && entry.immediateActions.length >= 1,
        `Life-threatening rhythm "${entry.rhythmKey}" must have immediateActions`,
      );
    }
  });

  test("clinicalSafetyFlag rules are non-trivial (>30 chars each)", () => {
    for (const entry of HIGH_RISK_ENTRIES) {
      for (const flag of entry.clinicalSafetyFlags) {
        assert.ok(
          flag.rule.length > 30,
          `${entry.rhythmKey}: safety flag rule is too short: "${flag.rule}"`,
        );
        assert.ok(
          flag.rationale.length > 30,
          `${entry.rhythmKey}: safety flag rationale is too short`,
        );
      }
    }
  });

  test("compare/contrast relationships include confusionConsequence", () => {
    for (const entry of PUBLISHED_REASONING_ENTRIES) {
      for (const cc of entry.compareContrast) {
        assert.ok(
          cc.confusionConsequence.length > 20,
          `${entry.rhythmKey}: compareContrast with "${cc.otherRhythm}" has trivial confusionConsequence`,
        );
        assert.ok(
          cc.keyDifferentiator.length > 10,
          `${entry.rhythmKey}: compareContrast with "${cc.otherRhythm}" has trivial keyDifferentiator`,
        );
      }
    }
  });
});

// ─── Content accuracy spot-checks ────────────────────────────────────────────

describe("ECG Clinical Reasoning — content accuracy spot-checks", () => {
  test("VT entry: wide QRS recognition criterion present", () => {
    const vt = getClinicalReasoningEntry("ventricular_tachycardia");
    assert.ok(vt, "VT entry must exist");
    const hasWideQrs = vt.recognition.some((r) => r.toLowerCase().includes("wide qrs") || r.includes("0.12"));
    assert.ok(hasWideQrs, "VT recognition must mention wide QRS");
  });

  test("VF entry: CPR as immediate action", () => {
    const vf = getClinicalReasoningEntry("ventricular_fibrillation");
    assert.ok(vf, "VF entry must exist");
    const hasCpr = [...(vf.immediateActions ?? []), ...vf.nursingPriorities].some(
      (s) => s.toLowerCase().includes("cpr"),
    );
    assert.ok(hasCpr, "VF must include CPR in immediate actions or nursing priorities");
  });

  test("VF entry: defibrillate as codeBlue escalation", () => {
    const vf = getClinicalReasoningEntry("ventricular_fibrillation");
    assert.ok(vf, "VF entry must exist");
    assert.ok(vf.escalationCriteria.codeBlue.length > 0, "VF must have codeBlue escalation");
  });

  test("AFib entry: anticoagulation mentioned in nursing priorities or safety flags", () => {
    const af = getClinicalReasoningEntry("atrial_fibrillation");
    assert.ok(af, "AFib entry must exist");
    const all = [
      ...af.nursingPriorities,
      ...af.clinicalSafetyFlags.map((f) => f.rule),
      ...af.commonTraps,
    ].join(" ").toLowerCase();
    assert.ok(all.includes("anticoagul"), "AFib must mention anticoagulation");
  });

  test("AFib entry: WPW safety flag present", () => {
    const af = getClinicalReasoningEntry("atrial_fibrillation");
    assert.ok(af, "AFib entry must exist");
    const hasWpwFlag = af.clinicalSafetyFlags.some(
      (f) => f.rule.toLowerCase().includes("wpw") || f.rule.toLowerCase().includes("accessory"),
    );
    assert.ok(hasWpwFlag, "AFib must have a WPW safety flag (AV nodal agent contraindication)");
  });

  test("CHB entry: atropine warning safety flag present", () => {
    const chb = getClinicalReasoningEntry("third_degree_av_block");
    assert.ok(chb, "CHB entry must exist");
    const hasAtropineFlag = chb.clinicalSafetyFlags.some(
      (f) => f.rule.toLowerCase().includes("atropine"),
    );
    assert.ok(hasAtropineFlag, "CHB must warn that atropine is ineffective for infranodal block");
  });

  test("Sinus tachycardia: do-not-treat-rate safety flag present", () => {
    const st = getClinicalReasoningEntry("sinus_tachycardia");
    assert.ok(st, "Sinus tachycardia entry must exist");
    const hasFlag = st.clinicalSafetyFlags.some(
      (f) => f.rule.toLowerCase().includes("rate-control") ||
             f.rule.toLowerCase().includes("beta-blocker") ||
             f.rule.toLowerCase().includes("cause"),
    );
    assert.ok(hasFlag, "Sinus tachycardia must flag against rate-control without treating the cause");
  });

  test("STEMI entry: nitrate contraindication in RV MI is flagged", () => {
    const stemi = getClinicalReasoningEntry("stemi_pattern");
    assert.ok(stemi, "STEMI entry must exist");
    const hasNitrateFlag = stemi.clinicalSafetyFlags.some(
      (f) => f.rule.toLowerCase().includes("nitrate") || f.rule.toLowerCase().includes("nitroglycerin"),
    );
    assert.ok(hasNitrateFlag, "STEMI must warn about nitrate contraindication in inferior/RV MI");
  });

  test("NSR entry: clinical risk is 'low'", () => {
    const nsr = getClinicalReasoningEntry("normal_sinus_rhythm");
    assert.ok(nsr, "NSR entry must exist");
    assert.equal(nsr.clinicalRiskLevel, "low");
  });

  test("VT entry: clinical risk is 'life_threatening'", () => {
    const vt = getClinicalReasoningEntry("ventricular_tachycardia");
    assert.ok(vt, "VT entry must exist");
    assert.equal(vt.clinicalRiskLevel, "life_threatening");
  });

  test("VT entry: compareContrast includes SVT", () => {
    const vt = getClinicalReasoningEntry("ventricular_tachycardia");
    assert.ok(vt, "VT entry must exist");
    const hasSvt = vt.compareContrast.some((cc) => cc.otherRhythm === "svt");
    assert.ok(hasSvt, "VT must contrast with SVT (most dangerous clinical confusion)");
  });

  test("Sinus bradycardia: compareContrast includes third-degree AV block", () => {
    const brad = getClinicalReasoningEntry("sinus_bradycardia");
    assert.ok(brad, "Sinus bradycardia entry must exist");
    const hasChb = brad.compareContrast.some((cc) => cc.otherRhythm === "third_degree_av_block");
    assert.ok(hasChb, "Sinus bradycardia must contrast with 3rd-degree AV block");
  });
});

// ─── Profession note coverage ─────────────────────────────────────────────────

describe("ECG Clinical Reasoning — profession note coverage", () => {
  const professions = ["RN", "new_grad"] as const;

  for (const profession of professions) {
    test(`all published entries have at least one ${profession} note`, () => {
      for (const entry of PUBLISHED_REASONING_ENTRIES) {
        const hasNote = entry.professionNotes.some((n) => n.profession === profession);
        assert.ok(hasNote, `"${entry.rhythmKey}" is missing a ${profession} professionNote`);
      }
    });
  }

  test("profession notes are non-trivial (>40 chars each)", () => {
    for (const entry of PUBLISHED_REASONING_ENTRIES) {
      for (const note of entry.professionNotes) {
        assert.ok(
          note.note.length > 40,
          `${entry.rhythmKey}: profession note for "${note.profession}" is too short (${note.note.length} chars)`,
        );
      }
    }
  });
});

// ─── Escalation hierarchy consistency ────────────────────────────────────────

describe("ECG Clinical Reasoning — escalation hierarchy consistency", () => {
  test("NSR has only monitor-level escalation (no notify/rapid/code)", () => {
    const nsr = getClinicalReasoningEntry("normal_sinus_rhythm");
    assert.ok(nsr, "NSR must exist");
    assert.equal(nsr.escalationCriteria.notify.length, 0, "NSR should not have notify escalation");
    assert.equal(nsr.escalationCriteria.rapidResponse.length, 0, "NSR should not have rapid response");
    assert.equal(nsr.escalationCriteria.codeBlue.length, 0, "NSR should not have code blue");
  });

  test("life_threatening rhythms have codeBlue escalation criteria", () => {
    for (const entry of LIFE_THREATENING_ENTRIES) {
      assert.ok(
        entry.escalationCriteria.codeBlue.length > 0 ||
        entry.escalationCriteria.rapidResponse.length > 0,
        `Life-threatening rhythm "${entry.rhythmKey}" must have code blue or rapid response criteria`,
      );
    }
  });

  test("all published entries have escalationCriteria with 4 levels defined", () => {
    for (const entry of PUBLISHED_REASONING_ENTRIES) {
      assert.ok(Array.isArray(entry.escalationCriteria.monitor), `${entry.rhythmKey}: escalation.monitor missing`);
      assert.ok(Array.isArray(entry.escalationCriteria.notify), `${entry.rhythmKey}: escalation.notify missing`);
      assert.ok(Array.isArray(entry.escalationCriteria.rapidResponse), `${entry.rhythmKey}: escalation.rapidResponse missing`);
      assert.ok(Array.isArray(entry.escalationCriteria.codeBlue), `${entry.rhythmKey}: escalation.codeBlue missing`);
    }
  });
});

// ─── Registry accessors ───────────────────────────────────────────────────────

describe("ECG Clinical Reasoning — registry accessor functions", () => {
  test("getClinicalReasoningEntry returns correct entry by rhythmKey", () => {
    const nsr = getClinicalReasoningEntry("normal_sinus_rhythm");
    assert.ok(nsr, "normal_sinus_rhythm should be in the registry");
    assert.equal(nsr.rhythmKey, "normal_sinus_rhythm");
    assert.equal(nsr.label, "Normal Sinus Rhythm");
  });

  test("getClinicalReasoningEntry returns undefined for unknown key", () => {
    const missing = getClinicalReasoningEntry("not_a_real_rhythm");
    assert.equal(missing, undefined);
  });

  test("REGISTRY_RHYTHM_KEYS are unique", () => {
    assert.equal(
      REGISTRY_RHYTHM_KEYS.length,
      new Set(REGISTRY_RHYTHM_KEYS).size,
      "REGISTRY_RHYTHM_KEYS must not contain duplicates",
    );
  });

  test("LIFE_THREATENING_ENTRIES all have clinicalRiskLevel life_threatening", () => {
    for (const e of LIFE_THREATENING_ENTRIES) {
      assert.equal(e.clinicalRiskLevel, "life_threatening");
    }
  });

  test("HIGH_RISK_ENTRIES include both high and life_threatening", () => {
    const levels = new Set(HIGH_RISK_ENTRIES.map((e) => e.clinicalRiskLevel));
    assert.ok(levels.has("life_threatening"), "HIGH_RISK_ENTRIES must include life_threatening");
  });
});
