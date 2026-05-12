/**
 * Phase 8 hardening tests — clinical trajectory, prescribing safety,
 * follow-up intelligence, lab evolution, domain remediation, and authoring guardrails.
 *
 * Run: `npx tsx --test src/lib/cases/phase8-hardening.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  computeTrajectoryState,
  inferSafetyFlags,
  inferUnresolvedIssues,
  deriveStabilityState,
  trajectoryDebt,
} from "@/lib/cases/clinical-trajectory-engine";

import {
  classifyPrescribingRiskSeverity,
  classifyFromText,
  buildPrescribingRiskProfile,
  computeReadinessPenalty,
  applyPrescribingPenaltyToReadiness,
} from "@/lib/cnple/prescribing-safety-engine";

import {
  intervalToDays,
  assessFollowUpAppropriateness,
  followUpPenaltyDebt,
  inferClinicalUrgency,
} from "@/lib/cases/follow-up-intelligence";

import {
  applyMedicationEffectsToLabs,
  applyDiseaseEffectsToLabs,
  computeLabTrendDirection,
  evolveLabs,
} from "@/lib/cases/case-lab-evolution";

import {
  buildRemediationPriorityMap,
  deriveWeakAndStrongDomains,
} from "@/lib/cases/domain-remediation-engine";

import {
  auditCaseAuthoring,
} from "@/lib/cases/cnple-case-authoring-guardrails";

import {
  buildCaseSessionAnalytics,
  toCaseAnalyticsPostHogEvent,
} from "@/lib/cases/case-session-analytics";

import {
  computeScore,
  buildStepPayload,
  processStepAdvance,
} from "@/lib/cases/longitudinal-case-engine";

import { CASE_HYPERTENSION_FOLLOWUP } from "@/content/cases/cnple-sample-cases";
import type { CaseDecisionRecord } from "@/lib/cases/longitudinal-case-types";

// ── Trajectory debt ───────────────────────────────────────────────────────────

describe("trajectoryDebt", () => {
  it("optimal contributes 0 debt", () => assert.equal(trajectoryDebt("optimal"), 0));
  it("acceptable contributes 8 debt", () => assert.equal(trajectoryDebt("acceptable"), 8));
  it("suboptimal contributes 22 debt", () => assert.equal(trajectoryDebt("suboptimal"), 22));
  it("harmful contributes 48 debt", () => assert.equal(trajectoryDebt("harmful"), 48));
});

// ── Stability state derivation ────────────────────────────────────────────────

describe("deriveStabilityState", () => {
  it("returns improving when risk=0 and no critical flags", () => {
    assert.equal(deriveStabilityState(0, []), "improving");
  });

  it("returns stable when risk=20", () => {
    assert.equal(deriveStabilityState(20, []), "stable");
  });

  it("returns deteriorating when risk=55", () => {
    assert.equal(deriveStabilityState(55, []), "deteriorating");
  });

  it("returns critical when risk >= 80", () => {
    assert.equal(deriveStabilityState(80, []), "critical");
  });

  it("returns critical when there is a critical safety flag regardless of risk score", () => {
    const flag = { code: "test", label: "test", severity: "critical" as const, stepIndex: 0, domain: "acute-urgent-care" as const };
    assert.equal(deriveStabilityState(5, [flag]), "critical");
  });
});

// ── computeTrajectoryState ────────────────────────────────────────────────────

describe("computeTrajectoryState", () => {
  it("returns improving with zero cumulative risk for all-optimal decisions", () => {
    const decisions: CaseDecisionRecord[] = CASE_HYPERTENSION_FOLLOWUP.steps.map((s, i) => ({
      stepIndex: i, chosenOptionId: s.question.correctOptionId, isCorrect: true,
      cnpleDomainSlug: s.cnpleDomain, trajectory: "optimal",
    }));
    const state = computeTrajectoryState(decisions);
    assert.equal(state.cumulativeRiskScore, 0);
    assert.equal(state.stabilityState, "improving");
    assert.equal(state.activeSafetyFlags.length, 0);
  });

  it("accumulates debt from harmful decisions", () => {
    const decisions: CaseDecisionRecord[] = CASE_HYPERTENSION_FOLLOWUP.steps.map((s, i) => ({
      stepIndex: i,
      chosenOptionId: s.question.options.find((o) => o.id !== s.question.correctOptionId)!.id,
      isCorrect: false,
      cnpleDomainSlug: s.cnpleDomain,
      trajectory: "harmful",
    }));
    const state = computeTrajectoryState(decisions);
    assert.ok(state.cumulativeRiskScore > 0, "harmful decisions must accumulate risk");
    assert.ok(state.activeSafetyFlags.length > 0, "harmful decisions must raise safety flags");
  });

  it("delayed consequence: second error in same domain is amplified", () => {
    const base: CaseDecisionRecord = {
      stepIndex: 0, chosenOptionId: "A", isCorrect: false,
      cnpleDomainSlug: "pharmacotherapeutics", trajectory: "suboptimal",
    };
    const repeat: CaseDecisionRecord = {
      stepIndex: 1, chosenOptionId: "B", isCorrect: false,
      cnpleDomainSlug: "pharmacotherapeutics", trajectory: "suboptimal",
    };
    const state1 = computeTrajectoryState([base]);
    const stateRepeat = computeTrajectoryState([base, repeat]);
    // Repeated same-domain error should yield higher debt than two independent errors
    const independent: CaseDecisionRecord = {
      stepIndex: 1, chosenOptionId: "B", isCorrect: false,
      cnpleDomainSlug: "diagnostics-labs", trajectory: "suboptimal",
    };
    const stateIndependent = computeTrajectoryState([base, independent]);
    assert.ok(
      stateRepeat.cumulativeRiskScore > stateIndependent.cumulativeRiskScore,
      "Repeated same-domain errors should compound to higher risk than independent domain errors",
    );
    void state1;
  });

  it("resolves unresolved issues when an optimal decision follows", () => {
    const bad: CaseDecisionRecord = {
      stepIndex: 0, chosenOptionId: "X", isCorrect: false,
      cnpleDomainSlug: "chronic-disease-management", trajectory: "harmful",
    };
    const good: CaseDecisionRecord = {
      stepIndex: 1, chosenOptionId: "Y", isCorrect: true,
      cnpleDomainSlug: "chronic-disease-management", trajectory: "optimal",
    };
    const stateAfterBad = computeTrajectoryState([bad]);
    const stateAfterGood = computeTrajectoryState([bad, good]);
    assert.ok(stateAfterBad.unresolvedClinicalIssues.length > 0);
    // After an optimal decision, the unresolved issue for this domain should be cleared
    const stillUnresolved = stateAfterGood.unresolvedClinicalIssues.filter(
      (i) => i.code === "uncontrolled_chronic_disease",
    );
    assert.equal(stillUnresolved.length, 0, "Optimal decision should resolve uncontrolled_chronic_disease issue");
  });

  it("cumulativeRiskScore never exceeds 100", () => {
    const decisions: CaseDecisionRecord[] = Array.from({ length: 10 }, (_, i) => ({
      stepIndex: i, chosenOptionId: "X", isCorrect: false,
      cnpleDomainSlug: "pharmacotherapeutics" as const, trajectory: "harmful" as const,
    }));
    const state = computeTrajectoryState(decisions);
    assert.ok(state.cumulativeRiskScore <= 100, "Risk score must not exceed 100");
  });
});

// ── inferSafetyFlags ──────────────────────────────────────────────────────────

describe("inferSafetyFlags", () => {
  it("raises critical flag for harmful decision", () => {
    const decision: CaseDecisionRecord = {
      stepIndex: 0, chosenOptionId: "D", isCorrect: false,
      cnpleDomainSlug: "pharmacotherapeutics", trajectory: "harmful",
    };
    const flags = inferSafetyFlags(decision);
    assert.ok(flags.length > 0);
    assert.ok(flags.every((f) => f.severity === "critical"));
  });

  it("raises warning flag for suboptimal prescribing risk", () => {
    const decision: CaseDecisionRecord = {
      stepIndex: 1, chosenOptionId: "C", isCorrect: false,
      cnpleDomainSlug: "pharmacotherapeutics", trajectory: "suboptimal",
      prescribingRiskSeverity: "high",
    };
    const flags = inferSafetyFlags(decision);
    assert.ok(flags.some((f) => f.severity === "warning"));
  });

  it("raises no flags for optimal decision", () => {
    const decision: CaseDecisionRecord = {
      stepIndex: 0, chosenOptionId: "B", isCorrect: true,
      cnpleDomainSlug: "chronic-disease-management", trajectory: "optimal",
    };
    assert.equal(inferSafetyFlags(decision).length, 0);
  });
});

// ── inferUnresolvedIssues ─────────────────────────────────────────────────────

describe("inferUnresolvedIssues", () => {
  it("no issues for optimal/acceptable decisions", () => {
    for (const trajectory of ["optimal", "acceptable"] as const) {
      const d: CaseDecisionRecord = {
        stepIndex: 0, chosenOptionId: "A", isCorrect: true,
        cnpleDomainSlug: "chronic-disease-management", trajectory,
      };
      assert.equal(inferUnresolvedIssues(d).length, 0, `trajectory=${trajectory}`);
    }
  });

  it("returns unresolved issue for suboptimal chronic disease decision", () => {
    const d: CaseDecisionRecord = {
      stepIndex: 0, chosenOptionId: "C", isCorrect: false,
      cnpleDomainSlug: "chronic-disease-management", trajectory: "suboptimal",
    };
    const issues = inferUnresolvedIssues(d);
    assert.ok(issues.length > 0);
    assert.ok(issues.some((i) => i.code === "uncontrolled_chronic_disease"));
  });
});

// ── Prescribing safety ────────────────────────────────────────────────────────

describe("classifyPrescribingRiskSeverity", () => {
  it("prescribing family + harmful → critical", () => {
    assert.equal(classifyPrescribingRiskSeverity("safe-prescribing-medication-management", "harmful"), "critical");
  });

  it("prescribing family + suboptimal → high", () => {
    assert.equal(classifyPrescribingRiskSeverity("safe-prescribing-medication-management", "suboptimal"), "high");
  });

  it("optimal/acceptable returns null", () => {
    assert.equal(classifyPrescribingRiskSeverity("safe-prescribing-medication-management", "optimal"), null);
    assert.equal(classifyPrescribingRiskSeverity("safe-prescribing-medication-management", "acceptable"), null);
  });

  it("non-prescribing family returns null", () => {
    assert.equal(classifyPrescribingRiskSeverity("health-promotion-screening", "harmful"), null);
  });
});

describe("classifyFromText", () => {
  it("detects contraindication from text", () => {
    const r = classifyFromText("This drug is contraindicated in renal failure.");
    assert.ok(r?.category === "contraindication");
  });

  it("detects renal dosing issue", () => {
    const r = classifyFromText("eGFR-based dose adjustment was not applied.");
    assert.ok(r?.category === "renal_dosing");
  });

  it("returns null for unrelated text", () => {
    assert.equal(classifyFromText("Assessment of cardiovascular risk factors."), null);
  });
});

describe("buildPrescribingRiskProfile", () => {
  it("empty decisions yields null worst severity and zero penalty", () => {
    const profile = buildPrescribingRiskProfile([]);
    assert.equal(profile.worstSeverity, null);
    assert.equal(profile.readinessPenalty, 0);
    assert.equal(profile.requiresUrgentRemediation, false);
  });

  it("critical prescribing miss triggers urgent remediation", () => {
    const decisions: CaseDecisionRecord[] = [{
      stepIndex: 0, chosenOptionId: "D", isCorrect: false,
      cnpleDomainSlug: "pharmacotherapeutics", trajectory: "harmful",
      prescribingRiskSeverity: "critical",
    }];
    const profile = buildPrescribingRiskProfile(decisions);
    assert.equal(profile.requiresUrgentRemediation, true);
    assert.ok(profile.readinessPenalty > 0);
  });

  it("repeat error adds extra penalty", () => {
    const decisions: CaseDecisionRecord[] = [
      { stepIndex: 0, chosenOptionId: "C", isCorrect: false, cnpleDomainSlug: "pharmacotherapeutics", trajectory: "suboptimal", prescribingRiskSeverity: "high" },
      { stepIndex: 1, chosenOptionId: "D", isCorrect: false, cnpleDomainSlug: "pharmacotherapeutics", trajectory: "suboptimal", prescribingRiskSeverity: "high" },
    ];
    const profileOnce = buildPrescribingRiskProfile([decisions[0]!]);
    const profileTwice = buildPrescribingRiskProfile(decisions);
    assert.ok(profileTwice.readinessPenalty > profileOnce.readinessPenalty, "Repeat errors should increase penalty");
  });
});

describe("applyPrescribingPenaltyToReadiness", () => {
  it("reduces readiness score by penalty amount", () => {
    const decisions: CaseDecisionRecord[] = [{
      stepIndex: 0, chosenOptionId: "X", isCorrect: false,
      cnpleDomainSlug: "pharmacotherapeutics", trajectory: "harmful",
      prescribingRiskSeverity: "critical",
    }];
    const profile = buildPrescribingRiskProfile(decisions);
    const adjusted = applyPrescribingPenaltyToReadiness(80, profile);
    assert.ok(adjusted < 80, "Prescribing penalty must reduce readiness");
    assert.ok(adjusted >= 0, "Readiness must not go below 0");
  });
});

// ── Follow-up intelligence ────────────────────────────────────────────────────

describe("intervalToDays", () => {
  it("converts hours", () => assert.equal(intervalToDays({ value: 24, unit: "hours", label: "" }), 1));
  it("converts days", () => assert.equal(intervalToDays({ value: 7, unit: "days", label: "" }), 7));
  it("converts weeks", () => assert.equal(intervalToDays({ value: 2, unit: "weeks", label: "" }), 14));
  it("converts months", () => assert.equal(intervalToDays({ value: 3, unit: "months", label: "" }), 90));
});

describe("assessFollowUpAppropriateness", () => {
  it("null interval returns not_applicable", () => {
    assert.equal(assessFollowUpAppropriateness(null, "routine"), "not_applicable");
  });

  it("4-week follow-up for routine urgency is appropriate", () => {
    assert.equal(
      assessFollowUpAppropriateness({ value: 4, unit: "weeks", label: "" }, "routine"),
      "appropriate",
    );
  });

  it("1-year follow-up for urgent urgency is dangerous delay", () => {
    assert.equal(
      assessFollowUpAppropriateness({ value: 12, unit: "months", label: "" }, "urgent"),
      "dangerous_delay",
    );
  });

  it("same-day escalation for routine issue is excessive_escalation", () => {
    assert.equal(
      assessFollowUpAppropriateness({ value: 0, unit: "days", label: "" }, "routine"),
      "excessive_escalation",
    );
  });

  it("emergency: any delay beyond immediate is too_late or dangerous", () => {
    const result = assessFollowUpAppropriateness({ value: 2, unit: "days", label: "" }, "emergency");
    assert.ok(result === "too_late" || result === "dangerous_delay");
  });
});

describe("followUpPenaltyDebt", () => {
  it("appropriate and not_applicable return 0", () => {
    assert.equal(followUpPenaltyDebt("appropriate"), 0);
    assert.equal(followUpPenaltyDebt("not_applicable"), 0);
  });

  it("dangerous_delay returns highest penalty (25)", () => {
    assert.equal(followUpPenaltyDebt("dangerous_delay"), 25);
  });

  it("too_early returns minimal penalty (3)", () => {
    assert.equal(followUpPenaltyDebt("too_early"), 3);
  });
});

describe("inferClinicalUrgency", () => {
  it("critical direction → emergency", () => {
    assert.equal(inferClinicalUrgency("critical", "acute-urgent-care"), "emergency");
  });

  it("worsening + acute domain → urgent", () => {
    assert.equal(inferClinicalUrgency("worsening", "acute-urgent-care"), "urgent");
  });

  it("improving → routine", () => {
    assert.equal(inferClinicalUrgency("improving", "chronic-disease-management"), "routine");
  });
});

// ── Lab evolution ─────────────────────────────────────────────────────────────

describe("applyMedicationEffectsToLabs", () => {
  it("statin reduces LDL-C over 2 steps", () => {
    const initial = { "LDL-C": 3.1 };
    const updated = applyMedicationEffectsToLabs(initial, ["atorvastatin 40 mg"], 2);
    assert.ok(updated["LDL-C"]! < 3.1, "Statin should reduce LDL-C");
  });

  it("ACE inhibitor increases creatinine", () => {
    const initial = { "Creatinine": 80 };
    const updated = applyMedicationEffectsToLabs(initial, ["ramipril 5 mg daily"], 1);
    assert.ok(updated["Creatinine"]! > 80, "ACEi should increase creatinine (haemodynamic effect)");
  });

  it("does not reduce below minimum value", () => {
    const initial = { "LDL-C": 0.6 };
    const updated = applyMedicationEffectsToLabs(initial, ["atorvastatin"], 10);
    assert.ok(updated["LDL-C"]! >= 0.5, "LDL-C must not fall below physiological minimum");
  });

  it("SGLT2 inhibitor reduces eGFR (haemodynamic dip)", () => {
    const initial = { "eGFR": 62 };
    const updated = applyMedicationEffectsToLabs(initial, ["canagliflozin 100 mg daily"], 1);
    assert.ok(updated["eGFR"]! < 62, "SGLT2i should cause initial eGFR dip");
  });
});

describe("applyDiseaseEffectsToLabs", () => {
  it("uncontrolled diabetes worsens HbA1c", () => {
    const initial = { "HbA1c": 8.0 };
    const updated = applyDiseaseEffectsToLabs(initial, ["uncontrolled diabetes"], 2);
    assert.ok(updated["HbA1c"]! > 8.0, "Uncontrolled diabetes should worsen HbA1c");
  });

  it("does not apply effect for unrelated issue", () => {
    const initial = { "HbA1c": 8.0 };
    const updated = applyDiseaseEffectsToLabs(initial, ["elevated blood pressure"], 2);
    assert.equal(updated["HbA1c"], 8.0);
  });
});

describe("computeLabTrendDirection", () => {
  it("stable within 5%", () => {
    assert.equal(computeLabTrendDirection([3.1, 3.0, 3.05], false), "stable");
  });

  it("improving when LDL-C decreases (lower is better)", () => {
    assert.equal(computeLabTrendDirection([3.1, 2.5, 1.9], false), "improving");
  });

  it("worsening when HbA1c increases (lower is better)", () => {
    assert.equal(computeLabTrendDirection([7.0, 8.5, 9.2], false), "worsening");
  });

  it("improving when eGFR increases (higher is better)", () => {
    assert.equal(computeLabTrendDirection([45, 52, 58], true), "improving");
  });
});

describe("evolveLabs", () => {
  it("evolves lab panel values over steps", () => {
    const artifact = {
      type: "lab_panel" as const,
      name: "Fasting labs",
      finding: "HbA1c elevated",
      values: [
        { test: "HbA1c", value: "8.4", unit: "%", referenceRange: "Target <7.0%" },
        { test: "LDL-C", value: "3.1", unit: "mmol/L", referenceRange: "Target <2.0" },
      ],
    };
    const evolved = evolveLabs(artifact, ["atorvastatin 40 mg", "metformin"], [], 3);
    const hba1c = parseFloat(evolved.values!.find((v) => v.test === "HbA1c")!.value);
    const ldl = parseFloat(evolved.values!.find((v) => v.test === "LDL-C")!.value);
    assert.ok(hba1c < 8.4, "Metformin should reduce HbA1c");
    assert.ok(ldl < 3.1, "Atorvastatin should reduce LDL-C");
  });
});

// ── Domain remediation engine ─────────────────────────────────────────────────

describe("buildRemediationPriorityMap", () => {
  it("returns empty map for all-optimal decisions", () => {
    const decisions: CaseDecisionRecord[] = CASE_HYPERTENSION_FOLLOWUP.steps.map((s, i) => ({
      stepIndex: i, chosenOptionId: s.question.correctOptionId, isCorrect: true,
      cnpleDomainSlug: s.cnpleDomain, trajectory: "optimal",
    }));
    assert.equal(buildRemediationPriorityMap(decisions).length, 0);
  });

  it("classifies repeated same-domain errors as pattern", () => {
    const decisions: CaseDecisionRecord[] = [
      { stepIndex: 0, chosenOptionId: "C", isCorrect: false, cnpleDomainSlug: "pharmacotherapeutics", trajectory: "harmful" },
      { stepIndex: 1, chosenOptionId: "D", isCorrect: false, cnpleDomainSlug: "pharmacotherapeutics", trajectory: "harmful" },
    ];
    const map = buildRemediationPriorityMap(decisions);
    const entry = map.find((e) => e.domain === "pharmacotherapeutics");
    assert.ok(entry, "pharmacotherapeutics must be in map");
    assert.ok(entry!.isPattern, "Two harmful errors in same domain must be classified as pattern");
  });

  it("applies prescribing risk multiplier for higher priority", () => {
    const withRisk: CaseDecisionRecord[] = [{
      stepIndex: 0, chosenOptionId: "X", isCorrect: false,
      cnpleDomainSlug: "pharmacotherapeutics", trajectory: "suboptimal",
      prescribingRiskSeverity: "critical",
    }];
    const withoutRisk: CaseDecisionRecord[] = [{
      stepIndex: 0, chosenOptionId: "X", isCorrect: false,
      cnpleDomainSlug: "pharmacotherapeutics", trajectory: "suboptimal",
    }];
    const mapWith = buildRemediationPriorityMap(withRisk);
    const mapWithout = buildRemediationPriorityMap(withoutRisk);
    const entryWith = mapWith.find((e) => e.domain === "pharmacotherapeutics")!;
    const entryWithout = mapWithout.find((e) => e.domain === "pharmacotherapeutics")!;
    const priorityRank = { low: 1, moderate: 2, high: 3, urgent: 4 };
    assert.ok(
      priorityRank[entryWith.priority] >= priorityRank[entryWithout.priority],
      "Critical prescribing risk should increase or maintain priority",
    );
  });
});

describe("deriveWeakAndStrongDomains", () => {
  it("domain with no errors is strong", () => {
    const decisions: CaseDecisionRecord[] = CASE_HYPERTENSION_FOLLOWUP.steps.map((s, i) => ({
      stepIndex: i, chosenOptionId: s.question.correctOptionId, isCorrect: true,
      cnpleDomainSlug: s.cnpleDomain, trajectory: "optimal",
    }));
    const map = buildRemediationPriorityMap(decisions);
    const { weakDomains, strongDomains } = deriveWeakAndStrongDomains(decisions, map);
    assert.equal(weakDomains.length, 0);
    assert.ok(strongDomains.length > 0);
  });

  it("domain with urgent-priority errors is weak", () => {
    const decisions: CaseDecisionRecord[] = [
      { stepIndex: 0, chosenOptionId: "X", isCorrect: false, cnpleDomainSlug: "pharmacotherapeutics", trajectory: "harmful" },
      { stepIndex: 1, chosenOptionId: "X", isCorrect: false, cnpleDomainSlug: "pharmacotherapeutics", trajectory: "harmful" },
    ];
    const map = buildRemediationPriorityMap(decisions);
    const { weakDomains } = deriveWeakAndStrongDomains(decisions, map);
    assert.ok(weakDomains.includes("pharmacotherapeutics"), "Repeated harmful errors → weak domain");
  });
});

// ── Case authoring guardrails ─────────────────────────────────────────────────

describe("auditCaseAuthoring — clean case passes", () => {
  it("CASE_HYPERTENSION_FOLLOWUP passes authoring audit (no critical violations)", () => {
    const result = auditCaseAuthoring(CASE_HYPERTENSION_FOLLOWUP);
    const criticals = result.violations.filter((v) => v.severity === "critical");
    assert.equal(criticals.length, 0, `Unexpected critical violations: ${JSON.stringify(criticals)}`);
  });
});

describe("auditCaseAuthoring — catches violations", () => {
  it("flags impossible BP (systolic < diastolic)", () => {
    const badCase = {
      ...CASE_HYPERTENSION_FOLLOWUP,
      id: "test-bp-case",
      steps: [
        {
          ...CASE_HYPERTENSION_FOLLOWUP.steps[0]!,
          vitals: [{ label: "BP", value: "80/120", unit: "mmHg" }],
        },
        ...CASE_HYPERTENSION_FOLLOWUP.steps.slice(1),
      ],
    };
    const result = auditCaseAuthoring(badCase as typeof CASE_HYPERTENSION_FOLLOWUP);
    assert.ok(result.violations.some((v) => v.code === "bp_systolic_below_diastolic"));
  });

  it("flags implausible K+ value", () => {
    const badCase = {
      ...CASE_HYPERTENSION_FOLLOWUP,
      id: "test-k-case",
      steps: [
        {
          ...CASE_HYPERTENSION_FOLLOWUP.steps[0]!,
          diagnosticArtifacts: [{
            type: "lab_panel" as const,
            name: "Labs",
            finding: "K+ very high",
            values: [{ test: "K+", value: "15.0", unit: "mmol/L" }],
          }],
        },
        ...CASE_HYPERTENSION_FOLLOWUP.steps.slice(1),
      ],
    };
    const result = auditCaseAuthoring(badCase as typeof CASE_HYPERTENSION_FOLLOWUP);
    assert.ok(result.violations.some((v) => v.code === "implausible_lab_value"), "K+ 15.0 must fail plausibility");
  });

  it("flags missing correct option in question", () => {
    const badCase = {
      ...CASE_HYPERTENSION_FOLLOWUP,
      id: "test-q-case",
      steps: [
        {
          ...CASE_HYPERTENSION_FOLLOWUP.steps[0]!,
          question: {
            ...CASE_HYPERTENSION_FOLLOWUP.steps[0]!.question,
            correctOptionId: "Z",  // Not in options
          },
        },
        ...CASE_HYPERTENSION_FOLLOWUP.steps.slice(1),
      ],
    };
    const result = auditCaseAuthoring(badCase as typeof CASE_HYPERTENSION_FOLLOWUP);
    assert.ok(result.violations.some((v) => v.code === "invalid_correct_option"));
  });

  it("flags placeholder rationale", () => {
    const badCase = {
      ...CASE_HYPERTENSION_FOLLOWUP,
      id: "test-placeholder",
      steps: [
        {
          ...CASE_HYPERTENSION_FOLLOWUP.steps[0]!,
          question: {
            ...CASE_HYPERTENSION_FOLLOWUP.steps[0]!.question,
            rationale: "TODO: add rationale here",
          },
        },
        ...CASE_HYPERTENSION_FOLLOWUP.steps.slice(1),
      ],
    };
    const result = auditCaseAuthoring(badCase as typeof CASE_HYPERTENSION_FOLLOWUP);
    assert.ok(result.violations.some((v) => v.code === "placeholder_rationale"));
  });

  it("flags ACEi + ARB combination as critical", () => {
    const badCase = {
      ...CASE_HYPERTENSION_FOLLOWUP,
      id: "test-ace-arb",
      medications: [
        ...CASE_HYPERTENSION_FOLLOWUP.medications,
        { name: "Losartan", dose: "50 mg", route: "PO", frequency: "daily", indication: "Hypertension" },
      ],
    };
    const result = auditCaseAuthoring(badCase as typeof CASE_HYPERTENSION_FOLLOWUP);
    const criticals = result.violations.filter((v) => v.severity === "critical" && v.code === "unsafe_med_combination");
    assert.ok(criticals.length > 0, "ACEi + ARB must be flagged as critical combination");
  });
});

// ── Case session analytics ────────────────────────────────────────────────────

describe("buildCaseSessionAnalytics", () => {
  it("produces valid analytics payload from all-correct decisions", () => {
    const decisions: CaseDecisionRecord[] = CASE_HYPERTENSION_FOLLOWUP.steps.map((s, i) => ({
      stepIndex: i, chosenOptionId: s.question.correctOptionId, isCorrect: true,
      cnpleDomainSlug: s.cnpleDomain, trajectory: "optimal",
    }));
    const score = computeScore(CASE_HYPERTENSION_FOLLOWUP, decisions);
    const state = { stabilityState: "improving" as const, cumulativeRiskScore: 0, unresolvedClinicalIssues: [], activeSafetyFlags: [] };
    const payload = buildCaseSessionAnalytics({
      scenarioId: CASE_HYPERTENSION_FOLLOWUP.id,
      mode: "PRACTICE",
      decisions,
      score,
      trajectoryState: state,
      completedAt: new Date("2026-05-12T10:00:00Z"),
    });
    assert.equal(payload.scenarioId, CASE_HYPERTENSION_FOLLOWUP.id);
    assert.equal(payload.pathwayId, "ca-np-cnple");
    assert.equal(payload.totalSteps, 4);
    assert.equal(payload.correctCount, 4);
    assert.equal(payload.finalStabilityState, "improving");
  });

  it("toCaseAnalyticsPostHogEvent prefixes all keys", () => {
    const decisions: CaseDecisionRecord[] = CASE_HYPERTENSION_FOLLOWUP.steps.map((s, i) => ({
      stepIndex: i, chosenOptionId: s.question.correctOptionId, isCorrect: true,
      cnpleDomainSlug: s.cnpleDomain, trajectory: "optimal",
    }));
    const score = computeScore(CASE_HYPERTENSION_FOLLOWUP, decisions);
    const state = { stabilityState: "improving" as const, cumulativeRiskScore: 0, unresolvedClinicalIssues: [], activeSafetyFlags: [] };
    const payload = buildCaseSessionAnalytics({ scenarioId: CASE_HYPERTENSION_FOLLOWUP.id, mode: "PRACTICE", decisions, score, trajectoryState: state, completedAt: new Date() });
    const event = toCaseAnalyticsPostHogEvent(payload);
    for (const key of Object.keys(event)) {
      assert.ok(key.startsWith("cnple_case_"), `Event key "${key}" must be prefixed with cnple_case_`);
    }
  });

  it("analytics payload contains no free-text option content", () => {
    const decisions: CaseDecisionRecord[] = CASE_HYPERTENSION_FOLLOWUP.steps.map((s, i) => ({
      stepIndex: i, chosenOptionId: s.question.correctOptionId, isCorrect: true,
      cnpleDomainSlug: s.cnpleDomain, trajectory: "optimal",
    }));
    const score = computeScore(CASE_HYPERTENSION_FOLLOWUP, decisions);
    const state = { stabilityState: "improving" as const, cumulativeRiskScore: 0, unresolvedClinicalIssues: [], activeSafetyFlags: [] };
    const payload = buildCaseSessionAnalytics({ scenarioId: CASE_HYPERTENSION_FOLLOWUP.id, mode: "PRACTICE", decisions, score, trajectoryState: state, completedAt: new Date() });
    // None of the option labels should appear in the payload
    const serialised = JSON.stringify(payload);
    for (const step of CASE_HYPERTENSION_FOLLOWUP.steps) {
      for (const opt of step.question.options) {
        assert.ok(!serialised.includes(opt.label), `Option label "${opt.label.slice(0, 30)}..." must not appear in analytics payload`);
      }
    }
  });
});

// ── Integrated engine: buildStepPayload includes trajectoryState ──────────────

describe("buildStepPayload with trajectory state", () => {
  it("first step has no trajectoryState (no prior decisions)", () => {
    const payload = buildStepPayload("sess-x", CASE_HYPERTENSION_FOLLOWUP, 0, "PRACTICE");
    assert.equal(payload.trajectoryState, undefined);
  });

  it("later step includes trajectoryState from prior decisions", () => {
    const priorDecisions: CaseDecisionRecord[] = [{
      stepIndex: 0, chosenOptionId: CASE_HYPERTENSION_FOLLOWUP.steps[0]!.question.correctOptionId,
      isCorrect: true, cnpleDomainSlug: CASE_HYPERTENSION_FOLLOWUP.steps[0]!.cnpleDomain, trajectory: "optimal",
    }];
    const payload = buildStepPayload("sess-y", CASE_HYPERTENSION_FOLLOWUP, 1, "PRACTICE", priorDecisions);
    assert.ok(payload.trajectoryState !== undefined, "Step 1 payload must include trajectoryState when prior decisions provided");
  });
});

// ── Integrated engine: computeScore uses prescribing penalty ──────────────────

describe("computeScore integration", () => {
  it("harmful prescribing decision reduces score below raw correctness %", () => {
    const decisions: CaseDecisionRecord[] = CASE_HYPERTENSION_FOLLOWUP.steps.map((s, i) => ({
      stepIndex: i,
      chosenOptionId: i === 2
        ? s.question.options.find((o) => o.id !== s.question.correctOptionId)!.id
        : s.question.correctOptionId,
      isCorrect: i !== 2,
      cnpleDomainSlug: s.cnpleDomain,
      trajectory: i === 2 ? "harmful" : "optimal",
      prescribingRiskSeverity: i === 2 ? "critical" : undefined,
    }));
    const rawPct = Math.round((3 / 4) * 100); // 75% raw
    const score = computeScore(CASE_HYPERTENSION_FOLLOWUP, decisions);
    assert.ok(
      score.score0to100 < rawPct,
      `Prescribing penalty must reduce score below raw ${rawPct}%. Got ${score.score0to100}`,
    );
  });

  it("score includes finalTrajectoryState", () => {
    const decisions: CaseDecisionRecord[] = CASE_HYPERTENSION_FOLLOWUP.steps.map((s, i) => ({
      stepIndex: i, chosenOptionId: s.question.correctOptionId, isCorrect: true,
      cnpleDomainSlug: s.cnpleDomain, trajectory: "optimal",
    }));
    const score = computeScore(CASE_HYPERTENSION_FOLLOWUP, decisions);
    assert.ok(score.finalTrajectoryState !== undefined);
    assert.equal(score.finalTrajectoryState!.stabilityState, "improving");
  });

  it("score includes remediationPriority", () => {
    const decisions: CaseDecisionRecord[] = CASE_HYPERTENSION_FOLLOWUP.steps.map((s, i) => ({
      stepIndex: i, chosenOptionId: s.question.correctOptionId, isCorrect: true,
      cnpleDomainSlug: s.cnpleDomain, trajectory: "optimal",
    }));
    const score = computeScore(CASE_HYPERTENSION_FOLLOWUP, decisions);
    assert.ok(Array.isArray(score.remediationPriority));
  });
});
