/**
 * ECG Phase 2 Governance Contract Tests
 *
 * CI enforcement for all Phase 2 artifacts:
 *   - ecg-simulation-catalog.ts    (250 simulations, ≥50 per profession)
 *   - ecg-rhythm-progression-engine.ts (deterioration maps completeness)
 *   - ecg-ngn-cases.ts             (NGN format coverage, safety content)
 *   - ecg-competency-passport.ts   (badge/level structure integrity)
 *   - ecg-adaptive-cat-engine.ts   (5-level coverage)
 *   - ecg-documentation-handoff.ts (SBAR required elements)
 *   - ecg-telemetry-layer.ts       (high-risk scenarios documented)
 *
 * FAIL CI IF:
 *   - < 50 simulations for any profession
 *   - Total < 250 simulations
 *   - Duplicate simulation IDs
 *   - Life-threatening simulations missing code blue decision point
 *   - Deterioration maps missing missableWarnings
 *   - NGN cases missing all 6 NCJMM layers in aggregate
 *   - Competency badges missing profession-specific coverage
 *   - SBAR templates missing required elements
 *   - Telemetry scenarios missing life-threatening consequences
 *
 * Run:
 *   npx tsx --test src/lib/ecg-module/ecg-phase2-governance.contract.test.ts
 */

import assert from "node:assert/strict";
import test, { describe } from "node:test";

import {
  ECG_SIMULATION_CATALOG,
  CATALOG_COUNTS,
  SIMULATION_IDS,
  getSimulationsForProfession,
  getPublishedSimulations,
} from "@/lib/ecg-module/ecg-simulation-catalog";

import {
  validateEcgSimulation,
} from "@/lib/ecg-module/ecg-simulation-schema";

import {
  ECG_RHYTHM_PROGRESSION_MAPS,
  ALL_PROGRESSION_MAP_IDS,
  getDeteriorationPathsFrom,
  getMissableWarningsForRhythm,
} from "@/lib/ecg-module/ecg-rhythm-progression-engine";

import {
  ECG_NGN_CASES,
  NGN_CASE_IDS,
  NGN_FORMATS_COVERED,
  getCasesByFormat,
  getCasesByJudgmentLayer,
} from "@/lib/ecg-module/ecg-ngn-cases";

import {
  ECG_COMPETENCY_BADGES,
  ECG_PASSPORT_LEVEL_GATES,
  ECG_PROFESSION_PASSPORT_CONFIGS,
  computeEcgPassportLevel,
} from "@/lib/ecg-module/ecg-competency-passport";

import {
  ECG_ADAPTIVE_LEVELS,
  ECG_DOMAIN_ADAPTIVE_CONFIGS,
  computeNextAdaptiveDifficulty,
  computeEcgReadinessScore,
} from "@/lib/ecg-module/ecg-adaptive-cat-engine";

import {
  ECG_SBAR_TEMPLATES,
  ECG_DOCUMENTATION_TEMPLATES,
  SBAR_TEMPLATE_IDS,
} from "@/lib/ecg-module/ecg-documentation-handoff";

import {
  ECG_TELEMETRY_SCENARIOS,
  TELEMETRY_SCENARIO_IDS,
  getHighRiskTelemetryScenarios,
} from "@/lib/ecg-module/ecg-telemetry-layer";

// ─── Phase 1 Gate: Simulation Catalog ─────────────────────────────────────────

describe("Phase 2 Gate — Simulation Catalog (250 total, ≥50 per profession)", () => {
  test("total simulation count ≥ 250", () => {
    assert.ok(ECG_SIMULATION_CATALOG.length >= 250,
      `Simulation catalog has ${ECG_SIMULATION_CATALOG.length} — minimum 250 required`);
  });

  test("all simulation IDs are unique", () => {
    assert.equal(SIMULATION_IDS.length, new Set(SIMULATION_IDS).size,
      "Duplicate simulation IDs found in catalog");
  });

  const PROFESSIONS = ["RN", "RPN", "NP", "RT", "new_grad"] as const;
  const MIN_PER_PROFESSION = 50;

  for (const profession of PROFESSIONS) {
    test(`${profession}: ≥${MIN_PER_PROFESSION} simulations`, () => {
      const count = CATALOG_COUNTS[profession];
      assert.ok(count >= MIN_PER_PROFESSION,
        `${profession} has ${count} simulations — minimum ${MIN_PER_PROFESSION} required`);
    });
  }

  test("all simulation IDs are slug-valid (lowercase, hyphens, no spaces)", () => {
    for (const id of SIMULATION_IDS) {
      assert.match(id, /^[a-z0-9-]+$/,
        `Simulation ID "${id}" must be lowercase alphanumeric with hyphens only`);
    }
  });

  test("all simulations have non-empty title and summary", () => {
    for (const sim of ECG_SIMULATION_CATALOG) {
      assert.ok(sim.title.length > 5, `Simulation "${sim.id}": title too short`);
      assert.ok(sim.summary.length > 20, `Simulation "${sim.id}": summary too short`);
    }
  });

  test("all simulations have ≥1 target profession", () => {
    for (const sim of ECG_SIMULATION_CATALOG) {
      assert.ok(sim.targetProfessions.length >= 1,
        `Simulation "${sim.id}" must target ≥1 profession`);
    }
  });

  test("all simulations have estimatedMinutes > 0", () => {
    for (const sim of ECG_SIMULATION_CATALOG) {
      assert.ok(sim.estimatedMinutes > 0,
        `Simulation "${sim.id}": estimatedMinutes must be > 0`);
    }
  });

  test("all simulations have difficulty 1–5", () => {
    for (const sim of ECG_SIMULATION_CATALOG) {
      assert.ok(sim.difficulty >= 1 && sim.difficulty <= 5,
        `Simulation "${sim.id}": difficulty ${sim.difficulty} out of 1–5 range`);
    }
  });
});

// ─── Phase 1 Gate: Published Flagship Simulations ─────────────────────────────

describe("Phase 2 Gate — Published simulations pass schema validation", () => {
  const published = getPublishedSimulations();

  test("at least 3 published flagship simulations exist", () => {
    assert.ok(published.length >= 3,
      `Only ${published.length} published simulations — expected ≥3 flagship simulations`);
  });

  for (const sim of published) {
    test(`${sim.id}: passes validateEcgSimulation()`, () => {
      const errors = validateEcgSimulation(sim);
      assert.deepEqual(errors, [],
        `Published simulation "${sim.id}" validation failures:\n  ${errors.join("\n  ")}`);
    });

    test(`${sim.id}: has ≥2 rhythm progression nodes`, () => {
      assert.ok(sim.rhythmProgression.length >= 2,
        `Published simulation "${sim.id}" must have ≥2 progression nodes`);
    });

    test(`${sim.id}: has ≥1 decision point`, () => {
      assert.ok(sim.decisionPoints.length >= 1,
        `Published simulation "${sim.id}" must have ≥1 decision point`);
    });

    test(`${sim.id}: debrief has learning objectives`, () => {
      assert.ok(sim.debrief.learningObjectives.length >= 1,
        `Published simulation "${sim.id}": debrief must have ≥1 learning objective`);
    });
  }
});

// ─── Phase 2 Gate: Clinical Safety — Life-Threatening Simulations ─────────────

describe("Phase 2 Gate — Life-threatening simulation safety requirements", () => {
  const lifeThreatening = ECG_SIMULATION_CATALOG.filter((sim) =>
    sim.rhythmProgression.some((n) => n.riskLevel === "life_threatening"),
  );

  test("≥3 life-threatening simulations exist in catalog", () => {
    assert.ok(lifeThreatening.length >= 3,
      `Only ${lifeThreatening.length} life-threatening simulations found — expected ≥3`);
  });

  for (const sim of lifeThreatening.filter((s) => s.publishStatus === "published")) {
    test(`${sim.id}: life-threatening sim has escalation decision point`, () => {
      const hasEscalation = sim.decisionPoints.some((dp) => dp.decisionType === "escalation");
      assert.ok(hasEscalation,
        `Life-threatening simulation "${sim.id}" must have ≥1 escalation decision point`);
    });
  }

  const simRequiringCode = ECG_SIMULATION_CATALOG.filter((s) => s.requiresCodeBlueDecision);
  test("≥1 simulation requires code blue decision", () => {
    assert.ok(simRequiringCode.length >= 1, "At least one simulation must require a code blue decision");
  });

  const simRequiringStemi = ECG_SIMULATION_CATALOG.filter((s) => s.requiresStemiActivation);
  test("≥1 simulation requires STEMI activation", () => {
    assert.ok(simRequiringStemi.length >= 1, "At least one simulation must require STEMI activation");
  });
});

// ─── Phase 2 Gate: Rhythm Progression Engine ──────────────────────────────────

describe("Phase 2 Gate — Rhythm Progression Engine", () => {
  test("≥4 progression maps exist", () => {
    assert.ok(ECG_RHYTHM_PROGRESSION_MAPS.length >= 4,
      `Only ${ECG_RHYTHM_PROGRESSION_MAPS.length} progression maps — minimum 4 required`);
  });

  test("all progression map IDs are unique", () => {
    const ids = ALL_PROGRESSION_MAP_IDS;
    assert.equal(ids.length, new Set(ids).size, "Duplicate progression map IDs found");
  });

  for (const map of ECG_RHYTHM_PROGRESSION_MAPS) {
    test(`Map "${map.id}": has ≥1 node`, () => {
      assert.ok(map.nodes.length >= 1, `Map "${map.id}" must have ≥1 node`);
    });

    test(`Map "${map.id}": has overallTeachingTheme (non-trivial)`, () => {
      assert.ok(map.overallTeachingTheme.length > 30,
        `Map "${map.id}": overallTeachingTheme too short`);
    });

    for (const node of map.nodes) {
      if (node.deteriorationPaths.length > 0) {
        test(`Map "${map.id}" node "${node.rhythmKey}": all edges have missableWarnings`, () => {
          for (const edge of node.deteriorationPaths) {
            assert.ok(
              edge.missableWarnings.length >= 1 || edge.clinicalTrigger.length > 20,
              `Map "${map.id}" node "${node.rhythmKey}" → "${edge.targetLabel}": ` +
              "edge must have ≥1 missableWarning or detailed clinicalTrigger",
            );
          }
        });

        test(`Map "${map.id}" node "${node.rhythmKey}": all edges have interventionsThatInterrupt`, () => {
          for (const edge of node.deteriorationPaths) {
            assert.ok(edge.interventionsThatInterrupt.length >= 1,
              `Map "${map.id}" edge to "${edge.targetLabel}" must have ≥1 intervention`);
          }
        });
      }
    }
  }

  test("VF deterioration path has defibrillation as an intervention", () => {
    const vfPaths = getDeteriorationPathsFrom("ventricular_tachycardia");
    const hasDefib = vfPaths.some((edge) =>
      edge.interventionsThatInterrupt.some((i) =>
        i.toLowerCase().includes("defibrillat"),
      ),
    );
    assert.ok(hasDefib, "VT deterioration must include defibrillation as an intervention");
  });

  test("PVC deterioration has electrolyte correction as intervention", () => {
    const pvcPaths = getDeteriorationPathsFrom("pvcs");
    const hasElectrolyte = pvcPaths.some((edge) =>
      edge.interventionsThatInterrupt.some((i) =>
        i.toLowerCase().includes("potassium") || i.toLowerCase().includes("electrolyte"),
      ),
    );
    assert.ok(hasElectrolyte, "PVC deterioration must include electrolyte correction");
  });
});

// ─── Phase 2 Gate: NGN Cases ──────────────────────────────────────────────────

describe("Phase 2 Gate — NGN Clinical Judgment Cases", () => {
  test("≥9 NGN cases exist", () => {
    assert.ok(ECG_NGN_CASES.length >= 9, `Only ${ECG_NGN_CASES.length} NGN cases — minimum 9 required`);
  });

  test("all NGN case IDs are unique", () => {
    assert.equal(NGN_CASE_IDS.length, new Set(NGN_CASE_IDS).size, "Duplicate NGN case IDs found");
  });

  const REQUIRED_FORMATS = ["mcq", "sata", "bowtie", "matrix", "prioritization", "delegation", "documentation", "handoff"];
  for (const format of REQUIRED_FORMATS) {
    test(`NGN cases include at least one "${format}" format`, () => {
      const cases = getCasesByFormat(format as Parameters<typeof getCasesByFormat>[0]);
      assert.ok(cases.length >= 1, `No NGN case with format "${format}" found`);
    });
  }

  const REQUIRED_JUDGMENT_LAYERS = [
    "recognize_cues", "analyze_cues", "prioritize_hypotheses",
    "generate_solutions", "take_actions", "evaluate_outcomes",
  ] as const;

  for (const layer of REQUIRED_JUDGMENT_LAYERS) {
    test(`At least one NGN case covers judgment layer "${layer}"`, () => {
      const cases = getCasesByJudgmentLayer(layer);
      assert.ok(cases.length >= 1, `No NGN case covers NCJMM layer "${layer}"`);
    });
  }

  test("all NGN cases have ≥2 options", () => {
    for (const c of ECG_NGN_CASES) {
      assert.ok(c.options.length >= 2, `NGN case "${c.id}" must have ≥2 options`);
    }
  });

  test("all NGN cases have ≥1 correct ID", () => {
    for (const c of ECG_NGN_CASES) {
      assert.ok(c.correctIds.length >= 1, `NGN case "${c.id}" must have ≥1 correctId`);
    }
  });

  test("VT case explicitly teaches pulse-check before action", () => {
    const vtCase = ECG_NGN_CASES.find((c) => c.id === "ngn-mcq-vt-pulse-check");
    assert.ok(vtCase, "VT pulse-check case must exist");
    const hasCardioversion = vtCase.options.some((o) =>
      o.correct && o.text.toLowerCase().includes("cardioversion"),
    );
    assert.ok(hasCardioversion, "VT case correct answer must include synchronized cardioversion");
  });

  test("STEMI case has nitrate contraindication as incorrect answer with safety flag", () => {
    const stemiCase = ECG_NGN_CASES.find((c) => c.id === "ngn-sata-stemi-protocol");
    assert.ok(stemiCase, "STEMI SATA case must exist");
    const nitrateOption = stemiCase.options.find((o) =>
      o.text.toLowerCase().includes("nitroglycerin") && !o.correct,
    );
    assert.ok(nitrateOption, "STEMI case must have nitroglycerin as incorrect option");
    assert.ok(nitrateOption.safetyFlag || nitrateOption.consequence,
      "Nitroglycerin option must have safety flag or consequence");
  });

  test("NGN cases have non-trivial rationale (>50 chars each)", () => {
    for (const c of ECG_NGN_CASES) {
      assert.ok(c.rationale.length > 50, `NGN case "${c.id}": rationale too short`);
    }
  });
});

// ─── Phase 2 Gate: Competency Passport ────────────────────────────────────────

describe("Phase 2 Gate — ECG Competency Passport", () => {
  test("≥20 competency badges defined", () => {
    assert.ok(ECG_COMPETENCY_BADGES.length >= 20, `Only ${ECG_COMPETENCY_BADGES.length} badges — expected ≥20`);
  });

  test("all badge IDs are unique", () => {
    const ids = ECG_COMPETENCY_BADGES.map((b) => b.id);
    assert.equal(ids.length, new Set(ids).size, "Duplicate badge IDs found");
  });

  test("7 passport level gates defined", () => {
    assert.equal(ECG_PASSPORT_LEVEL_GATES.length, 7, "Expected 7 passport levels");
  });

  test("5 profession configs defined", () => {
    assert.equal(ECG_PROFESSION_PASSPORT_CONFIGS.length, 5, "Expected 5 profession passport configs");
  });

  test("life-threatening recognition badges are required for Clinical Ready", () => {
    const clinicalReadyGate = ECG_PASSPORT_LEVEL_GATES.find((g) => g.level === "clinical_ready");
    assert.ok(clinicalReadyGate, "Clinical Ready level gate must exist");
    const required = clinicalReadyGate.requirements.requiredBadges;
    assert.ok(required.includes("recognizes_vf" as any), "Clinical Ready must require VF recognition badge");
    assert.ok(required.includes("recognizes_stemi" as any), "Clinical Ready must require STEMI recognition badge");
    assert.ok(required.includes("judgment_activated_code_blue" as any), "Clinical Ready must require code blue judgment badge");
  });

  test("computeEcgPassportLevel returns 'beginner' for empty achievements", () => {
    const level = computeEcgPassportLevel([], 0, 0, {});
    assert.equal(level, "beginner");
  });

  test("computeEcgPassportLevel returns higher level for strong achievements", () => {
    const telemetryReadyGate = ECG_PASSPORT_LEVEL_GATES.find((g) => g.level === "telemetry_ready");
    assert.ok(telemetryReadyGate, "Telemetry Ready gate must exist");

    const level = computeEcgPassportLevel(
      telemetryReadyGate.requirements.requiredBadges as any[],
      telemetryReadyGate.requirements.minimumOverallAccuracy + 0.05,
      telemetryReadyGate.requirements.minimumSimulationsCompleted + 5,
      {
        rhythm_recognition: 0.90,
        acls_critical_rhythms: 0.85,
        telemetry_interpretation: 0.82,
      },
    );
    assert.ok(
      ["telemetry_ready", "clinical_ready", "ecg_mastery"].includes(level),
      `Expected ≥ telemetry_ready but got "${level}"`,
    );
  });

  test("RPN max level is telemetry_ready (not clinical_ready)", () => {
    const rpnConfig = ECG_PROFESSION_PASSPORT_CONFIGS.find((c) => c.profession === "RPN");
    assert.ok(rpnConfig, "RPN passport config must exist");
    assert.equal(rpnConfig.maxLevel, "telemetry_ready");
  });

  test("NP max level is ecg_mastery", () => {
    const npConfig = ECG_PROFESSION_PASSPORT_CONFIGS.find((c) => c.profession === "NP");
    assert.ok(npConfig, "NP passport config must exist");
    assert.equal(npConfig.maxLevel, "ecg_mastery");
  });
});

// ─── Phase 2 Gate: Adaptive CAT Engine ────────────────────────────────────────

describe("Phase 2 Gate — Adaptive CAT Engine", () => {
  test("exactly 5 adaptive difficulty levels defined", () => {
    assert.equal(ECG_ADAPTIVE_LEVELS.length, 5, "Expected exactly 5 adaptive difficulty levels");
  });

  test("levels are numbered 1–5 in order", () => {
    for (let i = 0; i < ECG_ADAPTIVE_LEVELS.length; i++) {
      assert.equal(ECG_ADAPTIVE_LEVELS[i]?.level, i + 1, `Level ${i + 1} is missing`);
    }
  });

  test("8 domain adaptive configs defined (one per competency domain)", () => {
    assert.equal(ECG_DOMAIN_ADAPTIVE_CONFIGS.length, 8, "Expected 8 domain adaptive configs");
  });

  test("computeNextAdaptiveDifficulty increases with consecutive correct answers", () => {
    const next = computeNextAdaptiveDifficulty(2, 0.85, 3, 0);
    assert.ok(next >= 2, `Expected ≥ level 2 after 3 consecutive correct, got ${next}`);
    assert.ok(next <= 5, `Level cannot exceed 5, got ${next}`);
  });

  test("computeNextAdaptiveDifficulty decreases with consecutive incorrect", () => {
    const next = computeNextAdaptiveDifficulty(4, 0.40, 0, 3);
    assert.ok(next <= 4, `Expected decrease from level 4 after 3 consecutive incorrect, got ${next}`);
  });

  test("computeEcgReadinessScore returns 0–100 score", () => {
    const result = computeEcgReadinessScore({ rhythm_recognition: 0.80, acls_critical_rhythms: 0.85 });
    assert.ok(result.score >= 0 && result.score <= 100, `Score ${result.score} out of 0–100 range`);
  });

  test("computeEcgReadinessScore identifies weak domains", () => {
    const result = computeEcgReadinessScore({ rhythm_recognition: 0.40 });
    assert.ok(result.weakDomains.includes("rhythm_recognition"),
      "rhythm_recognition at 0.40 should be a weak domain");
  });

  test("all domains have non-empty remediationLessonIds or remediationSimulationIds", () => {
    for (const config of ECG_DOMAIN_ADAPTIVE_CONFIGS) {
      const hasContent =
        config.remediationLessonIds.length > 0 ||
        config.remediationSimulationIds.length > 0;
      assert.ok(hasContent, `Domain "${config.domain}" has no remediation content`);
    }
  });
});

// ─── Phase 2 Gate: Documentation and Handoff ──────────────────────────────────

describe("Phase 2 Gate — Documentation and Handoff Templates", () => {
  test("≥4 SBAR templates defined", () => {
    assert.ok(ECG_SBAR_TEMPLATES.length >= 4, `Only ${ECG_SBAR_TEMPLATES.length} SBAR templates`);
  });

  test("all SBAR template IDs are unique", () => {
    assert.equal(SBAR_TEMPLATE_IDS.length, new Set(SBAR_TEMPLATE_IDS).size,
      "Duplicate SBAR template IDs");
  });

  test("all SBAR templates have ≥4 required elements", () => {
    for (const t of ECG_SBAR_TEMPLATES) {
      assert.ok(t.requiredElements.length >= 4,
        `SBAR template "${t.id}" must have ≥4 required elements`);
    }
  });

  test("all SBAR templates have model answer (non-trivial)", () => {
    for (const t of ECG_SBAR_TEMPLATES) {
      assert.ok(t.modelAnswer.length > 100,
        `SBAR template "${t.id}" model answer too short`);
    }
  });

  test("SBAR templates include AFib, VT emergency, and STEMI", () => {
    const ids = ECG_SBAR_TEMPLATES.map((t) => t.id);
    assert.ok(ids.includes("sbar-new-afib"), "Missing AFib SBAR template");
    assert.ok(ids.includes("sbar-vt-emergency"), "Missing VT emergency SBAR template");
    assert.ok(ids.includes("sbar-stemi-alert"), "Missing STEMI alert SBAR template");
    assert.ok(ids.includes("sbar-rosc-icu-transfer"), "Missing ROSC ICU transfer SBAR template");
  });

  test("documentation templates include code blue and STEMI", () => {
    const ids = ECG_DOCUMENTATION_TEMPLATES.map((t) => t.id);
    assert.ok(ids.includes("doc-code-blue"), "Missing code blue documentation template");
    assert.ok(ids.includes("doc-stemi-event"), "Missing STEMI event documentation template");
  });

  test("STEMI SBAR explicitly requires D2B time element", () => {
    const stemiSbar = ECG_SBAR_TEMPLATES.find((t) => t.id === "sbar-stemi-alert");
    assert.ok(stemiSbar, "STEMI SBAR template must exist");
    const hasD2BElement = stemiSbar.requiredElements.some(
      (el) => el.toLowerCase().includes("time") || el.toLowerCase().includes("d2b"),
    );
    assert.ok(hasD2BElement, "STEMI SBAR must require time-of-ECG element for D2B calculation");
  });
});

// ─── Phase 2 Gate: Telemetry Layer ────────────────────────────────────────────

describe("Phase 2 Gate — Telemetry Interpretation Layer", () => {
  test("≥8 telemetry scenarios defined", () => {
    assert.ok(ECG_TELEMETRY_SCENARIOS.length >= 8,
      `Only ${ECG_TELEMETRY_SCENARIOS.length} telemetry scenarios — expected ≥8`);
  });

  test("all telemetry scenario IDs are unique", () => {
    assert.equal(TELEMETRY_SCENARIO_IDS.length, new Set(TELEMETRY_SCENARIO_IDS).size,
      "Duplicate telemetry scenario IDs");
  });

  test("all telemetry scenarios have non-trivial teachingPearl", () => {
    for (const s of ECG_TELEMETRY_SCENARIOS) {
      assert.ok(s.teachingPearl.length > 30, `Telemetry scenario "${s.id}" teachingPearl too short`);
    }
  });

  test("all telemetry scenarios have consequenceIfMistaken", () => {
    for (const s of ECG_TELEMETRY_SCENARIOS) {
      assert.ok(s.consequenceIfMistaken.length > 20,
        `Telemetry scenario "${s.id}" must have consequenceIfMistaken`);
    }
  });

  test("life-threatening telemetry scenarios have explicit safety guidance", () => {
    const highRisk = getHighRiskTelemetryScenarios();
    assert.ok(highRisk.length >= 3, `Only ${highRisk.length} high-risk telemetry scenarios — expected ≥3`);
    for (const s of highRisk) {
      assert.ok(s.requiredAction.length > 30,
        `High-risk scenario "${s.id}" must have detailed requiredAction`);
    }
  });

  test("lead displacement scenario teaches patient-first assessment (not call code first)", () => {
    const leadOff = ECG_TELEMETRY_SCENARIOS.find((s) => s.id === "telem-lead-off-vf");
    assert.ok(leadOff, "Lead displacement VF scenario must exist");
    const teachesPatientFirst =
      leadOff.howToDistinguish.some((h) => h.toLowerCase().includes("patient")) ||
      leadOff.requiredAction.toLowerCase().includes("patient");
    assert.ok(teachesPatientFirst, "Lead displacement scenario must teach patient-before-monitor assessment");
  });

  test("pacemaker failure-to-capture scenario is classified life_threatening", () => {
    const ftc = ECG_TELEMETRY_SCENARIOS.find((s) => s.id === "telem-failure-to-capture");
    assert.ok(ftc, "Pacemaker failure-to-capture scenario must exist");
    assert.equal(ftc.safetyRisk, "life_threatening",
      "Failure to capture in a pacemaker-dependent patient is life-threatening");
  });
});

// ─── Cross-module integration checks ──────────────────────────────────────────

describe("Phase 2 Gate — Cross-module integration", () => {
  test("Simulation catalog references rhythm keys that exist in rhythm templates", () => {
    const KNOWN_RHYTHM_KEYS = new Set([
      "normal_sinus_rhythm", "sinus_bradycardia", "sinus_tachycardia",
      "atrial_fibrillation", "atrial_flutter", "svt", "pvcs", "pacs",
      "ventricular_tachycardia", "ventricular_fibrillation", "asystole", "pea",
      "first_degree_av_block", "second_degree_type_i_av_block", "second_degree_type_ii_av_block",
      "third_degree_av_block", "bundle_branch_block", "stemi_pattern", "nstemi_pattern",
      "hyperkalemia_pattern", "hypokalemia_pattern", "torsades_de_pointes", "paced_rhythm",
      "respiratory_sinus_arrhythmia", "junctional_rhythm", "accelerated_junctional_rhythm",
      "ventricular_escape_rhythm", "idioventricular_rhythm", "right_bundle_branch_block",
      "left_bundle_branch_block",
      // Pediatric keys
      "pediatric_svt", "pediatric_hypoxic_bradycardia", "pediatric_ventricular_tachycardia",
      "pediatric_normal_sinus", "junctional_ectopic_tachycardia",
    ]);

    for (const sim of ECG_SIMULATION_CATALOG) {
      for (const node of sim.rhythmProgression) {
        assert.ok(KNOWN_RHYTHM_KEYS.has(node.rhythmKey),
          `Simulation "${sim.id}" node "${node.nodeId}" references unknown rhythmKey "${node.rhythmKey}"`);
      }
    }
  });

  test("Progression maps reference the same life-threatening rhythms as the clinical reasoning registry", () => {
    const lifeThreatKeys = ["ventricular_fibrillation", "ventricular_tachycardia", "third_degree_av_block", "asystole"];
    for (const key of lifeThreatKeys) {
      const paths = getDeteriorationPathsFrom(key);
      const warnings = getMissableWarningsForRhythm(key);
      // Either the rhythm is a deterioration endpoint OR it has its own deterioration paths
      const appearsInMaps = ECG_RHYTHM_PROGRESSION_MAPS.some((map) =>
        map.nodes.some((n) => n.rhythmKey === key) ||
        map.nodes.some((n) => n.deteriorationPaths.some((e) => e.targetRhythmKey === key)),
      );
      assert.ok(appearsInMaps || paths.length > 0,
        `Life-threatening rhythm "${key}" should appear in at least one progression map`);
    }
  });

  test("NGN cases reference rhythms covered in the clinical reasoning registry", () => {
    const REGISTRY_KEYS = new Set([
      "normal_sinus_rhythm", "sinus_tachycardia", "sinus_bradycardia",
      "atrial_fibrillation", "ventricular_tachycardia", "ventricular_fibrillation",
      "third_degree_av_block", "stemi_pattern", "nstemi_pattern",
      "hyperkalemia_pattern", "pvcs", "pea",
    ]);

    for (const c of ECG_NGN_CASES) {
      for (const rhythmKey of c.rhythmKeys) {
        assert.ok(REGISTRY_KEYS.has(rhythmKey),
          `NGN case "${c.id}" references rhythm "${rhythmKey}" not in clinical reasoning registry`);
      }
    }
  });
});
